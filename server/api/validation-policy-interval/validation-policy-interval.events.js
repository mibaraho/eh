/**
 * ValidationPolicyInterval model events
 */

'use strict';

import {EventEmitter} from 'events';
var ValidationPolicyInterval = require('../../sqldb').ValidationPolicyInterval;
var ValidationPolicyIntervalEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ValidationPolicyIntervalEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ValidationPolicyInterval.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ValidationPolicyIntervalEvents.emit(event + ':' + doc._id, doc);
    ValidationPolicyIntervalEvents.emit(event, doc);
    done(null);
  }
}

export default ValidationPolicyIntervalEvents;
