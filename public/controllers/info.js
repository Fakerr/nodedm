angular.module('MyApp')
    .controller('InfoCtrl', ['$scope', 'infor','$rootScope', function ($scope, infor,$rootScope) {


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