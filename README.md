# Front-end Manifest

Just my personal collection to build on, regarding front-end frameworks, programming style, ideoms etc etc.

## Table of Contents

  1. [Framework Combinations and Boilerplates](#framework-combinations-and-boilerplates)
  1. [Situational GUI Packages](#situational-gui-packages)
  1. [JavaScript Knowledge Collection](#javascript-knowledge-collection)

## Framework Combinations and Boilerplates

Thoughts and resources on interesting entire framework and tool combinations for a project.

### Dev framework: `node.js`, `gulp`, `typescript`, `less/sass`
```
// install node.js for your platfom
npm install  // reads the projects package.json and installs all components
gulp X  // run your build, server, watch tasks that automatically compiles typescript, less/sass etc
```

### App framework: `angularjs`, `bootstrap`, `angular-ui`

AngularJS: Gives data binding, modules, markup abstractions.
(Twitter) Bootstrap: CSS abstractions handling everything from media queries & grids to buttons & colors.
Angular-UI: Bundle of directives for bootstrap components using angularjs instead of jQuery.

## Situational GUI Packages

- `font-awesome`
- `d3`
- `leaflet`

## JavaScript Knowledge Collection

Collected knowledge, good practices and ideoms in the actual programming language of the web, building on top of the other in a somewhat cronological order.

### Basic language research notes

#### Ideoms and Note particles
```javascript
function foo() {} // is equal to:
var foo = function () {};
```
```javascript
'foo' + 'bar' // faster for few arguments (substrings)
['foo', 'bar'].join('') // faster for many arguments
```
```javascript
var value = p && p.name; // guard
value = v || 10; // default
```
```javascript
NaN === NaN; // => false!
NaN !== NaN; // => true!
```
```javascript
myList[myList.length] = 'world'; // is equal to:
myList.push('world');
```
- There is only function scope, no block scope, therefore:
  - Declare all variables at the top of the function
  - Declare all functions before you call them
  `In ES6 there is block scope!`

- Private and privileged members can only be made when an object is constructed. Public members can be added at any time.

- Too many arguments to a function is not an error, and they can be accessed through the `arguments` variable.

- The with statement should not be used.

- Vars which are not explicitly initialized are given the value `undefined`

- Use the `===` and `!==` operators. The `==` and `!=` operators do type coercion and should not be used.

- The `===` operator used with objects compares object references, not values

- Do not use `for in` with arrays (Actually, dont use `for in` at all, see below)

- `Array.sort()` will sort values as strings!

- Don’t use `_` in the beginning of identifiers.

- Use CAPS for global variables (Not widely accepted).

- Always use JSLint

- Reserved words
  ```javascript
  abstract
  boolean break byte
  case catch char class const continue
  debugger default delete do double
  else enum export extends
  false final finally float for function
  goto
  if implements import in instanceof int interface
  long
  native new null
  package private protected public
  return
  short static super switch synchronized
  this throw throws transient true try typeof
  var volatile void
  while with
  ```

#### IIFE
Imediately Invoked Function Expression
```javascript
(function() {
    'use strict';
    /* ... */
})();
```

#### Object `later` function
```javascript
if (typeof Object.prototype.later !== 'function') {
    Object.prototype.later = function(msec, method) {
        var args = arguments.slice(2);
        method = this[method];
        setTimeout(method.bind(this, args), msec);
        return this;
    };
}
```

#### String `trim` function
```javascript
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s*(\S*(\s+\S+)*)\s*$/, '$1');
    };
}
```

#### String `supplant` function
```javascript
if (typeof String.prototype.supplant !== 'function') {
    String.prototype.supplant = function (o) {
        return this.replace(/{([^{}]*)}/g, function (a, b) {
            var r = o[b];
            return typeof r === 'string' ? r : a;
        });
    };
}
```
```javascript
var html = '\
    <div class="{className}">\
       <span class="foo">{name}</span>\
    </div>\
’; // backslash is ok because your editor should spot eventual spaces
var data = {
    className: 'bar',
    name: 'Test'
};
divEl.innerHTML = html.supplant(data);
```

#### `isArray` function
(Use your framworks version, for instance `angular.isArray`)
```javascript
if (typeof Array.isArray !== 'function') {
    Array.isArray = function (value) {
        return Array.prototype.toString.apply(value) === '[object Array]';
    }
}
```

#### Type conversions
```javascript
num = +str; // convert string to number
str = ''+num; // num to string
isOk = !!count; // convert to boolean
num = parseInt('08', 10); // always specify base 10
```

### Douglas Crockford: The Better Parts - JSConfUY 2014
[Youtube video](https://www.youtube.com/watch?v=bo36MrBfTk4)

#### Don't use `for`, `for in`, `while` (ES5)
Use `forEach` on arrays. And for looping on objects: use `Object.keys`
```javascript
Object.keys(anObject).forEach(function (key) {
    console.log(anObject[key]);
});
```

#### ES6 recursion
In ES6 we can use recursion instead of loops (without memory penalties)
```javascript
function repeat(func) {
    if (func() !== undefined) {
        return repeat(func);
    }
}
```

#### Constructor pattern
```javascript
function constructor(spec) {
    var that = otherConstructor(spec),
        member,
        method = function () {
            // spec, member, method
        };
    that.method = method;
    return that;
}
```
- Thought: Better object pattern?
```javascript
function constructor(spec) {
    var that = otherConstructor(spec);
    //----- PRIVATE MEMBERS ----
    var member;
    //----- PUBLIC INTERFACE ----
    that.method = method;
    //----- IMPLEMENTATION ----
    function method() {
        // spec, member, method
    }
    return that;
}
```


