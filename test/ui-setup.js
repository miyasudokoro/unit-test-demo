/** @file test/ui-setup.js */

// include the main setup file so it exists first
require( './setup.js' );

const path = require( 'path' );
const fs = require( 'fs' );
const { JSDOM } = require( 'jsdom' );
const URL = 'file://' + path.join( __dirname, '..', 'src' ).replace( /\\/g, '/' ) + '/';
const OPTIONS = {
    runScripts: 'dangerously',  // don't load up scripts you can't trust -- mock them instead
    resources: 'usable',
    url: 'http://localhost/'    // this helps to attach a debugger
};

// utilities for helping tests run
module.exports = {
    addFileToWindow: addFileToWindow,
    loadFilesInWindow: loadFilesInWindow,
    startAndEndWindow: startAndEndWindow
};

/** Resolves when a file has loaded in the window.
 *
 * @param window {Window} the window
 * @param file {string} file path
 * @returns {Promise}
 */
function addFileToWindow( window, file ) {
    const scriptEl = window.document.createElement( 'script' );
    let promise = new Promise( ( resolve, reject ) => {
        scriptEl.onload = resolve;
        scriptEl.onerror = reject;
        scriptEl.src = URL + file;
    } );
    window.document.head.appendChild( scriptEl );
    return promise;
}

/** Runs UI files using JSDOM window.
 *
 * @param files {Array} the relative paths within src
 * @param html {string} html string to load in
 * @param options {object} options for JSDOM
 * @param window {Window} an existing window
 * @returns {Promise} resolving in window; rejecting in load error instance
 */
function loadFilesInWindow( files, html='', options=OPTIONS, window=null ) {
    window = window || ( new JSDOM( html, options ) ).window;
    if ( files && files.length ) {
        const promises = files.map( file => {
            return addFileToWindow( window, file ).catch( e => {
                return Promise.reject( new Error( 'Load failed: ' + file ) );
            } );
        } );
        return Promise.all( promises ).then( () => window );
    }
    return Promise.reject( new Error( 'no files' ) );
}

/** Creates and breaks down a window via "before" and "after" statements.
 * Call inside a "describe" to have a window that exists for exactly the length of that describe.
 *
 * @param loadFiles {Array} the relative paths within src for files to load initially
 * @param postLoadFiles {Array} the relative paths within src for files to load after the first files have loaded
 * @param html {string} html string to load in
 * @param options {object} options for JSDOM
 * @param window {Window} an existing window
 * @returns {Promise} resolving in window; rejecting in load error instance
 */
function startAndEndWindow( loadFiles, postLoadFiles, html, options ) {
    // this is a normal "before" statement
    before( function( done ) {
        loadFilesInWindow( loadFiles, html, options ).then( window => {
            global.window = window;
            global.document = window.document;
            if ( postLoadFiles ) {
                loadFilesInWindow( postLoadFiles, undefined, undefined, window ).then( () => done(), done );
            } else {
                done();
            }
        }, done );
    } );

    after( function() {
        if ( global.window ) {
            global.window.close();
            delete global.window;
            delete global.document;
        }
    } );
}