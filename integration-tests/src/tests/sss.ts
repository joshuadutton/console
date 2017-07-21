import Chromeless from 'chromeless'
import { closeTab, CONSOLE_URL, runRemote, viewport, waitTimeout } from '../config'

export default async (cookies: any[]): Promise<any> =>  {

  const chromeless = new Chromeless({
    runRemote,
    waitTimeout,
    closeTab,
    viewport,
  })

  const screen = await chromeless
    .cookies.set(cookies)
    .goto(CONSOLE_URL)
    .wait(5200)
    .eval.screenshot()

  console.log(screen)

    await chromeless
    .wait('a[data-test="sidenav-functions"]')
    .click('a[data-test="sidenav-functions"]')
    .wait(5200)
    .wait('a[data-test="create-function-button"]')
    .click('a[data-test="create-function-button"]')
    .wait('div[data-test="choose-sss"]')
    .click('div[data-test="choose-sss"]')
    .wait('.next .next-name')
    .click('.next .next-name')
    .wait(700)
    .eval.code(() => document.querySelector('input[data-test="function-name-input"]').focus())

  const screen2 = await chromeless
    .type('Test SSS Function', 'input[data-test="function-name-input"]')
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(2200)
    .wait('a[data-test="edit-sss-function-button"]')
    .click('a[data-test="edit-sss-function-button"]')
    .wait(1200)
    .wait('pre.CodeMirror-line')
    .click('pre.CodeMirror-line')
    .type('  ')
    .wait(600)
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(2200)
    .eval.screenshot()

  console.log('\n\n\nSCREEN')
  console.log(screen2)
  console.log('\n\n\n')

    return chromeless
    .wait('a[data-test="edit-sss-function-button"]')
    .click('a[data-test="edit-sss-function-button"]')
    .wait(1600)
    .wait('.popup-footer .delete')
    .click('.popup-footer .delete')
    .wait(2000)
    .end()

}
