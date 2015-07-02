angular.module('MyApp')
    .controller('ProfileCtrl', ['$scope', '$http', '$rootScope','ngDialog', function ($scope, $http, $rootScope,ngDialog) {

        $scope.pageClass = 'fadeZoom';

       /* $scope.change = function (image) {
            $scope.pub = image;
        };*/

        $scope.open = function (image) {
            $scope.pub = image;
            ngDialog.open({
                template: 'firstDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope
            });
        };

        $scope.openVideo = function (video) {
            $scope.pubVideo = video;
            ngDialog.open({
                template: 'secondDialog',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                scope: $scope
            });
        };

        $http.get('/api/user', {params: {id: $rootScope.currentUser._id}})
            .success(function (data) {
                $scope.userName = data.name;
                $scope.ann = data.annonces;
                //$scope.pub = data.annonces[0];
                $scope.videos = [
                    "https://www.youtube.com/embed/0NycEiHOeX8?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=0NycEiHOeX8",
                    "https://www.youtube.com/embed/6AytbSdWBKg?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=6AytbSdWBKg",
                    "https://www.youtube.com/embed/R4-YdC5N6Lo?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=R4-YdC5N6Lo",
                    "https://www.youtube.com/embed/15R7I5cH6QA?autoplay=0&amp;controls=0&amp;loop=1&amp;showinfo=0&amp;modestbranding=1&amp;disablekb=1&amp;enablejsapi=1&amp;playlist=15R7I5cH6QA"
                      ];

            }).error(function (err) {
                console.log(err, 'error user !!');
            });

        $scope.pageClass = 'fadeZoom';
    }]);
