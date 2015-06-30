angular.module('MyApp').
    filter('trusted', function($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });