angular.module('MyApp')
    .controller('statCtrl', ['$scope','$rootScope','$http', function ($scope,$rootScope,$http) {
        $scope.catNames = [];
        $scope.pubCount = [];
        $scope.Mois = ["Janvier", "Fevrier", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Decembre"];
        $scope.NbMois = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        $scope.NbMoisS = [];
        $scope.type = 'Pie';

        $scope.toggle = function () {
            $scope.type = $scope.type === 'PolarArea' ?
                'Pie' : 'PolarArea';
        };

        var getMonthNumber = function (date) {
        console.log(Number(date.substring(5, 7)) - 1);
        return (Number(date.substring(5, 7)) - 1);
    };
        $http.get('/api/annonces/all').success(function(data){
            console.log(data);
            for(i=0; i<data.length;i++){
                console.log(data[i].categorie);
                $scope.catNames.push(data[i].categorie);
                $scope.pubCount.push(data[i].pubs.length);
                for(j = 0;j<data[i].pubs.length;j++){
                    var k = getMonthNumber(data[i].pubs[j].date);
                    $scope.NbMois[k]++;
                }
            }
            $scope.NbMoisS.push($scope.NbMois);
        });
    }]);