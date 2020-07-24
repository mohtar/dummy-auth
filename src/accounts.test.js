const accounts = require('./accounts');

test('check password', async () => {
  const password = 'foo';
  expect(
    await accounts.checkPassword(
      password,
      await accounts.makePassword(password),
    ),
  ).toBeTruthy();
});
