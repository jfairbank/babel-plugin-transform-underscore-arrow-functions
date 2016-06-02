## babel-plugin-transform-underscore-arrow-functions

Transform arrow functions with an underscore param into param-less functions.

```js
_ => 42    ---->    () => 42
```

Some developers prefer the style of writing terse arrow functions that use no
parameters with a single underscore parameter. One small downside is that you
still create a function that takes one argument. It's debatable whether there is
any performance benefit of wasting that one parameter or not. Some crude
benchmarks I've run in Node indicate that there is no appreciable run time
difference between the same function that takes one or no arguments for multiple
benchmark runs. Regardless, if you'd still like to treat an arrow function with
a underscore param as a function without parameters, then this plugin is for
you!

## Install

    $ npm install --save-dev babel-plugin-transform-underscore-arrow-functions

## Usage

Add to your `.babelrc`:

```json
{
  "plugins": ["transform-underscore-arrow-functions"]
}
```

## Example Transformations

### Underscore unused

```js
// Body expression
_ => 42;                      ---->    () => 42;


// Body block
_ => {                                 () => {
  console.log('hello');       ---->      console.log('hello');
  return 42;                             return 42;
};                                     };


// Both arrow functions are transformed
_ => _ => console.log(42);    ---->    () => () => console.log(42);

```

### Underscore used

This plugin avoids transforming the function if you use the underscore as a real
parameter.

```js
// Used shallowly.
_ => _ * 2;                       ---->    _ => _ * 2;


// Used deeply.
_ => a => console.log(_, a);      ---->    _ => a => console.log(_, a);


// Inner underscore is used.
// Shadowed outer underscore removed.
_ => (a, _) => console.log(_);    ---->    () => (a, _) => console.log(_)


// Inner underscore is used again.
_ => _ => console.log(_);         ---->    () => _ => console.log(_);


// Outer underscore is used.
// Inner underscore is unused.
_ => {                                     _ => {
  console.log(_);                 ---->      console.log(_);
  _ => 42;                                   () => 42;
};                                         };
```
