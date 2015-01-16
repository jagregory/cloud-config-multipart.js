// largely taken from python examples
// http://docs.python.org/library/email-examples.html

require('es6-shim')

var fs = require('fs'),
  mimeMultipartStream = require('mime-multipart-stream')

function readFirstLineOfFile(filename) {
  return new Promise(function(resolve, reject) {
    var data = ''
    var stream = fs.createReadStream(filename)
    stream.on('error', reject)
    stream.on('data', function(chunk) {
      data += chunk
      if (data.indexOf('\n') >= 0) {
        this.close()
      }
    })
    stream.on('end', function() {
      resolve(data.split('\n')[0])
    })
  })
}

var defaultType = 'text/plain; charset=UTF-8'
var mimeTypeMappings = {
  '#!': 'text/x-shellscript',
  '#cloud-boothook': 'text/cloud-boothook',
  '#cloud-config': 'text/cloud-config',
  '#include': 'text/x-include-url',
  '#part-handler': 'text/part-handler',
  '#upstart-job': 'text/upstart-job',
}

function getTypeFromPreamble(preamble) {
  var type = Object.keys(mimeTypeMappings).find(function(prefix) {
    return preamble.startsWith(prefix)
  })
  return mimeTypeMappings[type]
}

function getType(filename) {
  return readFirstLineOfFile(filename)
    .then(getTypeFromPreamble)
    .then(function(type) {
      return type || defaultType
    })
}

module.exports = function(files, opts) {
  var stream = mimeMultipartStream({
    boundary: '===============7782905480619671273==',
    type: 'mixed'
  })

  return Promise.all(files.map(function(file) {
      return getType(file)
        .then(function(type) {
          stream.add({
            type: type,
            body: fs.createReadStream(file)
          })
          return true
        })
    }))
    .then(function() {
      return stream
    })
}
