
define('eventmaster/event', function(require){

var fnQueue = require('mo/lang/struct').fnQueue,
    manager = require('./eventmaster/manager');

function Event(opt){
    opt = opt || {};
    this.subject = opt.subject;
    this.trace = opt.trace;
    this.traceStack = opt.traceStack || [];
    this._disalbed = false;
    this._observeHandlers = fnQueue();
}

var api = Event.prototype = {

    addListener: function(handler){
        this._observeHandlers.push(handler);
        return this;
    },

    removeListener: function(handler){
        this._observeHandlers.clear(handler);
        return this;
    },

    emit: use_hooks('_beforeEmit', '_afterEmit'),

    disable: function(){
        this._disalbed = true;
        return this;
    },

    enable: function(){
        this._disalbed = false;
        return this;
    },

    _useHooks: use_hooks,

    _beforeEmit: function(){},

    _afterEmit: function(){},

    _trace: function(){
        this.traceStack.unshift(this.subject);
        if (this.traceStack.length > this.trace) {
            this.traceStack.pop();
        }
    }

};

api.trigger = api.fire = api.emit;
api.on = api.bind = api.addListener;
api.off = api.unbind = api.removeListener;

function use_hooks(before, after){
    return function(args){
        if (this._disalbed) {
            return this;
        }
        if (this.trace) {
            this._trace();
        }
        args = args || [];
        this[before].call(this, args);
        this._observeHandlers.apply(this, args);
        this[after].call(this, args);
        return this;
    };
}

function exports(opt){
    return new exports.EventManager(opt);
}

exports.EventManager = manager(Event);
exports.Event = Event;

return exports;

});

