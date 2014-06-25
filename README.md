<!---
layout: intro
title: EventMaster
-->

# EventMaster

> Promise + Event = ?

## Examples

* [demo](http://ozjs.org/EventMaster/examples/)

## In NodeJS

```
npm install eventmaster
```

## In browser

```
bower install eventmaster`
```

## Dependencies

* [mo/lang/es5](https://github.com/dexteryy/mo/es5)
* [mo/lang/mix](https://github.com/dexteryy/mo/mix)
* [mo/lang/struct](https://github.com/dexteryy/mo/struct)

## API and usage

```javascript 
var eventFactory = require('eventmaster/event');
var event = eventFactory();
var singleEvent = new eventFactory.Event();
```

* `event.on`/`event.bind`/`event.addListener`
* `event.off`/`event.unbind`/`event.removeListener`
* `event.emit`/`event.trigger`/`event.fire`
* `event.disable`
* `event.enable`

```javascript 
var eventFactory = require('eventmaster/stateful');
var event = eventFactory();
var singleEvent = new eventFactory.StatefulEvent();
```

_(In addition to the above API)_
* `event.addOnceListener`/`event.once`/`event.wait`
* `event.removeOnceListener`/`event.cancel`
* `event.progress`
* `event.notify`
* `event.resolve`
* `event.reset`
* `event.merge`

```javascript 
var eventFactory = require('eventmaster');
var event = eventFactory();
var promise = new eventFactory.Promise();
```

_(In addition to the above API)_
* `event.then`/`event.addOnceListener`/`event.once`/`event.wait`
* `event.done`
* `event.fail`
* `event.error`
* `event.reject`
* `event.follow`
* `event.end`
* `event.all`
* `event.any`
* `event.some`

## More References

See [OzJS Project Homepage](http://ozjs.org/)

## License

Copyright (c) 2010 - 2014 dexteryy  
Licensed under the MIT license.


