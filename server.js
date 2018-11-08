const express = require('express')
const cors = require('cors');

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const users = require('./routes/api/users')
const profile = require('./routes/api/profile')
const post = require('./routes/api/post')
const path = require('path')




const app = express()

// Then use it before your routes are set up:
app.use(cors());
//Add middleware for body parser
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function(req, res, next) {
    // Handle the get for this route
});

app.post('/', function(req, res, next) {
    // Handle the post for this route
});

//DB config
const db = require('./config/keys').mongoURI

//connect to mongo db
//  mongoose.connect(db, {  reconnectTries: 100,
//      reconnectInterval: 500,
//      autoReconnect: true,
//       useNewUrlParser: true,
//      dbName: 'developerconnector'})
// mongoose.connect('mongodb://127.0.0.1:27017/test')
mongoose.connect(db,{useNewUrlParser:true})

.then(() => console.log('mongo db connected'))
    .catch(err => console.log(err))

//passport middleware
app.use(passport.initialize())

require('./config/passport')(passport)



//use routes
app.use('/api/users',users)
app.use('/api/profile',profile)
app.use('/api/post',post)


// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.port || 5000

app.listen(port, ()=> console.log(`the server is running on the port no ${port}`))
