angular.module('MyApp')
    .controller("logAnnoncerCtrl", ['$scope', '$http', '$rootScope', 'ngDialog', '$window', function ($scope, $http, $rootScope, ngDialog, $window) {

        $scope.getPos = function(user){
            if (user.age <= 19)
                return Number(0);
            if ((user.age >=20)&&(user.age <=29))
                return Number(1);
            if ((user.age >=30)&&(user.age <=39))
                return Number(2);
            if ((user.age >=40)&&(user.age <=49))
                return Number(3);
            if ((user.age >=50)&&(user.age <=59))
                return Number(4);
            if (user.age >=60)
                return Number(5);
        };
        $scope.getPosSexe = function(user){
            if (user.sexe == "Homme")
                return Number(0);
            if (user.sexe == "Femme")
                return Number(1);
        }
        $scope.plotChars = function () {
            $scope.sexes = ["Homme","Femme"];
            $scope.numberBySexe = [0,0];
            $scope.TrancheAge = ["< 19", "20 - 29", "30 - 39", "40 - 49", "50 - 59", "> 60"];
            $scope.numberByAge = [0,0,0,0,0,0];
            $scope.numbersByAge = [];
            for (i=0;i<$scope.ListOfUser.length;i++){
                $scope.numberByAge[$scope.getPos($scope.ListOfUser[i])]+=1;
                $scope.numberBySexe[$scope.getPosSexe($scope.ListOfUser[i])]+=1;
            }
            console.log($scope.numberByAge);
            $scope.numbersByAge.push($scope.numberByAge);
        }

        $scope.getUrl = function (type, url, lienExterne) {
            if (type == "image")
                return (url);
            return ("http://img.youtube.com/vi/" + lienExterne.replace('https://www.youtube.com/watch?v=', '') + "/0.jpg");
        };

        $scope.getListUser = function (id,nom) {
            $scope.currentAnn = nom;
            $http.get('/api/viewedAds/userList', {params: {id: id}}).success(function (ListofUser) {
                $scope.ListOfUser = ListofUser;
                console.log(ListofUser);
                ngDialog.open({
                    template:'userList',
                    scope: $scope,
                    overlay: false,
                    className: 'ngdialog-theme-plain'
                });
                $scope.plotChars();
            });
        };
        var timeAct;
        var videoLong;
        $scope.playerVars = {
            controls: 1
        };

        $scope.$on('youtube.player.ready', function ($event, player) {
            videoLong = player.getDuration();
            timeAct = 0;
        });

        $scope.$on('youtube.player.playing', function ($event, player) {
            player1 = player;
            $scope.duration = videoLong - timeAct;
            $scope.show = true;
        });

        $scope.open = function (image) {
            if (image.type == "image") {
                $scope.pub = image.url;
                $scope.lien = image.lienExterne;
                ngDialog.open({
                    template: 'firstDialog',
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    scope: $scope
                });
            }
            else {
                $scope.pubVideo = image;
                $scope.show = false;
                $scope.heightDialogVideo = 550;
                $scope.widthDialogVideo = 1170;
                ngDialog.open({
                    template: 'secondDialog',
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    scope: $scope
                });
            }
        };

        $http.put("/publist/", $rootScope.currentUser.pub).success(function (response) {
            var i, j, c;
            var k = -1;
            var r = [];
            var pl = [];
            for (i = 0; i < response.length; i++) {
                pl = response[i].pubs;
                for (c = 0; c < pl.length; c++) {
                    for (j = 0; j < $rootScope.currentUser.pub.length; j++) {
                        if ($rootScope.currentUser.pub[j].id_pub == pl[c].id) {
                            k = k + 1;
                            r[k] = pl[c];
                        }
                    }
                }
            }
            $scope.publ = r;
        });
    }]);
