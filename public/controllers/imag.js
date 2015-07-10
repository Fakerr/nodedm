angular.module('MyApp')
    .controller('SearchCtrl', ['$scope', 'image','$rootScope', function ($scope, image,$rootScope) {

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
            image.imag({
                email: $rootScope.currentUser.email,
                type: "video",
                nom_pub: $scope.name,
                categorie: "iphone",
                nb_max: 15,
                montant: $scope.prix,
                url: "https://www.asus.com/fr/",
                lien: $scope.img.name
            });
        };
        $scope.pageClass = 'fadeZoom'
    }]);
