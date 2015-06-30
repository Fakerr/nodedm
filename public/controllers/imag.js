angular.module('MyApp')
    .controller('SearchCtrl', ['$scope', 'image', function ($scope, image) {
        $scope.cibles = {
            Transport: false,
            Cosmetique: false,
            Habitation: false,
            Sports: false,
            Mode: false,
            Boisson: false
        };

        $scope.fileNameChanged = function (element) {
            $scope.img = element.files[0];
        };

        $scope.imag = function () {
            //console.log('123');
            image.imag({
                name: $scope.name,
                prix: $scope.prix,
                marque: $scope.marque,
                cibles: $scope.cibles,
                image: $scope.img.name
            });
        };
        $scope.pageClass = 'fadeZoom'
    }]);
