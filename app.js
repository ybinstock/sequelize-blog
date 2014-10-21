var express = require("express"),
app = express(),
methodOverride = require('method-override'),
bodyParser = require("body-parser"),
db = require("./models/index");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride('_method'));


////Post Routes////

//Index
app.get('/', function(req, res){
  db.Post.findAll().done(function(err,posts){
    res.render('index', {allPosts: posts});
  });
});

//New Page
app.get('/posts/new', function(req, res){
  db.Author.findAll().done(function(err,authors){
  res.render('posts/new', {allAuthors:authors, title:"",body:""});
  });
});


//Submit Post
app.post('/posts/', function(req, res) {
  var title = req.body.post.title;
  var body = req.body.post.body;
  var AuthorId = req.body.post.AuthorId;

  db.Post.create({
    title: title,
    body: body,
    AuthorId: AuthorId
  }).done(function(err,success){
    if(err) {
      var errMsg = "title must be at least 6 characters";
      res.render('posts/new',{errMsg:errMsg, id:AuthorId, title:title, genre:genre});
    }
    else{
      res.redirect('/');
    }
  });
});

//Show individual post
app.get('/posts/:id', function(req, res) {
  db.Post.find(req.params.id).done(function(err,post){
    res.render('posts/show', {post: post});
  });
});

//Edit
app.get('/posts/:id/edit', function(req, res) {
  //find our book
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    res.render('posts/edit', {post: post});
  });
});

//Update
app.put('/posts/:id', function(req, res) {
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    post.getAuthor().success(function(author){
      post.updateAttributes({
      title: req.body.post.title,
      body: req.body.post.body
    }).done(function(err,success){

      if(err) {
        var errMsg = "title must be at least 6 characters";
        res.render('posts/edit',{post: post, errMsg:errMsg});
      }
      else{
        res.redirect('/');
      }
     });
    });
  });
});

//Delete
app.delete('/posts/:id', function(req, res) {
  var id = req.params.id;
  db.Post.find(id).done(function(err,post){
    post.getAuthor().done(function(err,author){
      post.destroy().done(function(err,success){
        res.redirect('/');
      });
    });
  });
});


///Author Routes////

//Index
app.get('/authors/', function(req, res){
  db.Author.findAll().done(function(err,authors){
    res.render('authors/index', {allAuthors: authors});
  });
});

//New Author
app.get('/authors/new', function(req, res){
  res.render('authors/new',{name:"", bio:""});
});

//Show individual author - done
app.get('/authors/:id', function(req, res) {
  db.Post.findAll({ where: {AuthorId: req.params.id}}).done(function(err,posts){
    db.Author.find(req.params.id).done(function(err,author){
      res.render('authors/show', {author: author, allPosts:posts});
    });
  });
});

//Create Author
app.post('/authors/', function(req, res) {
  var name = req.body.author.name;
  var bio = req.body.author.bio;

  db.Author.create({
    name: name,
    bio: bio,
  }).done(function(err,success){
    if(err) {
      var errMsg = "title must be at least 6 characters";
      res.render('posts/new',{errMsg:errMsg, id:AuthorId, title:title, genre:genre});
    }
    else{
      res.redirect('/authors/');
    }
  });
});

//Edit
app.get('/authors/:id/edit', function(req, res) {
  //find our author
  var id = req.params.id;
  db.Author.find(id).success(function(author){
    res.render('authors/edit', {author: author});
  });
});

//Update
app.put('/authors/:id', function(req, res) {
  var id = req.params.id;
  db.Author.find(id).success(function(author){
    author.updateAttributes({
      name: req.body.author.name,
      bio: req.body.author.bio
    }).success(function(){
      res.redirect('/authors');
    });
  });
});

//Delete
app.delete('/authors/:id', function(req, res) {
  var id = req.params.id;
  db.Author.find(id).success(function(author){
    db.Post.destroy({
      where: {
        AuthorId: author.id
      }
    }).success(function(){
      author.destroy().success(function(){
        res.redirect('/authors');
        });
      });
    });
  });


app.listen(3000, function(){
  "Server is listening on port 3000";
});