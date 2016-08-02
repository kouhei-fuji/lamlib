import AWS from 'aws-sdk'
import { MailParser } from 'mailparser'
import mailcomposer from 'mailcomposer'

const FROM_EMAIL = process.env.FROM_EMAIL
const TO_EMAIL   = process.env.TO_EMAIL
const SES_REGION = process.env.SES_REGION || 'us-west-2' // defaults: Oregon

const createMessage = received_mail => {
  return new Promise((resolve, reject) => {
    const source = {
      from: FROM_EMAIL, // fixed
      to: TO_EMAIL,     // fixed
      replyTo: received_mail.from,
      inReplyTo: received_mail.inReplyTo,
      references: received_mail.references,
      subject: received_mail.subject,
      text: received_mail.text,
      html: received_mail.html,
      attachments: (received_mail.attachments || []).map(attachment => {
        const attachment_args = {
          filename: attachment.fileName,
          cid: attachment.contentId,
          content: attachment.content,
          contentType: attachment.contentType,
          contentTransferEncoding: attachment.transferEncoding
        }
        return attachment_args
      }),
      date: received_mail.date
    }

    mailcomposer(source).build((err, build_data) => {
      if (err) reject(err)
      const ses_params = {
        RawMessage: {
          Data: build_data
        }
      }
      resolve(ses_params)
    })
  })
}

const sendMessage = ses_params => {
  return new Promise((resolve, reject) => {
    const ses = new AWS.SES({ region: SES_REGION, apiVersion: '2010-12-01' })
    ses.sendRawEmail(ses_params, (err, data) => {
      if (err) reject(err)
      resolve(data)
    })
  })
}

export default (event, context, callback) => {
  console.log('processing_event:%j', event);

  const mailparser = new MailParser()
  mailparser.on('end', received_mail => {
    createMessage(received_mail)
    .then(sendMessage)
    .then(data => {
      console.log(data)
      callback(null, data)
    })
    .catch(err => {
      console.log(err)
      callback(err)
    })
  });

  (event.Records || []).map(record => {
    if (!record.s3) {
      console.log('invalid_record')
      callback('invalid record')
      return
    }

    const bucket = record.s3.bucket.name
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))
    const params = {
      Bucket: bucket,
      Key: key
    }

    const s3 = new AWS.S3({ apiVersion: '2006-03-01' })
    s3.getObject(params).promise()
    .then(data => {
      mailparser.write(data.Body)
      mailparser.end()
    })
    .catch(err => {
      console.log(err)
      callback(err)
    })
  })
}
