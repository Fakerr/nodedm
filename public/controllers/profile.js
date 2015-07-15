/* Discount should be used with configurable  variable */

angular.module('MyApp')
    .controller('ProfileCtrl', ['$scope', '$http', '$rootScope','ngDialog','$window', function ($scope, $http, $rootScope,ngDialog,$alert,$window) {

        //Dimension video dans la page profile.
        $scope.heightVideo = 280;
        $scope.widthVideo = 375;
        //Dimension image dans profile.
        $scope.heightImage= 280;
        $scope.widthImage = 375;
        $scope.playerVars = {
            controls: 0
        };

        $http.get('/api/user', {params: {id: $rootScope.currentUser._id}})
            .success(function (data) {
                $scope.user = data;
                $scope.userName = data.name;
                $scope.ann = data.annonces;
                $scope.videos = data.annoncesVideos;
            }).error(function (err) {
                console.log(err, 'error user !!');
            });

        $scope.$on('youtube.player.playing', function ($event, player) {
            $scope.duration = player.getDuration();
            $scope.show = true;
        });

        $scope.$on('youtube.player.ended', function ($event, player) {
            // modif boolean check and update $scope.user
            var vid = $scope.user.annoncesVideos;
            var lien = player.getVideoUrl();
            var res =  lien.replace("?v=","/");
            for (var i = 0; i < vid.length; i++) {
                if (!vid[i].url.localeCompare(res)) {
                    var videoCheck = $scope.user.annoncesVideos[i].check;
                    var id = $scope.user.annoncesVideos[i].id;
                    var c = i;
                    break;
                }
            }
            if(!videoCheck){
                $scope.user.annoncesVideos[c].check = true;
                $scope.donate(id);
            }
            //player.playVideo();
        });

        $scope.open = function (image) {
            $scope.pub = image.url;
            $scope.lien = image.lien;
            $scope.heightDialogImage = 550;
            $scope.widthDialogImage = 800;
            ngDialog.open({
                template: 'firstDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope
            });
        };

        $scope.openVideo = function (video) {
            $scope.pubVideo = video;
            $scope.show = false;
           // $scope.duration = 0;
            $scope.heightDialogVideo = 550;
            $scope.widthDialogVideo = 1170;
            ngDialog.open({
                template: 'secondDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope
            });
        };

        $scope.donate = function(idPub){
            $scope.user.portefeuille += 1;
            $http.put('/api/users/' + $scope.user._id, $scope.user).success(function(data){
                $scope.user = data;
                $rootScope.currentUser = data;
                updatePub(idPub);
            });
        };

        $scope.donateImage = function(url){
            var images =  $scope.user.annonces;
            for (var i = 0; i < images.length; i++) {
                if (!images[i].url.localeCompare(url)) {
                    var check = $scope.user.annonces[i].check;
                    var id = $scope.user.annonces[i].id;
                    var index = i;
                    break;
                }
            }
            if(!check){
                $scope.user.annonces[index].check = true;
                $scope.user.portefeuille += 1;
                $http.put('/api/users/' + $scope.user._id, $scope.user).success(function(data){
                    $scope.user = data;
                    $rootScope.currentUser = data;
                    updatePub(id);
                });
            }
        };

        function updatePub(idPub){
            $http.get('/api/annonceurs/pub', {params: {id_pub: idPub}}).success(function(ann){
                var annonceur = ann;
                var pubs = ann.pub;
                for (var i = 0; i < pubs.length; i++) {
                    if (!pubs[i].id.localeCompare(idPub)) {
                        annonceur.pub[i].budget -= 1;
                        break;
                    }
                }
                $http.put('/api/annonceurs/' + annonceur._id, annonceur);
            });
        }

        $scope.pageClass = 'fadeZoom';
    }]);
