import axios from 'axios'

const SLACK_WEBHOOK_URL  = process.env.SLACK_WEBHOOK_URL,
      SLACK_POST_CHANNEL = process.env.SLACK_POST_CHANNEL,
      SLACK_ICON         = process.env.SLACK_ICON,
      APP_NAME           = process.env.APP_NAME || 'contact-form-to-slack'

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}

const generateSlackMessage = (jsonString) => {
  const json = JSON.parse(jsonString)
  return JSON.stringify({
    icon_emoji: SLACK_ICON,
    channel: SLACK_POST_CHANNEL,
    attachments: [
      {
        fallback: `[${APP_NAME}] Contact Arrival`,
        color: '#d3d3d3',
        pretext: `[${APP_NAME}] Contact Arrival`,
        text: json.Message,
        fields: Object.keys(json).filter(key => key != 'Message').map(key => {
          return {
            title: key,
            value: json[key]
          }
        }),
        footer: APP_NAME,
        ts: Math.floor(new Date(json.Date || new Date()).getTime() / 1000)
      }
    ]
  })
}

export default (event, context, callback) => {
  console.log('processing_event:', event)

  return Promise.all((event.Records || []).map(record => {
    if (!record.Sns) {
      console.log('invalid_record:', record)
      return Promise.reject(JSON.stringify(record))
    }

    return(
      axios.post(SLACK_WEBHOOK_URL, generateSlackMessage(record.Sns.Message), config)
      .then(res => res.statusText)
    )
  }))
  .then(statuses => {
    console.log('success:', statuses)
    callback(null, statuses)
  })
  .catch(err => {
    console.log('failure:', err)
    callback(err)
  })
}
