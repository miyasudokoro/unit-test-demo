/** @file test/canary.spec.js */

// include setup file at the top so our global state exists
require( './ui-setup.js' );

// canary unit test
describe( 'canary', function() {
    it( 'adds 2 + 2', function() {
        expect( 2 + 2 ).to.equal( 4 );
    } );
} );