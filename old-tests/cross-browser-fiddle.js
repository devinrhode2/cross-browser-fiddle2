var test = require('tape');
var JSON = require('json3');
var _ = require('underscore');

var hb = require('hb');

test('basic methods', function(t) {
  t.equal(typeof hb.designMode(), 'boolean', 'designMode should return boolean');
});

test('inspect selection object', function(t) {
  console.log(hb.getSelection());
  if (document.defaultView.getSelection()) {
    console.log('defaulView');
  }
  if (window.getSelection()) {
    console.log('window.getSel');
  }
  if (document.getSelection()) {
    console.log('doc.getSel');
  }

  if (document.selection) {
    console.log('document.selection');
    if (document.selection.createRange) {
      console.log('sel.createRange');
      console.log('text', document.selection.createRange().text);
    } else {
      console.log('no createRange. .text:', document.selection.text);
    }
  } else {
    console.log('no doc.sel');
  }

});

test('method support:', function (t) {
  var methods = [
      'addRange'
    , 'collapse'
    , 'collapseToEnd'
    , 'collapseToStart'
    , 'constructor'
    , 'containsNode'
    , 'deleteFromDocument'
    , 'empty'
    , 'extend'
    , 'getRangeAt'
    , 'modify'
    , 'removeAllRanges'
    , 'selectAllChildren'
    , 'setBaseAndExtent'
    , 'setPosition'
  ];
  _.each(methods, function forEachMethod(method) {
    if (Selection.prototype[method]) {
      console.log('++' + method);
    } else {
      console.log('--'  + method);
    }
  });
  t.end();
});

/**
IE8:
empty
IE9:
addRange
collapse
collapseToEnd
collapseToStart
deleteFromDocument
getRangeAt
removeAllRanges
selectAllChildren
*/