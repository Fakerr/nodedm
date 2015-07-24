angular.module('MyApp')
    .controller('SearchCtrl', ['$scope', 'image', '$rootScope','Upload', function ($scope, image, $rootScope,Upload) {

        $scope.img = '';
        $scope.select = {cible: ''};
        /*fix undefined cible problem(coz ngRepeat scope)*/
        $scope.lacible = "";

        $scope.upload = function (files) {
            if (files && files.length) {
                var file = files[0];
                $scope.img = file.name;
                Upload.upload({
                    url: 'upload/picture',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                }).error(function (data, status, headers, config) {
                })
            }
        };


        $scope.imag = function () {
            $scope.upload($scope.files);
            image.imag({
                email: $rootScope.currentUser.email,
                type: $scope.selection,
                nom_pub: $scope.name,
                categorie: $scope.select.cible,
                nb_max: 15,
                montant: $scope.prix,
                marque: $scope.marque,
                lienExterne: $scope.url,
                url: $scope.img,
                numCompte: $scope.NumCompte,
                passwd: $scope.passwd
            });
            $scope.img = '';
            $scope.selection = '';
            $scope.name = '';
            $scope.select = {cible: ''};
            $scope.marque = '';
            $scope.budget = '';
            $scope.url = '';
        };
        $scope.pageClass = 'fadeZoom';
        $scope.cibleAn = [

            {"name": "Maison", "array": ["cuisine", "salleDeBain", "meuble", "accessoire", "jardin", "produit"]},
            {
                "name": "Cosmetique",
                "array": ["produitAllergie", "maquillage", "antiRide", "shampooing", "parfun", "cremeSoin", "centreEsthetique"]
            },
            {"name": "Bebe", "array": ["babySitting", "prduitMaternite", "produitBebe"]},
            {"name": "Accessoires", "array": ["valise", "montre", "bijoux", "chapeau", "cravate"]},
            {
                "name": "Habit",
                "array": ["chassureFemme", "chassureHomme", "soiree", "costume", "vetementFemme", "vetementHomme"]
            },
            {"name": "Sport", "array": ["salleSport", "chasse", "athletisme", "vetement"]},
            {
                "name": "IT",
                "array": ["ordinateur", "accessoirePC", "cableUSB", "infoProf", "smartphone", "bureau", "logiciel", "jeuxVideo", "operateur"]
            },
            {
                "name": "Electromenager",
                "array": ["cuisson", "laveLinge", "laveVaisselle", "froid", "machineCafe", "petitDej", "aspirateur", "repassage", "culinaire"]
            },
            {
                "name": "Alimentation",
                "array": ["boissonSansAlcool", "BoissonAlcoolose", "eau", "prduitLaitier", "chocolat", "produitBio", "produitDietetiq"]
            },
            {
                "name": "Etablissement",
                "array": ["garderie", "ecole", "LycePrive", "UnivPrive", "agenceVoyage", "restaurant", "fastfood", "salonThe", "supermarche",]
            },
            {"name": "Voyage", "array": ["croisiere", "tourismeCulturel", "TourismeMer", "TourismeMontagne"]},
            {
                "name": "Auto & Voiture",
                "array": ["moto", "voitureFamille", "voiturePetite", "voitureHautGamme", "camion"]
            },
            {"name": "Construction", "array": ["construction"]},
            {"name": "Loisir", "array": ["intrumentMusique", "musique", "cinema", "livre", "theatre", "concert"]}];

    }]);