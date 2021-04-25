import { Selector } from 'testcafe';

fixture`Getting Started`
  .page`http://localhost:3000`

test('My first test', async t => {
  await t
    .typeText('#username', process.env.USERNAME)
    .typeText('#password', process.env.PASSWORD)
    .click(Selector('button[type="submit"]'))
})