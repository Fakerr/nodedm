/* Discount should be used with configurable  variable */

angular.module('MyApp')
    .controller('ProfileCtrl', ['$scope', '$http', '$rootScope', 'ngDialog', function ($scope, $http, $rootScope, ngDialog) {

        var player1;
        var timeAct;
        var videoLong;
        //Dimension video dans la page profile.
        $scope.heightVideo = 280;
        $scope.widthVideo = 375;
        //Dimension image dans profile.
        $scope.heightImage = 280;
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

        $scope.$on('youtube.player.ready', function ($event, player) {
            videoLong = player.getDuration();
            timeAct = 0;
        });

        $scope.$on('youtube.player.playing', function ($event, player) {
            player1 = player;
            $scope.duration = videoLong - timeAct;
            $scope.show = true;
        });

        $scope.$on('youtube.player.paused', function ($event, player) {
            $scope.show = false;
            timeAct = player.getCurrentTime();
        });


        $scope.$on('youtube.player.ended', function ($event, player) {
            // modif boolean check and update $scope.user
            $scope.show = false;
            videoLong = player.getDuration();
            timeAct = 0;
            player.stopVideo();
            player.playVideo();
            player.pauseVideo();
            var vid = $scope.user.annoncesVideos;
            var lien = player.getVideoUrl();
            var res = lien.replace("?v=", "/");
            for (var i = 0; i < vid.length; i++) {
                if (!vid[i].url.localeCompare(res)) {
                    var videoCheck = $scope.user.annoncesVideos[i].check;
                    var id = $scope.user.annoncesVideos[i].id;
                    var c = i;
                    break;
                }
            }
            if (!videoCheck) {
                $scope.user.annoncesVideos[c].check = true;
                $scope.donate(id);
            }
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

        $scope.donate = function (idPub) {
            $scope.user.portefeuille += 1;
            $http.put('/api/users/' + $scope.user._id, $scope.user).success(function (data) {
                $scope.user = data;
                $rootScope.currentUser = data;
                $scope.videos = data.annoncesVideos;
                updatePub(idPub);
            });
        };

        $scope.donateImage = function (url) {
            var images = $scope.user.annonces;
            for (var i = 0; i < images.length; i++) {
                if (!images[i].url.localeCompare(url)) {
                    var check = $scope.user.annonces[i].check;
                    var id = $scope.user.annonces[i].id;
                    var index = i;
                    break;
                }
            }
            if (!check) {
                $scope.user.annonces[index].check = true;
                $scope.user.portefeuille += 1;
                $http.put('/api/users/' + $scope.user._id, $scope.user).success(function (data) {
                    $scope.user = data;
                    $rootScope.currentUser = data;
                    $scope.ann = data.annonces;

                    /* $window.localStorage.token = data.token;
                     var token = data.token;
                     if (token) {
                     var payload = JSON.parse($window.atob(token.split('.')[1]));
                     //takes a JSON-formatted string and converts it to a JavaScript object
                     //window.atob: encoder
                     $rootScope.currentUser = payload.user;
                     }*/
                    updatePub(id);
                });
            }
        };

        function updatePub(idPub) {
            $http.get('/api/annonceurs/pub', {params: {id_pub: idPub}}).success(function (ann) {
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

        var hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        function handleVisibilityChange() {
            if (!document[hidden]) {
                $scope.$broadcast('timer-start');
                player1.playVideo();
            } else {
                $scope.$broadcast('timer-stop');
                player1.pauseVideo();
            }
        }

        document.addEventListener(visibilityChange, handleVisibilityChange, false);
        $scope.pageClass = 'fadeZoom';

    }]);
