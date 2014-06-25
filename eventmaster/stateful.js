
define('eventmaster/stateful', function(require){

var _ = require('mo/lang/mix'),
    fnQueue = require('mo/lang/struct').fnQueue,
    manager = require('./manager'),
    Event = require('./event').Event,
    orig_api = Event.prototype;

function StatefulEvent(opt){
    Event.call(this, opt);
    this._doneHandlers = fnQueue();
    this._alterQueue = fnQueue();
    this._state = 0;
    this._argsCache = [];
}

var api = StatefulEvent.prototype = _.mix({}, orig_api, {

    addOnceListener: function(handler){
        if (this._state === 1) {
            handler.apply(this, this._argsCache);
        } else if (!this._state) {
            this._doneHandlers.push(handler);
        }
        return this;
    },

    removeOnceListener: function(handler){
        this._doneHandlers.clear(handler);
        return this;
    },

    addListener: function(handler){
        if (this._state) { // resolve, reject
            handler.apply(this, this._argsCache);
        }
        orig_api.addListener.call(this, handler); // notify, fire, error
        return this;
    },

    removeListener: function(handler){
        orig_api.removeListener.call(this, handler);
        return this;
    },

    progress: function(handler){ // notify, fire?, error?
        var self = this;
        this._observeHandlers.push(function(){
            if (!self._state) {
                handler.apply(this, arguments);
            }
        });
        return this;
    },

    notify: function(args){ // progress, bind
        if (this._disalbed) {
            return this;
        }
        this._state = 0;
        this._observeHandlers.apply(this, args || []);
        return this;
    },

    _beforeEmit: function(){
        this._curOnceHandlers = this._doneHandlers;
        this._doneHandlers = this._alterQueue;
    },

    _afterEmit: function(args){
        var onces = this._curOnceHandlers;
        onces.apply(this, args);
        onces.length = 0;
        this._alterQueue = onces;
    },

    resolve: function(args){ // bind, then, done 
        this._state = 1;
        this._argsCache = args || [];
        return this.emit(args);
    },

    reset: function(){ // resolve, reject
        this._state = 0;
        this._argsCache = [];
        this._doneHandlers.length = 0;
        return this;
    },

    merge: function(promise){ // @TODO need testing
        _.merge(this._doneHandlers, promise._doneHandlers);
        _.merge(this._observeHandlers, promise._observeHandlers);
        var subject = promise.subject;
        _.mix(promise, this);
        promise.subject = subject;
        return this;
    }

});

api.trigger = api.fire = api.emit;
api.on = api.bind = api.addListener;
api.off = api.unbind = api.removeListener;
api.once = api.addOnceListener;
api.cancel = api.removeOnceListener;

function exports(opt){
    return new exports.EventManager(opt);
}

exports.EventManager = manager(StatefulEvent);
exports.StatefulEvent = StatefulEvent;

return exports;

});
