var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jsonAPI');

var User = require('./app/models/user');

app.use(bodyParser.urlencoded({ expended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 3000;

var router = express.Router();

router.use(function(req, res, next){
  console.log('Something is happening.');
  next();
});

router.get('/', function(req, res){
  res.json({message: 'Successfully Posted a test message.' });
});

router.route('/users')
  .post(function(req, res){
    var user = new User();
    user.twitter_id = req.body.twitter_id;
    user.name = req.body.name;
    user.age = req.body.age;

    user.save(function(err){
      if(err){
        res.send(err);
      }
      res.json({message : 'User Created!'});
    });
  })
  .get(function(req, res){
    User.find(function(err, users){
      if(err){
        res.send(err);
      }
      res.json(users);
    });
  });

router.route('/users/:user_id')
  .get(function(req, res){
    User.findById(req.params.user_id, function(err, user){
      if(err){
        res.send('err');
      }
      res.json(user);
    });
  })
  .put(function(req, res){
    User.findById(req.params.user_id, function(err, user){
      if(err){
        res.send('err');
      }
      user.twitter_id = req.body.twitter_id;
      user.name = req.body.name;
      user.age = req.body.age;

      user.save(function(err){
        if(err){
          res.send(err);
        }
        res.json({message : 'User Update!'});
      });
    });
  })
  .delete(function(req, res){
    User.remove({
      _id : req.params.user_id
    }, function(err, user){
      if(err){
        res.send(err);
      }
      res.json({message : 'Successfully deleted!'});
    });
  });

app.use('/api', router);

app.listen(port);
console.log('listen on port ' + port);
