(function(window, doc) {
  'use strict';

  var bound = [];
  var sock = io.connect('http://localhost');
  var submitButton = doc.getElementById('submit-button');
  var inputField = doc.getElementById('name-input');
  var elementList = doc.querySelectorAll('my-element');;
  var i, length = elementList.length;
  var addBoundElement = function(element, propertyName) {
    bound.push({
      el: element,
      prop: propertyName
    });
  };
  var removeBoundElement = function(element, propertyName) {
    var index = bound.length;
    var boundElement;
    while(--index > -1) {
      boundElement = bound[index];
      if(boundElement.el === element &&
          boundElement.prop === propertyName) {
        bound.splice(index, 1);
        return true;
      }
    }
    return false;
  };

  // Assign custom event handlers for bind/unbind from polymer elements.
  for(i = 0; i < length; i++) {
    elementList[i].addEventListener('bind', function(event) {
      addBoundElement(event.target, event.detail.prop);
    });
    elementList[i].addEventListener('unbind', function(event) {
      removeBoundElement(event.target, event.detail.prop);
    });
  }
  // Listen for notification from socket.
  sock.on('notification', function (data) {
    var key;
    var listing;
    // Filter out bound elements by matching propertyName and assign value.
    for(key in data) {
      bound.filter(function(entry) {
        return entry.prop === key;
      }).forEach(function(entry) {
        entry.el[entry.prop] = data[key];
      });
    }
  });

  submitButton.addEventListener('click', function() {
    sock.emit('setName', {value: inputField.value});
  });

  doc.onkeypress = function(event) {
    if(event.keyCode === 13) {
      event.preventDefault();
      return false;
    }
  };
}(this, document));