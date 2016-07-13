# kopper-serverless
A small framework for building serverless apis on AWS lambda in node.

[![Build Status](https://travis-ci.org/benconnito/kopper-serverless.svg)](https://travis-ci.org/benconnito/kopper-serverless)

##there is a grunt helper!
use with https://github.com/benconnito/grunt-kopper-serverless for easy deployment of lambdas and api definition on api gateway

##api
```javascript
var Kopper = require('kopper-serverless');
var AWS = require('aws-sdk');

exports.handler = function (event, context) {
  try{
    Kopper.AWS.config(event, 'us-east-1', 'default', AWS);
    
    if(event){
      Kopper.Succeed({/*response*/}, context);
    }else{
      throw new Kopper.Error.NonFatalError('missing event object', 400);
    }
  }catch(error){
    Kopper.Fail(error, error.code, context);
  }
}
```
