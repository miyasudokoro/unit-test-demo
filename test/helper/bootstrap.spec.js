/** @file test/helper/bootstrap.spec.js */

// include setup file at the top so our global state exists
const { startAndEndWindow } = require( '../ui-setup.js' );

// put in the files we need: test file and any dependencies
const files = [ 'helper/bootstrap.js' ];

// outer "describe" statement prefixes every test with the file name
describe( 'helper/bootstrap', function() {
    let bootstrap;

    startAndEndWindow( files );

    // cleanup
    afterEach( function() {
        delete window.UnitTest;
    } );

    // no state setup is required for this test
    it( 'creates object in namespace', function() {
        let content = {
            name: 'the content'
        };
        bootstrap = window.helper.bootstrap;
        bootstrap.namespace( 'UnitTest.Sub.MyObject', content );

        expect( window.UnitTest.Sub.MyObject.name ).to.equal( 'the content' );
    } );

    // describe the state that will be set up
    describe( 'after a namespace has been created', function() {
        beforeEach( function() {
            // state setup: the namespace UnitTest.Sub.MyObject already exists
            let content = {
                name: 'the content'
            };
            bootstrap = window.helper.bootstrap;
            bootstrap.namespace( 'UnitTest.Sub.MyObject', content );
        } );

        // this test runs against the state created in the "beforeEach" statement
        it( 'creates additional function in namespace', function() {
            function MyContent() {}

            bootstrap.namespace( 'UnitTest.Sub.MyObject', { MyFunction: MyContent } );

            expect( window.UnitTest.Sub.MyObject.MyFunction ).to.equal( MyContent );
            expect( window.UnitTest.Sub.MyObject.name ).to.equal( 'the content' );
        } );
    } );
} );
