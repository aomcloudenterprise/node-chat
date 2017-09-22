$(document).ready(function() {

    var loginCard = $('.login'),
        loginForm = $('.login__form'),
        nickInput = $('.login__nick'),
        loginError = $('.login__error'),
        chatCard = $('.chat'),
        messageForm = $('.chat__form'),
        newMessage = $('.new-message'),
        chatWindow = $('.chat__window'),
        onlineUsers = $('.online-users'),
        usersList = $('.users__list'),
        windowWidth = $(window).width(),
        socket = io.connect(),
        nickName = '',
        newMessageText = '';

    var statusTpl = Handlebars.compile( $("#status-template").html() );
    var messageTpl = Handlebars.compile( $("#message-template").html() );
    var usersTpl = Handlebars.compile( $("#users-template").html() );

    emojione.ascii = true;
    emojione.imageType = 'png';
    emojione.unicodeAlt = false;

    newMessage.on('keyup', function(e) {

        if (e.keyCode === 13) {
            sendMessage();
        }

    });

    $(document).on('keypress', '.login__nick', function(e) {

        if(e.which === 32) {
            return false;
        }

    });

    messageForm.on('submit', function(e) {

        e.preventDefault();
        sendMessage();

    });

    socket.on("message", function(data) {

       var html = messageTpl({
           time: formatDate(data.time),
           nick: data.nick,
           message: data.message
       });

       chatWindow.append(html);
       scrollToBottom();

   });

    loginForm.on('submit', function(e) {

        e.preventDefault();
        goToChat();

    });

    socket.on('canjoin', function(data) {

        if(data) {

            loginError.text(data);

        } else {

            loginCard.hide();
            chatCard.show();

        }

    });

    socket.on('status', function(data) {

        var html = statusTpl({
            status: data.status,
            time: formatDate(data.time),
            users: data.users
        });

        var users = usersTpl({
            users: data.users,
            onlineUsers: data.users.length
        });

        chatWindow.append(html);
        $('.chat__users').html(users);

        // searching for active users by checking it's content in HTML
        var activeUser = $('.user__name:contains("' + nickName + '")');
        activeUser.addClass('user--active');

        // changing users list emojiones
        var emojiones = $('.user__emoji');
        $.each(emojiones, function(index, value) {

            var emoji = $(value).html();
            var newEmoji = emojione.shortnameToImage(emoji);
            $(this).html(newEmoji);

        });

    });

    function goToChat() {

        nickName = $.trim(nickInput.val());
        socket.emit('join', nickName);

    }

    function sendMessage() {

        newMessageText = $.trim(newMessage.val());

        if(newMessageText !== "") {

            newMessage.val('');
            socket.emit("message", newMessageText);
            newMessage.focus();
        }

    }

    function formatDate(time) {

        var date = new Date(time),
            hours = date.getHours(),
            minutes = date.getMinutes(),
            seconds = date.getSeconds();

        return (hours < 10 ? "0" + hours : hours) + ":" +
            (minutes < 10 ? "0" + minutes : minutes) + ":" +
            (seconds < 10 ? "0" + seconds : seconds);

    }

    function scrollToBottom() {

        chatWindow.scrollTop( chatWindow.prop("scrollHeight") );

    }

    if (windowWidth <= 550) {
        $('.chat__users-btn').sideNav({
            edge: 'right'
        });
    }

    $(window).on('resize', function() {

        windowWidth = $(window).width();

        if (windowWidth <= 550) {

            $(".chat__users-btn").sideNav({
                edge: 'right'
            });

        }

    });

});
