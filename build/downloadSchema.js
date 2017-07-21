const {introspectionQuery} = require('graphql')
const fs = require('fs')

const fetch = require('isomorphic-fetch')

const url = 'https://dev.api.graph.cool/system'

fetch(
  url,
  {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query: introspectionQuery}),
  }
)
  .then((response) => {
    return response.json()
  })
  .then((res) => {
    fs.writeFileSync(__dirname + '/schema.json', JSON.stringify(res), 'utf-8')
    console.log('Done downloading schema from ' + url)
  })
