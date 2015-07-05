angular.module('MyApp')
    .controller('ProfileCtrl', ['$scope', '$http', '$rootScope','ngDialog','$window', function ($scope, $http, $rootScope,ngDialog,$window) {

        //Dimension video dans la page profile.
        $scope.heightVideo = 280;
        $scope.widthVideo = 400;
        //Dimension image dans profile.
        $scope.heightImage= 280;
        $scope.widthImage = 380;

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
                $scope.videos = [
                    "https://www.youtube.com/embed/oYOKp9j-_yY?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=oYOKp9j-_yY",
                    "https://www.youtube.com/embed/0NycEiHOeX8?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=0NycEiHOeX8",
                    "https://www.youtube.com/embed/6AytbSdWBKg?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=6AytbSdWBKg",
                    "https://www.youtube.com/embed/R4-YdC5N6Lo?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=R4-YdC5N6Lo",
                    "https://www.youtube.com/embed/15R7I5cH6QA?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=15R7I5cH6QA",
                    "https://www.youtube.com/embed/lC1pBoxvpzw?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=lC1pBoxvpzw"
                      ];
            }).error(function (err) {
                console.log(err, 'error user !!');
            });

        $scope.pageClass = 'fadeZoom';
    }]);
