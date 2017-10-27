export default () => {
  const staticArgs = {};
  const dynamicArgs = {};
  const middleware = ({ dispatch, getState }) => {
    const extraArgument = { ...staticArgs };
    Object.entries(dynamicArgs).forEach(([key, callback]) => {
      Object.defineProperty(extraArgument, key, {
        get() {
          return callback({ dispatch, getState });
        },
        enumerable: true,
      });
    });

    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState, extraArgument);
      }
      return next(action);
    };
  };
  middleware.withStatic = arg => {
    Object.assign(staticArgs, arg);
    return middleware;
  };
  middleware.withDynamic = arg => {
    Object.assign(dynamicArgs, arg);
    return middleware;
  };
  return middleware;
};
