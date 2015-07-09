angular.module('MyApp')
    .controller('SearchCtrl', ['$scope', 'image', function ($scope, image) {
        $scope.cibles = {
            Transport: false,
            Cosmetique: false,
            Habitation: false,
            Sports: false,
            Mode: false,
            Boisson: false
        };

        $scope.fileNameChanged = function (element) {
            $scope.img = element.files[0];
        };

        $scope.imag = function () {
            //console.log('123');
            image.imag({
                name: $scope.name,
                prix: $scope.prix,
                marque: $scope.marque,
                cibles: $scope.cibles,
                image: $scope.img.name
            });
        };
        $scope.pageClass = 'fadeZoom';
        $scope.cibleAn2 = [];
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


