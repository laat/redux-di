/* eslint-env jest */
import diThunkMiddleware from '.';

describe('di-thunks', () => {
  const doDispatch = () => {};
  const doGetState = () => {};
  const store = { dispatch: doDispatch, getState: doGetState };
  const createNextHandler = () => diThunkMiddleware()(store);
  describe('as normal thunks', () => {
    test('must return a function to handle action', () => {
      const nextHandler = createNextHandler();
      const actionHandler = nextHandler();
      expect(actionHandler).toBeInstanceOf(Function);
      expect(actionHandler).toHaveLength(1);
    });
    test('must run the given action function with dispatch and getState', done => {
      const nextHandler = createNextHandler();
      const actionHandler = nextHandler();
      actionHandler((dispatch, getState) => {
        expect(dispatch).toBe(doDispatch);
        expect(getState).toBe(doGetState);
        done();
      });
    });
    test('must pass action to next if not a function', () => {
      const nextHandler = createNextHandler();
      const expected = 'redux';
      const actionHandler = nextHandler(() => expected);
      const outcome = actionHandler();
      expect(outcome).toBe(expected);
    });
    test('must be invoced sync if a function', () => {
      const nextHandler = createNextHandler();
      const actionHandler = nextHandler();
      let mutated = 0;
      actionHandler(() => ++mutated);
      expect(mutated).toBe(1);
    });
    test('must throw if argument is non-object', () => {
      expect(diThunkMiddleware()).toThrow();
    });
  });
  describe('with extra arguments', () => {
    test('static argument', done => {
      const staticArg = { foobar: true };
      const nextHandler = diThunkMiddleware().withStatic(staticArg)(store);
      const actionHandler = nextHandler();
      actionHandler((dispatch, getState, arg) => {
        expect(dispatch).toBe(doDispatch);
        expect(getState).toBe(doGetState);
        expect(arg).toEqual(staticArg);
        done();
      });
    });
    test('dynamic argument functions called with store properties', done => {
      const dynamicArg = {
        foobar: ({ dispatch, getState }) => {
          expect(dispatch).toBe(doDispatch);
          expect(getState).toBe(doGetState);
          done();
        },
      };
      const nextHandler = diThunkMiddleware().withDynamic(dynamicArg)(store);
      const actionHandler = nextHandler();
      actionHandler((dispatch, getState, arg) => {
        // eslint-disable-next-line
        arg.foobar; // must be accessed for the property getter to be called.
      });
    });
    test('dynamic+static', done => {
      const dynamicArg = {
        dynamic: () => 'dynamic',
      };
      const staticArg = {
        foobar: true,
      };
      const middleware = diThunkMiddleware()
        .withStatic(staticArg)
        .withDynamic(dynamicArg);
      const nextHandler = middleware(store);
      const actionHandler = nextHandler();
      actionHandler((dispatch, getState, arg) => {
        expect(dispatch).toBe(doDispatch);
        expect(getState).toBe(doGetState);
        expect(arg.foobar).toBe(staticArg.foobar);
        expect(arg.dynamic).toBe('dynamic');
        done();
      });
    });
  });
});
