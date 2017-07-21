import Chromeless from 'chromeless'
import { CONSOLE_URL, runRemote, viewport, waitTimeout } from '../config'

export default async (cookies: any[]): Promise<any> =>  {

  const chromeless = new Chromeless({
    runRemote,
    waitTimeout,
    viewport,
  })

  return chromeless
    .cookies.set(cookies)
    .goto(CONSOLE_URL)
    .wait(3200)
    .wait('div[data-test="logo"]')
    .click('div[data-test="logo"]')
    .wait('div[data-test="add-project-button"]')
    .click('div[data-test="add-project-button"]')
    .wait('input[data-test="project-name-input"]')
    .type('Very Long Test Project Name')
    .click('div[data-test="submit-add-project-button"]')
    .wait(5200)
    .eval.code(() => document.querySelector('.project-name').innerHTML)

}
