angular.module('MyApp')
    .controller('logUserCtrl', ['$scope', '$http', '$rootScope', 'ngDialog','$window', function ($scope, $http, $rootScope, ngDialog, $window){

        var timeAct;
        var videoLong;
        $scope.playerVars = {
            controls: 0
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
            $scope.pub = image.url;
            $scope.lien = image.lienExterne;
            ngDialog.open({
                template: 'firstDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope
            });
        };

        $scope.openVideo = function (video) {
            $scope.pubVideo = video;
            $scope.show = false;
            $scope.heightDialogVideo = 550;
            $scope.widthDialogVideo = 1170;
            ngDialog.open({
                template: 'secondDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope
            });
        };
    }]);

