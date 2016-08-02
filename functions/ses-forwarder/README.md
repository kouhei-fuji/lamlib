# Lamlib SES forwarder

The function is mail forwarder from SES to another.

## Requirements

- Node.js 4.3.2

## Environment Variables

- `FROM_EMAIL`: Verified email address on SES
- `TO_EMAIL`: Forwarding destination (Set it: `you@gmail.com`, Get by: `info@your-domain.com` => Forward for: `you+info@gmail.com`)
- `SES_REGION`: Defaults `us-west-2` (Oregon)

## AWS Setup

### S3

Create domain dedicated S3 bucket.

### SES

1. Create Email Receiving Rule Set of each email address
1. Add S3 action
  1. Select created S3 bucket
  1. Set object key prefix by receiver (if your want to receive `info@your-domain.com`, set `info/`)

### Lambda

1. Select created function
1. Select `current` alias
1. Add `trigger`
  1. Select `S3`
  1. Select created S3 bucket
  1. Event type to `Put`

## Deploy

*This function includes `iconv`, so that you should build/deploy on ami-f0091d91 EC2 (see [Lambda Execution Environment and Available Libraries](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html))*

Setup on EC2 (ami-f0091d91):

```
$ sudo su -
# curl https://raw.githubusercontent.com/apex/apex/master/install.sh | sh
# apex upgrade
# NODE_VERSION=4.3.2
# NODE_DOWNLOAD_SHA256=f307f173a96dff6652bc70d835af0c732864bb09875cf32a0b6ce7d70cebf77d
# cd /usr/local/src \
    && curl -O https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz \
    && echo ${NODE_DOWNLOAD_SHA256} node-v${NODE_VERSION}-linux-x64.tar.gz | sha256sum -c - \
    && tar xf node-v${NODE_VERSION}-linux-x64.tar.gz -C /usr/local --strip-components=1 \
    && rm -rf /usr/local/src/node-v${NODE_VERSION}-linux-x64.tar.gz
# exit
$ sudo yum -y install git gcc-c++ && sudo yum clean all
$ git clone https://github.com/kouhei-fuji/lamlib.git
$ cd lamlib/functions/ses-forwarder && npm i
```

Upload ses-forwarder function to Lambda:

```
$ pwd
/path/to/lamlib/functions/ses-forwarder
$ apex deploy -C ../.. --region $SES_REGION --set FROM_EMAIL=$FROM_EMAIL --set TO_EMAIL=$TO_EMAIL --set SES_REGION=$SES_REGION ses-forwarder
```

You can also exec other commands in other directory. (see [Apex details](http://apex.run/#examples))

## TODO

- Add `Cc` informations in original message into forwarded message
