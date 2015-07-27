var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var crypto = require('crypto');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var moment = require('moment');
var async = require('async');
var request = require('request');
var xml2js = require('xml2js');
var agenda = require('agenda')({db: {address: 'localhost:27017/test'}});
var sugar = require('sugar');
var nodemailer = require('nodemailer');
var _ = require('lodash');
var autoIncrement = require('mongoose-auto-increment');
var tokenSecret = 'your unique secret';
var uuid = require('node-uuid');
multiparty = require('multiparty');
fs = require('fs');
var formidable = require('formidable');
var arff = require('node-arff');
var spawn = require('child_process').spawn;
var _ = require('underscore');
var util = require('util');
var fakery = require('mongoose-fakery');
var paypal = require('paypal-rest-sdk');
var Paypal1 = require('paypal-adaptive');
var session = require('express-session');
var shortid = require('shortid');
var busboy = require('connect-busboy');


var administrateurSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true, lowercase: true, trim: true},
    password: String,
    type: String
});
var connection = mongoose.createConnection("mongodb://localhost");
var videoPub = new mongoose.Schema({
    id: String,
    url: String,
    check: Boolean
});

var imageSchema = new mongoose.Schema({
    id: String,
    name: {type: String, unique: true, lowercase: true, trim: true},
    cible: Array,
    prix: Number,
    marque: String,
    url: String
});

var image2Schema = new mongoose.Schema({
    id: Number,
    question: String,
    categorie: String
});

var annoncesSchema = new mongoose.Schema({
    categorie: String,
    pubs: []
});

var annonceurSchema = new mongoose.Schema({
    name: {type: String, trim: true, required: true},
    email: {type: String, unique: true, lowercase: true, trim: true},
    password: String,
    type: String,
    pub: []
});

var userSchema = new mongoose.Schema({
    Nom: {type: String, trim: true, required: true},
    email: {type: String, unique: true, lowercase: true, trim: true},
    password: String,
    type: String,
    facebook: {
        id: String,
        email: String
    },
    google: {
        id: String,
        email: String
    },
    fulfil1: Boolean,
    fulfil2: Boolean,
    Prenom: String,
    Sexe: String,
    Age: Number,
    portefeuille: Number,
    type: String,
    Statut_social: String,
    Nombre_enfants: Number,
    Niveau_Etude: String,
    Profession: String,
    Salaire: Number,
    Langues: [{langue: String}],
    Poids: Number,
    Taille: Number,
    IMC: Number,
    Allergies: [{allergie: String}],
    Maladies: [{maladie: String}],
    Frequence_voyages: Number,
    Types_voyages: String,
    Budget_voyages: Number,
    Direction: String,
    Duree_voyages: Number,
    Type_hebergement: String,
    Compagnie: String,
    Types_reservation: String,
    Age_ordinateur: Number,
    Marque_ordinateur: String,
    Prix_ordinateur: Number,
    Age_telephone: Number,
    Marque_tele: String,
    Prix_tele: Number,
    Lieu_achat: String,
    Operateurs_tel: [{op: String}],
    Choix_operateur: String,
    Type_offre: String,
    Type_connexion_internet: String,
    Fournisseur_internet: String,
    Sports: [{Sport: String}],
    Budget_sport: Number,
    Frequence_sport: Number,
    Endroit_sport: String,
    Niveau_Sport: String,
    Sports_regardes: [{Sport: String}],
    Comment: String,
    Type_abonnement: String,
    Utilisation_produits_cosmétiques: Number,
    Marques: [{Marque: String}],
    Frequence_utilisation: Number,
    Critere_choix: String,
    Frequence_achat: Number,
    Lieu_achat_produits_cosmetiques: String,
    Tester_produit: Number,
    Salons_esthetiques: Number,
    Frequence_salon_esthetiques: Number,
    Styles_vetement: [{Style: String}],
    Styles_chaussures: [{Style: String}],
    Budget: Number,
    Critere_choix_habits: [{Critere: String}],
    maniere_achat: String,
    hebergement: String,
    status: String,
    Etat_hebergement: String,
    style_hebergement: String,
    source_inspiration_hebergement: String,
    Boissons: [{type: String, marque: String, frequence: String, Budget: Number, lieu: String}],
    budget_carburants: Number,
    type_carburant: String,
    Station_de_services: String,
    Transport_publique: [{type: String, frequence: Number, dest: String}],
    Categories: [],
    Mode_payement: String,
    annonces: [],
    annoncesVideos: []
});

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ARXi5KtJpLv0xpGdOM3iZNzoLNFHRG4wSmM7vlOjIirp3zBD--53lDKicwxwr-wwAgqcHDCFD749gF_S',
    'client_secret': 'EP_uhxXQab5aBvYkEpz2UAYSjP9n3WSaNuM7rU_2TcOzQZxhu2G7E8w8hyKWh98_NuNWv9UpDal95bXI'
});
var card_data = {
    "type": "visa",
    "number": "4032039278059607",
    "expire_month": "08",
    "expire_year": "2020",
    "cvv2": "123",
    "first_name": "Joe",
    "last_name": "Shopper"
};

paypal.creditCard.create(card_data, function (error, credit_card) {
    if (error) {
        console.log(error + 'erreur');
        // throw error;
    } else {
        // console.log("Create Credit-Card Response");
        // console.log(credit_card);
    }
})

userSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

annonceurSchema.pre('save', function (next) {
    var annonceur = this;
    if (!annonceur.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(annonceur.password, salt, function (err, hash) {
            if (err) return next(err);
            annonceur.password = hash;
            next();
        });
    });
});


annoncesSchema.pre('save', function (next) {
    var annonce = this;
    next();
});

administrateurSchema.pre('save', function (next) {
    var administrateur1 = this;
    if (!administrateur1.isModified('password')) return next();
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(administrateur1.password, salt, function (err, hash) {
            if (err) return next(err);
            administrateur1.password = hash;
            next();
        });
    });
});


imageSchema.pre('save', function (next) {
    var imagePub = this;
    next();
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

annonceurSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

administrateurSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);
var Annonceur = mongoose.model('Annonceur', annonceurSchema);
var ImagePub = mongoose.model('ImagePub', imageSchema);
var ImageAdmin = mongoose.model('ImageAdmin', image2Schema);
var Annonce = mongoose.model('Annonce', annoncesSchema);
var Administrateur1 = mongoose.model('Administrateur1', administrateurSchema);
var connection = mongoose.createConnection("mongodb://localhost");
mongoose.connect('localhost');
autoIncrement.initialize(connection);
image2Schema.plugin(autoIncrement.plugin, 'ImageAdmin');

var app = express();


app.set('port', process.env.PORT || 8080);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy());
var data;

function ensureAuthenticated(req, res, next) {
    if (req.headers.authorization) {
        var token = req.headers.authorization.split(' ')[1];
        try {
            var decoded = jwt.decode(token, tokenSecret);
            if (decoded.exp <= Date.now()) {
                res.send(400, 'Access token has expired');
            } else {
                req.user = decoded.user;
                return next();
            }
        } catch (err) {
            return res.send(500, 'Error parsing token');
        }
    } else {
        return res.send(401);
    }
}

function createJwtToken(user) {
    var payload = {
        user: user,
        iat: new Date().getTime(),
        exp: moment().add('days', 7).valueOf()
    };
    return jwt.encode(payload, tokenSecret);
}

app.post('/auth/signup', function (req, res, next) {
    var type = req.body.type;
    if (!type.localeCompare("client")) {
        var user = new User({
            Nom: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type,
            portefeuille: 0,
            fulfil1: false,
            fulfil2: false
        });
        user.save(function (err) {
            if (err) return next(err);
            res.sendStatus(200);
        });
    } else if (!type.localeCompare("annonceur")) {
        var ann = new Annonceur({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            type: req.body.type
        });
        ann.save(function (err) {
            if (err) return next(err);
            res.sendStatus(200);
        });
    }
});

app.post('/auth/login', function (req, res, next) {
    Annonceur.findOne({email: req.body.email}, function (err, ann) {
        if (!ann) {
            User.findOne({email: req.body.email}, function (err, user) {
                if (!user) {
                    Administrateur1.findOne({email: req.body.email}, function (err, adminis) {
                        if (!adminis) res.send(401, 'Invalid email and/or password');
                        else {
                            adminis.comparePassword(req.body.password, function (err, isMatch) {

                                if (!isMatch) return res.send(401, 'Invalid email and/or password');
                                var token = createJwtToken(adminis);
                                res.send({token: token});
                            });
                        }
                    });

                } else {
                    user.comparePassword(req.body.password, function (err, isMatch) {

                        if (!isMatch) return res.send(401, 'Invalid email and/or password');
                        var token = createJwtToken(user);
                        res.send({token: token});
                    });
                }
            });
        } else {
            ann.comparePassword(req.body.password, function (err, isMatch) {
                if (!isMatch) return res.send(401, 'Invalid email and/or password');
                var token = createJwtToken(ann);
                res.send({token: token});
            });
        }
    });
});


app.post('/infor/info', function (req, res, next) {
    console.log('ok');
    var query = {'email': req.body.email};
    var age1 = req.body.age;
    var sexe1 = req.body.sexe;
    var job1 = req.body.job;
    var langage1 = req.body.langues;

    User.findOneAndUpdate(query, {
        "Age": age1,
        "Sexe": sexe1,
        "Profession": job1,
        "Langues": langage1,
        "Statut_social": req.body.statut,
        "Nombre_enfants": req.body.enfant,
        "Niveau_Etude": req.body.nivEtude,
        "Salaire": req.body.salaire,
        "fulfil1": true
    }, {upsert: true}, function (err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send("succesfully saved");
    });
});


app.post('/mode/mod', function (req, res, next) {
    var query = {'email': req.body.email};
    var poids = req.body.poids;
    var taille1 = req.body.taille;
    var typeVoyages1 = req.body.typeVoyages;
    var IMC1 = req.body.poids / (req.body.taille * req.body.taille);
    User.findOneAndUpdate(query, {
        "Poids": req.body.poids,
        "Taille": req.body.taille,
        "IMC": IMC1,
        "Frequence_voyages": req.body.freqVoyage,
        "Types_voyages": typeVoyages1,
        "Direction": req.body.direction,
        "Duree_voyages": req.body.duree,
        "Type_hebergement": req.body.typeHebergements,
        "Compagnie": req.body.Compagnie,
        "Types_reservation": req.body.typeReservation,
        "Budget_voyages": req.body.budget,
        "fulfil2": true
    }, {upsert: true}, function (err, doc) {
        if (err) return res.send(500, {error: err});
        return res.send("succesfully saved");
    });
});

app.post('/transfertbanc/trans', function (req, res, next) {
    var userID1 = 'testcybex-buyer@hotmail.com';
    var password1;
    var query = {'email': 'yo@yo'};
    var numCompte = req.body.numer;
    var montant = req.body.montant
    console.log(req.body.method);
    console.log(numCompte);
    console.log(montant);
    console.log(req.body.nomAssociation);
    console.log(req.body.typeBon);

    if (req.body.method === 'bonAchat') {
        console.log('Bon dachat');
    }
    if (req.body.method === 'association') {
        if (req.body.nomAssociation == 'croixRouge') {
            // userID1 prend ID du compte de l'association Croissant rouge
            console.log('transfert réalisé vers le compte du croissant rouge');
        }
        if (req.body.nomAssociation == 'medecinSansFrontiere') {
            // userID1 prend ID du compte de l'association Croissant rouge
            console.log('transfert réalisé vers le compte du Medecins sans frontieres');
        }
        if (req.body.nomAssociation == 'unicef') {
            // userID1 prend ID du compte de l'association Croissant rouge
            console.log('transfert réalisé vers le compte d UNICEF');
        }
    }
    if (req.body.method === 'banktrans') {
        console.log('Transfert bancaire réalisé');
        montant = req.body.montant;
        userID1 = req.body.numer;
    }
    var pay = require('paypal-pay')({
        //required parameters
        'userId': 'testcybex-facilitator_api1.hotmail.com',
        'password': 'WQCV82LMEGHAKYPH',
        'signature': 'AkhzG..PXbThngjvEnnPuE33IuSxAhsaHTJo69SkjF3cuiH-4gvo0qsT',

        //make sure that senderEmail and above credentials are from the same paypal account
        //otherwise paypal won't compete payment automatically
        'senderEmail': 'testcybex-facilitator@hotmail.com',

        //optional parameters and their defaults
        'sandbox': true,
        'feesPayer': 'SENDER',
        'currencyCode': 'USD'
    });

    pay(userID1, 50, "This is an example memo", function (err, response) {
        console.log(response);
        if (err) {
            console.log(err + 'uuuuuuuuuuuuuuuuuu');
            //response.error -- will contains errors if something went wrong
            //see response examples below for more details

            return;
        }
    });
});

app.post('/adminis/admin', function (req, res, next) {
    var imageAdmin = new ImageAdmin({
        categorie: req.body.categorie,
        question: req.body.question
    });
    imageAdmin.save(function (err) {
        if (err) return next(err);
        res.send(200);
    });
});


app.post('/auth/facebook', function (req, res, next) {
    var profile = req.body.profile;
    var signedRequest = req.body.signedRequest;
    var encodedSignature = signedRequest.split('.')[0];
    var payload = signedRequest.split('.')[1];

    var appSecret = '298fb6c080fda239b809ae418bf49700';

    var expectedSignature = crypto.createHmac('sha256', appSecret).update(payload).digest('base64');
    expectedSignature = expectedSignature.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    if (encodedSignature !== expectedSignature) {
        return res.send(400, 'Invalid Request Signature');
    }

    User.findOne({facebook: profile.id}, function (err, existingUser) {
        if (existingUser) {
            var token = createJwtToken(existingUser);
            return res.send(token);
        }
        var user = new User({
            name: profile.name,
            facebook: {
                id: profile.id,
                email: profile.email
            }
        });
        user.save(function (err) {
            if (err) return next(err);
            var token = createJwtToken(user);
            res.send(token);
        });
    });
});

app.post('/auth/google', function (req, res, next) {
    var profile = req.body.profile;
    User.findOne({google: profile.id}, function (err, existingUser) {
        if (existingUser) {
            var token = createJwtToken(existingUser);
            return res.send(token);
        }
        var user = new User({
            name: profile.displayName,
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        });
        user.save(function (err) {
            if (err) return next(err);
            var token = createJwtToken(user);
            res.send(token);
        });
    });
});

app.get('/categories/annonces', function (req, res, next) {
    console.log(req.query.cat);
    Annonce.find({categorie: {$in: req.query.cat}}, function (err, cat) {
        if (err) return next(err);
        console.log(cat);
        res.send(cat);
    });
});


app.get('/api/users', function (req, res, next) {
    if (!req.query.email) {
        return res.send(400, {message: 'Email parameter is required.'});
    }
    User.findOne({email: req.query.email}, function (err, user) {
        if (err) return next(err);
        res.send({available: !user});
    });
});

/*
app.get('/api/user', function (req, res, next) {
    User.findOne({_id: req.query.id}, function (err, post) {
        if (err) return next(err);
        res.send(post);
    });
});
*/

app.get('/api/users/:id', function (req, res, next) {
    User.findById(req.params.id, function (err, todo) {
        if (err) res.send(err);
        res.json(todo);
    });
});


app.put('/api/users/:id', function (req, res, next) {

    console.log('hello');
    User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
        console.log(req.body);
        if (err) return next(err);
        var token = createJwtToken(req.body);
        res.send({token: token});
    });
    //}
});

app.get('/api/imagesPub', function (req, res, next) {
    if (!req.query.name) {
        return res.send(400, {message: 'name parameter is required.'});
    }
    ImagePub.findOne({name: req.query.name}, function (err, imagePub) {
        if (err) return next(err);
        res.send({available: !imagePub});
    });
});

//upload donnees vers fichier .json
spawn('mongoexport', ['--db', 'test', '--collection', 'users', '--out', 'chahnouza.json'])
    .on('error', function (err) {
        throw err
    });

app.post('/api/subscribe', ensureAuthenticated, function (req, res, next) {
    Show.findById(req.body.showId, function (err, show) {
        if (err) return next(err);
        show.subscribers.push(req.user._id);
        show.save(function (err) {
            if (err) return next(err);
            res.send(200);
        });
    });
});

app.post('/api/unsubscribe', ensureAuthenticated, function (req, res, next) {
    Show.findById(req.body.showId, function (err, show) {
        if (err) return next(err);
        var index = show.subscribers.indexOf(req.user._id);
        show.subscribers.splice(index, 1);
        show.save(function (err) {
            if (err) return next(err);
            res.send(200);
        });
    });
});

app.post('/upload/picture', function (req, res, next) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        fstream = fs.createWriteStream(__dirname + '/public/images/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });
});

app.post('/image/imag', function (req, res, next) {
    query = {'email': req.body.email};
    var identifiantPub = shortid.generate();
    var ObjectId = mongoose.Types.ObjectId;
    console.log(req.body.categorie);
    var identifiantCat;
    var dateCat;
    var ObjectId = mongoose.Types.ObjectId;
    var prix1 = req.body.montant * 0.4;
    var prix2 = req.body.montant * 0.6;
    var idCompte = req.body.numCompte;
    var psswd = req.body.passwd;

    //transfert bancaire vers le compte administrateur
    var pay = require('paypal-pay')({
        'userId': idCompte,
        'password': psswd,
        'signature': 'AkhzG..PXbThngjvEnnPuE33IuSxAhsaHTJo69SkjF3cuiH-4gvo0qsT',
        'senderEmail': 'testcybex-facilitator@hotmail.com',
        'sandbox': true,
        'feesPayer': 'SENDER',
        'currencyCode': 'USD'
    });
    pay('testcybex-buyer@hotmail.com', prix1, "This is an example memo", function (err, response) {
        console.log(response);
        if (err) {
            console.log(err + 'ooooooooooooooo');
            return;
        }
    });
//Transfert vers compte 2 qui sera partagé avec les clients:
    pay('testcybex-buyer@hotmail.com', prix2, "This is an example memo", function (err, response) {
        console.log(response);
        if (err) {
            console.log(err + 'uuuuuuuuuuuuuuuuuu');
            return;
        }
    });
    //chaque video vaut 1
    var num_max = Math.floor(prix2);
    var annonce = {
        id: identifiantPub,
        name: req.body.nom_pub,
        annonceur: req.body.email,
        nb_max: num_max,
        nb_utilisation: 0,
        montant: req.body.montant,
        marque: req.body.marque,
        lienExterne: req.body.lienExterne,
        url: '/images/' + req.body.url,
        type: req.body.type
        // date: dateCat
    }
    var pub = {
        id_pub: identifiantPub,
        categorie: req.body.categorie,
        date_pub: ''
    }
    Annonceur.findOneAndUpdate(query, {$push: {'pub': pub}}, {upsert: true}, function (err, doc) {
        if (err) return res.send(500, {error: err});
        Annonce.findOneAndUpdate({'categorie': req.body.categorie}, {$push: {'pubs': annonce}}, {upsert: true}, function (err, doc) {
            if (err) return res.send(500, {error: err});
            res.send(200);
        });
    });
});

function sendPubForUsers(categorie, type, lienPub, urlPub, res) {
    if (!type.localeCompare('image')) {
        var image = {
            url: urlPub,
            lien: lienPub,
            check: false
        }
        User.findOneAndUpdate({email: "walid@walid"}, {$push: {'annonces': image}}, function (err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send("successfuly saved");
        })
    } else if (!type.localeCompare('video')) {
        var video = {
            url: lienPub.replace("?v=", "/"),
            check: false
        }
        User.findOneAndUpdate({email: "walid@walid"}, {$push: {'annoncesVideos': video}}, function (err, doc) {
            if (err) return res.send(500, {error: err});
            return res.send("successfuly saved");
        })
    }
}


app.get('*', function (req, res) {
    res.redirect('/#' + req.originalUrl);
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(500, {message: err.message});
});

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

agenda.define('send email alert', function (job, done) {
    Show.findOne({name: job.attrs.data}).populate('subscribers').exec(function (err, show) {
        var emails = show.subscribers.map(function (user) {
            if (user.facebook) {
                return user.facebook.email;
            } else if (user.google) {
                return user.google.email
            } else {
                return user.email
            }
        });

        var upcomingEpisode = show.episodes.filter(function (episode) {
            return new Date(episode.firstAired) > new Date();
        })[0];

        var smtpTransport = nodemailer.createTransport('SMTP', {
            service: 'SendGrid',
            auth: {user: 'hslogin', pass: 'hspassword00'}
        });

        var mailOptions = {
            from: 'Fred Foo ✔ <foo@blurdybloop.com>',
            to: emails.join(','),
            subject: show.name + ' is starting soon!',
            text: show.name + ' starts in less than 2 hours on ' + show.network + '.\n\n' +
            'Episode ' + upcomingEpisode.episodeNumber + ' Overview\n\n' + upcomingEpisode.overview
        };

        smtpTransport.sendMail(mailOptions, function (error, response) {
            console.log('Message sent: ' + response.message);
            smtpTransport.close();
            done();
        });
    });
});

//agenda.start();

agenda.on('start', function (job) {
    console.log("Job %s starting", job.attrs.name);
});

agenda.on('complete', function (job) {
    console.log("Job %s finished", job.attrs.name);
});