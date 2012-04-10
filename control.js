var Benchmark = require('benchmark');

//var fullText = "blahblahS01E05blahblah";
//var fullText = "blahblah1x05blahblah";
var fullText = "blahblah105blahblah";

function funa1(x) {}
function funa2(x) {}
function funb1(x) {}
function funb2(x) {}
function func1(x) {}
function func2(x) {}

function test_scope_anon(fullText) {
  var num1 = null;
  var num2 = null;
  (function() {
    function testAndAssignMatch(m) {
      if (m != null) {
        num1 = funa1(m[1]);
        num2 = funa1(m[2]);
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


function test_if_assign(fullText) {
  var num1 = null;
  var num2 = null;
  var matches = null;
  if (matches = /[Ss](\d?\d)[Ee](\d?\d)/.exec(fullText)) {
    num1 = funa1(matches[1]);
    num2 = funa2(matches[2]);
  } else if (matches = /([01]?[0-9])[xX]([0-9]?[0-9])/.exec(fullText)) {
    num1 = funb1(matches[1]);
    num2 = funb2(matches[2]);
  } else if (matches = /(\d)\.?(\d?\d)/.exec(fullText)) {
    num1 = func1(matches[1]);
    num2 = func2(matches[2]);
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

function test_reSwitch(fullText) {
  var num1 = null;
  var num2 = null;
  reSwitch(fullText
    , /[Ss](\d?\d)[Ee](\d?\d)/
    , function(matches) {
        num1 = funa1(matches[1]);
        num2 = funa2(matches[2]);
      }
    , /([01]?[0-9])[xX]([0-9]?[0-9])/
    , function(matches) {
        num1 = funb1(matches[1]);
        num2 = funb2(matches[2]);
      }
    , /(\d)\.?(\d?\d)/
    , function(matches) {
        num1 = funa1(matches[1]);
        num2 = func2(matches[2]);
      }
  );
}

function test_reSwitch_multi(fullText) {
  var num1 = null;
  var num2 = null;
  reSwitch(fullText
    , /[Ss](\d?\d)[Ee](\d?\d)/
    , /([01]?[0-9])[xX]([0-9]?[0-9])/
    , function(matches) {
        num1 = funa1(matches[1]);
        num2 = funa2(matches[2]);
      }
    , /(\d)\.?(\d?\d)/
    , function(matches) {
        num1 = funa1(matches[1]);
        num2 = func2(matches[2]);
      }
  );
}

function base() {
}

function justParse() {
  var num1 = parseInt('1');
  var num2 = parseInt('05');
}

(function main() {
  var suite = new Benchmark.Suite;
  var basename = 'empty function call';
  var baseperiod = -1;

  suite.add(basename, function() {
    base();
  })
  .add('inline anonymous function call', function() {
    (function() {return;})();
  })
  .add('scoping function + nested function', function() {
    test_scope_anon(fullText);
  })
  .add('assignment inside if', function() {
    test_if_assign(fullText);
  })
  .add('RegExp switch meta function', function() {
    test_reSwitch(fullText);
  })
  .add('RegExp switch meta function multi', function() {
    test_reSwitch_multi(fullText);
  })
  .add('just parse ints', function() {
    justParse();
  })
  .add('simple RegExp exec', function() {
    /simple/.exec('simple');
  })
  .on('cycle', function(event, bench) {
    if (bench.name === basename) {
      baseperiod = bench.times.period;
      console.log('Unit is: ' + basename);
    }
    console.log(bench.name);
    console.log('Number of time units:');
    console.log(bench.times.period / baseperiod);
    console.log();
  })
  .run({'async': true})
})();
