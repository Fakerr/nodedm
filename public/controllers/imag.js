angular.module('MyApp')
    .controller('SearchCtrl', ['$scope', 'image','$rootScope', function ($scope, image,$rootScope) {

        $scope.img = '';
        $scope.select = {cible: ''};  /*fix undefined cible problem(coz ngRepeat scope)*/

        $scope.fileNameChanged = function (element) {
            $scope.imagePub = element.files[0];
            $scope.img = $scope.imagePub.name;
        };

        $scope.imag = function () {
            image.imag({
                email: $rootScope.currentUser.email,
                type: $scope.selection,
                nom_pub: $scope.name,
                categorie: $scope.select.cible,
                nb_max: 15,
                montant: $scope.prix,
                marque: $scope.marque,
                budget: $scope.budget,
                lienExterne: $scope.url.replace("?v=","/"),
                url: $scope.img
            });
            $scope.img = '';
        };

        $scope.pageClass = 'fadeZoom';
        $scope.cibleAn = [
            {"name":"Maison","array":["cuisine","salleDeBain","meuble","accessoire","jardin","produit"]},
            {"name":"Cosmetique","array":["produitAllergie","maquillage","antiRide","shampooing","parfun","cremeSoin","centreEsthetique"]},
            {"name":"Bebe","array":["babySitting","prduitMaternite","produitBebe"]},
            {"name":"Accessoires","array":["valise","montre","bijoux","chapeau","cravate"]},
            {"name":"Habit","array":["chassureFemme","chassureHomme","soiree","costume","vetementFemme","vetementHomme"]},
            {"name":"Sport","array":["salleSport","chasse","athletisme","vetement"]},
            {"name":"IT","array":["ordinateur","accessoirePC","cableUSB","infoProf","smartphone","bureau","logiciel","jeuxVideo","operateur"]},
            {"name":"Electromenager","array":["cuisson","laveLinge","laveVaisselle","froid","machineCafe","petitDej","aspirateur","repassage","culinaire"]},
            {"name":"Alimentation","array":["boissonSansAlcool","BoissonAlcoolose","eau","prduitLaitier","chocolat","produitBio","produitDietetiq"]},
            {"name":"Etablissement","array":["garderie","ecole","LycePrive","UnivPrive","agenceVoyage","restaurant","fastfood","salonThe","supermarche",]},
            {"name":"Voyage","array":["croisiere","tourismeCulturel","TourismeMer","TourismeMontagne"]},
            {"name":"Auto & Voiture","array":["moto","voitureFamille","voiturePetite","voitureHautGamme","camion"]},
            {"name":"Construction","array":["construction"]},
            {"name":"Loisir","array":["intrumentMusique","musique","cinema","livre","theatre","concert"]}];
    }]);


