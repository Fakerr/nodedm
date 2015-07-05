angular.module('MyApp')
    .directive('youtube', function() {
        return{
            restrict: 'E',
            scope: {
                src: '=',
                width: '=',
                height: '='
            },
            templateUrl: 'views/youtube.html'
        };
    });