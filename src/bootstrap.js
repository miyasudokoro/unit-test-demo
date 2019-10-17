/** @file src/bootstrap.js */

(function() {

	/**
     * Initialize a namespace given as a string
     * @param {string} the name of the namespace
     */
    function namespace(name, content) {
        window.helper.bootstrap.namespace( name, content );
    }

    window.namespace = namespace;

    function jsonEquals(a, b) {
        // content of this function cut from the demo for brevity
    }

    namespace('App.Util');

    App.Util.UUID = function() {
        // content of this function cut from the demo for brevity
    }

    /**
     * Returns a function that can be passed as a callback to multiple
     * asynchronous executions; when all of them finish, the callback passed
     * as the second parameter is executed
     *
     * @constructor
     *
     * @param {Number} calls the number of calls that need to complete
     * @param {Function} callback the function that will be executed when all callbacks finish
     */
    function AsyncJoin(callback) {
        // content of this function cut from the demo for brevity
    }

    window.AsyncJoin = AsyncJoin;
    window._nop = function() {};

    namespace('ArrayUtils');
    ArrayUtils.binarySearch = function (array, item, comparator) {
        // content of this function cut from the demo for brevity
    };

    function getNumber(string, r, k) {
        // content of this function cut from the demo for brevity
    }

    ArrayUtils.naturalOrderComparator = function(a, b) {
        // content of this function cut from the demo for brevity
    };

    /*
     * &, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ]
     */

    function escapeAttribute(string) {
        // content of this function cut from the demo for brevity
    }

    window.escapeAttribute = escapeAttribute;
    window.jsonEquals = jsonEquals;

    /**
     * Event dispatching
     */
    namespace('App.Common', {
        Event: Event,
        Promise: Promise
    });

    function Promise(executor) {
        // content of this function cut from the demo for brevity
    }

    /**
     * TODO: remove this in favor of App.Event.Event()
     */
    function Event() {
        var _subscribers = [];

        function subscribe(handler) {
            if (typeof handler !== 'function')
                throw new Error('Handler must be a function');
            _subscribers.push(handler);
        }

        function unsubscribe(handler) {
            for (var i = 0; i < _subscribers.length; i++)
                if (_subscribers[i] === handler) {
                    _subscribers.splice(i, 1);
                    break;
                }
        }

        function unsubscribeAll() {
            _subscribers.length = 0;
        }

        function dispatch(context, args) {
            // content of this function cut from the demo for brevity
        }

        this.subscribe = subscribe;
        this.unsubscribe = unsubscribe;
        this.unsubscribeAll = unsubscribeAll;
        this.dispatch = dispatch;
    }

    // another 100 lines of polyfill functions cut from the demo for brevity

}());
