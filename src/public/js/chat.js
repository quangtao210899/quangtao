

// kết nối server
var socket = io.connect(`http://localhost:3000`)
var messages = document.getElementById("messages");

socket.on('connect',function(data){
    // gửi thông báo join đến cho server
    socket.emit('join','hello server from client')
})



// listen thread event
socket.on('thread', function(data, idUserFrom, idUserTo, idFood){
    // lấy idPerson
    var idUserF = document.getElementById('idUserFrom').value
    var idUserT = document.getElementById('idUserTo').value
    var idF = document.getElementById('idFood').value
    // hiển thị tin nhắn từ server gửi đến
    if(idUserFrom==idUserF&&idUserTo==idUserT&&idFood==idF){
        $msg = '<div class="user-inbox inbox"><div class="msg-header"><p>'+ data +'</p></div></div>';
        $(".form").append($msg);
        $("#text").val('');
        var formChat = $('#form-chat');
        formChat.scrollTop(formChat.prop("scrollHeight"));
    }
})

socket.on('header', function(idUserTo){
    // lấy idPerson
    var idUserF = document.getElementById('idUser').value
    if(idUserF==idUserTo){
        var notificationIHeader = document.getElementById('notification-i-header')
        var notificationSpanHeader = document.getElementById('notification-span-header')
        var notificationAHeader = document.getElementById('notification-a-header')
        var countNotification = notificationSpanHeader.innerText
        var handleNotification = document.getElementById('handle-notification')
        //xử lý số thông báo
        if(countNotification==''||countNotification==null){
            notificationSpanHeader.innerText='+1';
            handleNotification.innerText = 'Bạn có 1 tin nhắn mới'
        }
        else if(countNotification=='+9'){
            handleNotification.innerText = 'Bạn có 9 tin nhắn mới'
        }
        else {
            countNotification = parseInt(countNotification)
            countNotification++;
            handleNotification.innerText='Bạn có ' +countNotification+ ' tin nhắn mới'
            countNotification = '+' + countNotification;
            notificationSpanHeader.innerText = countNotification
        }
    }
})



// chờ đến khi load xong thư viện
document.addEventListener('DOMContentLoaded', function(){
    // di thanh chuột xuống dưới cùng
    var formChat = $('#form-chat');
    formChat.scrollTop(formChat.prop("scrollHeight"));
    // sự kiện ấn vào nút send messenge
    var aSendMessage = $('#a-send-message');
    aSendMessage.click(function(e){
        e.preventDefault()
        // lấy text trong input
        var message =document.getElementById('text').value
        message = message.trim()
        var idUserTo = document.getElementById('idUserTo') .value
        var idUserFrom = document.getElementById('idUserFrom') .value
        var idFood = document.getElementById('idFood') .value
        //gửi thông báo đến server
        if(message!=''&&message!=""){
            socket.emit('messages', message, idUserFrom, idUserTo, idFood)
            message.value=''
            return false;  
        }
        else {
            socket.emit('messages', "👍", idUserFrom, idUserTo, idFood)
            message.value=''
            return false;
        }
    })

    var logout = document.getElementById('logout')
    logout.onclick = function(e){
      e.preventDefault();
      window.location= '/logout'
    }


    // xử lý sự kiện của thẻ header
    var a = document.getElementById('notification-a-header')
    var b = document.getElementById('notification-span-header')
    a.onclick = function(e){
      e.preventDefault();
    }

    var handleNotification = document.getElementById('handle-notification')
    handleNotification.onclick = function(e){
      e.preventDefault()
      b.innerText=''
      this.innerText = 'Không có thông báo nào'
      var idUser = document.getElementById('idUser').value
      socket.emit('changeNotificationMessageToZero', idUser)
    }
    //
    
    $('#form1').submit(function(e){
        e.preventDefault()
        // lấy text trong input
        var message =document.getElementById('text').value
        message = message.trim()
        var idUserTo = document.getElementById('idUserTo') .value
        var idUserFrom = document.getElementById('idUserFrom') .value
        var idFood = document.getElementById('idFood') .value
        //gửi thông báo đến server
        if(message!=''&&message!=""){
            socket.emit('messages', message, idUserFrom, idUserTo, idFood)
            message.value=''
            return false;  
        }
        else {
            return false;
        }
    })
})




/// header

