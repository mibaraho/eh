/**
 * ProductImage model events
 */

'use strict';

import {EventEmitter} from 'events';
var ProductImage = require('../../sqldb').ProductImage;
var ProductImageEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ProductImageEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  ProductImage.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    ProductImageEvents.emit(event + ':' + doc._id, doc);
    ProductImageEvents.emit(event, doc);
    done(null);
  }
}

export default ProductImageEvents;
