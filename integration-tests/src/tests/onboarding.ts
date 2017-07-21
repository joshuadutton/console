import Chromeless from 'chromeless'
import { closeTab, CONSOLE_URL, runRemote, viewport, waitTimeout } from '../config'
import * as fs from 'fs'

export default async (cookies: any[]): Promise<any> =>  {
  const chromeless = new Chromeless({
    runRemote,
    waitTimeout,
    closeTab,
    viewport,
  })

  await chromeless
    .cookies.set(cookies)
    .goto(CONSOLE_URL)
    .wait(2600)
    .wait('div[data-test="start-onboarding"]')
    .click('div[data-test="start-onboarding"]')
    .wait(1100)
    .click('.add-type')
    .wait(300)
    .type('Post', '.name-input')
    .wait(300)
    .wait('.button.save')
    .click('.button.save')
    .wait(2100)

    .click('a[data-test="add-post-field"]')
    .eval.code(() => document.querySelector('a[data-test="add-post-field"] .add-button').click())

  const screenshot = await chromeless
    .wait(1100)
    .wait('input.fieldNameInputField')
    .type('imageUrl', 'input.fieldNameInputField')
    .wait(600)
    .click('div[data-test="string-type"] div')
    .wait(900)
    .click('.buttons div.button.active')
    .wait(1900)
    .click('a[data-test="add-post-field"]')
    .wait('input.fieldNameInputField')
    .type('description', 'input.fieldNameInputField')
    .wait(600)
    .click('div[data-test="string-type"]')
    .wait(900)
    .click('.buttons div.button')
    .wait(1900)
    .click('.playground-button')
    .wait(2100)
    .wait('.CodeMirror')
    .wait(300)
    .press(8, 2)
    .wait(1500)
    .click('.graphcool-execute-button')
    .wait(1100)
    .click('.tab.plus')
    // execute mutation
    .wait(1100)
    .click('.tether-content .btn')
    .wait(1600)
    .click('.graphiql-wrapper:last-child .graphcool-execute-button svg')
    .wait('.tether-content .btn')
    .click('.tether-content .btn')
    .wait(1100)
    .click('.graphiql-wrapper:last-child .graphcool-execute-button')
    .wait(1100)
    .click('.tabs .tab')
    // execute query again
    .wait(900)
    .click('.graphcool-execute-button')
    .wait(3100)
    .wait('.bottom .skip')
    .click('.bottom .skip')
    .wait(1000)
    .wait('div[data-test="close-popup"]')
    .click('div[data-test="close-popup"]')
    .wait(2000)
    .eval.screenshot()

  console.log('\n\n')
  console.log(screenshot)
  console.log('\n\n')
}
