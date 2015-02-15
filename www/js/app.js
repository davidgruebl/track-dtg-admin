angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
    if (window.StatusBar) StatusBar.styleDefault()

    window.navigator.geolocation.getCurrentPosition(function(location) {
      console.log('Location from Phonegap')
      console.log(location)
    })

    var bgGeo = window.plugins.backgroundGeoLocation
    bgGeo.start()
  })
})
