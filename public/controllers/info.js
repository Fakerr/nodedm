angular.module('MyApp')
    .controller('InfoCtrl', ['$scope', 'infor','$rootScope','$location', function ($scope, infor,$rootScope,$location) {

        $scope.langues = {
            Arabe: false,
            Français: false,
            Anglais: true,
            Espagnol: false,
            Portugais: false,
            chinois: false,
            Japonais: false,
            Allemand: false
        };
        $scope.info = function () {
            infor.info({
                email: $rootScope.currentUser.email,
                fulfil: true,
                age: $scope.age,
                sexe: $scope.sexe,
                job: $scope.job,
                langues: $scope.langues,
                statut: $scope.statut,
                enfant: $scope.enfant,
                nivEtude: $scope.nivEtude,
                salaire: $scope.salaire
            });
        };


        $scope.pageClass = 'fadeZoom'
    }]);