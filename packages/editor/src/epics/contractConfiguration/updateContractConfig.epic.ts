import { ofType } from 'redux-observable';
import { AnyAction } from 'redux';
import { compilerActions, panesActions, contractConfigActions } from '../../actions';
import { withLatestFrom, switchMap, catchError } from 'rxjs/operators';
import { IContractConfiguration, IProjectItem, ProjectItemTypes } from '../../models';
import { findItemByPath, traverseTree } from '../../reducers/explorerLib';
import { empty, of } from 'rxjs';
import { ConstructorArgumentsList } from '../../components/projectEditor/editors/contractConfigModal/constructorArgumentsList';
import { number } from 'prop-types';

export const updateContractConfig = (action$: AnyAction, state$: any) => action$.pipe(
    ofType(compilerActions.HANDLE_COMPILE_OUTPUT),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
        console.log(state$);
        const firstKey = Object.keys(action.data.contracts)[0];
        const secondKey = Object.keys(action.data.contracts[firstKey])[0];
        const compilerOutputData = action.data.contracts[firstKey][secondKey].metadata;
        const parsedCompilerOutputData = JSON.parse(compilerOutputData);
        const constructorData = parsedCompilerOutputData.output.abi.filter((obj: { type: string; }) => obj.type === 'constructor');
        console.log('constructor data', constructorData);
        const numberOfArgs = constructorData[0].inputs.length;
        const dappFileItem: Nullable<IProjectItem> = findItemByPath(state.explorer.tree, ['dappfile.json'], ProjectItemTypes.File);
        if (dappFileItem != null && dappFileItem.code != null) {
            const code = dappFileItem.code;
            const parsedCode = JSON.parse(code);
            if (numberOfArgs !== parsedCode.contracts[0].args.length) {
                overwriteArray(state$, constructorData[0].inputs, parsedCode);
                return [panesActions.saveFile(dappFileItem.id, JSON.stringify(parsedCode, null, 4))];
            } else {
                return empty();
            }
        } else {
            return empty();
        }

    }),
    catchError((err: any) => {
        console.log('Error while updating the contract configuration: ', err);
        return of(compilerActions.HANDLE_COMPILE_OUTPUT);
    })
);

export const overwriteArray = (state$: any, constructorOutputArray: any[], parsedDappfile: any) => {
    const arr: any[] = [];
    for (let el of constructorOutputArray) {
        if (el.name === 'initMessage' && state$.value.projects.project.name === 'Hello World') {
            el = {type: 'value', value: 'Hello World!'};
            arr.push(el);
        } else {
            el = { type: 'value', value: el.name };
            arr.push(el);
        }
        parsedDappfile.contracts[0].args = arr;
    }
};