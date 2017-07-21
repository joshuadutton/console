import Chromeless from 'chromeless'
import { closeTab, CONSOLE_URL, runRemote, viewport, waitTimeout } from '../config'

export default async (cookies: any[]): Promise<any> => {

  const chromeless = new Chromeless({
    runRemote,
    waitTimeout,
    closeTab,
    viewport,
  })

  return chromeless
    .cookies.set(cookies)
    .goto(CONSOLE_URL)
    .wait(3200)
    .wait('a[data-test="sidenav-permissions"]')
    .click('a[data-test="sidenav-permissions"]')
    .wait(1200)
    .click('a[data-test="edit-permission-button-Post"]')
    .wait(1200)
    // click apply to whole type
    .wait('.next .next-name')
    .click('.next .next-name')
    .wait(400)
    .wait('.permission-query-wrapper .after')
    .click('.permission-query-wrapper .after')
    .wait(400)
    .click('div[data-test="button-auth-required"]')
    .wait(700)
    .wait('.buttons .button.active')
    .click('.buttons .button.active')
    .wait(1200)
    .eval.code(() => document.querySelector('.z5:last-child h3[data-test="permission-row-label"]').innerHTML)

}
