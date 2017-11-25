/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/validation-policy-intervals              ->  index
 * POST    /api/validation-policy-intervals              ->  create
 * GET     /api/validation-policy-intervals/:id          ->  show
 * PUT     /api/validation-policy-intervals/:id          ->  update
 * DELETE  /api/validation-policy-intervals/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
import {ValidationPolicyInterval} from '../../sqldb';

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

// Gets a list of ValidationPolicyIntervals
export function index(req, res) {
  ValidationPolicyInterval.findAll({
          order:[
        ['position']
      ]
  })
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single ValidationPolicyInterval from the DB
export function show(req, res) {
  ValidationPolicyInterval.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Creates a new ValidationPolicyInterval in the DB
export function create(req, res) {
  ValidationPolicyInterval.create(req.body)
    .then(respondWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing ValidationPolicyInterval in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  ValidationPolicyInterval.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Deletes a ValidationPolicyInterval from the DB
export function destroy(req, res) {
  ValidationPolicyInterval.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
