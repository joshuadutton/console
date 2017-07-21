import test from 'ava'
import onboarding from './tests/onboarding'
import signup from './signup'
import createProject from './tests/createProject'
import sss from './tests/sss'
import rp from './tests/rp'
import updatePermission from './tests/updatePermission'
import createPermission from './tests/createPermission'
import databrowser from './tests/databrowser'
import playground from './tests/playground'
import {deleteCustomer, extractCustomerInfo} from './deleteUser'

let cookies: any[] = []

test.before('signup, get cookie and run onboarding', async t => {
  console.log('######### signup')
  cookies = await signup()
  console.log('######### onboarding')
  await onboarding(cookies)
})

test.after('delete user', async () => {
  console.log('Deleting User')
  const customerInfo = extractCustomerInfo(cookies)
  try {
    const deleteResult = await deleteCustomer(customerInfo)
    console.log(deleteResult)
  } catch (e) {
    console.error(e)
    // it's not critical to delete the customer as we delete them every night
  }

})

test('create and update sss', async t => {
  console.log('######### sss')
  await sss(cookies)
  t.pass()
})

test('create and update rp', async t => {
  console.log('######### rp')
  await rp(cookies)
  t.pass()
})

test('updatePermission', async t => {
  console.log('######### updatePermission')
  const permissionLabel = await updatePermission(cookies)
  t.is(permissionLabel, 'Authenticated')
  t.pass()
})

test('createPermission', async t => {
  console.log('######### createPremission')
  const permissionLabel = await createPermission(cookies)
  t.is(permissionLabel, 'Authenticated')
  t.pass()
})

test('databrowser', async t => {
  console.log('######### databrowser')
  await databrowser(cookies)
  t.pass()
})

// TODO activate later when new playground is used
// test('playground', async t => {
//   console.log('######### playground')
//   await playground(cookies)
//   t.pass()
// })
