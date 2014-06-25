
define('eventmaster/manager', [], function(){

var slice = Array.prototype.slice;

return function(Event){

    function dispatchFactory(i){
        return function(subject){
            var promise = this.lib[subject];
            if (!promise) {
                promise = this.lib[subject] = new Event({
                    subject: subject,
                    trace: this.trace,
                    traceStack: this.traceStack
                });
            }
            promise[i].apply(promise, slice.call(arguments, 1));
            return this;
        };
    }

    function EventManager(opt){
        if (opt) {
            this.trace = opt.trace;
            this.traceStack = opt.traceStack;
        }
        this.lib = {};
    }

    var orig_api = Event.prototype;
    var api = EventManager.prototype = (function(methods){
        for (var i in orig_api) {
            methods[i] = dispatchFactory(i);
        }
        return methods;
    })({});
    api.wait = api.once;

    return EventManager;

};

});
