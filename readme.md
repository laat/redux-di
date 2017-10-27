# redux-di [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url]
[travis-image]: https://travis-ci.org/laat/redux-di.svg?branch=master
[travis-url]: https://travis-ci.org/laat/redux-di
[npm-image]: https://img.shields.io/npm/v/redux-di.svg?style=flat
[npm-url]: https://npmjs.org/package/redux-di

> Redux thunk middleware with dependency injection.

Simple dependency injection in the action creator. The dependency
injection enables easily testable asynchronous action creators.

*NB*:
This is an alternative to [redux-thunk](https://github.com/gaearon/redux-thunk),
which already has some of this functionality with the
[withExtraArgument](https://github.com/gaearon/redux-thunk#injecting-a-custom-argument)
option for an extra *static* argument. **redux-di** has a *dynamic* argument created
with *dispatch* and *getState* as parameters which is sometimes convenient.


## Install

```
$ npm install --save redux-di
```

## Usage

In this example we have an api-client which is created with some token saved in
the redux state. This is not currently possible with
[redux-thunk](https://github.com/gaearon/redux-thunk) and is the only
significant difference in **redux-di**.

### configure store
```js
import { createStore, applyMiddleware, compose } from 'redux';
import reduxDI from 'redux-di';

// create a apiClient instance to inject into thunks.
const diMiddleware = reduxDI(
  ({ getState }) => ({
    api: createApiClient({ token: getState().token })
  })
);

const initialState = {};
const rootReducer = (state: {}) => state;

const enhancer = compose(applyMiddleware(diMiddleware));
const store = createStore(rootReducer, initialState, enhancer);
```

### thunks

```js
const fetchUsersBegin = () => ({ type: 'begin' });
const fetchUsersSuccess = (users) => ({ type: 'success', users });
const fetchUsersError = () => ({ type: 'error'});

export const fetchUsers = () =>
async ({ dispatch, getState, api }) => {
  // both dispatch and getState are normal
  dispatch(fetchUsersBegin());
  const state = getState();
  try {
    // yay, injected api!
    // easily mocked for tests
    const users = await api.getUsers();
    dispatch(fetchUsersSuccess(users));
  } catch (err) {
    dispatch(fetchUsersError());
  }
};
```

### dispatch thunks

```js
store.dispatch(fetchUsers()); // dispatch the thunk
```
## License

MIT © [Sigurd Fosseng](https://github.com/laat)
