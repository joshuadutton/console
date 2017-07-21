export const examples = {
  'weather': {
    sdl: `type WeatherPayload {
  temperature: Float!
  pressure: Float!
  windSpeed: Float!
}

extend type Query {
  weather(city: String!): WeatherPayload
}
`,
    code: `const fetch = require('node-fetch')

module.exports = function (event) {
  const city = event.data.city
  return fetch(getApiUrl(city))
  .then(res => res.json())
  .then(data => {
    console.log(data)
    return {
      data: {
        temperature: data.main.temp,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
      }
    }
  })
}

function getApiUrl(query) {
	return \`http://samples.openweathermap.org/data/2.5/weather?q=$\{query\}&appid=b1b15e88fa797225412429c1c50c122a1\`
  }`,
  },
  'cuid': {
    sdl: `type CuidPayload {
  cuid: String!
}

extend type Query {
  cuid: CuidPayload
}
`,
    code: `const cuid = require('cuid')

module.exports = function (event) {
  return {
  	data: {
      cuid: cuid()
    }
  }
}`,
  },
  'sendgrid': {
    sdl: `type EmailPayload {
  success: Boolean!
}

extend type Mutation {
  sendMail(
    email: String!
    subject: String!
    body: String
  ): EmailPayload
}
`,
    code: `const SendGrid = require('sendgrid')
const helper = SendGrid.mail
const sg = SendGrid('SENDGRID_API_KEY')

module.exports = function (event) {
  const mail = generateMail(event.data)

  const request = sg.emptyRequest({
  	method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  })

  return sg.API(request).then(result => {
    return {
      data: {
      	success: true,
      },
    }
  })
  .catch(err => ({data: {success: false}}))
}

function generateMail(data) {
  const from = new helper.Email('test@test.com')
  const to = new helper.Email(data.email)
  const subject = data.subject
  const body = new helper.Content('text/plain', data.body)

  return new helper.Mail(from, subject, to, body)
}`,
  },
}
