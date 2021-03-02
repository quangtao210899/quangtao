

// kết nối server
var socket = io.connect(`http://localhost:3000`)
var messages = document.getElementById("messages");


socket.on('connect',function(data){
    // gửi thông báo join đến cho server
    socket.emit('join','hello server from client')
})



// listen thread event
socket.on('thread', function(data){
    let li = document.createElement("li");
    let span = document.createElement("span");
    var messages = document.getElementById("messages");
    messages.appendChild(li).append(data);
    messages.appendChild(span).append("by " + "anonymous" + ": " + "just now");
})


$('form').submit(function(e){
    // bỏ sự kiện load lại trang
    e.preventDefault()
    // lấy text trong input
    var message = $('#text').val()
    //gửi thông báo đến server
    socket.emit('messages', message)
    this.reset()
    return false;
})