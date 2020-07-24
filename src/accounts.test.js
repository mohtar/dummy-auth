import * as accounts from './accounts';

test('check password', async () => {
  const password = 'foo';
  expect(
    await accounts.checkPassword(
      password,
      await accounts.makePassword(password),
    ),
  ).toBeTruthy();
});
