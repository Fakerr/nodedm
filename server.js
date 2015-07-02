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
var agenda = require('agenda')({ db: { address: 'localhost:27017/test' } });
var sugar = require('sugar');
var nodemailer = require('nodemailer');
var _ = require('lodash');
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

var session = require('express-session');


var videoPub = new mongoose.Schema({
  id : String, 
  type : String, //sport, cosmétique, boissons....
  prix : Number
});

var imageSchema =new mongoose.Schema({
  id: String,
  name: { type: String, unique: true, lowercase: true, trim: true },
  cible: Array,
  prix: Number,
  marque: String,
  url: String
});

var userSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, unique: true, lowercase: true, trim: true },
  password: String,
  facebook: {
    id: String,
    email: String
  },
  google: {
    id: String,
    email: String
  },
  portefeuille: Number,
  InfoPerso: {
  age: String, 
  sexe: String, 
  job: String,
  langues: Array, 
  statut: String,
  enfant: Number,
  nivEtude: String,
  salaire: Number
 },
 ModeVie: {
  poids: Number,
  taille: Number,
  freqVoyage: Number,
  typeVoyages: Array,
  direction: String,
  duree: Number,
  typeHebergement: Array,
  compagnie: Array,
  typeReservation: String,
  Budget : String
 },
  annonces: [String],
  annoncesVideo: [String]
});


userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

imageSchema.pre('save', function(next){
var imagePub = this;
next();
});


userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
//var Show = mongoose.model('Show', showSchema);
var ImagePub = mongoose.model('ImagePub', imageSchema);
mongoose.connect('localhost');
var app = express();




app.set('port', process.env.PORT || 8080);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
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

app.post('/auth/signup', function(req, res, next) {
  var user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    portefeuille: 0
  });
  user.save(function(err) {
    if (err) return next(err);
    res.send(200);
  });
});

app.post('/auth/login', function(req, res, next) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) return res.send(401, 'User does not exist');
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (!isMatch) return res.send(401, 'Invalid email and/or password');
      var token = createJwtToken(user);
      res.send({ token: token });
    });
  });
});

app.post('/infor/info', function(req, res, next) {
console.log('ok');
var query =  {'email' : 'admin@admin' };
var age1 = req.body.age;
console.log(req.body.sexe);
var sexe1 = req.body.sexe;
console.log(req.body.job);
var job1 = req.body.job;
var langage1= req.body.langues;
//var dateNaiss1 =req.body.dateNaiss;
//var portefeuille1 = portefeuille + 5;
User.findOneAndUpdate(query, {"InfoPerso.age": age1, "InfoPerso.sexe": sexe1, "InfoPerso.job": job1, "InfoPerso.langues" :langage1, "InfoPerso.statut" :req.body.statut, "InfoPerso.enfant": req.body.enfant, "InfoPerso.nivEtude": req.body.nivEtude, "InfoPerso.salaire": req.body.salaire, portefeuille: 5 }, {upsert:true},function(err, doc){
if (err) return res.send(500, { error: err });
return res.send("succesfully saved");
});
});


app.post('/mode/mod', function(req, res, next) {
console.log('ok');
var query =  {'email' : 'test@69' };
var poids = req.body.poids;
console.log(req.body.poids);
var taille1 = req.body.taille;
var typeVoyages1 = req.body.typeVoyages;
console.log =(typeVoyages1);
User.findOneAndUpdate(query, {"ModeVie.poids": req.body.poids, "ModeVie.taille": req.body.taille, "ModeVie.freqVoyage": req.body.freqVoyage, "ModeVie.typeVoyages":typeVoyages1, "ModeVie.direction":req.body.direction, "ModeVie.duree":req.body.duree, "ModeVie.typeHebergement": req.body.typeHebergements, "ModeVie.compagnie": req.body.compagnie, "ModeVie.typeReservation": req.body.typeReservation, "ModeVie.Budget": req.body.Budget, portefeuille: 10 }, {upsert:true},function(err, doc){
if (err) return res.send(500, { error: err });
return res.send("succesfully saved");
});
});


app.post('/auth/facebook', function(req, res, next) {
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

  User.findOne({ facebook: profile.id }, function(err, existingUser) {
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
    user.save(function(err) {
      if (err) return next(err);
      var token = createJwtToken(user);
      res.send(token);
    });
  });
});

app.post('/auth/google', function(req, res, next) {
  var profile = req.body.profile;
  User.findOne({ google: profile.id }, function(err, existingUser) {
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
    user.save(function(err) {
      if (err) return next(err);
      var token = createJwtToken(user);
      res.send(token);
    });
  });
});


app.get('/api/users', function(req, res, next) {
  if (!req.query.email) {
    return res.send(400, { message: 'Email parameter is required.' });
  }
  User.findOne({ email: req.query.email }, function(err, user) {
    if (err) return next(err);
    res.send({ available: !user });
  });  
});


app.get('/api/user', function(req, res, next) {
  User.findOne({ _id: req.query.id }, function (err, post) {
    if (err) return next(err);
    res.send(post);
  });
});


app.get('/api/users/:id', function (req, res, next) {
  User.findById(req.params.id, function(err, todo){
    if(err) res.send(err);
    res.json(todo);
  });
});


app.get('/api/imagesPub', function(req, res, next) {
  if (!req.query.name) {
    return res.send(400, { message: 'name parameter is required.' });
  }
  ImagePub.findOne({ name: req.query.name }, function(err, imagePub) {
    if (err) return next(err);
    res.send({ available: !imagePub });
  });  
});



//upload donnees vers fichier .json
spawn('mongoexport', [ '--db', 'test', '--collection', 'users', '--out', 'chahnouza.json' ])
.on('error', function( err ){ throw err });

app.post('/api/subscribe', ensureAuthenticated, function(req, res, next) {
  Show.findById(req.body.showId, function(err, show) {
    if (err) return next(err);
    show.subscribers.push(req.user._id);
    show.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  });
});

app.post('/api/unsubscribe', ensureAuthenticated, function(req, res, next) {
  Show.findById(req.body.showId, function(err, show) {
    if (err) return next(err);
    var index = show.subscribers.indexOf(req.user._id);
    show.subscribers.splice(index, 1);
    show.save(function(err) {
      if (err) return next(err);
      res.send(200);
    });
  }); 
});

//var obj =  {'InfoPerso.age' : '23', 'ModeVie.freqVoyage' : '1' };
/*var oMap = {};
oMap.map = function () { 
  console.log('dfv');
    this.users.forEach(function(users){ 
        if(User.InfoPerso.age == '23'){ 
        console.log('model');
         emit( User.email); 
       }
    });
};     
oMap.map();

oMap.reduce = function (k, vals) { 
  console.log('ldfn');
  
   var User = [];
    for(var i=0;i<values.length;i++)
    User.push(values[i]);       
    return JSON.stringify(User);
   }

oMap.query  = {user:'username'};  
oMap.scope = {person:'user1'};
User.mapReduce(oMap,function (err, data, stats) { 
    console.log('map reduce took %d ms', stats.processtime)
    if(err) callback(err);
    else callback(null,data);
}); 

/*User.mapReduce(obj, function (err, model, stats) {
  console.log('map reduce took %d ms', stats.processtime)
  model.find().where('value').gt(10).exec(function (err, docs) {
    console.log(docs);
  });
});*/



app.post('/image/imag', function(req, res, next) {
var imagePub = new ImagePub({
    name: req.body.name,
    prix: req.body.prix,
    marque: req.body.marque,
    cible: req.body.cibles,
    url: 'images/' + req.body.image
  });

   console.log('hiii');
  imagePub.save(function(err) {
    if (err) return next(err);
    var query1 =  {'name' : req.body.name };
    ImagePub.findOneAndUpdate(query1, {"cible": req.body.cibles}, {upsert:true},function(err, doc){
      if (err) return res.send(500, { error: err });
      return res.sendStatus(200);
    });
  });
});


app.get('*', function(req, res) {
  res.redirect('/#' + req.originalUrl);
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.sendStatus(500, { message: err.message });
});

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

agenda.define('send email alert', function(job, done) {
  Show.findOne({ name: job.attrs.data }).populate('subscribers').exec(function(err, show) {
    var emails = show.subscribers.map(function(user) {
      if (user.facebook) {
        return user.facebook.email;
      } else if (user.google) {
        return user.google.email
      } else {
        return user.email
      }
    });

    var upcomingEpisode = show.episodes.filter(function(episode) {
      return new Date(episode.firstAired) > new Date();
    })[0];

    var smtpTransport = nodemailer.createTransport('SMTP', {
      service: 'SendGrid',
      auth: { user: 'hslogin', pass: 'hspassword00' }
    });

    var mailOptions = {
      from: 'Fred Foo ✔ <foo@blurdybloop.com>',
      to: emails.join(','),
      subject: show.name + ' is starting soon!',
      text: show.name + ' starts in less than 2 hours on ' + show.network + '.\n\n' +
        'Episode ' + upcomingEpisode.episodeNumber + ' Overview\n\n' + upcomingEpisode.overview
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
      console.log('Message sent: ' + response.message);
      smtpTransport.close();
      done();
    });
  });
});

//agenda.start();

agenda.on('start', function(job) {
  console.log("Job %s starting", job.attrs.name);
});

agenda.on('complete', function(job) {
  console.log("Job %s finished", job.attrs.name);
});