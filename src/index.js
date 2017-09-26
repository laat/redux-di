// @flow
type Dispatch = (action: Object | any) => any;
type State = any;
type MiddlewareAPI = { dispatch: Dispatch, getState(): State };
type Injector = (api: MiddlewareAPI) => { [key: string]: any };

const mergeResults = (...args) => (result, fn) => ({ ...result, ...fn(...args) });

export default (...injectors: Array<Injector>) => ({ dispatch, getState }: MiddlewareAPI) =>
  (next: Dispatch) => (action: any) => {
    if (typeof action === 'function') {
      const defaultProps = { dispatch, getState };
      return action(injectors.reduce(mergeResults(defaultProps), defaultProps));
    }
    return next(action);
  };
