import axios from 'axios';
import Users from './users';

jest.mock('axios');

function forEach(items, callback) {
  for (let index = 0; index < items.length; index++) {
    callback(items[index]);
  }
}

test('Using a mock function', () => {
  const mockCallback = jest.fn(x => 42 + x);
  forEach([0, 1], mockCallback);

  // The mock function is called twice
  expect(mockCallback.mock.calls.length).toBe(2);

  // The first argument of the first call to the function was 0
  expect(mockCallback.mock.calls[0][0]).toBe(0);

  // The first argument of the second call to the function was 1
  expect(mockCallback.mock.calls[1][0]).toBe(1);

  // The return value of the first call to the function was 42
  expect(mockCallback.mock.results[0].value).toBe(42);
})

test('.mock property 1', () => {
  const myMock = jest.fn();

  const a = new myMock();
  const b = {};
  const bound = myMock.bind(b);
  bound();

  console.log(myMock.mock.instances);
  // > [ <a>, <b> ]
})

test('.mock property 2', () => {
  const someMockFunction = jest.fn().mockReturnValue('return value');
  const a = new someMockFunction('first arg', 'second arg');
  a.name = 'test';

  // The function was called exactly once
  expect(someMockFunction.mock.calls.length).toBe(1);

  // The first arg of the first call to the function was 'first arg'
  expect(someMockFunction.mock.calls[0][0]).toBe('first arg');

  // The second arg of the first call to the function was 'second arg'
  expect(someMockFunction.mock.calls[0][1]).toBe('second arg');

  // The return value of the first call to the function was 'return value'
  expect(someMockFunction.mock.results[0].value).toBe('return value');

  someMockFunction();
  // This function was instantiated exactly twice
  expect(someMockFunction.mock.instances.length).toBe(2);

  // The object returned by the first instantiation of this function
  // had a `name` property whose value was set to 'test'
  expect(someMockFunction.mock.instances[0].name).toEqual('test');
})

test('Mock Return Values 1', () => {
  const myMock = jest.fn();
  console.log(myMock());
  // > undefined

  myMock.mockReturnValueOnce(10).mockReturnValueOnce('x').mockReturnValue(true);

  console.log(myMock(), myMock(), myMock(), myMock());
  // > 10, 'x', true, true
})

test('Mock Return Values 2', () => {
  const filterTestFn = jest.fn();

  // Make the mock return `true` for the first call,
  // and `false` for the second call
  filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);

  const result = [11, 12].filter(num => filterTestFn(num));

  console.log(result);
  // > [11]
  console.log(filterTestFn.mock.calls);
  // > [ [11], [12] ]
})

describe('Mock Modules', () => {
  test('should fetch users', () => {
    const users = [{ name: 'Bob' }];
    const resp = { data: users };
    axios.get.mockResolvedValue(resp);

    // or you could use the following depending on your use case:
    // axios.get.mockImplementation(() => Promise.resolve(resp))

    return Users.all().then(data => expect(data).toEqual(users));
  });
})

test('Mock Implementations 1', () => {
  const myMockFn = jest.fn(cb => cb(null, true));

  myMockFn((err, val) => console.log(val));
  // > true
})

test('Mock Implementations 2', () => {
  jest.mock('./foo'); // this happens automatically with automocking
  const foo = require('./foo');

  // foo is a mock function
  foo.mockImplementation(() => 42);
  foo();
  // > 42
})

test('Mock Implementation 3', () => {
  const myMockFn = jest
    .fn()
    .mockImplementationOnce(cb => cb(null, true))
    .mockImplementationOnce(cb => cb(null, false));

  myMockFn((err, val) => console.log(val));
  // > true

  myMockFn((err, val) => console.log(val));
  // > false
})

test('Mock Implementation 4', () => {
  const myMockFn = jest
    .fn(() => 'default')
    .mockImplementationOnce(() => 'first call')
    .mockImplementationOnce(() => 'second call');

  console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
  // > 'first call', 'second call', 'default', 'default'
})

test('Mock Implementation 5', () => {
  const myObj = {
    myMethod: jest.fn().mockReturnThis(),
  };

  // is the same as

  const otherObj = {
    myMethod: jest.fn(function () {
      return this;
    }),
  };
})

test('Mock Names', () => {
  const myMockFn = jest
    .fn()
    .mockReturnValue('default')
    .mockImplementation(scalar => 42 + scalar)
    .mockName('add42');
})

test('Custom Matchers 1', () => {
  const mockFunc = jest.fn();
  const arg1 = 'arg1';
  const arg2 = 'arg2';
  mockFunc(arg1, arg2);

  // The mock function was called at least once
  expect(mockFunc).toHaveBeenCalled();

  // The mock function was called at least once with the specified args
  expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);

  // The last call to the mock function was called with the specified args
  expect(mockFunc).toHaveBeenLastCalledWith(arg1, arg2);

  // All calls and the name of the mock is written as a snapshot
  expect(mockFunc).toMatchSnapshot();
})

test('Custom Matchers 2', () => {
  const mockFunc = jest.fn().mockName('a mock name');
  const arg1 = 42;
  const arg2 = 'arg2';
  mockFunc(arg1, arg2);

  // The mock function was called at least once
  expect(mockFunc.mock.calls.length).toBeGreaterThan(0);

  // The mock function was called at least once with the specified args
  expect(mockFunc.mock.calls).toContainEqual([arg1, arg2]);

  // The last call to the mock function was called with the specified args
  expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1]).toEqual([
    arg1,
    arg2,
  ]);

  // The first arg of the last call to the mock function was `42`
  // (note that there is no sugar helper for this specific of an assertion)
  expect(mockFunc.mock.calls[mockFunc.mock.calls.length - 1][0]).toBe(42);

  // A snapshot will check that a mock was invoked the same number of times,
  // in the same order, with the same arguments. It will also assert on the name.
  expect(mockFunc.mock.calls).toEqual([[arg1, arg2]]);
  expect(mockFunc.getMockName()).toBe('a mock name');
})
