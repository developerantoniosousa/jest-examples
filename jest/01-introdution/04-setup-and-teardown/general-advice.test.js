test('this will be the only test that runs', () => {
  expect(true).toBe(true);
});

test.only('this test will not run', () => {
  expect('A').toBe('A');
});