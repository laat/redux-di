# redux-di [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url]
[travis-image]: https://img.shields.io/travis/laat/redux-di.svg?style=flat
[travis-url]: https://travis-ci.org/laat/redux-di
[npm-image]: https://img.shields.io/npm/v/redux-di.svg?style=flat
[npm-url]: https://npmjs.org/package/redux-di

> Redux thunk middleware with dependency injection.

Simple dependency injection in the action creator. The dependency
injection enables easy testable asynchronous action creators.

## Install

```
$ npm install --save redux-di
```

## Usage

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

function configureStore(initialState) {
  const enhancer = compose(
    applyMiddleware(diMiddleware)
  );
  return createStore(rootReducer, initialState, enhancer);
}
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
