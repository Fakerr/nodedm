angular.module('MyApp', ['ngResource', 'ngMessages', 'ngRoute', 'ngAnimate', 'mgcrea.ngStrap', 'ngDialog', 'timer', 'youtube-embed', 'ngFileUpload'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);

        $routeProvider
            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'MainCtrl'
            })

            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signup.html',
                controller: 'SignupCtrl'
            })

            .when('/form', {
                templateUrl: 'views/form.html',
                controller: 'InfoCtrl'
            })
            .when('/search', {
                templateUrl: 'views/search.html',
                controller: 'SearchCtrl'
            })

            .when('/profile', {
                templateUrl: 'views/profile.html',
                controller: 'ProfileCtrl'
            })

            .when('/Mode-de-vie', {
                templateUrl: 'views/modeVie.html',
                controller: 'ModeVieCtrl'
            })
            .when('/High-Tech', {
                templateUrl: 'views/highTech.html',
                controller: 'HighTechCtrl'
            })
            .when('/Internet et opérateurs téléphoniques', {
                templateUrl: 'views/internet.html',
                controller: 'InternetCtrl'
            })
            .when('/Sports', {
                templateUrl: 'views/sport.html',
                controller: 'SportCtrl'
            })
            .when('/Cosmetique', {
                templateUrl: 'views/cosmetique.html',
                controller: 'CosmetiqueCtrl'
            })
            .when('/Mode', {
                templateUrl: 'views/mode.html',
                controller: 'ModeCtrl'
            })
            .when('/Habitation', {
                templateUrl: 'views/Habitation.html',
                controller: 'HabitationCtrl'
            })
            .when('/Boissons', {
                templateUrl: 'views/Boissons.html',
                controller: 'BoissonsCtrl'
            })
            .when('/Transport', {
                templateUrl: 'views/Transport.html',
                controller: 'TransportCtrl'
            })
            .when('/logUser', {
                templateUrl: 'views/logUser.html',
                controller: 'logUserCtrl'
            })
            .when('/adminUser', {
                templateUrl: 'views/utilisateur_admin.html',
                controller: 'UserAdminCtrl'
            })
            .when('/adminAnnoncer', {
                templateUrl: 'views/annonceur_admin.html',
                controller: 'AnnoncerAdminCtrl'
            })
            .when('/privacy', {
                templateUrl: 'views/Privacy.html',
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push(function ($rootScope, $q, $window, $location) {
            return {
                request: function (config) {
                    if ($window.localStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $window.localStorage.token;
                    }
                    return config;
                },
                responseError: function (response) {
                    if (response.status === 401 || response.status === 403) {
                        $location.path('/login');
                    }
                    return $q.reject(response);
                }
            }
        });
    })
    .run(['$http', '$rootScope', '$location', 'Auth', function ($http, $rootScope, $location, Auth) {
        $rootScope.$on('$routeChangeStart', function (event) {

            if (Auth.isLoggedIn() == 0) {
                event.preventDefault();

                // redirection to if not connected
                if (($location.path() != '/home') && ($location.path() != '/') && ($location.path() != '/signup')&& ($location.path() != '/privacy'))
                    $location.path('/login');
            }

            else if (Auth.isLoggedIn() == 1) {

                // redirection to if annoncer
                if (($location.path() != '/home') && ($location.path() != '/') && ($location.path() != '/search')&& ($location.path() != '/privacy'))
                    $location.path('/home');
            }
            else if (Auth.isLoggedIn() == 2) {

                // redirection to if User
                if (($location.path() != '/home') && ($location.path() != '/') && ($location.path() != '/form') && ($location.path() != '/profile')
                    && ($location.path() != '/Mode-de-vie') && ($location.path() != '/High-Tech') && ($location.path() != '/logUser')&& ($location.path() != '/privacy'))
                    $location.path('/home');
            }
            else if (Auth.isLoggedIn() == 3) {

                //redirection to if Administrator
                if (($location.path() != '/home') && ($location.path() != '/') && ($location.path() != '/adminAnnoncer') && ($location.path() != '/adminUser')&& ($location.path() != '/privacy'))
                    $location.path('/home');
            }

        });
    }]);