/**
 * Product model events
 */

'use strict';

import {EventEmitter} from 'events';
var Product = require('../../sqldb').Product;
var ProductEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Product.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductEvents.emit(event + ':' + doc._id, doc);
    ProductEvents.emit(event, doc);
    done(null);
  }
}

export default ProductEvents;
