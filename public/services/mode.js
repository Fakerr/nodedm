angular.module('MyApp')
    .factory('mode', function ($http, $location, $rootScope, $alert, $window) {
        var token = $window.localStorage.token;
        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            //takes a JSON-formatted string and converts it to a JavaScript object
            //window.atob: encoder
            $rootScope.currentUser = payload.user;
        }

        return {
            mod: function (user) {
                return $http.post('/mode/mod', user)
                    .success(function () {
                        $location.path('/Mode-de-vie');
                        $alert({
                            title: 'Félicitations!',
                            content: 'Vos informations sont ajoutées.',
                            animation: 'fadeZoomFadeDown',
                            type: 'material',
                            duration: 3
                        });
                    })
                    .error(function (response) {
                        $alert({
                            title: 'Erreur!',
                            content: response.data,
                            animation: 'fadeZoomFadeDown',
                            type: 'material',
                            duration: 3
                        });
                    });
            }
        }
    });
