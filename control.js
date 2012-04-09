
var fullText = "blahblahS01E05blahblah";
//var fullText = "blahblah1x05blahblah";
//var fullText = "blahblah105blahblah";

function a(fullText) {
  var num1 = null;
  var num2 = null;
  (function() {
    function testAndAssignMatch(m) {
      if (matches != null) {
        num1 = parseInt(m[1]);
        num2 = parseInt(m[2]);
        return true;
      }
      return false;
    }
    var matches = /[Ss](\d?\d)[Ee](\d?\d)/.exec(fullText);
    if (testAndAssignMatch(matches)) return;
    matches = /([01]?[0-9])[xX]([0-9]?[0-9])/.exec(fullText)
    if (testAndAssignMatch(matches)) return;
    matches = /(\d)\.?(\d?\d)/.exec(fullText)
    if (testAndAssignMatch(matches)) return;
  })();
}


function b(fullText) {
  var num1 = null;
  var num2 = null;
  var matches = null;
  if (matches = /[Ss](\d?\d)[Ee](\d?\d)/.exec(fullText)) {
    num1 = parseInt(matches[1]);
    num2 = parseInt(matches[2]);
  } else if (matches = /([01]?[0-9])[xX]([0-9]?[0-9])/.exec(fullText)) {
    num1 = parseInt(matches[1]);
    num2 = parseInt(matches[2]);
  } else if (matches = /(\d)\.?(\d?\d)/.exec(fullText)) {
    num1 = parseInt(matches[1]);
    num2 = parseInt(matches[2]);
  }
}

function reSwitch() {
  var str = arguments[0];
  var matches;
  var i = 1;
  while (i < arguments.length - 1) {
    matches = arguments[i].exec(str);
    var fun = arguments[++i];
    if (matches) {
      // Keep going until we find a function instead of a RegExp
      while (fun.exec !== undefined && i < arguments.length) {
        fun = arguments[++i];
      }
      fun(matches);
      break;
    } else {
      // Keep going until we find a RegExp
      while (arguments[i].exec === undefined && i < arguments.length) {
        i++;
      }
    }
  }
}

function c(fullText) {
  var num1 = null;
  var num2 = null;
  reSwitch(fullText
    , /[Ss](\d?\d)[Ee](\d?\d)/
    , /([01]?[0-9])[xX]([0-9]?[0-9])/
    , function(matches) {
        num1 = parseInt(matches[1]);
        num2 = parseInt(matches[2]);
      }
    , /([01]?[0-9])[xX]([0-9]?[0-9])/
    , function(matches) {
        num1 = parseInt(matches[1]);
        num2 = parseInt(matches[2]);
      }
    , /(\d)\.?(\d?\d)/
    , function(matches) {
        num1 = parseInt(matches[1]);
        num2 = parseInt(matches[2]);
    }
    );
}

function base() {
  return;
}

function a10() {
  a(fullText); a(fullText); a(fullText); a(fullText); a(fullText);
  a(fullText); a(fullText); a(fullText); a(fullText); a(fullText);
}
function b10() {
  b(fullText); b(fullText); b(fullText); b(fullText); b(fullText);
  b(fullText); b(fullText); b(fullText); b(fullText); b(fullText);
}
function c10() {
  c(fullText); c(fullText); c(fullText); c(fullText); c(fullText);
  c(fullText); c(fullText); c(fullText); c(fullText); c(fullText);
}
function base10() {
  base(); base(); base(); base(); base();
  base(); base(); base(); base(); base();
}

function makeRecord(desc, count, start, finish) {
  return {desc: desc, count: count, start: start, finish: finish};
}

(function main() {
  console.log('hello');
  var i;
  var start;
  var finish;
  var results = {};
  var count = 10000;
  // base
  start = Date.now();
  for (i = 0; i < count; i++) { base10(); }
  finish = Date.now();
  results['base'] = makeRecord('empty function call', 10*count, start, finish);

  // a
  start = Date.now();
  for (i = 0; i < count; i++) { a10(); }
  finish = Date.now();
  results['a'] = makeRecord('inline function', 10*count, start, finish);

  // b
  start = Date.now();
  for (i = 0; i < count; i++) { b10(); }
  finish = Date.now();
  results['b'] = makeRecord('assignment inside if', 10*count, start, finish);

  // c
  start = Date.now();
  for (i = 0; i < count; i++) { c10(); }
  finish = Date.now();
  results['c'] = makeRecord('RegExp switch meta function', 10*count, start, finish);

  for (test in results) {
    result = results[test];
    console.log('Test: ' + test);
    console.log('   ' + result.desc);
    console.log('   ' + (result.finish - result.start)/result.count + ' ms');
  }
})();
