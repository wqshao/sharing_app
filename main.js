var express = require('express');
var cookieSession = require('cookie-session'); // Loads the piece of middleware for sessions
var bodyParser = require('body-parser'); // Loads the piece of middleware for managing the settings
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const mongodb = require('mongodb');
const PORT = process.env.PORT || 5000

var app = express();
var uri = 'mongodb://heroku_f68df9w2:jevru8mle0dhctreiqegi55cfa@ds245234.mlab.com:45234/heroku_f68df9w2';
var db = null
var linklist = null

function addtestdata() {
	linklist.insert(
		[{username: "wenqi", link: "hello", favorite: false, seen: false, category: "overall"},
		{username: "wenqi", link: "hello world", favorite: true, seen: true, category: "travel"}],
  		function(err, result) {
        console.log("added log!")})
}

//connect to db 
mongodb.MongoClient.connect(uri, function(err, client) {
  db = client.db('heroku_f68df9w2');
  linklist = db.collection('linklist');
  console.log("DB Connected");
  //addtestdata();
})



// view engine setup
//app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* Using client side sessions 
[todo update to express-session later] */
app.use(cookieSession({name: 'session', secret: 'privatelinks'}));
app.use(urlencodedParser)
/* If there is no to do list in the session, 
we create an empty one in the form of an array before continuing */
app.use(function(req, res, next){
	//console.log(req.session)
    if (typeof(req.session.linkslist) == 'undefined') {
        req.session.linkslist = [];
    }
    next();
})

//var username = NULL; 

app.get('/', function(req, res, next) {
	console.log("GET: /")
	console.log(req.query) 
	if(!req.query.user) {
    var user_name = "test_user"
    console.log(user_name)
	}
	if(req.query.user){
	var user_name = req.query.user 		
	}
	//console.log(req.session) // + " and session info: " + req.session)
	linklist.find(
		{ username: user_name },
		{ "username": 0, "link": 1, "_id": 0 }
		).toArray(function(err, docs) {
		  if (docs.length==0) {
			console.log("empty");
			var userlinklist = [];
			} 
		  if (docs.length > 0) {
			var userlinklist = docs.map(x => x.link)
			console.log(userlinklist)
			}
		  res.render('pages/index', {page:'Wenqi Says Hi', menuId:'home', user_name: user_name, linkslist: userlinklist}); 
			//passing page and menuId variables to index view fil
		})
//	console.log(userlinklist)
  	// GET REQUEST HAS URL PARAMS AND COOKIES 
	//console.log('home')
});

/* Adding an item to the list */

app.post('/add/', function(req, res) {
	// POST REQUEST HAS HEADERS and POST PARAMS
    console.log("the information passed is")
    console.log(req.body)
    var params = {}
    if (req.body.newlink != '') {
	   	params['favorite'] = false //set defaults
	   	params['seen'] = false //set faults
	   	params['category'] = "overall" //set faults 
	   	params['username'] = req.body.user
	   	params["link"] = req.body.newlink
		linklist.insert(params,	function(err, result) {
	        console.log("added new log!")
		    res.send('hiiiii i added a log'); // This seems silly because 
		    //POST requests generally have nothing to do with the page render, lifecycle or layout
	    })
	} else {
		res.send({error:"didn't find anything to add"})
	}
    // RES.SEND({some information just like AJAX})
    // No res.render because you're not requesting a whole page
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

app.listen(PORT, () => console.log(`Running the server on ${ PORT }`))

