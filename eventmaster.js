/**
 * EventMaster
 * Promise + Event = ?
 *
 * using AMD (Asynchronous Module Definition) API with OzJS
 * see http://ozjs.org for details
 *
 * Copyright (C) 2010-2014, Dexter.Yy, MIT License
 * vim: et:ts=4:sw=4:sts=4
 */
define("eventmaster", function(require){ 

var _ = require('mo/lang/mix'),
    fnQueue = require('mo/lang/struct').fnQueue,
    manager = require('./eventmaster/manager'),
    StatefulEvent = require('./eventmaster/stateful').StatefulEvent,
    orig_api = StatefulEvent.prototype,
    slice = Array.prototype.slice,
    pipes = ['notify', 'emit', 'fire', 'trigger', 'error', 
        'resolve', 'reject', 'reset', 'disable', 'enable'];

function Promise(opt){
    StatefulEvent.call(this, opt);
    this._failHandlers = fnQueue();
    this._lastDoneQueue = [];
    this._lastFailQueue = [];
    this.pipe = {};
    var self = this;
    pipes.forEach(function(i){
        this[i] = function(){
            return self[i].call(self, slice.call(arguments));
        };
    }, this.pipe);
}

var api = Promise.prototype = _.mix({}, orig_api, {

    then: function(handler, errorHandler){
        var _state = this.state;
        if (errorHandler) { // error, reject
            if (_state === 2) {
                this._resultCache = errorHandler.apply(this, this._argsCache);
            } else if (!_state) {
                this._failHandlers.push(errorHandler);
                this._lastFailQueue = this._failHandlers;
            }
        } else {
            this._lastFailQueue = [];
        }
        if (handler) { // fire, resolve
            if (_state === 1) {
                this._resultCache = handler.apply(this, this._argsCache);
            } else if (!_state) {
                this._doneHandlers.push(handler);
                this._lastDoneQueue = this._doneHandlers;
            }
        } else {
            this._lastDoneQueue = [];
        }
        return this;
    },

    done: function(handler){ // fire, resolve
        return this.then(handler);
    },

    fail: function(handler){ // error, reject
        return this.then(false, handler);
    },

    removeOnceListener: function(handler){
        this._failHandlers.clear(handler);
        return orig_api.cancel.call(this, handler);
    },

    error: orig_api._useHooks('_beforeError', '_afterEmit'),

    _beforeError: function(){
        this._curOnceHandlers = this._failHandlers;
        this._failHandlers = this._alterQueue;
        this._doneHandlers.length = 0;
    },

    _beforeEmit: function(){
        orig_api._beforeEmit.call(this);
        this._failHandlers.length = 0;
    },

    reject: function(args){ // bind, then, fail 
        this._state = 2;
        this._argsCache = args || [];
        return this.error(args);
    },

    reset: function(){
        orig_api.reset.call(this);
        this._failHandlers.length = 0;
    },

    merge: function(promise){
        _.merge(this._failHandlers, promise._failHandlers);
        orig_api.merge.call(this, promise);
    },

    follow: function(){
        var next = new Promise();
        next._prevActor = this;
        if (this._state) {
            pipe(this._resultCache, next);
        } else {
            var doneHandler = this._lastDoneQueue.pop();
            if (doneHandler) {
                this._lastDoneQueue.push(function(){
                    return pipe(doneHandler.apply(this, arguments), next);
                });
            }
            var failHandler = this._lastFailQueue.pop();
            if (failHandler) {
                this._lastFailQueue.push(function(){
                    return pipe(failHandler.apply(this, arguments), next);
                });
            }
        }
        return next;
    },

    end: function(){
        return this._prevActor;
    },

    all: function(){
        var fork = when.apply(this, this._when);
        return fork;
    },

    any: function(){
        var fork = when.apply(this, this._when);
        fork._count = fork._total = 1;
        return fork;
    },

    some: function(n){
        var fork = when.apply(this, this._when);
        fork._count = fork._total = n;
        return fork;
    }

});

api.once = api.addOnceListener = api.then;
api.cancel = api.removeOnceListener;

function when(){
    var mutiArgs = [],
        completed = [],
        mutiPromise = new Promise();
    mutiPromise._when = [];
    mutiPromise._count = mutiPromise._total = arguments.length;
    Array.prototype.forEach.call(arguments, function(promise, i){
        var mutiPromise = this;
        mutiPromise._when.push(promise.bind(callback));
        function callback(args){
            if (!completed[i]) {
                completed[i] = true;
                mutiArgs[i] = args;
                if (--mutiPromise._count === 0) {  // @TODO
                    completed.length = 0;
                    mutiPromise._count = mutiPromise._total;
                    mutiPromise.resolve.call(mutiPromise, mutiArgs);
                }
            }
        }
    }, mutiPromise);
    return mutiPromise;
}

function pipe(prev, next){
    if (prev && prev.then) {
        prev.then(next.pipe.resolve, next.pipe.reject)
            .progress(next.pipe.notify);
    } else if (prev !== undefined) {
        next.resolve([prev]);
    }
    return prev;
}

var EventManager = manager(Promise);

_.mix(EventManager, {
    promise: function(subject){
        var promise = this.lib[subject];
        if (!promise) {
            promise = this.lib[subject] = new Promise({
                subject: subject,
                trace: this.trace,
                traceStack: this.traceStack
            });
        }
        return promise;
    },
    when: function(){
        var args = [];
        for (var i = 0, l = arguments.length; i < l; i++) {
            args.push(this.promise(arguments[i]));
        }
        return when.apply(this, args);
    }
});

function exports(opt){
    return new exports.EventManager(opt);
}

exports.EventManager = exports.Event = EventManager;
exports.Promise = Promise;
exports.when = when;
exports.pipe = pipe;

return exports;

});
