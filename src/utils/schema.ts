import { buildClientSchema, introspectionQuery, printSchema } from 'graphql'

export default function getFullIdl(projectId: string) {
  const endpointUrl = `${__BACKEND_ADDR__}/relay/v1/${projectId}`
  return fetch(
    endpointUrl,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'x-graphcool-source': 'console:playground',
      },
      body: JSON.stringify({query: introspectionQuery}),
    },
  )
    .then((response) => {
      return response.json()
    })
    .then((res: any) => {
      const schema = buildClientSchema(res.data)
      return printSchema(schema)
    })
}
