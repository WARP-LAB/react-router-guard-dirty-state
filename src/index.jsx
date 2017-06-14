'use strict';

/*
 * ██████╗ ██╗██████╗ ████████╗██╗   ██╗     ██████╗ ██╗   ██╗ █████╗ ██████╗ ██████╗
 * ██╔══██╗██║██╔══██╗╚══██╔══╝╚██╗ ██╔╝    ██╔════╝ ██║   ██║██╔══██╗██╔══██╗██╔══██╗
 * ██║  ██║██║██████╔╝   ██║    ╚████╔╝     ██║  ███╗██║   ██║███████║██████╔╝██║  ██║
 * ██║  ██║██║██╔══██╗   ██║     ╚██╔╝      ██║   ██║██║   ██║██╔══██║██╔══██╗██║  ██║
 * ██████╔╝██║██║  ██║   ██║      ██║       ╚██████╔╝╚██████╔╝██║  ██║██║  ██║██████╔╝
 * ╚═════╝ ╚═╝╚═╝  ╚═╝   ╚═╝      ╚═╝        ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝
 */

import React, {Component} from 'react';

let PASS_PROP_AUTO = true;

const guardHoc = (UnsavedComponent) => {
  const getDisplayName = (UnsavedComponent) => {
    return UnsavedComponent.displayName || UnsavedComponent.name || 'UnsavedComponent';
  };

  class SaveGuardedComponent extends Component {
    constructor (props) {
      super(props);

      // state holder (stateful)
      this.state = {
        guardIsActive: false
      };

      // instance variable holder (stateless)
      this.instance = {
        guardIsActive: false
      };

      this.onBeforeUnload = this.onBeforeUnload.bind(this);
      this.handleGuardSetActive = this.handleGuardSetActive.bind(this);
    }

    componentWillUnmount () {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
    }

    onBeforeUnload (ev) {
      // no custom string possible any more
      // Chrome: https://developers.google.com/web/updates/2016/04/chrome-51-deprecations?hl=en#remove_custom_messages_in_onbeforeunload_dialogs
      // anyways, fill it
      const dialogText = 'Changes you made are not saved. Are you sure you want to leave this page?';
      ev.returnValue = dialogText;
      return dialogText;
    }

    // default behaviour is stateful
    handleGuardSetActive (guardIsActive = false) {
      console.log('handleGuardSetActive', PASS_PROP_AUTO, guardIsActive);
      (PASS_PROP_AUTO)
      ? this.handleGuardSetActiveStateful(guardIsActive)
      : this.handleGuardSetActiveStateless(guardIsActive);
    }

    handleGuardSetActiveStateful (guardIsActive = false) {
      // if no change made, then just return
      if (this.state.guardIsActive === guardIsActive) return;
      // add/remove event listeners
      if (guardIsActive) {
        window.addEventListener('beforeunload', this.onBeforeUnload);
      } else {
        window.removeEventListener('beforeunload', this.onBeforeUnload);
      }
      // Set state (thus - rerender and pass guardIsActive prop)
      // UnsavedComponent does not have to manage dirty state for Prompt by itself
      // It can simply use
      // <Prompt
      //   when={this.props.guardIsActive}
      //   message="Are you sure you want to leave this page?"
      // />
      this.setState({
        guardIsActive
      });
    }

    handleGuardSetActiveStateless (guardIsActive = false) {
      // if no change made, then just return
      if (this.instance.guardIsActive === guardIsActive) return;
      // add/remove event listeners
      if (guardIsActive) {
        window.addEventListener('beforeunload', this.onBeforeUnload);
      } else {
        window.removeEventListener('beforeunload', this.onBeforeUnload);
      }
      // Do not set state (thus - don't rerender and pass guardIsActive prop)
      // UnsavedComponent has to manage dirty state for Prompt by itself
      // It has to use
      // <Prompt
      //   when={this.state.guardIsActive}
      //   message="Are you sure you want to leave this page?"
      // />
      this.instance.guardIsActive = guardIsActive;
    }

    render () {
      if (PASS_PROP_AUTO) {
        return (
          <UnsavedComponent
            {...this.props}
            guardDirtySetActive={this.handleGuardSetActive}
            guardDirtyIsActive={this.state.guardIsActive}
          />
        );
      }
      return (
        <UnsavedComponent
          {...this.props}
          guardDirtySetActive={this.handleGuardSetActive}
        />
      );
    }
  }
  SaveGuardedComponent.displayName = `GuardUnsavedComponent(${getDisplayName(UnsavedComponent)})`;
  return SaveGuardedComponent;
};

const guardDirtySate = (supplyGuardDirtyIsActive = true) => {
  PASS_PROP_AUTO = supplyGuardDirtyIsActive;
  return guardHoc;
};

export default guardDirtySate;
