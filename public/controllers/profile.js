/* Discount should be used with configurable  variable */

angular.module('MyApp')
    .controller('ProfileCtrl', ['$scope', '$http', '$rootScope', 'ngDialog','$window', function ($scope, $http, $rootScope, ngDialog, $window) {

        var player1;
        var timeAct;
        var videoLong;
        $scope.playerVars = {
            controls: 0
        };
        $scope.ann = [];
        $scope.videos = [];

        $http.get('/categories/annonces', {params: {cat: $rootScope.currentUser.Categories}})
            .success(function (data) {
                data.forEach(function (categorie) {
                    categorie.pubs.forEach(function (pub, index) {
                        if (pub.type == "video") {
                            var a = categorie.pubs[index];
                            a.categorie = categorie.categorie;
                            $scope.videos.push(a);
                        } else {
                            $scope.ann.push(categorie.pubs[index]);
                        }
                    });
                });
            }).error(function (err) {
                console.log(err, 'error get categories !!');
            });

        $scope.check = function (video) {
            for (var i = 0; i < $rootScope.currentUser.annoncesVideos.length; i++) {
                if (!$rootScope.currentUser.annoncesVideos[i].lienExterne.localeCompare(video.lienExterne)) {
                    return true;
                    break;
                }
            }
            return false;
        };

        $scope.checked = function (image) {
            for (var i = 0; i < $rootScope.currentUser.annonces.length; i++) {
                if (!$rootScope.currentUser.annonces[i].lienExterne.localeCompare(image.lienExterne)) {
                    return true;
                    break;
                }
            }
            return false;
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

        $scope.$on('youtube.player.paused', function ($event, player) {
            $scope.show = false;
            timeAct = player.getCurrentTime();
        });


        $scope.$on('youtube.player.ended', function ($event, player) {
            // modif boolean check and update $rootScope.currentUser
            $scope.show = false;
            videoLong = player.getDuration();
            timeAct = 0;
            player.stopVideo();
            player.playVideo();
            player.pauseVideo();
            var vid = $scope.videos;
            var lien = player.getVideoUrl();
           //var res = lien.replace("?v=", "/");
            for (var i = 0; i < vid.length; i++) {
                if (!vid[i].lienExterne.localeCompare(lien)) {
                    if (!$scope.check($scope.videos[i])) {
                        $rootScope.currentUser.annoncesVideos.push($scope.videos[i]);
                        console.log("HIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII");
                        console.log($rootScope.currentUser.annoncesVideos);
                        $scope.donate($scope.videos[i]);
                    }
                    break;
                }
            }
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
            // $scope.duration = 0;
            $scope.heightDialogVideo = 550;
            $scope.widthDialogVideo = 1170;
            ngDialog.open({
                template: 'secondDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope
            });
        };

        $scope.donate = function (pub) {
            console.log("--------------***********************---------");
            console.log(pub);
            $rootScope.currentUser.portefeuille += 1;
            $http.get('/api/annonces/pub', {params: {id_pub: pub.id, categorie:pub.categorie}}).success(function (ann) {
            });
            $http.put('/api/users/' + $rootScope.currentUser._id, $rootScope.currentUser).success(function (data) {
                $window.localStorage.token = $window.localStorage.token = btoa(JSON.stringify($rootScope.currentUser));
            });
        };

        $scope.donateImage = function (url) {
            var images = $scope.ann;
            for (var i = 0; i < images.length; i++) {
                if (!images[i].url.localeCompare(url)) {
                    if (!$scope.checked(images[i])) {
                        $rootScope.currentUser.annonces.push(images[i]);
                        $scope.donate(images[i]);
                    }
                    break;
                }
            }
        };

        function updatePub(idPub,categ) {
            $http.get('/api/annonces/pub', {params: {categorie:categ,id_pub: idPub}}).success(function (ann) {
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
