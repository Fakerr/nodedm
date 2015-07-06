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

        $scope.$on('youtube.player.ended', function ($event, player) {
            $scope.donate();
            $scope.url = player.getVideoUrl();
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
           // $window.location.href = 'https://www.apple.com/tn/iphone-6/';
           // $rootScope.currentUser.portefeuille ++;
            $scope.user.portefeuille += 1;
            $http.put('/api/users/' + $scope.user._id, $scope.user).success(function(data){
                $scope.user = data;
                $rootScope.currentUser = data;
            });
        };

        $http.get('/api/user', {params: {id: $rootScope.currentUser._id}})
            .success(function (data) {
                $scope.user = data;
                $scope.userName = data.name;
                $scope.ann = data.annonces;
                //Exemple de videos à génerer à partir de la base.
                $scope.videos = data.annoncesVideos;
                /*angular.forEach(data.annoncesVideos, function(value) {
                 if(value.check == false){
                 $scope.videos = value ;
                 }
                 });*/

            }).error(function (err) {
                console.log(err, 'error user !!');
            });

        $scope.pageClass = 'fadeZoom';
    }]);
