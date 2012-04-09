var Benchmark = require('benchmark');

//var fullText = "blahblahS01E05blahblah";
//var fullText = "blahblah1x05blahblah";
var fullText = "blahblah105blahblah";

function a(fullText) {
  var num1 = null;
  var num2 = null;
  (function() {
    function testAndAssignMatch(m) {
      if (m != null) {
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

(function main() {
  var suite = new Benchmark.Suite;

  suite.add('empty function call', function() {
    base();
  })
  .add('scoping function + nested function', function() {
    a(fullText);
  })
  .add('assignment inside if', function() {
    b(fullText);
  })
  .add('RegExp switch meta function', function() {
    c(fullText);
  })
  .add('simple RegExp exec', function() {
    /simple/.exec('simple');
  })
  .on('cycle', function(event, bench) {
    console.log(String(bench));
  })
  .run({'async': true})
})();
