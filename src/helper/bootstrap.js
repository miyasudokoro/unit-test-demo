/** @file src/helper/bootstrap.js */

( function() {

    const bootstrap = {
        namespace: function ( name, content ) {
            var parts = String(name).split('.');
            var parent = window;
            for (var i in parts) {
                parent[parts[i]] = parent[parts[i]] || {};
                parent = parent[parts[i]];
            }
            if (content) //$.extend(parent, content);
                for (var i in content)
                    parent[i] = content[i];
        }
    };

    window.namespace = bootstrap.namespace;

    window.helper = window.helper || {};
    window.helper.bootstrap = bootstrap;
} )();