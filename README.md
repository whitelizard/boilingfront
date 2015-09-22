Boiling front-end
=================

A changing reference, collection of knowledge and notes, and boilerplate, for front-end development.

Table of Contents
-----------------

  1. [AngularJS 1.x + Typescript](#angularjs-1x--typescript)
  1. [JavaScript Knowledge Collection](#javascript-knowledge-collection)
  1. [Frameworks etc](#frameworks-etc)

AngularJS 1.x + Typescript
--------------------------

Personal and evolving style guide until widely adopted such appears, or Angular 2.0 is released.
### Module template
```typescript
///<reference path="../../typings/tsd.d.ts"/>

var angular:ng.IAngularStatic = require('angular');

module app {
    'use strict';
    
    angular.module('app', [require('angular-material'), require('angular-route')]);
    
    angular
        .module('app')
        .config(config)
    ;
    
    config.$inject = ['$routeProvider'];
    
    function config($routeProvider) {
    	//...
    }
}
```
### Service template
```typescript
///<reference path="../../typings/tsd.d.ts"/>

module services {
    'use strict';
    
    interface IItemService {
        getItems():IItem[];
        addItem(newItem:IItem):void;
    }
    
    export interface IItem {
        name: string;
        available: boolean;
    }

    /////////////////////////
    
    class ItemService implements IItemService {
        
        //------ SETUP ------//
    
        static $inject = ['$log'];
        static $log;
        
        constructor(public $log) {
            ItemService.$log = $log;
        }
        
        //------ MEMBERS ------//
        
        private items:IItem[] = [];
        
        //------ METHODS ------//
        
        getItems():IItem[] {
            return this.items;
        }
        
        addItem(newItem:IItem):void {
            this.items.push(newItem);
            this.$log.debug('Item added');
        }
        
    }
    
    /////////////////////////
    
    angular
        .module('services')
        .factory('itemService', factory)
    ;
    
    factory.$inject = ['$log'];
    
    function factory($log) {
        return new ItemService($log);
    }
}
```
- Making dependencies explicitly static exposes them to other possible classes used in the same file, as `ItemService.$log(...)`, instead of having to deal with external dependencies as arguments to every other class used in the file.

### Controller template
```typescript
///<reference path="../../typings/tsd.d.ts"/>

module app {
    'use strict';
    
    interface IItemController {
    
        items: IItem[];
        newItem: IItem;
        
        addItem():void;
        renameItem(name:string):void;
    }
    
    /////////////////////////
    
    class ItemController implements IItemController {
        
        //------ SETUP ------//
        
        static $inject = ['$log', 'itemService'];
        
        constructor(public $log, public itemService) {
            this.items = this.itemService.getItems();
        }
        
        //------ MEMBERS ------//
        
        items: IItem[];
        newItem: IItem;
        
        //------ METHODS ------//
        
        addItem():void {
            this.itemService.addItem(this.newItem);
            this.$log.debug('Item added');
        }
		
        renameItem(name:string):void {
           this.itemService.renameItem(name);
        }
        
    }
    
    /////////////////////////
    
    angular
        .module('app')
        .controller('app.ItemController', ItemController)
    ;
}
```

JavaScript Knowledge Collection
-------------------------------

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
'; // backslash is ok because your editor should spot eventual spaces
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
- (Angular has its own version of `forEach`)

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

Frameworks etc.
---------------

Thoughts and resources on interesting framework and lib combinations.

### Dev framework: `node.js`, `gulp`, `typescript`, `scss`
Install `node.js` for your platfom. Create `package.json` file with:
```
npm init
```
Add dependencies, and install them with:
```
npm install
```
Create tasks in `gulpfile.js` and run them:
```
gulp X
```
Ex of tasks would be `build`, run local `server` and `watch` that automatically compiles typescript, scss etc. when files are changed.

- See above section for templates of using typescript with angular 1.x

### Extended dev framework. Above plus: `browserify`, `tsd`

- Browserify: Lets you require('modules') in the browser by bundling up all of your dependencies.
- TSD: A package manager to search and install TypeScript definition files directly from the community driven DefinitelyTyped repository.

### App framework: `angularjs`, `bootstrap`, `angular-ui`

- AngularJS: Gives data binding, modules, markup abstractions.
- (Twitter) Bootstrap: CSS abstractions handling everything from media queries & grids to buttons & colors.
- Angular-UI: Bundle of directives for bootstrap components using angularjs instead of jQuery.

### App framework: `angularjs`, `angular-material`, `materialdesignicons`

- Google material design concept framework in angular

#### Resources

- Important angular style guide: [johnpapa](https://github.com/johnpapa/angular-styleguide)
- Deep dive into Angular 2: [dive](https://www.opencredo.com/2015/07/08/a-deep-dive-into-angular-2-0/)

### Situational Packages

- `font-awesome`
- `d3`
- `nvd3`
- `leaflet`
- `messageformat`

