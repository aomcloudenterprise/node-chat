var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    hbs = require('express-handlebars'),
    chat = require('./chat');

app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use( express.static('public') );

app.get('/', function(req, res) {

    res.render('home', {
        title: 'Node.js Chat'
    });

});

server.listen(process.env.PORT || 8080, function() {
    console.log('Server is running.');
});

chat(io);
