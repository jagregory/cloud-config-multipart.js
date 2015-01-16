# cloud-config-multipart.js

Javascript multipart file concatenator for cloud-config user data

## Installation

    npm install cloud-config-multipart

## Usage

    var multipart = require('cloud-config-multipart')

    multipart(['file.txt', 'another.yaml'])
      .then(function(stream) {
        stream.on('data', function(d) {
          console.log(d.toString())
        })
      })

There's only one function, the one exported. It converts a list of files into a multipart document stream wrapped in an es6-promise.

## TODO:

  1. Directories
