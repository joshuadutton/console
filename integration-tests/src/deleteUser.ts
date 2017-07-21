import * as fetch from 'isomorphic-fetch'

interface Cookie {
  name: string
  value: string
  path: string
  expires: number
  size: number
  httpOnly: boolean
  secure: boolean
  session: boolean
}

interface CustomerInfo {
  token: string
  customerId: string
}

export function extractCustomerInfo(cookies: Cookie[]): CustomerInfo {
  let token = null
  let customerId = null
  cookies.forEach(cookie => {
    if (cookie.name === 'graphcool_auth_token') {
      token = cookie.value
    }

    if (cookie.name === 'graphcool_customer_id') {
      customerId = cookie.value
    }
  })

  return {token, customerId}
}

export async function deleteCustomer({token, customerId}: CustomerInfo) {
  const query = `mutation ($customerId: String!) {
    deleteCustomer(input: {
      customerId: $customerId
      clientMutationId: "asd"
    }) {
      clientMutationId
      deletedId
    }
  }`
  const variables = {
    customerId,
  }
  const result = await fetch(`${process.env.BACKEND_ADDR}/system`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables})
  })
  const json = await result.json()
  return json
}
