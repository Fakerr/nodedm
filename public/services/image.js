angular.module('MyApp')
  .factory('image', function($http, $location, $rootScope, $alert, $window) {
      
      return {
      imag: function(annonceur) {
        return $http.post('/image/imag', annonceur)
          .success(function() {
            $location.path('/search');
            $alert({
              title: 'Congratulations!',
              content: 'The Anounce has been added in your database and sent to the specific users.',
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
          })
          .error(function(response) {
            $alert({
              title: 'Error!',
              content: response.data,
              animation: 'fadeZoomFadeDown',
              type: 'material',
              duration: 3
            });
          });
      }
  }
  });
