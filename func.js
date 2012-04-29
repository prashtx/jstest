var Benchmark = require('benchmark');

function Obj() {
  this.fun_a = f;
  this.fun_b = function() { f(); };
}

Obj.prototype.fun_c = f;
Obj.prototype.fun_d = function() {f();};

var obj1 = new Obj();
obj1.fun_e = f;

function f() {
  return true;
}

function func_call() {
  f();
}

function func_apply() {
  f.apply(null);
}

function func_anonwrapper() {
  (function() {
    f();
  })();
}

function base() {
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
  .add('Regular function call', function() {
    func_call();
  })
  .add('Function.apply', function() {
    func_apply();
  })
  .add('Anonymous wrapper', function() {
    func_apply();
  })
  .add('Object priveledged function', function() {
    obj1.fun_a();
  })
  .add('Called from object priveledged function', function() {
    obj1.fun_b();
  })
  .add('Prototype function', function() {
    obj1.fun_c();
  })
  .add('Called from prototype function', function() {
    obj1.fun_d();
  })
  .add('Added to object', function() {
    obj1.fun_e();
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
