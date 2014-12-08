'use strict';

angular.module('app.services')
    .service('Example', [
        function() {

            this.greet = function() {
                return 'Hello!';
            };

        }
    ]);