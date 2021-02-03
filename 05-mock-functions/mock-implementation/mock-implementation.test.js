
test('mock implementation', () => {
  const myMockFn = jest.fn(cb => cb(null, true));

  myMockFn((err, val) => console.log(val));
  // > true
});

describe('foo', () => {
  test('example 1', () => {
    jest.mock('./foo'); // this happens automatically with automocking
    const foo = require('./foo');

    // foo is a mock function
    foo.mockImplementation(() => 42);
    console.log(foo());
    // > 42
  });

  test('example 2', () => {
    const myMockFn = jest
      .fn()
      .mockImplementationOnce(cb => cb(null, true))
      .mockImplementationOnce(cb => cb(null, false));

    myMockFn((err, val) => console.log(val));
    // > true

    myMockFn((err, val) => console.log(val));
    // > false
  });

  test('example 3', () => {
    const myMockFn = jest
      .fn(() => 'default')
      .mockImplementationOnce(() => 'first call')
      .mockImplementationOnce(() => 'second call');

    console.log(myMockFn(), myMockFn(), myMockFn(), myMockFn());
    // > 'first call', 'second call', 'default', 'default'
  });

  test('example 4', () => {
    const myObj = {
      myMethod: jest.fn().mockReturnThis(),
    };

    // is the same as

    const otherObj = {
      myMethod: jest.fn(function () {
        return this;
      }),
    };
  });
});