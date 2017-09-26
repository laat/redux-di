// @flow
import sinon from 'sinon';
import test from 'tape';
import di from './index.js';

const fn = () => function noop() {};

test('passthrough middleware when action is not a function', assert => {
  const store = { dispatch: fn(), getState: fn() };
  const action = { type: 'NOOP' };
  const next = sinon.stub();
  di()(store)(next)(action);
  assert.ok(next.calledWith(action), 'calls next with action');
  assert.end();
});

test('thunk with dependency injection', assert => {
  const store = { dispatch: sinon.spy(), getState: sinon.spy() };
  const config = { aValue: true };
  const getConfig = sinon.spy(({ dispatch, getState }) => {
    getState('getConfig');
    dispatch('getConfig');
    return { config };
  });
  const action = sinon.spy(({ dispatch, getState }) => {
    getState('action');
    dispatch('action');
    return 'actionResult';
  });
  const next = sinon.stub();

  const result = di(getConfig)(store)(next)(action);

  assert.ok(next.notCalled, 'action is function, do not call next');
  assert.ok(getConfig.calledWith(store), 'getConfig called with store');
  assert.ok(
    action.calledWith({ ...store, config }),
    'dependency injection works'
  );
  assert.ok(
    store.dispatch.calledWith('getConfig'),
    'injector can call dispatch'
  );
  assert.ok(
    store.getState.calledWith('getConfig'),
    'injector can call getState'
  );
  assert.ok(store.dispatch.calledWith('action'), 'thunk can call dispatch');
  assert.ok(store.getState.calledWith('action'), 'thunk can call getState');
  assert.equal(result, 'actionResult', 'returns result from action');
  assert.end();
});
