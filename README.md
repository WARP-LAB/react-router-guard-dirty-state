#react-router-guard-dirty-state

*Guard unsaved / dirty componets (usually containing forms) by alets when leaving both by onbeforeunload and react-roter routes.*

## About

This is higher order component for React (DOM) to let end users know that view they are about to leave has *dirty state*.

*Leaving* means

1. closing browser tab / window
2. navigating away from a page via *react-router* 4.

This helper is primary meant for 1st case (generic components / containers), but can also be used with router [`<Promt>`](https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/api/Prompt.md) as HOC passes bool prop that can be used.

```jsx
<Prompt
  when={this.props.guardDirtyIsActive}
  message="Changes you made are not saved. Are you sure you want to leave this page?"
/>
```

By *dirty state* it is usually (and also here) meant when some form data is changed and unsaved. But it can be any state that is not *resolved* by user before closing the window or navigating away from the route.

## Usage

ES2015

```javascript
import guardDirtySate from 'react-router-guard-dirty-state';
```

CommonJS

```javascript
const guardDirtySate = require('react-router-guard-dirty-state').default;
```

Decorate

```javascript
/**
 * @param {PropTypes.bool} receiveBoolProp, default = true
 * @param {PropTypes.node} React.Component / React.pureComponent
 */
guardDirtySate(receiveBoolProp)(React.Component)
```

## Example


```jsx
'use strict';

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Prompt} from 'react-router-dom';
import guardDirtySate from 'react-router-guard-dirty-state';

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
      guardDirtyIsActive: false,
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
    alert(`Data was submitted. Name: ${formValues.username}, surname: ${formValues.password}`);
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
              value={formValues.username}
              onChange={this.handleFormChange}
            />
          </label>
          <label>
          {'Surname:'}
            <input
              type="text"
              name="surname"
              value={formValues.password}
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

export default guardDirtySate()(SomeComponent);
```


## Props

```javascript
void guardDirtySetActive(bool)
```

On all cases where state become *dirty* issue `this.props.guardDirtySetActive(true)`.
On all cases where state becomes clear (form is saved or reverted) issue `this.props.guardDirtySetActive(false)`.

Done. When leaving page while *dirty* is active user will get promted.

```javascript
bool guardDirtyIsActive
```

This prop reflects current `dirty` state. Basically it means that issuing `this.props.guardDirtySetActive(isDirty)` where `isDirty` differs from previous *state* the component will receive prop update for `guardDirtyIsActive`. Do whatever you want with `this.props.guardDirtyIsActive`. 

Example shows simple case where `SomeComponent` is 
 is under `<Router>` tree (any level deep as `react-router` 4 works [this way](https://reacttraining.com/react-router/web/example/basic) now) and we can use this prop to set wether `<Prompt />` should run on route change.
 
Note that receiving `guardDirtyIsActive` prop can be turned off if you do not use it, which saves React reconciliation cycles.
 
 ```jsx
 export default guardDirtySate(false)(SomeComponent);
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

