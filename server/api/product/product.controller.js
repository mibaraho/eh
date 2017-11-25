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
    res.status(statusCode).send(err);
  };
}

// Gets a list of Products
export function index(req, res) {
  Product.findAll()
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
  Product.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
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
      spellingNameValidation(bundle.product),
      spellingDescriptionValidation(bundle.product)
    ]

    return Promise.all(promises)
    .then(function(azureProductValidationResults){
      bundle.validations = _.concat(bundle.validations, azureProductValidationResults)
      return bundle
    })
  }
}

function spellingNameValidation(product){
  return Promise.resolve()
}
function spellingDescriptionValidation(product){
return callBingSpellCheckService(product.description)
}

function prepareValidationResponse(){
  return function(bundle){
    return bundle.validations
  }
}


function callBingSpellCheckService(text){
  var mkt = "es";
  var mode = "proof";
  var query_string = "mkt=" + mkt + "&mode=" + mode;
    var options = {
        method: 'POST',
        uri: config.azureCredentias.host,
        qs: {
            mkt: mkt,
            mode: mode
        },
        body: text,
        json: true // Automatically parses the JSON string in the response
    };
  
  return rp(options)
  .then(function(result){
    return result
  })
}