/** @file test/activity-monitor.spec.js */

// include setup file at the top so our global state exists
const { startAndEndWindow } = require( './ui-setup.js' );

// what files we are including, in dependency order
// preLoad: files creating the global state expected when the files load
const preLoad = [
    'lib/jquery.js',
    'helper/bootstrap.js'
];
// files: the files to load for this test
const files = [
    'activity-monitor.js'
];

// mock Event
let event;
const MockEvent = function() {
    event = {
        mockSubscriber: {},
        hasTriggered: 0,
        hasUnsubscribed: 0,
        getEventSubscriber: function() {
            return this.mockSubscriber;
        },
        trigger: function() {
            this.hasTriggered++;
        },
        unsubscribeAll: function() {
            this.hasUnsubscribed++;
        }
    };
    return event;
};

// an outer "describe" prefixes all tests in this file the same
describe( 'activity-monitor', function() {
    let monitor;

    startAndEndWindow( preLoad, files );

    // set up the environment of each test separately
    // you can use "before" to set up a shared environment, but then you must be more careful of pollution
    beforeEach( function() {
        let ActivityMonitor = window.App.Common.ActivityMonitor;

        // if we had loaded the "Event" file in, we would stub it here
        // sinon.stub( App.Event, 'Event' ).callsFake( MockEvent );
        // instead, we will simply make a simple mock object
        window.App.Event = {
            Event: MockEvent
        };

        monitor = new ActivityMonitor( 1 );
    } );

    // cleanup listeners and clear timeout
    afterEach( function() {
        monitor.stop();
    } );

    it( 'starts timer and sets activity listeners', function() {
        sinon.stub( document, 'addEventListener' );

        monitor.start();

        expect( document.addEventListener.getCall( 0 ).args[ 0 ] ).to.equal( 'click' );
        expect( document.addEventListener.getCall( 1 ).args[ 0 ] ).to.equal( 'scroll' );
        expect( document.addEventListener.getCall( 2 ).args[ 0 ] ).to.equal( 'keydown' );
    } );

    describe( 'after the monitor is started', function() {
        let callback;

        beforeEach( function() {
            sinon.stub( document, 'addEventListener' );

            monitor.start();

            // extract the callback from our stub
            // remember that this callback is technically a public function; here's how we can test it (but refactoring might be a good idea)
            callback = document.addEventListener.getCall( 0 ).args[ 1 ];
        } );

        it( 'detects activity (version A, callback extraction)', function() {
            // recorded previously:
            let recorded = parseInt( window.localStorage.getItem( 'lastActivity' ) ) || 0;

            // call the callback to test it
            callback();

            // expect localStorage to have been updated
            expect( parseInt( window.localStorage.getItem( 'lastActivity' ) ) ).to.be.greaterThan( recorded );
        } );

        it( 'stops the monitor', function() {
            sinon.stub( document, 'removeEventListener' );

            monitor.stop();

            // DE12121 typo "addEventListener" instead of "removeEventListener"
            expect( document.removeEventListener.getCall( 0 ).args[ 0 ] ).to.equal( 'click' );
            expect( document.removeEventListener.getCall( 1 ).args[ 0 ] ).to.equal( 'scroll' );
            expect( document.removeEventListener.getCall( 2 ).args[ 0 ] ).to.equal( 'keydown' );

            expect( event.hasTriggered ).to.equal( 0 ); // did not trigger
            expect( event.hasUnsubscribed ).to.equal( 1 ); // but it did unsubscribe
        } );

        it( 'stops the timer if inactivity is detected', function( done ) {
            // testing the timeout via its effects after a certain period of time
            setTimeout( function() {
                // expecting that it has triggered "no activity" because more than 1ms has passed
                // expecting that it only happened once
                expect( event.hasTriggered ).to.equal( 1 );
                expect( event.hasUnsubscribed ).to.equal( 1 );
                done();
            }, 2 );
        } );
    } );

    it( 'detects activity (version B, trigger event)', function( done ) {
        let recorded = window.localStorage.getItem( 'lastActivity' ) || 0;
        monitor.start();

        window.$( 'body' ).trigger( 'click' );

        // wait for event
        setTimeout( function() {
            // expect localStorage to have been updated
            expect( parseInt( window.localStorage.getItem( 'lastActivity' ) ) ).to.be.greaterThan( recorded );
            done();
        }, 1 );
    } );
} );
