//super optimized. ya heard me
var test = require('tape');

//some tests to verify the stranger parts work as expected
test('basicness', function elnamo(t) {

  (function windowLogWrapper() {
    var consoleLogDefined = (
      typeof console === 'object' &&
      typeof console.log === 'function' &&
      console.log.name === 'log' //if you noop the function, then the function name isn't 'log' and window.log won't call it
    );
    window.log = function logFn() {
      'dont use strict'; // because of logFn.caller access below
      log.history.push(arguments);
      log.history[log.history.length - 1][arguments.length] = 'caller:' + logFn.caller.name || logFn.caller;
      if (consoleLogDefined) {
        console.log.apply(console, [].slice.call(arguments, 0));
      }
    };
    log.history = log.history || [];
  }());

  log('things');
  t.equal(log.history, [['things', 'caller:elnamo']]);
});

test('consistent console.log.name', function(t) {
  if (typeof console === 'object' && typeof console.log === 'function') {
    t.equal(console.log.name, 'log');
  } else {
    t.equal('no console log', 'no console log');
  }
});

test('arguments mutation when pushed onto other array, and then having more stuff pushed onto IT', function(t){
  var arr = [];
  (function testingArguments() {
    var length = arguments.length;
    arr.push(arguments);
    arr[arr.length - 1][arguments.length] = 'more shit like function names';
    t.deepEqual(['a'], [].slice.call(arguments, 0), 'arguments should not change');
  }('a'));
});