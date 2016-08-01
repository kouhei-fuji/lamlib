# Lamlib SES forwarder

The function is mail forwarder from SES to another.

## Requirements

- Node.js 4.3.2

## Environment Variables

- `FROM_EMAIL`: Verified email address on SES
- `TO_EMAIL`: Forwarding destination
- `SES_REGION`: Defaults `us-west-2` (Oregon)

## Deploy

in project root:

    $ apex deploy --region $SES_REGION --set FROM_EMAIL=$FROM_EMAIL --set TO_EMAIL=$TO_EMAIL --set SES_REGION=$SES_REGION ses-forwarder

or somewhere:

    $ apex deploy --region $SES_REGION -C /path/to/project-root --set FROM_EMAIL=$FROM_EMAIL --set TO_EMAIL=$TO_EMAIL --set SES_REGION=$SES_REGION ses-forwarder

You can also exec other commands as above. (see [Apex details](http://apex.run/#examples).)
