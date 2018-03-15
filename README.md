# react-router-guard-dirty-state

*Guard unsaved / dirty componets (usually containing forms) by issuing alert when leaving the component both by closing window (onbeforeunload) and / or navigating away by using react-roter routes.*

## About

This is higher order component for React (DOM) to let end users know that view they are about to leave has *dirty state*.

*Leaving* means

1. navigating away from a route via *react-router* 4.
2. closing browser tab / window altogether

This helper was put together for augmenting 1st case as *react-router* [`<Promt>`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Prompt.md) is fine and dandy, but does not cover closing browser window. However this HOC can be used also with generic components / containers, where no routing is used.

By *dirty state* it is usually (and also here) meant when some form data is changed and unsaved. But it can be any state that is not *resolved* by user before closing the window or navigating away from the route.

## Install

```sh
npm install react-router-guard-dirty-state --save-dev
```

## Usage

ES2015 (ES6)

```javascript
import guardDirtyState from 'react-router-guard-dirty-state';
```

CommonJS

```javascript
const guardDirtyState = require('react-router-guard-dirty-state').default;
```

Decorate

```javascript
/**
 * @param {PropTypes.bool} receiveBoolProp default = true
 * @param {PropTypes.node} React.Component (or React.PureComponent)
 */
guardDirtyState(receiveBoolProp)(React.Component)
```

## Props

```javascript
void guardDirtySetActive(bool)
```

On all cases where state become *dirty* issue `this.props.guardDirtySetActive(true)`.
On all cases where state becomes *pristine* (form is saved or reverted) issue `this.props.guardDirtySetActive(false)`.

When leaving page while *dirty* is active user will get promted.

```javascript
bool guardDirtyIsActive
```

This prop reflects current `dirty` state. Basically it means that issuing `this.props.guardDirtySetActive(isDirty)` where `isDirty` differs from previous *state* the component will receive prop update for `guardDirtyIsActive`. Do whatever you want with `this.props.guardDirtyIsActive`. Of course prop will be pushed only on *dirty state* change, not on every `guardDirtySetActive()`.

Example shows simple case where `SomeComponent` is 
 is under `<Router>` tree (any level deep as `react-router` 4 works [this way](https://reacttraining.com/react-router/web/example/basic) now) and we can use this prop to set wether `<Prompt />` should run on route change.
 
Note that receiving `guardDirtyIsActive` prop can be turned off by passing `false` to HOC if you do not use it (you do not use routes, or use some form management package for React that already handles `dirty` in component-space), which saves React reconciliation cycles.
 
 ```jsx
 export default guardDirtyState(false)(SomeComponent);
 ```
 
 
## Example


```jsx
'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Prompt} from 'react-router-dom';
import guardDirtyState from 'react-router-guard-dirty-state';

class SomeComponent extends Component {
  static propTypes = {
    guardDirtySetActive: PropTypes.func,
    guardDirtyIsActive: PropTypes.bool,
    children: PropTypes.node
  };
  static defaultProps = {
    guardDirtyIsActive: false
  };

  constructor (props) {
    super(props);

    this.state = {
      formValues: {
        name: '',
        surname: ''
      }
    };

    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.setFormDirty = this.setFormDirty.bind(this);
  }

  setFormDirty (isDirty = false) {
    if (typeof this.props.guardDirtySetActive === 'function') {
      this.props.guardDirtySetActive(isDirty);
    }
  }

  handleFormChange (ev) {
    this.setFormDirty(true);

    const target = ev.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState((prevState, props) => ({
      formValues: {
        ...prevState.formValues,
        [name]: value
      }
    }));
  }

  handleFormSubmit (ev) {
    const {formValues} = this.state;
    alert(`Data was submitted. Name: ${formValues.name}, surname: ${formValues.surname}`);
    ev.preventDefault();
    this.setFormDirty(false);
  }

  render () {
    const {formValues} = this.state;
    return (
      <div>
        <h1>{'Submit your name and surname form'}</h1>
        <hr/>
        <form
          onSubmit={this.handleFormSubmit}
        >
          <label>
          {'Name:'}
            <input
              type="text"
              name="name"
              value={formValues.name}
              onChange={this.handleFormChange}
            />
          </label>
          <label>
          {'Surname:'}
            <input
              type="text"
              name="surname"
              value={formValues.surname}
              onChange={this.handleFormChange}
            />
          </label>
          <input
            type="submit"
            value="Submit"
          />
        </form>
        <Prompt
          when={this.props.guardDirtyIsActive}
          message="Changes you made may not be saved / There is unsaved data. Are you sure you want to leave this page?"
        />
        {this.props.children}
      </div>
    );
  }
}

export default guardDirtyState()(SomeComponent);
```

 
## Building

```sh
npm run build:dev
```

```sh
npm run build:prod
```

## Testing

N/A

## Todo

Copy possible static methods using [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics)



