angular.module('MyApp')
    .factory('infor', function ($http, $location, $rootScope, $alert, $window) {
        var token = $window.localStorage.token;
        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            //takes a JSON-formatted string and converts it to a JavaScript object
            //window.atob: encoder
            $rootScope.currentUser = payload.user;
        }

        return {
            info: function (user) {
                return $http.post('/infor/info', user)
                    .success(function () {
                        $location.path('/form');
                        $alert({
                            title: 'Félicitations!',
                            content: 'Vos informations sont ajoutées.',
                            animation: 'fadeZoomFadeDown',
                            type: 'material',
                            duration: 3
                        });
                        $rootScope.infoPerso = true; // From infoPerso fulfiled
                        $location.path('/Mode-de-vie');
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
