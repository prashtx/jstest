var Benchmark = require('benchmark');

function string_plus() {
  var a = 'http://server:port';
  var b = 'nouns';
  var c = 'id';
  var d = 'morenouns';
  var path = a + '/' + b + '/' + c + '/' + d;
}

function string_join() {
  var a = 'http://server:port';
  var b = 'nouns';
  var c = 'id';
  var d = 'morenouns';
  var path = [a, b, c, d].join('/');
}

function string_concat() {
  var a = 'http://server:port';
  var b = 'nouns';
  var c = 'id';
  var d = 'morenouns';
  var path = a.concat('/', b, '/', c, '/', d);
}

function replacer() {
  var count = 0;
  var arr = arguments;
  return function() {
    return arr[count++];
  }
}
  //return arr[0].replace(/%(?!%)s/g, function() {return arr[++count];})
function stringsub() {
  var count = 0;
  var arr = arguments;
  return arr[0].replace(/%(s|%)/g, function(msub) {
    if (msub[1] == 's')
      return arr[++count];
    else
      return '%';
  });
}
  //var a = '%s/%s/%s/%s'.replace(/([^%]?)?%s/g, replacer('http://server:port', 'nouns', 'id', 'morenouns'));
  //var a = '%s/%s/%s/%s'.replace(/%(?!%)s/g, replacer('http://server:port', 'nouns', 'id', 'morenouns'));
function string_replace() {
  var a = stringsub('%s/%s/%s/%s', 'http://server:port', 'nouns', 'id', 'morenouns');
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
  .add('Concatenate with plus', function() {
    string_plus();
  })
  .add('Regex string replace', function() {
    string_concat();
  })
  .add('Concatenate with join', function() {
    string_join();
  })
  .add('Concatenate with concat', function() {
    string_concat();
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
