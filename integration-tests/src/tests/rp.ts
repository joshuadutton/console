import Chromeless from 'chromeless'
import { closeTab, CONSOLE_URL, runRemote, viewport, waitTimeout } from '../config'

export default async (cookies: any[]): Promise<any> =>  {

  const chromeless = new Chromeless({
    runRemote,
    waitTimeout,
    viewport,
    closeTab,
  })

  await chromeless
    .cookies.set(cookies)
    .goto(CONSOLE_URL)
    .wait(3200)
    .wait('a[data-test="sidenav-functions"]')
    .click('a[data-test="sidenav-functions"]')
    .wait(1200)
    .wait('a[data-test="create-function-button"]')
    .click('a[data-test="create-function-button"]')
    .wait('div[data-test="choose-rp"]')
    .click('div[data-test="choose-rp"]')
    .wait('.next .next-name')
    .click('.next .next-name')
    .wait(700)
    .click('div[data-test="pre-write-circle"]')
    .wait(400)
    .wait('.next .next-name')
    .click('.next .next-name')
    .wait(700)
    .eval.code(() => document.querySelector('input[data-test="function-name-input"]').focus())

  return chromeless
    .type('Test RP Function', 'input[data-test="function-name-input"]')
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(2200)
    .wait('a[data-test="edit-rp-function-button"]')
    .click('a[data-test="edit-rp-function-button"]')
    .wait(1200)
    .wait('pre.CodeMirror-line')
    .click('.js-editor')
    .type('  ')
    .wait(400)
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(1200)
    .wait('a[data-test="edit-rp-function-button"]')
    .click('a[data-test="edit-rp-function-button"]')
    .wait(1200)
    .wait('.popup-footer .delete')
    .click('.popup-footer .delete')
    .end()

}
