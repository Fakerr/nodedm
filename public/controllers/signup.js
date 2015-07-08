angular.module('MyApp')
  .controller('SignupCtrl', function($scope, Auth) {
    $scope.signup = function() {
      Auth.signup({
        name: $scope.displayName,
        email: $scope.email,
        password: $scope.password,
        type: $scope.type
      });
    };
    $scope.pageClass = 'fadeZoom'
  });