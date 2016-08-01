export default (event, context, callback) => {
  console.log('processing_event:%j', event)
  callback(null, event)
}
