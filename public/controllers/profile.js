angular.module('MyApp')
    .controller('ProfileCtrl', ['$scope', '$http', '$rootScope','ngDialog','$window', function ($scope, $http, $rootScope,ngDialog,$window,youtubeEmbedUtils) {

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


        $scope.$on('youtube.player.ended', function ($event, player) {
            // modif boolean check and update $scope.user
            var vid = $scope.user.annoncesVideos;
            var lien = player.getVideoUrl();
            var res =  lien.replace("?v=","/");
            for (var i = 0; i < vid.length; i++) {
                if (!vid[i].url.localeCompare(res)) {
                    $scope.user.annoncesVideos[i].check = true;
                    break;
                }
            }
            $scope.donate();
            //player.playVideo();
        });


        $scope.open = function (image) {
            $scope.pub = image;
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
            $scope.heightDialogVideo = 550;
            $scope.widthDialogVideo = 1170;
            ngDialog.open({
                template: 'secondDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope
            });
        };

        $scope.donate = function(){
           /* delete $window.localStorage.token;
            $rootScope.currentUser = null;*/
            $scope.user.portefeuille += 1;

            $http.put('/api/users/' + $scope.user._id, $scope.user).success(function(data){
                $scope.user = data;
               // $window.localStorage.token = data.token;
                $rootScope.currentUser = data;
            });
        };

        $scope.pageClass = 'fadeZoom';
    }]);
