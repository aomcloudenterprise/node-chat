function init(io) {
    var users = [];
    var usersInfo = [];
    var emojiones = [':)', 'B)', ':D', ';)', '0:3', ':P', ':x'];
    var nickColors = ['#e91e63', '#9575cd', '#4db6ac', '#d4e157', '#ffb74d', '#ff7043', '#424242'];

// podlaczenie klienta
    io.on('connection', function(socket) {

        socket.on('join', function(nick) {

            var reason = validateNick(nick);

            if(!reason) {

                socket.nick = nick;
                var randomNumber = getRandom();
                users.push(nick);
                usersInfo.push({
                    nick: nick,
                    emoji: emojiones[randomNumber],
                    color: nickColors[randomNumber]
                });

                io.emit('status', {
                    status: socket.nick + ' is online now',
                    time: Date.now(),
                    users: usersInfo
                });

                reason = '';
                socket.emit('canjoin', reason);

            } else {
                socket.emit('canjoin', reason);
            }
            console.log('now online: ' + usersInfo.length);
            console.log(usersInfo);

        }); // koniec zdarzenia"join"

        socket.on("disconnect", function() {

            for (var i = 0; i < usersInfo.length; i++) {
                if(usersInfo[i].nick == socket.nick) {
                    usersInfo.splice(i, 1);
                }
            }

            io.emit("status", {
                time: Date.now(),
                status: socket.nick + " is out.",
                users: usersInfo
            });

        });

        socket.on("message", function(msg) {

            io.emit("message", {
                time: Date.now(),
                nick: socket.nick,
                message: msg
            });

            console.log(msg);

        });

        console.log('now online: ' + usersInfo.length);
        console.log(usersInfo);

    });


    function validateNick(nickName) {
        var usersDb = [];
        for (var i = 0; i < usersInfo.length; i++) {
            usersDb.push(usersInfo[i].nick.toUpperCase());
        }

        var reason = '';

        if (nickName.length < 3 || nickName.length > 12) {

            reason = 'Nick must be 3 - 12 characters long.';

        } else if (nickName.match(/^[a-z0-9]+$/i) == null) {

            reason = 'Your nick can only contain alphanumeric characters (letters A-Z, numbers 0-9 and underscore)';

        } else if (usersDb.includes(nickName.toUpperCase())) {
            reason = 'Sorry! Nick ' + nickName +  ' is already taken.';
        }

        return reason;

    }

    function getRandom() {
        return Math.floor(Math.random() * emojiones.length);
    }
}

module.exports = init;
