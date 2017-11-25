/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/products              ->  index
 * POST    /api/products              ->  create
 * GET     /api/products/:id          ->  show
 * PUT     /api/products/:id          ->  update
 * DELETE  /api/products/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {Product} from '../../sqldb';
var Promise = require('promise');
var rp = require('request-promise');
import config from '../../config/environment';
var https = require ('https');
var cognitiveServices = require('cognitive-services');

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    console.log(JSON.stringify(err))
    console.log(err.stack)
    res.status(statusCode).send(err);
  };
}

// Gets a list of Products
export function index(req, res) {
  Product.findAll({
      order:[
        ['createdAt' , 'DESC']
      ],
  })
    .then(function(result){
      result = _.map(result, function(item){
        item.content = JSON.parse(item.content)
        return item
      })
      return result
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Product from the DB
export function show(req, res) {
  Product.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(function(result){
      result.content = JSON.parse(result.content)
      return result
    })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new Product in the DB
export function create(req, res) {
  Product.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Product in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Product.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
// Updates an existing Product in the DB
export function approve(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return Product.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(initializeBundle())
    .then(sendProductToRemote())
    .then(updateProductWithRemoteResponse())
    .then(respondWithResult(res))
    .catch(handleError(res));
}
function initializeBundle(req, res) {
  return function(product){
    var bundle = {
      product: product
    }
    return bundle
  }
}

function sendProductToRemote(req, res) {
  return function(bundle){
    var _product = {
        brand_id: "1",
        category_id: "1",
        description: bundle.product.description,
        ean: '4679946120934',
        model: bundle.product.model,
        name: bundle.product.name,
        price: bundle.product.price,
        images_attributes: [
          {
            name: 'Zapatilla',
            url: 'https://www.foroatletismo.com/imagenes/2016/10/zapatilla-oro-luanvi.jpg'
          }
      ],
        stock: bundle.product.stock
      }

      var options = {
          method: 'POST',
          uri: 'http://52.170.248.170/api/v1/products',
          body: _product,
          headers: {
               'X-Company-ID': '1',
               'content-type': 'application/json'
          },
          json: true // Automatically parses the JSON string in the response
      };
    
    return rp(options)
    .then(function(result){
      bundle.response = result
      console.log(result)
      return bundle
    })
  }
}
function updateProductWithRemoteResponse(req, res) {
  return function(bundle){
    var _update = {
      validationStatus: 'accepted',
      content: JSON.stringify(bundle.response)
    }
    console.log(_update)
    return bundle.product.updateAttributes(_update)
      .then(updated => {
        return bundle;
      });
  }
}

// Deletes a Product from the DB
export function destroy(req, res) {
  Product.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}


export function validate(req, res) {
  return Promise.resolve()
  .then(initializeBundleWithProduct(req.body))
  .then(azureProductValidation())
  .then(approvalLevel())
  .then(prepareValidationResponse())
  .then(respondWithResult(res))
  .catch(handleError(res));
}

function initializeBundleWithProduct(product){
  return function(){
    var bundle = {
      product: product,
      validations:[]
    }
    return bundle
  }
}


function azureProductValidation(){
  return function(bundle){
    var promises = [
      nameValidation(bundle.product.name),
      descriptionValidation(bundle.product.description),
      imagenValidations(bundle.product.ProductImages)
    ]

    return Promise.all(promises)
    .then(function(azureProductValidationResults){
      bundle.validations =
        {
          name: azureProductValidationResults[0],
          description: azureProductValidationResults[1],
          imagenValidations: azureProductValidationResults[2]
        }
      return bundle
    })
  }
}

function nameValidation(productName){
  return validateProductProperty(productName)
}
function descriptionValidation(producDescription){
  return validateProductProperty(producDescription)
}

function imagenValidations(productImages){
  var promises = []
  var imageneValidations = []
  _.each(productImages, function(_productImage){
    var imageneValidation = {}
    var promise = callComputerVisionService(_productImage.url,config.azureCredentials.computerVisionAnalytics, 'en', 'analyze')
    .then(function(imageneValidationReult){
      return callTextTranslatorService(imageneValidationReult.description.tags,'en','es', config.azureCredentials.translatorText)
      .then(function(translatedTags){
        var captionPromises = []
        _.each(imageneValidationReult.description.captions, function(_caption){
          var captionPromise = callTextTranslatorService(_caption.text,'en','es', config.azureCredentials.translatorText)
          .then(function(_captionTranslatedText){
            _caption.text = _captionTranslatedText[0][0]
            return _captionTranslatedText
          })
          captionPromises.push(captionPromise)

        })
        return Promise.all(captionPromises)
        .then(function(translatedCaptions){
          console.log(translatedCaptions)
          imageneValidationReult.description.tags = translatedTags
          imageneValidation.ProductImageId = _productImage._id
          imageneValidation.analysis = imageneValidationReult
          return translatedCaptions
        })
      })
    })
    .then(function(){
      return callComputerVisionService(_productImage.url,config.azureCredentials.computerVisionAnalytics, 'en', 'ocr')
      .then(function(textAnalysisResult){
        imageneValidation.textAnalysis = textAnalysisResult
        imageneValidation.textAnalysis.words = []
         _.each(imageneValidation.textAnalysis.regions, function(_region){
            _.each(_region.lines, function(_line){
              _.each(_line.words, function(_word){
                 imageneValidation.textAnalysis.words.push(_word.text)
             })
          })
        })
        return textAnalysisResult
      })
    })
    .then(function(finalResult){
          imageneValidations.push(imageneValidation)
    })

    //image phase 2
    promises.push(promise)
    
  })
  return Promise.all(promises)
  .then(function(imageneValidationReults){

    return imageneValidations
  })
}

function callComputerVisionService(imageUrl, credentials, mkt, type){
  return new Promise(function(fulfill, reject){
    try{
      let query_string = "?language=" + mkt + "&visualFeatures=Categories,Description,Color&detectOrientation=true";
      let response_handler = function (response) {
          let body = '';
          response.on ('data', function (d) {
              body += d;
          });
          response.on ('end', function () {
              let body_ = JSON.parse (body);
              fulfill(body_)
          });
          response.on ('error', function (e) {
              console.log ('Error: ' + e.message);
              reject(e)
          });
      };


      let body = JSON.stringify ({url: imageUrl});


      let request_params = {
          method : 'POST',
          hostname : credentials.host,
          path : credentials.path +'/' + type + query_string,
          headers : {
              'Ocp-Apim-Subscription-Key' : credentials.key,
          }
      };
      console.log('request_params')
      console.log(request_params)
      console.log('body')
      console.log(body)

      let req = https.request (request_params, response_handler);
      req.write (body);
      req.end ();


    }catch(err){
      reject(err)
    }
  })
}

function validateProductProperty(productProperty){
  return callTextAnalyticsLanguageDetectionService(productProperty, config.azureCredentials.textAnalytics)
  .then(function(languageDetectionResult){
    var languageDetected =_.last(_.sortBy(languageDetectionResult.documents[0].detectedLanguages, function(_detectedLanguage){
      return _detectedLanguage.score
    }))
    console.log('*languageDetected*')
    console.log(languageDetected)
    var promises = [
      callBingSpellCheckService(productProperty, config.azureCredentials.spellCheck, languageDetected.iso6391Name),
      callTextAnalyticSentimentService(productProperty, config.azureCredentials.textAnalytics, languageDetected.iso6391Name),
      callTextAnalyticKeyPhraseService(productProperty, config.azureCredentials.textAnalytics, languageDetected.iso6391Name)
    ]
    return Promise.all(promises)
    .then(function(descriptionValidationResponses){
      return {
        languageDetection:  languageDetectionResult,
        spellCheck:  descriptionValidationResponses[0],
        sentiment:  descriptionValidationResponses[1],
        keyPhrase:  descriptionValidationResponses[2],
      }
    })
  })
}

function prepareValidationResponse(){
  return function(bundle){
    return bundle.validations
  }
}


/*
function callTextAnalyticsLanguagesService(text){
  return new Promise(function(fulfill, reject){
    try{

    }catch(err){
      reject(err)
    }
  })
}
*/

function callTextAnalyticsLanguageDetectionService(text, credentials){
  return callTextAnalyticsService(text, credentials, 'languages')
}
function callTextAnalyticSentimentService(text, credentials, mkt){
  return callTextAnalyticsService(text, credentials, 'sentiment', mkt)
}
function callTextAnalyticKeyPhraseService(text, credentials, mkt){
  return callTextAnalyticsService(text, credentials, 'keyPhrases', mkt)
}

function callTextTranslatorService(text,from, to, credentials, mkt){
  console.log("tranlate "+text)
  const client = new cognitiveServices.textTranslator({
      apiKey: config.azureCredentials.translatorText.key,
      endpoint: config.azureCredentials.translatorText.host
  });
  if(!_.isArray(text)){
    text = [text]
  }
  const body = {
      from: from,
      to: to,
      sourceTexts: text,
      contentType: "text/plain"
  }

  return client.translateArray({
      body
  }).then(response => {

    return _.map(response, function(_translation){
      return _translation.TranslatedText
    })

  })

}

function callTextAnalyticsService(text, credentials, type, mkt){
  return new Promise(function(fulfill, reject){
    try{

      let response_handler = function (response) {
          let body = '';
          response.on ('data', function (d) {
              body += d;
          });
          response.on ('end', function () {
              let body_ = JSON.parse (body);
              fulfill(body_)
          });
          response.on ('error', function (e) {
              console.log ('Error: ' + e.message);
              reject(e)
          });
      };


      let body = JSON.stringify ({
        documents:[
          {id: 1, text: text, language: mkt}
        ]
      });


      let request_params = {
          method : 'POST',
          hostname : credentials.host,
          path : credentials.path + '/' + type,
          headers : {
              'Ocp-Apim-Subscription-Key' : credentials.key,
          }
      };

      let req = https.request (request_params, response_handler);
      req.write (body);
      req.end ();


    }catch(err){
      reject(err)
    }
  })
}

function callBingSpellCheckService(text, credentials, mkt){
  console.log('callBingSpellCheckService')
  return new Promise(function(fulfill, reject){
    try{
        let mode = "proof";
        let query_string = "?mkt=" + mkt + "&mode=" + mode;
        console.log('query_string')
        console.log(query_string)
        let request_params = {
            method : 'POST',
            hostname : credentials.host,
            path : credentials.path + query_string,
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Content-Length' : text.length + 5,
                'Ocp-Apim-Subscription-Key' : credentials.key
            }
        };

        let response_handler = function (response) {
            let body = '';
            response.on ('data', function (d) {
                body += d;
            });
            response.on ('end', function () {
                fulfill(JSON.parse(body))
            });
            response.on ('error', function (e) {
                reject(e)
            });
        };

        let req = https.request (request_params, response_handler);
        req.write ("text=" + text);
        req.end ();
    }catch(err){
      reject(err)
    }
  })
}


function approvalLevel(){
  return function(bundle){

    var productDescriptionCountWords = countWords(bundle.product.description)
    var productDecriptionGrammaticalErrors = bundle.validations.description.spellCheck && bundle.validations.description.spellCheck.flaggedTokens? bundle.validations.description.spellCheck.flaggedTokens.length: 0
    var descriptionApprovalLevel = 1 - (productDecriptionGrammaticalErrors / productDescriptionCountWords)
    var imageApprovalLevel = 1
    if(!_.isEmpty(bundle.validations.imagenValidations)){
      var productImageValidation = _.first(bundle.product.imagenValidations)
      var wordsInTheImage = []

      if(!_.isEmpty(bundle.validations.imagenValidations[0].textAnalysis.words)){
        wordsInTheImage = wordsInTheImage.concat(bundle.validations.imagenValidations[0].textAnalysis.words)
      }
      if(!_.isEmpty(bundle.validations.imagenValidations[0].analysis.description.tags)){
        var tags  = _.map(bundle.validations.imagenValidations[0].analysis.description.tags, function(_tag){
          return _tag[0]
        })
        wordsInTheImage = wordsInTheImage.concat(tags)
        console.log(wordsInTheImage)
        imageApprovalLevel = 0
        _.each(wordsInTheImage, function(wordInImage){
          console.log('wordInImage')
          console.log(wordInImage)
          if(bundle.product.description.toLowerCase().includes(wordInImage.toLowerCase())){
            console.log('image contains image word!!!')
            imageApprovalLevel = 1
          }
        })

      }

    }
    console.log('*** wordsInTheImage ***')
    console.log(wordsInTheImage)
    bundle.validations.approvalLevel =((descriptionApprovalLevel + imageApprovalLevel) / 2) * 100
    return bundle
  }
}
function countWords(str) {
  var matches = str.match(/[\w\d]+/gi);
  return matches ? matches.length : 0;
}