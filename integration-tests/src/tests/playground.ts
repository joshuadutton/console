import Chromeless from 'chromeless'
import {CONSOLE_URL, runRemote, waitTimeout} from '../config'

export default async (cookies: any[]): Promise<any> => {

  const chromeless = new Chromeless({
    runRemote,
    waitTimeout,
  })

  return chromeless
    .goto(CONSOLE_URL)
    .cookies.set(cookies)
    .goto(CONSOLE_URL)
    .wait(3000)
    .wait('.playground-button')
    .click('.playground-button')
    .wait(1000)
    .click('.tab.plus')
    .type(`{`)
    .press(32, 2)
    .wait(100)
    .click('.CodeMirror-hint-active')
    .end()

}
