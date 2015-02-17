/* global angular cordova StatusBar */
var base64 = require('js-base64').Base64
var prefs = null

function setPreference (key, value, callback) {
  if (typeof callback !== 'function') callback = function () {}
  prefs.store(function (val) {
    callback(null, val)
  }, function (err) {
    callback(err)
  }, key, value)
}

function getPreference (key, callback) {
  prefs.fetch(function (val) {
    callback(null, val)
  }, function (err) {
    callback(err)
  }, key)
}

angular.module('starter', ['ionic'])
.controller('AuthController', function($scope) {
  $scope.submit = function() {
    if ($scope.username && $scope.password) {
      var auth = base64.encode($scope.username + ':' + $scope.password)
      setPreference('auth', auth)
    }
  }
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
    if (window.StatusBar) StatusBar.styleDefault()
    var bgGeo = window.plugins.backgroundGeoLocation
    prefs = window.plugins.appPreferences
    var $http = angular.injector(['ng']).get('$http')

    window.navigator.geolocation.getCurrentPosition(function(location) {
      console.log('Location:', location)
    })

    var callbackFn = function(location) {
      console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude)
      getPreference('auth', function (error, value) {
        if (error) return console.log(error)
        console.log(location, value)
        var req = {
          method: 'POST',
          url: 'http://track.dtg.sexy/api/location',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + value
          },
          data: location
        }

        $http(req)
        .success(function(data, status, headers, config) {
          console.log('loc posted successfully')
        })
        .error(function(data, status, headers, config) {
          console.log('loc post failed:', status)
        })
      })
      bgGeo.finish()
    }

    var failureFn = function(error) {
      console.log('BackgroundGeoLocation error', error)
    }

    bgGeo.configure(callbackFn, failureFn, {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 30,
      activityType: 'AutomotiveNavigation',
      debug: true,
      stopOnTerminate: false
    })

    bgGeo.start()
  })
})
