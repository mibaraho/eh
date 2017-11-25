/**
 * ProductMessage model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductMessage = require('../../sqldb').ProductMessage;
var ProductMessageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductMessageEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ProductMessage.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductMessageEvents.emit(event + ':' + doc._id, doc);
    ProductMessageEvents.emit(event, doc);
    done(null);
  }
}

export default ProductMessageEvents;
