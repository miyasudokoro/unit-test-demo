/** @file test/setup.js */

// globals so we don’t have to declare sinon, expect, assert in every file
const sinon = global.sinon = require( 'sinon' );
const chai = require( 'chai' );
const sinonChai = require( 'sinon-chai' );
const dirtyChai = require( 'dirty-chai' );
const chaiAsPromised = require( 'chai-as-promised' );
global.expect = chai.expect;
global.assert = chai.assert;

// before all tests...
before( function() {
    // ... connect sinon and chai
    chai.use( sinonChai );
    // ... provide easier testing of promises
    chai.use( chaiAsPromised );
    // ... provide function form of chai rather than properties
    chai.use( dirtyChai );
} );

// after each test ...
afterEach( function() {
    // ... restore the sinon contexts to their initial state
    sinon.restore();
} );

// unhandled promise rejections ... your tests can hang without this
// also see: wrapping any test cases occurring inside promise handlers inside try-catch
process.on( 'unhandledRejection', function( e ) {
    /* istanbul ignore next */
    assert.fail( e );
} );