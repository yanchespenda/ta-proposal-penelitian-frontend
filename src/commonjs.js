(function () {
  'use strict';

  var angular = require('./resources/js/angular');

  var app = angular.module('app', [
    require('./resources/js/angular-chart')
  ]);

  app.controller('CommonJSCtrl', ['$scope', function ($scope) {
    $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ];
  }]);

})();
