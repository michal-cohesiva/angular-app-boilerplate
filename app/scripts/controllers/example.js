'use strict';

angular.module('app.controllers')
    .controller('ExampleCtrl', ['$scope', 'Example',
        function($scope, ExampleService) {

            $scope.toggleGreeting = function() {

                if (angular.isUndefined($scope.greeting)) {
                    $scope.greeting = ExampleService.greet();
                    return;
                }

                delete $scope.greeting;

            };

        }
    ]);