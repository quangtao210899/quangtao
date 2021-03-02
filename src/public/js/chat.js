

// kết nối server
var socket = io.connect(`http://localhost:3000`)
var messages = document.getElementById("messages");


socket.on('connect',function(data){
    // gửi thông báo join đến cho server
    socket.emit('join','hello server from client')
})



// listen thread event
socket.on('thread', function(data, idUser){
    let p = document.createElement("p");
    // lấy idPerson
    var idPerson = document.getElementById('idPerson')
    idPerson = idPerson.value 
    if(idPerson==idUser){
        p.style.textAlign='right';
    }
    else {
        p.style.textAlign='left';
    }
    var messages = document.getElementById("messages");
    messages.appendChild(p).append(data);
})


$('form').submit(function(e){
    // bỏ sự kiện load lại trang
    e.preventDefault()
    // lấy text trong input
    var message = $('#text').val()
    var idPerson = document.getElementById('idPerson')
    var id = idPerson.value 
    //gửi thông báo đến server
    socket.emit('messages', message, id)
    this.reset()
    return false;
})