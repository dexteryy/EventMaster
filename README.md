<!---
layout: intro
title: EventMaster
-->

# EventMaster

> * A simple, compact and consistent implementation of a variant of CommonJS's *Promises* and *Events*
> * Provide both *Promise/Deferred/Flow* pattern and *Event/Notify/Observer/PubSub* pattern

## AMD and OzJS

* EventMaster can either be viewed as an independent library, or as a part of [OzJS mirco-framework](http://ozjs.org/#framework).
* It's wrapped as an [AMD (Asynchronous Module Definition)](https://github.com/amdjs/amdjs-api/wiki/AMD) module. You should use it with [oz.js](http://ozjs.org/#start) (or require.js or [similar](http://wiki.commonjs.org/wiki/Implementations) for handling dependencies). 
* If you want to make it available for both other AMD code and traditional code based on global namespace. OzJS provides [a mini define/require implementation](http://ozjs.org/examples/adapter/) to transform AMD module into traditional [module pattern](http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth).
* See [http://ozjs.org](http://ozjs.org) for details.

## Dependencies

* [mo/lang/es5](https://github.com/dexteryy/mo/es5)
* [mo/lang/mix](https://github.com/dexteryy/mo/mix)
* [mo/lang/struct](https://github.com/dexteryy/mo/struct)

## Examples

* [demo](http://ozjs.org/EventMaster/examples/)

## Get the code

* [View/download on Github](https://github.com/dexteryy/EventMaster/blob/master/eventmaster.js)
* Add/update to your project as new dependency:
    * via [istatic](https://github.com/mockee/istatic.git)
    * via [volo](https://github.com/volojs/volo)

## API and usage

```javascript 
var Event = require('eventmaster');
```

* `Event(opt)` -- 
* `Event.Promise(opt)` -- 
* `Event.Event(opt)` -- 
* `Event.when(promise, promise, ...)` -- 
* `Event.pipe(prev, next)` -- 

```javascript 
var event = Event();
```

* `event.promise(subject)` -- 
* `event.when(subject, subject, ...)` -- 
* `event.once(subject, callback, errorCallback)` -- 
* `event.done(subject, callback)` -- 
* `event.fail(subject, callback)` -- 
* `event.cancel(subject, callback, errorCallback)` -- 
* `event.bind(subject, callback)` -- 
* `event.unbind(subject, callback)` -- 
* `event.on()` -- alias for `event.bind`
* `event.off()` -- alias for `event.unbind`
* `event.progress(subject, callback)` -- 
* `event.notify(subject, [arg, arg, ...])` -- 
* `event.fire(subject, [arg, arg, ...])` -- 
* `event.error(subject, [arg, arg, ...])` -- 
* `event.resolve(subject, [arg, arg, ...])` -- 
* `event.reject(subject, [arg, arg, ...])` -- 
* `event.reset(subject)` -- 
* `event.disable(subject)` -- 
* `event.enable(subject)` -- 

```javascript 
var promise = Event.Promise();
```

* `promise.then(callback, errorCallback)` -- 
* `promise.done(callback)` -- 
* `promise.fail(callback)` -- 
* `promise.cancel(callback, errorCallback)` -- 
* `promise.bind(callback)` -- 
* `promise.unbind(callback)` -- 
* `promise.progress()` -- 
* `promise.notify()` -- 
* `promise.fire([arg, arg, ...])` -- 
* `promise.error([arg, arg, ...])` -- 
* `promise.resolve([arg, arg, ...])` -- 
* `promise.reject([arg, arg, ...])` -- 
* `promise.reset()` -- 
* `promise.disable()` -- 
* `promise.enable()` -- 
* `promise.merge()` -- 
* `promise.follow()` -- 
* `promise.end()` -- 
* `promise.all()` -- 
* `promise.any()` -- 
* `promise.some()` -- 
* `promise.pipe.fire(arg, arg, ...)` -- 
* `promise.pipe.error(arg, arg, ...)` -- 
* `promise.pipe.notify()` --
* `promise.pipe.resolve(arg, arg, ...)` -- 
* `promise.pipe.reject(arg, arg, ...)` -- 
* `promise.pipe.disable()` --
* `promise.pipe.enable()` --
* `promise.pipe.reset()` -- 

Under construction...

## More References

See [OzJS References](http://ozjs.org/#ref)

## Release History

See [OzJS Release History](http://ozjs.org/#release)

## License

Copyright (c) 2010 - 2013 dexteryy  
Licensed under the MIT license.


