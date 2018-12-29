var express = require('express');
var cookieSession = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const PORT = process.env.PORT || 5000

var app = express();


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Using client side sessions 
[todo update to express-session later] */
app.use(cookieSession({name: 'session', secret: 'privatelinks'}));

/* If there is no to do list in the session, 
we create an empty one in the form of an array before continuing */
app.use(function(req, res, next){
    if (typeof(req.session.linkslist) == 'undefined') {
        req.session.linkslist = [];
    }
    next();
})

app.get('/', function(req, res, next) {
  // GET REQUEST HAS URL PARAMS AND COOKIES 
  res.render('pages/index', {page:'Wenqi Says Hi', menuId:'home', linkslist: req.session.linkslist}); //passing page and menuId variables to index view file
  //console.log('home')
});

/* Adding an item to the list */
app.post('/add/', urlencodedParser, function(req, res) {
	// POST REQUEST HAS HEADERS and POST PARAMS
    if (req.body.newlink != '') {
        req.session.linkslist.push(req.body.newlink);
    }
    // RES.SEND({some information just like AJAX})
    // No res.render because you're not requesting a whole page
    res.redirect('/'); // This seems silly because POST requests generally have nothing to do with the page render, lifecycle or layout
})

/* Deletes an item from the to do list */
app.get('/delete/:id', function(req, res) {
    if (req.params.id != '') {
        req.session.linkslist.splice(req.params.id, 1);
    }
    res.redirect('/');
})

/* Redirects to the main list if the page requested is not found */
app.use(function(req, res, next){
    res.redirect('/');
})


/*app.get('/category', function(req, res, next) {
  res.render('pages/index', {page:'About Us', menuId:'about'}); //placeholder to render same page
  console.log('about')
});

app.get('/archive', function(req, res, next) {
  res.render('pages/index', {page:'Contact Us', menuId:'contact'}); //placeholder to render same page 
  console.log('contact')
});
*/

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

