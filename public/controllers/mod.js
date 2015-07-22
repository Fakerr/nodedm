angular.module('MyApp')
    .controller('ModeVieCtrl', ['$scope', 'mode','$rootScope','$location', function ($scope, mode,$rootScope,$location) {


        $scope.typeVoyages = {Mer: false, Montagne: false, Compagne: true, Culture: false, Aventure: false};
        $scope.typeHebergements = {
            Location: false,
            club: false,
            hotel: true,
            camping: false,
            famille: false,
            amis: false
        };
        $scope.compagnies = {amis: false, famille: true, couple: false}
        $scope.mod = function () {
            mode.mod({
                email: $rootScope.currentUser.email,
                fulfil: true,
                poids: $scope.poids,
                taille: $scope.taille,
                freqVoyage: $scope.freqVoyage,
                typeVoyages: $scope.typeVoyages,
                direction: $scope.direction,
                duree: $scope.duree,
                typeHebergements: $scope.typeHebergements,
                Compagnie: $scope.compagnies,
                typeReservation: $scope.typeReservation,
                budget: $scope.budget
            });
        };

        $scope.pageClass = 'fadeZoom'
    }]);