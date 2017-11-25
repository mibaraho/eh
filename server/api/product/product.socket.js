/**
 * Broadcast updates to client when the model changes
 */

'use strict';
import _ from 'lodash';
var ProductEvents = require('./product.events');

// Model events to emit
var events = ['save', 'remove'];

export function register(socket) {
  // Bind model events to socket events
  for (var i = 0, eventsLength = events.length; i < eventsLength; i++) {
    var event = events[i];
    var listener = createListener('product:' + event, socket);

    ProductEvents.on(event, listener);
    socket.on('disconnect', removeListener(event, listener));
  }
}


function createListener(event, socket) {
  return function(doc) {
    doc = doc.get()
    doc.content =  !_.isEmpty(doc.content) || !_.isString(doc.content) ? doc.content : JSON.parse(doc.content)
    
    socket.emit(event, doc);
  };
}

function removeListener(event, listener) {
  return function() {
    ProductEvents.removeListener(event, listener);
  };
}
