'use strict';

angular.module('ehApp')
  .controller('AdminCtrl', function ($scope, $state, ValidationPolicyIntervalsService, Auth, socket) {

    $scope.pendingActions = true;
    $scope.err = false;
    var getItems = function() {
      $scope.pendingActions = true;
      ValidationPolicyIntervalsService.list().$promise.then(function(result){
        $scope.intervals = result;
        populateSlider()
      }, function(err){

        $scope.error = true;
        $scope.pendingActions = false;

      });
    }

    var populateSlider = function(){
        $scope.middle = $scope.intervals[0]
        $scope.slider = {
            minValue: $scope.middle.intervalLowerLimit,
            maxValue: $scope.middle.intervalUpperLimit,
            options: {
                floor: 0,
                ceil: 100,
                step: 5,
                noSwitching: true,
                showSelectionBar: true,
                showTicks: true,
                getTickColor: function (value) {
                    if (value <= $scope.slider.minValue)
                      return 'red';
                    if (value <= $scope.slider.maxValue)
                      return '#000';
                    return '#2AE02A';
                }
            }
        };
    }

    $scope.save = function(){
      $scope.middle.intervalLowerLimit = $scope.slider.minValue
      $scope.middle.intervalUpperLimit = $scope.slider.maxValue
      ValidationPolicyIntervalsService.update({ id: $scope.middle._id }, $scope.middle, function(result){
        $state.go('merchant-products')
      }, function(err){
        console.log(err)
      })
    }
    Auth.getCurrentUser(function(currentUser){
      $scope.currentUser = currentUser;
      getItems()
    })
  });
