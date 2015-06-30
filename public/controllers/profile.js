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

        $http.get('/api/user', {params: {id: $rootScope.currentUser._id}})
            .success(function (data) {
                $scope.userName = data.name;
                $scope.ann = data.annonces;
                //$scope.pub = data.annonces[0];
                $scope.videos = [
                    "https://www.youtube.com/embed/0NycEiHOeX8",
                    "https://www.youtube.com/embed/6AytbSdWBKg",
                    "https://www.youtube.com/embed/R4-YdC5N6Lo",
                    "https://www.youtube.com/embed/15R7I5cH6QA"
                ];

            }).error(function (err) {
                console.log(err, 'error user !!');
            });

        $scope.pageClass = 'fadeZoom';
    }]);
