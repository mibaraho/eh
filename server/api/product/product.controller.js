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
    console.log(err)
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
    return bundle
  }
}
function updateProductWithRemoteResponse(req, res) {
  return function(bundle){
    bundle.response = {id: 1}
    var _update = {
      validationStatus: 'accepted',
      content: JSON.stringify(bundle.response)
    }
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
