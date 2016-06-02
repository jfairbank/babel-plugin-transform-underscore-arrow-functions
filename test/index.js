import test from 'ava';

const babel = require('babel-core');
const options = { plugins: ['../lib'] };

function testTransform(description, source, expected) {
  test(description, t => {
    const actual = babel.transform(source, options).code;
    t.is(actual.trim(), expected.trim());
  });
}

testTransform(
  'transforms a simple arrow expression with body expression',
  '_ => 42',
  '() => 42;'
);

testTransform(
  'transforms a simple arrow expression with body block',

`_ => {
  console.log('hello');
  return 42;
}`,

`() => {
  console.log('hello');
  return 42;
};
`);

testTransform(
  'transforms top and nested arrow expressions',
  '_ => _ => console.log(42)',
  '() => () => console.log(42);'
);

testTransform(
  'does not transform when _ is used shallowly',
  '_ => _ * 2',
  '_ => _ * 2;'
);

testTransform(
  'does not transform when _ is deeply',
  '_ => a => console.log(_, a)',
  '_ => a => console.log(_, a);'
);

testTransform(
  'transforms if deeply used _ shadows top level _',
  '_ => (a, _) => console.log(_)',
  '() => (a, _) => console.log(_);'
);

testTransform(
  'transforms top level if shadowed',
  '_ => _ => console.log(_)',
  '() => _ => console.log(_);'
);

testTransform(
  'transforms inner arrow expression if shadowed _ is not used',

`_ => {
  console.log(_);
  _ => 42;
}`,

`_ => {
  console.log(_);
  () => 42;
};`);
