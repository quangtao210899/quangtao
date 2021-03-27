


// kết nối server
var socket = io.connect(`http://localhost:3000`)
var messages = document.getElementById("messages");

socket.on('connect',function(data){
    // gửi thông báo join đến cho server
    socket.emit('join','hello server from client')
})



// listen thread event
socket.on('thread', function(data, idUserFrom, idUserTo){
    // lấy idPerson
    var idUserF = document.getElementById('idUserFrom').value
    var idUserT = document.getElementById('idUserTo').value
    // hiển thị tin nhắn từ server gửi đến
    if(idUserFrom==idUserF&&idUserTo==idUserT){
        $msg = '<div class="user-inbox inbox"><div class="msg-header"><p>'+ data +'</p></div></div>';
        $("#chatMessageByUser").append($msg);
        $("#text").val('');
        var formChat = $('#form-chat');
        formChat.scrollTop(formChat.prop("scrollHeight"));
        // xử lý sau khi nhắn tin
        var idUserChats = $('.idUserChats')
        for(var i = 0; i < idUserChats.length; i++){
            if(idUserChats[i].value == idUserTo){
                var children = $('#uiContacts').children()
                var index = $(children[i])
                $(index).insertBefore(children[0])
                //
                var li = $($('.idUserChats')[0]).parent()[0]
                li = $(li).children()[0]
                li = $(li).children()[1]
                li = $(li).children()[1]
                li.innerHTML = data
            }
        }
    }
    else if(idUserFrom==idUserT&&idUserTo==idUserF){
        $msg = `<div class="bot-inbox inbox"><div class="icon"><i class="fas fa-user"></i>
                </div><div class="msg-header"><p>${data}</p></div></div>`
        $("#chatMessageByUser").append($msg);
        $("#text").val('');
        var formChat = $('#form-chat');
        formChat.scrollTop(formChat.prop("scrollHeight"));    
        // xử lý tin nhắn sau chat  
        var idUserChats = $('.idUserChats')
        for(var i = 0; i < idUserChats.length; i++){
            if(idUserChats[i].value == idUserFrom){
                var children = $('#uiContacts').children()
                var index = $(children[i])
                $(index).insertBefore(children[0])
                //
                var li = $($('.idUserChats')[0]).parent()[0]
                li = $(li).children()[0]
                li = $(li).children()[1]
                li = $(li).children()[1]
                li.innerHTML = data
            }
        }      
    }
    else if(idUserTo==idUserF&&idUserFrom!=idUserT){
        // xử lý tin nhắn sau chat  
        var idUserChats = $('.idUserChats')
        for(var i = 0; i < idUserChats.length; i++){
            if(idUserChats[i].value == idUserFrom){
                var children = $('#uiContacts').children()
                var index = $(children[i])
                $(index).insertBefore(children[0])
                //oke
                // $(this).addClass('active2')
                var li = $($('.idUserChats')[0]).parent()[0]
                li = $(li).children()[0]
                li = $(li).children()[1]
                $(li).addClass('user_info2')
                var span = $(li).children()[0]
                var p = $(li).children()[1]
                var textSpan = span.innerHTML
                span.innerHTML = '<strong>'+textSpan+'</Strong>'
                p.innerHTML=data
            }
        }         
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

// hiển thị tin nhắn lấy về
socket.on('chatsToUser', function(chats){
    $('#chatMessageByUser').children().remove()
    var chatMessageByUser = $('#chatMessageByUser')
    if(chats){
        var idUserFrom =$('#idUserFrom').val()
        for(var i = 0; i < chats.length; i++){
            if(chats[i].idUserFrom==idUserFrom){
                var div =   `<div class="user-inbox inbox">
                                <div class="msg-header">
                                    <p>${chats[i].text}</p>
                                </div>
                            </div>`
                $(chatMessageByUser).append(div)
            }
            else {
                var div =   `<div class="bot-inbox inbox">
                                <div class="icon">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="msg-header">
                                    <p>${chats[i].text}</p>
                                </div>
                            </div>`
                $(chatMessageByUser).append(div)
            }  
        }
        var formChat = $('#form-chat');
        formChat.scrollTop(formChat.prop("scrollHeight"));
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
        //gửi thông báo đến server
        if(message!=''&&message!=""){
            socket.emit('messages', message, idUserFrom, idUserTo)
            message.value=''
            return false;  
        }
        else {
            socket.emit('messages', "👍", idUserFrom, idUserTo)
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
        //gửi thông báo đến server
        if(message!=''&&message!=""){
            socket.emit('messages', message, idUserFrom, idUserTo)
            message.value=''
            return false;  
        }
        else {
            return false;
        }
    })

    // xử lý sự kiện vote
    $('.fa-star').click(function(){
        var parent = $(this).parent()[0]
        var position = parseInt($(this).attr('vote'))
        var voteByUser = parseInt($('#voteByUser').val())
        var countVote = parseInt($('#countVote').val())
        var countUserVote = parseInt($('#countUserVote').val())
        if(voteByUser!=position){
            // gán lại vào input hidden
            if(voteByUser==0){
                countUserVote++;
                $('#countUserVote').val(countUserVote)
            }
            countVote = countVote + position - voteByUser
            $('#countVote').val(countVote)
            $('#voteByUser').val(position)
            var voteStar = countVote/countUserVote
            voteStar = Math.round(voteStar * 100) / 100
            // display Vote
            // $('#spanVoteShowFood').text('trên '+voteStar+ ' lượt đánh giá')
            document.getElementById('pVoteShowFood').innerHTML = 'Vote : '+voteStar+ ' '+ 
                '<span style="color:#666666" id="spanVoteShowFood">trên '+ countUserVote +' lượt đánh giá</span>'
            // $('#pVoteShowFood').text('Vote : '+countUserVote+ ' ')
            for(var i = 0; i <= 4; i++){
                if(i >= position) $(parent).children()[i].style.color = '#444'
                else $(parent).children()[i].style.color= '#FD4'
            }
            var userID = document.getElementById('idUserFrom').value
            var foodID = document.getElementById('idMainFood').value
            socket.emit('userVote', userID, position, foodID)
        }
    })


    // xử lý sự kiện click vào danh sách người đã nhắn tin
    $('.onActive').click(function(){
        setCaretToPos(document.getElementsByClassName("textInputMessageChat")[0], 
            document.getElementsByClassName("textInputMessageChat")[0].value.length);
        $('.onActive').removeClass('active2')
        $(this).addClass('active2')
        
        var li = $(this).children()[0]
        li = $(li).children()[1]
        $(li).removeClass('user_info2')
        var span = $(li).children()[0]
        var textSpan = $(span).find('strong').text()
        if(textSpan) span.innerHTML = textSpan

        var idUserFrom =$('#idUserFrom').val()
        var children  = $(this).children()[1]
        var idUserTo = $(children).val()
        // gán lại idUserTo
        document.getElementById('idUserTo').value=idUserTo
        socket.emit('getChat', idUserFrom, idUserTo)
    })

    $('#click').change(function(){
        setCaretToPos(document.getElementsByClassName("textInputMessageChat")[0], 
            document.getElementsByClassName("textInputMessageChat")[0].value.length);
    })
    // sự kiện click button chat
    $('#btn-chat').click(function(){
        var checked = $('#click').prop('checked')
        $('#click').prop('checked', !checked)
        var chatIdUser = $('#chatIdUser').val()
        if(!checked){
            var idUserChats = $('.idUserChats')
            for(var i = 0; i < idUserChats.length; i++){
                if(idUserChats[i].value == chatIdUser){
                    var children = $('#uiContacts').children()
                    for(var j = 0; j < children.length; j++){
                        if(i!=j) $(children[j]).removeClass('active2')
                    }
                    $(children[i]).addClass('active2')
                    var idUserFrom =$('#idUserFrom').val()
                    var index = $(children[i])
                    $(index).insertBefore(children[0])
                    // gán lại idUserTo
                    document.getElementById('idUserTo').value=chatIdUser
                    socket.emit('getChat', idUserFrom, chatIdUser)
                }
            } 
        }
        setCaretToPos(document.getElementsByClassName("textInputMessageChat")[0], 
            document.getElementsByClassName("textInputMessageChat")[0].value.length);
    })

})

function setSelectionRange(input, selectionStart, selectionEnd) {
    if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
    else if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    }
}
   
function setCaretToPos (input, pos) {
    setSelectionRange(input, pos, pos);
}


/// header

