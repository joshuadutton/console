import Chromeless from 'chromeless'
import { CONSOLE_URL, runRemote, viewport, waitTimeout } from '../config'

export default async (cookies: any[]): Promise<any> => {

  const chromeless = new Chromeless({
    runRemote,
    waitTimeout,
    viewport,
  })

  await chromeless
    .cookies.set(cookies)
    .goto(CONSOLE_URL)
    .wait(3200)
    .wait('a[data-test="sidenav-databrowser"]')
    .click('a[data-test="sidenav-databrowser"]')
    .wait(2200)
    .wait('a[data-test="sidenav-databrowser-model-Post"]')
    .click('a[data-test="sidenav-databrowser-model-Post"]')
    .wait(2200)
    .click('div[class^="NewRowInactive__add"]')
    .type('test url')
    .eval.code(() => document.querySelector('div[data-test="new-row-cell-imageUrl"] input').blur())

  await chromeless
    .click('div[data-test="new-row-cell-description"] > div > div')
    .wait(400)
    .wait('div[data-test="new-row-cell-description"] input')
    .type('some description', 'div[data-test="new-row-cell-description"] input')
    .eval.code(() => document.querySelector('div[data-test="new-row-cell-description"] input').blur())

  await chromeless
    .wait(700)
    .click('button[data-test="add-node"]')
    .wait(300)
    .click('div[data-test="edit-field-imageUrl"]')
    .click('div[data-test="cell-imageUrl"]')
    .type('123')
    .eval.code(() => document.querySelector('input').focus())

  return chromeless
    .press(13)
    .wait(400)
    .click('div[data-test="checkbox-row-0"]')
    .wait(400)
    .click('div[data-test="delete-button"]')
    .wait(400)
    .click('div.button.warning')
    .end()
}
