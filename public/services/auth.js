angular.module('MyApp')
    .factory('Auth', function ($http, $location, $rootScope, $alert, $window) {
        var token = $window.localStorage.token;
        if (token) {
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            $rootScope.currentUser = payload.user;
        }

        // Asynchronously initialize Facebook SDK
        $window.fbAsyncInit = function () {
            FB.init({
                appId: '624059410963642',
                responseType: 'token',
                version: 'v2.0'
            });
        };

        // Asynchronously load Facebook SDK
        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        // Asynchronously load Google+ SDK
        (function () {
            var po = document.createElement('script');
            po.type = 'text/javascript';
            po.async = true;
            po.src = 'https://apis.google.com/js/client:plusone.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(po, s);
        })();

        return {
            facebookLogin: function () {
                FB.login(function (response) {
                    FB.api('/me', function (profile) {
                        var data = {
                            signedRequest: response.authResponse.signedRequest,
                            profile: profile
                        };
                        $http.post('/auth/facebook', data).success(function (token) {
                            var payload = JSON.parse($window.atob(token.split('.')[1]));
                            $window.localStorage.token = token;
                            $rootScope.currentUser = payload.user;
                            $location.path('/');
                            $alert({
                                title: 'Félicitations!',
                                content: 'Vous avez réussi votre connexion avec Facebook.',
                                animation: 'fadeZoomFadeDown',
                                type: 'material',
                                duration: 3
                            });
                        });
                    });
                }, {scope: 'email, public_profile'});
            },
            googleLogin: function () {
                gapi.auth.authorize({
                    client_id: '55262601920-5jhf3qth89okujq6a7lh8bqc9epr8475.apps.googleusercontent.com',
                    scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read',
                    immediate: false
                }, function (token) {
                    gapi.client.load('plus', 'v1', function () {
                        var request = gapi.client.plus.people.get({
                            userId: 'me'
                        });
                        request.execute(function (authData) {
                            $http.post('/auth/google', {profile: authData}).success(function (token) {
                                var payload = JSON.parse($window.atob(token.split('.')[1]));
                                $window.localStorage.token = token;
                                $rootScope.currentUser = payload.user;
                                $location.path('/');
                                $alert({
                                    title: 'Félicitations!',
                                    content: 'Vous avez réussi votre connexion avec Google.',
                                    animation: 'fadeZoomFadeDown',
                                    type: 'material',
                                    duration: 3
                                });
                            });
                        });
                    });
                });
            },
            login: function (user) {
                return $http.post('/auth/login', user)
                    .success(function (data) {
                        $window.localStorage.token = data.token;
                        var payload = JSON.parse($window.atob(data.token.split('.')[1]));
                        $rootScope.currentUser = payload.user;
                        $location.path('/');
                        $alert({
                            title: 'Félicitations!',
                            content: 'Vous avez réussi votre connexion.',
                            animation: 'fadeZoomFadeDown',
                            type: 'material',
                            duration: 3
                        });

                        if (!$rootScope.currentUser.type.localeCompare("client"))
                            $window.location.href = '/home';
                        else if (!$rootScope.currentUser.type.localeCompare("annonceur"))
                            $window.location.href = '/home';
                    })
                    .error(function () {
                        delete $window.localStorage.token;
                        $alert({
                            title: 'Erreur!',
                            content: 'Identifiant ou mot de passe invalide.',
                            animation: 'fadeZoomFadeDown',
                            type: 'material',
                            duration: 3
                        });
                    });
            },
            signup: function (user) {
                return $http.post('/auth/signup', user)
                    .success(function () {
                        $location.path('/login');
                        $alert({
                            title: 'Félicitations!',
                            content: 'Votre compte est crée.',
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
            },
            logout: function () {
                delete $window.localStorage.token;
                $rootScope.currentUser = null;
                $alert({
                    content: 'Vous avez déconnecté.',
                    animation: 'fadeZoomFadeDown',
                    type: 'material',
                    duration: 3
                });
                $window.location.href = '/';
            }
        };
    });