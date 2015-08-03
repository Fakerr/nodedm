// le fichier du controlleur pour la page utilisateur.html

angular.module('MyApp')
    .controller("UserAdminCtrl", ['$scope', '$http', 'ngDialog', '$window', function ($scope, $http, ngDialog, $window) {

//la requete pour la recupération de la liste des utilisateur des le chargement de la page
        $scope.showForm = false;
        $http.get('/userlist').success(function (response) {
            var tab = [];
            var i = 0;
            for (i = 0; i < response.length; i++) {

                var x = 0;


                en = {
                    name: response[i].Nom,
                    portefeuille: response[i].portefeuille,
                    email: response[i].email,
                    password: response[i].password,
                    sexe: response[i].Sexe,
                    age: response[i].Age,
                    images: response[i].annonces,
                    videos: response[i].annoncesVideos,
                    _id: response[i]._id
                }
                tab[i] = en;
            }

            $scope.list_utilisateur = tab;
            console.log(tab);

        });

// la fonction qui se charge de l'affichage des publicités visités par l'utilisateur (pop up)

        $scope.clickToOpen = function (ut) {


            console.log(ut);
            var pub = [];
            var l = -1;
            var k = 0;

            for (k = 0; k < ut.images.length; k++) {
                l++;
                pub[l] = ut.images[k];
            }
            ;


            for (k = 0; k < ut.videos.length; k++) {
                l++;
                pub[l] = ut.videos[k];
            }
            ;
            var html = '<div class="container">' +
                '<h1>Liste des annonces consultées</h1>' +
                '<h3><input type="text" class="form-control" ng-model="query"></h3>'+
                '<table class="table">' +
                '<thead>' +
                '<tr>' +
                '<th>Nom</th>' +
                '<th>Marque</th>' +
                '<th>Annonceur</th>' +
                '<th>Type</th>' +
                '<th>URL</th>' +
                '<th>Lien Externe </th>' +
                '</tr>' +
                '</thead>' +
                '<tbody>';

            $scope.publ = pub;
            html +=
                '<tr ng-repeat="p in publ|filter: query track by $index" >' +
                '<td>{{p.name}}</td>' +
                '<td>{{p.marque}}</td>' +
                '<td>{{p.annonceur}}</td>' +
                '<td>{{p.type}}</td>' +
                '<td>{{p.url}}</td>' +
                '<td>{{p.lienExterne}}</td>' +
                '</tr>';


            html += '</tbody>' +
                '</table>' +
                '</div>';


            ngDialog.open({
                template: '<center >' +
                html +
                '</center>',
                plain: 'true',
                overlay: false,
                scope: $scope,
                className: 'ngdialog-theme-plain'
            });


        };


// la fonction qui supprime un utilisateur

        $scope.remove = function (id) {
            $http.delete("/userlist/" + id).success(function (response) {
                $window.location.reload();
            });
        };


// la fonction qui permet de modifier les données d'un utilisateur

        $scope.edit = function (id) {
            $scope.showForm = true;
            $http.get("/userlist/" + id).success(function (response) {


                en = {
                    name: response.Nom,
                    email: response.email,
                    password: response.password,
                    sexe: response.Sexe,
                    age: response.Age,
                    portefeuille: response.portefeuille,
                    _id: response._id
                }
                $scope.utilisateur = en;
            });
        };


// la fonction qui permet de mettre à jour un utilisateur aprés avoir modifier ses paramétres
        $scope.update = function () {

            $http.put("/userlist/" + $scope.utilisateur._id, $scope.utilisateur).success(function (response) {
                $window.location.reload();
                $scope.showForm = false;
            })
        };

        $scope.clear = function () {
            $scope.utilisateur = "";
        };

        $scope.update_pub = function () {
            $http.put("/plist/" + $scope.pub.id, $scope.pub).success(function (response) {
                $window.location.reload();
            })
        };

    }]);





