# Contact form to Slack

This function is posting contact form json to Slack.

## Requirements

- Node.js 4.3.2

## Environment Variables

- `SLACK_WEBHOOK_URL`: **Required**. Slack Webhook URL
- `SLACK_POST_CHANNEL`: Optional. Slack Channel to post message (Default: `null`)
- `SLACK_ICON`: Optional. Slack poster icon (Default: `null`)
- `APP_NAME`: Optional. Slack notification title (Default: `contact-form-to-slack`)

## Development

```
$ npm i
$ apex -C ../.. deploy --set SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL contact-form-to-slack
$ cat event.json | apex -C ../.. invoke contact-form-to-slack
$ apex -C ../.. logs -f contact-form-to-slack
```

## Deploy

    $ apex -C ../.. deploy --set SLACK_WEBHOOK_URL=$SLACK_WEBHOOK_URL contact-form-to-slack
