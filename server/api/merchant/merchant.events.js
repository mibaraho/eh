/**
 * Merchant model events
 */

'use strict';

import {EventEmitter} from 'events';
var Merchant = require('../../sqldb').Merchant;
var MerchantEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
MerchantEvents.setMaxListeners(0);

// Model events
var events = {
  'afterCreate': 'save',
  'afterUpdate': 'save',
  'afterDestroy': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Merchant.hook(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc, options, done) {
    MerchantEvents.emit(event + ':' + doc._id, doc);
    MerchantEvents.emit(event, doc);
    done(null);
  }
}

export default MerchantEvents;
