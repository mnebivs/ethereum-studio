// Copyright 2019 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import style from './style.less';
import { DropdownContainer } from '../common/dropdown';
import { Tooltip } from '../common';
import PreferencesModal from '../preferences';
import UploadDialog from './upload';
import {
    IconPreferences,
    IconProjectSelector,
    IconDropdown,
    IconUpload,
    IconFork,
    IconShare,
    IconNew,
    IconMenu,
    IconAlphabetA
} from '../icons';
import OnlyIf from '../onlyIf';
import NetworkAccountSelector from '../networkAccountSelector';
import ShareDialog from './share';
import MenuDropdownDialog from './menu';
import ProjectMenuDropdownDialog from './projectMenu';
import Login from "../login";
import { HelpAction } from "../common";

const MenuAction = () => (
    <div className={classNames([style.action, style.noBorder])}>
        <button className={classNames([style.container, "btnNoBg"])}>
            <IconMenu />
        </button>
    </div>
);

const NewAction = () => (
    <div className={classNames([style.action, style.actionRight])}>
        <button className={classNames([style.container, 'btnNoBg'])}>
            <IconNew />
        </button>
    </div>
);

const DashboardAction = () => (
    <div className={classNames([style.action, style.actionRight])}>
        <Tooltip title="Dashboard">
            <a href="/dashboard" className={classNames([style.container, "btnNoBg"])}>
                <IconProjectSelector />
            </a>
        </Tooltip>
    </div>
);

const PreferencesAction = () => (
    <div className={classNames([style.action, style.actionRight])}>
        <Tooltip title="Preferences">
            <button className={classNames([style.container, "btnNoBg"])}>
                <IconPreferences />
            </button>
        </Tooltip>
    </div>
);

const UploadDrowdownAction = () => (
    <div className={style.action}>
        <button className={classNames([style.container, 'btnNoBg'])}>
            <IconUpload />
            <span>Upload</span>
        </button>
    </div>
);

const ForkDropdownAction = (props) => {
    const { onForkClicked } = props;
    return(
        <div className={classNames([style.action, style.actionFork])}>
            <button className={classNames([style.container, 'btnNoBg'])} onClick={onForkClicked}>
                <IconFork />
                <span>Fork</span>
            </button>
        </div>
    )
};

const ShareDropdownAction = () => (
    <div className={classNames([style.action, style.actionShare])}>
        <button className={classNames([style.container, 'btnNoBg'])}>
            <IconShare />
            <span>Share</span>
        </button>
    </div>
);

// TODO - Finalise all this
const NewDropdownDialog = () => (
    <div className={style.helpMenu}>
        <ul>
            <li>
                <a
                    href="https://help.superblocks.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Start from scratch
                </a>
            </li>
            <li>
                <a
                    href="https://help.superblocks.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Start with a template
                </a>
            </li>
            <li>
                <a
                    href="https://help.superblocks.com"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Import a project
                </a>
            </li>
        </ul>
    </div>
);

const ProjectSelector = ({ title } = props) => (
    <div className={style.action}>
        <button className="btnNoBg">
            <span className={style.projectText}>{title}</span>
        </button> 
    </div>
);

export default class TopBar extends Component {

    state = {
        selectedProjectName: this.props.selectedProjectName,
        ipfsActions: {
            showUploadDialog: this.props.ipfsActions.showUploadDialog,
            showUploadButton: this.props.ipfsActions.showUploadButton,
            showForkButton: this.props.ipfsActions.showForkButton,
            showShareButton: this.props.ipfsActions.showShareButton,
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.ipfsActions !== this.props.ipfsActions) {
            this.setState({
                ipfsActions: this.props.ipfsActions
            });
        }

        if (prevProps.selectedProjectName !== this.props.selectedProjectName) {
            this.setState({
                selectedProjectName: this.props.selectedProjectName
            });
        }
    }

    onSettingsModalClose = () => {
        this.props.functions.modal.close();
    };

    showPreferencesModal = () => {
        const modal = (
            <PreferencesModal
                onCloseClick={this.onSettingsModalClose}
            />
        );
        this.props.functions.modal.show({
            cancel: () => {
                return false;
            },
            render: () => {
                return modal;
            }
        });
    };

    onForkClicked = () => {
        this.props.forkProject();
    }

    onCloseUploadDialog = () => {
        this.props.hideUploadDialog()
    }

    render() {

        const { showUploadDialog, showUploadButton, showForkButton, showShareButton } = this.state.ipfsActions;
        const { project, showOpenInLab } = this.props.view;
        const { selectedProjectName } = this.state;

        return (
            <div className={style.topbar}>
                <DropdownContainer
                    className={style.actionMenu}
                    dropdownContent={<MenuDropdownDialog />} >
                    <MenuAction />
                </DropdownContainer>
                <OnlyIf test={showOpenInLab}>
                    <a
                        className={style.openLab}
                        href={window.location}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open in Lab"
                    >
                        <IconAlphabetA style={{width: 17, height: 17}} />
                        <span>Open in Lab</span>
                    </a>
                </OnlyIf>
                <OnlyIf test={this.props.router.control}>
                    <NetworkAccountSelector
                        router={this.props.router}
                        functions={this.props.functions}
                   />
                </OnlyIf>
                <OnlyIf test={showUploadButton}>
                    <DropdownContainer
                        className={style.actionUpload}
                        dropdownContent={<UploadDialog />}
                        enableClickInside={true}
                        showMenu={showUploadDialog}
                        onCloseMenu={this.onCloseUploadDialog}
                    >
                        <UploadDrowdownAction />
                    </DropdownContainer>
                </OnlyIf>
                <OnlyIf test={showForkButton}>
                    <ForkDropdownAction
                        onForkClicked={this.onForkClicked}
                    />
                </OnlyIf>
                <DropdownContainer
                    className={style.actionShare}
                    dropdownContent={<ShareDialog />}
                    enableClickInside={true}
                >
                    <ShareDropdownAction />
                </DropdownContainer>
                <div className={style.projectButton}>
                    <ProjectSelector title={project.name} />
                    <DropdownContainer
                        className={style.projectMenuDropdown}
                        dropdownContent={<ProjectMenuDropdownDialog />} >
                        <IconDropdown className={classNames([style.dropDown, 'dropDown'])} />
                    </DropdownContainer>
                </div>
                <div className={style.actionsRight}>
                    <DropdownContainer
                        className={style.actionMenu}
                        dropdownContent={<NewDropdownDialog />} >
                        <NewAction />
                    </DropdownContainer>

                    <DashboardAction/>

                    <div onClick={this.showPreferencesModal}>
                        <PreferencesAction />
                    </div>

                    <HelpAction />

                    <div>
                        <Login
                            functions={this.props.functions}
                            onSettingsModalClose={this.onSettingsModalClose}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

TopBar.propTypes = {
    onProjectSelected: PropTypes.func.isRequired,
    router: PropTypes.object.isRequired,
    functions: PropTypes.object.isRequired,
    selectedProjectName: PropTypes.string,
    ipfsActions: PropTypes.shape({
        showUploadDialog: PropTypes.bool.isRequired,
        showUploadButton: PropTypes.bool.isRequired,
        showForkButton: PropTypes.bool.isRequired,
        showShareButton: PropTypes.bool.isRequired,
    }),
    view: PropTypes.shape({
        showSelectedProjectName: PropTypes.bool,
        showOpenInLab: PropTypes.bool,
    }),
};
