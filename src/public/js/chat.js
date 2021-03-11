

// kết nối server
var socket = io.connect(`http://localhost:3000`)
var messages = document.getElementById("messages");

socket.on('connect',function(data){
    // gửi thông báo join đến cho server
    socket.emit('join','hello server from client')
})



// listen thread event
socket.on('thread', function(data, idUser){
    // lấy idPerson
    var idPerson = document.getElementById('idPerson')
    idPerson = idPerson.value 
    if(idPerson==idUser){
        $msg = '<div class="user-inbox inbox"><div class="msg-header"><p>'+ data +'</p></div></div>';
        $(".form").append($msg);
        $("#text").val('');
        var formChat = $('#form-chat');
        formChat.scrollTop(formChat.prop("scrollHeight"));
    }
    else {
        $value = $("#text").val();
        $msg = '<div class="bot-inbox inbox"><div class="icon"><i class="fas fa-user"></i></div> <div class="msg-header"><p>'+data+'</p></div></div>';
        $(".form").append($msg);
        $("#text").val('');
        var formChat = $('#form-chat');
        formChat.scrollTop(formChat.prop("scrollHeight"));
    }
})


$('form').submit(function(e){
    // bỏ sự kiện load lại trang
    e.preventDefault()
    // lấy text trong input
    var message =document.getElementById('text')
    var idPerson = document.getElementById('idPerson')
    var id = idPerson.value 
    //gửi thông báo đến server
    if(message){
        socket.emit('messages', message.value, id)
        message.value=''
        return false;  
    }
    else {
        return false;
    }
})


// chờ đến khi load xong thư viện
document.addEventListener('DOMContentLoaded', function(){
    var formChat = $('#form-chat');
    formChat.scrollTop(formChat.prop("scrollHeight"));
    var btnChat = document.getElementById('btn-chat')
    btnChat.onclick = function(){
        window.location='/chat'
    }
})