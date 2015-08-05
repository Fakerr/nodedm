//fichier du controlleur pour la page annonceurs.html

angular.module('MyApp')
    .controller("AnnoncerAdminCtrl", ['$scope', '$http', 'ngDialog', '$window', function ($scope, $http, ngDialog, $window) {
        $scope.showForm = false;
        $scope.showFormDialog = false;

        //la requete pour la recupération de la liste des annonceurs dés le départ
        $http.get("/contactlist").success(function (response) {
            var tab = [];
            var i = 0;
            for (i = 0; i < response.length; i++) {
                var x = 0;
                en = {
                    name: response[i].name,
                    budget: 0,
                    email: response[i].email,
                    password: response[i].password,
                    pu: response[i].pub,
                    nombre: response[i].pub.length,
                    pub: response[i].pub,
                    _id: response[i]._id
                }
                tab[i] = en;
            }

            $scope.list_annonceur = tab;

        });


// la fonction pour afficher la liste des annonces pour un annonceur particulier
        $scope.aff = function (pu) {
            $http.put("/publist/", pu).success(function (response) {

                var i, j, c;
                var k = -1;
                var r = [];
                var pl = [];
                for (i = 0; i < response.length; i++) {
                    pl = response[i].pubs;
                    for (c = 0; c < pl.length; c++) {
                        for (j = 0; j < pu.length; j++) {
                            if (pu[j].id_pub == pl[c].id) {
                                k = k+1;
                                r[k] = pl[c];
                            }
                        }
                    }
                }
                $scope.publ = r;
                var html = '<div class="container">' +
                    '<h1>Liste des Pubs de ' + $scope.publ[0].annonceur + '</h1>' +
                        '<h3><input type="text" class="form-control" ng-model="query2"></h3>'+
                    '<table class="table thetable">' +
                    '<thead>' +
                    '<tr>' +
                    '<th>id</th>' +
                    '<th>nom</th>' +
                    '<th>marque</th>' +
                    '<th>montant</th>' +
                    '<th>nb_vues</th>' +
                    '<th>nb_max </th>' +
                    '<th>type</th>' +
                    '<th>Lien</th>' +
                    '<th>URL</th>' +
                    '<th>Actions</th><th></th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    '<tr ng-show="showFormDialog">' +
                    '<td><input class="form-control" ng-model="pub.id"></td>' +
                    '<td><input class="form-control" ng-model="pub.name"></td>' +
                    '<td><input class="form-control" ng-model="pub.marque"></td>' +
                    '<td><input class="form-control" ng-model="pub.montant"></td>' +
                    '<td><input class="form-control" ng-model="pub.nb_utilisation"></td>' +
                    '<td><input class="form-control" ng-model="pub.nb_max"></td>' +
                    '<td><input class="form-control" ng-model="pub.type"></td>' +
                    '<td><input class="form-control" ng-model="pub.lienExterne"></td>' +
                    '<td><input class="form-control" ng-model="pub.url"></td>' +
                    '<td><button class="btn btn-primary" ng-click="update_pub()">Actualiser</button></td>' +
                    '</tr>';


                html +=
                    '<tr ng-repeat="p in publ |filter: query2" >' +
                    '<td>{{p.id}}</td>' +
                    '<td>{{p.name}}</td>' +
                    '<td>{{p.marque}}</td>' +
                    '<td>{{p.montant}}</td>' +
                    '<td>{{p.nb_utilisation}}</td>' +
                    '<td>{{p.nb_max}}</td>' +
                    '<td>{{p.type}}</td>' +
                    '<td>{{p.lienExterne}}</td>' +
                    '<td>{{p.url}}</td>' +
                    '<td><button class="btn btn-warning" ng-click="edit_pub(p.id)">Modifier</button></td>' +
                    '<td><button class="btn btn-danger" ng-click="remove_pub(p.id)">Supprimer</button></td>' +
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
                    className:'ngdialog-theme-plain'
                });


            });


        };


//la fonction qui supprime un annonceur
        $scope.remove = function (id) {
            $http.delete("/contactlist/" + id).success(function (response) {
                $window.location.reload();
            });
        };


//la fonction qui supprime une annonce
        $scope.remove_pub = function (id) {

            $http.delete("/ann/" + id).success(function (response) {

                window.location.reload();

            });


        };


//la fontion qui modifie un annonceur
        $scope.edit = function (id) {

            $scope.showForm = true;
            $http.get("/contactlist/" + id).success(function (response) {
                en = {
                    name: response.name,
                    email: response.email,
                    password: response.password,
                    pu: response.pub,
                    nombre: response.pub.length,
                    pub: response.pub,
                    _id: response._id
                }


                $scope.annonceur = en;

            });
        };


//la fonction qui met à jour la base aprés avoir modifier les données d'un annonceur
        $scope.update = function () {
            $http.put("/contactlist/" + $scope.annonceur._id, $scope.annonceur).success(function (response) {
                $window.location.reload();
                $scope.showForm = false;
            })
        };

//la fonction qui vide le champ de texte
        $scope.clear = function () {
            $scope.annonceur = "";
        };
//la fonction qui met à jour la base de données aprés avoir modifier une annonce
        $scope.update_pub = function () {
            $http.put("/plist/" + $scope.pub.id, $scope.pub).success(function (response) {
                $window.location.reload();
                $scope.showFormDialog = false;
            })
        };


//la fonction qui modifie les parametres d'une annonce
        $scope.edit_pub = function (id) {

            $scope.showFormDialog = true ;
            $http.get("/plist/" + id).success(function (response) {
                var t = [];
                var i;
                for (i = 0; i < response.pubs.length; i++) {

                    if (response.pubs[i].id == id) {
                        t = response.pubs[i];
                    }
                }
                $scope.pub = t;

            });
        };

    }]);





