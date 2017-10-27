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

const storeDependent = {
  api: ({getState}) => initApiClient(getState().apiToken),
}
const sideEffects = {
  redirect: (href) => { location.href = href },
}

const thunkMiddleware = diThunk().withStatic(sideEffects).withDynamic(storeDependent);

// configure store
const initialState = {};
const rootReducer = (state: {}) => state;
const enhancer = compose(applyMiddleware(thunkMiddleware));
const store = createStore(rootReducer, initialState, enhancer);
```

### thunks

```js
const fetchUsersBegin = () => ({ type: 'begin' });
const fetchUsersSuccess = (users) => ({ type: 'success', users });
const fetchUsersError = () => ({ type: 'error'});

// because api and redirect are parameters, they are easily stubbed for testing
const getUserProfile = (id) => async (dispatch, getState, { api, redirect }) => {
  try {
    dispatch({ type: 'PROFILE_BEGIN', id });
    const profile = await api.getProfile(id);
    dispatch({ type: 'PROFILE_SUCCESS', profile});
  } catch(err) {
    dispatch({ type: 'PROFILE_ERROR'}, id, err);
    redirect('http://localhost/500.html');
  }
}
```

### dispatch thunks

```js
dispatch(getUserProfile())
```
## License

MIT © [Sigurd Fosseng](https://github.com/laat)
