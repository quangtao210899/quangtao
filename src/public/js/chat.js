


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
    var idUserF = $('#idUserFrom').val()
    var idUserT = $('#idUserTo').val()
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
        var kt = -1
        for(var i = 0; i < idUserChats.length; i++){
            if(idUserChats[i].value == idUserFrom){
                kt=i
                var children = $('#uiContacts').children()
                var index = $(children[i])
                $(index).insertBefore(children[0])
                // $(this).addClass('active2')
                var li = $($('.idUserChats')[0]).parent()[0]
                li = $(li).children()[0]
                li = $(li).children()[1]
                $(li).addClass('user_info2')
                var span = $(li).children()[0]
                var p = $(li).children()[1]
                var textSpan = $(span).find('strong')
                if(textSpan.length>0){
                    span.innerHTML = '<strong>'+$(textSpan).text()+'</Strong>'
                }
                else{
                    span.innerHTML = '<strong>'+$(span).text()+'</Strong>'
                }
                p.innerHTML=data
            }
        } 
        if(kt==-1){
            socket.emit('getUserChatForTo', idUserFrom)
        }        
    }
})

socket.on('header', function(idUserTo){
    // lấy idPerson
    var idUserF = document.getElementById('idUser').value
    if(idUserF==idUserTo){
        var notificationSpanHeader = document.getElementById('notification-span-header')
        var countNotification = notificationSpanHeader.innerText
        var countRowNotificationMesage = $('#handle-notification-message').length
        //xử lý số thông báo
        if(countNotification==''||countNotification==null){
            notificationSpanHeader.innerText='+1';
        }
        else if(countNotification=='+9'){
        }
        else {
            countNotification = parseInt(countNotification)
            countNotification++;
            countNotification = '+' + countNotification;
            notificationSpanHeader.innerText = countNotification
        }
        //Tăng số lương tin nhắn lên 1
        if(countRowNotificationMesage){
            var handleNotificationMessage = $('#handle-notification-message')[0]
            if(parseInt(handleNotificationMessage.innerHTML)){
                var countMessage=parseInt(handleNotificationMessage.innerHTML)
                countMessage++
                if(countMessage>9) countMessage=9
                handleNotificationMessage.innerHTML='+' +countMessage+' tin nhắn mới'
            } 
            else {
                handleNotificationMessage.innerHTML='+1 tin nhắn mới'
            }
        }
        else {
            var element = `<a class="dropdown-item" id='handle-notification-message' href="/">+1 tin nhắn mới </a>`
            $('#dropdown-notification').append(element)
            var countRowNotification =  $('#dropdown-notification').children().length
            if(countRowNotification==2){
                var children =  $('#dropdown-notification').children()
                var dropdownNotificationOrder = children[1] 
                $(dropdownNotificationOrder).insertBefore(children[0])
            }
            //thêm lại sự kiện
            var a = document.getElementById('notification-a-header')
            var b = document.getElementById('notification-span-header')
            a.onclick = function(e){
                e.preventDefault();
            }
    
            $('#handle-notification-message').click(function(e){
                e.preventDefault()
                var countRowNotification =  $('#dropdown-notification').children().length
                if(parseInt($('#handle-notification-order').text())){
                    b.innerText='+' + parseInt($('#handle-notification-order').text())
                }
                else {
                   b.innerText='' 
                }
                if(countRowNotification==1){
                    this.innerText = 'Không có thông báo'
                }
                else if(countRowNotification==2){
                    $('#handle-notification-message').remove()
                }
                var idUser = document.getElementById('idUser').value
                socket.emit('changeNotificationMessageToZero', idUser)
            })
        }
    }
})


socket.on('header2', function(idUserTo){
    // lấy idPerson
    var idUserF = document.getElementById('idUser').value
    if(idUserF==idUserTo){
        var notificationSpanHeader = document.getElementById('notification-span-header')
        var countNotification = notificationSpanHeader.innerText
        var countRowNotificationOrder = $('#handle-notification-order').length
        //xử lý số thông báo
        if(countNotification==''||countNotification==null){
            notificationSpanHeader.innerText='+1';
        }
        else if(countNotification=='+9'){
        }
        else {
            countNotification = parseInt(countNotification)
            countNotification++;
            countNotification = '+' + countNotification;
            notificationSpanHeader.innerText = countNotification
        }
        //Tăng số lương order lên 1
        if(countRowNotificationOrder){
            var handleNotificationOrder = $('#handle-notification-order')[0]
            if(parseInt(handleNotificationOrder.innerHTML)){
                var countMessage=parseInt(handleNotificationOrder.innerHTML)
                countMessage++
                if(countMessage>9) countMessage=9
                handleNotificationOrder.innerHTML='+' +countMessage+' đơn hàng mới'
            } 
            else {
                handleNotificationOrder.innerHTML='+1 đơn hàng mới'
            }
        }
        else {
            var element = `<a class="dropdown-item" id='handle-notification-order' href="/">+1 đơn hàng mới </a>`
            $('#dropdown-notification').append(element)
            //oke
            var countRowNotification =  $('#dropdown-notification').children().length
            if(countRowNotification==2){
                var children =  $('#dropdown-notification').children()
                var dropdownNotificationOrder = children[1] 
                $(dropdownNotificationOrder).insertBefore(children[0])
            }
            if(!$('#handle-notification-message')||$('#handle-notification-message').text()=='Không có thông báo'){
                $('#handle-notification-message').remove()
            }
            // thêm lại sự kiện
            var a = document.getElementById('notification-a-header')
            var b = document.getElementById('notification-span-header')
            a.onclick = function(e){
                e.preventDefault();
            }
            $('#handle-notification-order').click(function(e){
                e.preventDefault()
                if(parseInt($('#handle-notification-message').text())){
                    b.innerText='+' + parseInt($('#handle-notification-message').text())
                }
                else {
                   b.innerText='' 
                }
                this.innerText = 'Không có đơn hàng mới'
                var idUser = document.getElementById('idUser').value
                socket.emit('changeNotificationOrderToZero', idUser)
                window.location = '/me/restaurant/prepare'
            })
        }
    }
})

// hiển thị tin nhắn lấy về
socket.on('chatsToUser', function(chats){
    $('#chatMessageByUser').children().remove()
    var chatMessageByUser = $('#chatMessageByUser')
    if(chats){
        var idUserFrom =$('#idUserFrom').val()
        if(chats.length>0){
            if(chats[0].idUserFrom==idUserFrom){
                var chatByStoreFood = $('#chatByStoreFood').children()
                if(chatByStoreFood.length<2){
                    if(chatByStoreFood.length==1){
                        var parent = $('#chatByStoreFood')[0]
                        parent.removeChild(chatByStoreFood[0])
                    }
                    var parent = $('#chatByStoreFood')[0]
                    var div = ` <div class="bot-inbox inbox">
                                    <div class="icon">
                                        <i class="fas fa-user"></i>
                                    </div>
                                    <div class="msg-header">
                                        <p>Chào quý khách</p>
                                    </div>
                                </div>`
                    $(parent).append(div)
                    div =   `<div class="bot-inbox inbox">
                                <div class="icon">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="msg-header">
                                    <p>Quý khách đã chọn được món ăn ưa thích nào chưa?</p>
                                </div>
                            </div>`
                    $(parent).append(div)    
                }
            }
            else{
                var chatByStoreFood = $('#chatByStoreFood').children()
                if(chatByStoreFood.length==1){
                    var parent = $('#chatByStoreFood')[0]
                    parent.removeChild(chatByStoreFood[0])
                }
                if(chatByStoreFood.length==2){
                    var parent = $('#chatByStoreFood')[0]
                    parent.removeChild(chatByStoreFood[0])
                    parent.removeChild(chatByStoreFood[1])
                }
            }
        }
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

// hiển thị user được trả về
    socket.on('userChatForFrom', function(user){
        var index;
        // thêm thẻ li vào trong bảng những ng nhắn tin
        if(user.image){
            index = `<li class="onActive active2">
                        <div class="d-flex bd-highlight">
                            <div class="img_cont">
                                <img src="${user.image}" class="rounded-circle user_img">
                                <span class="online_icon"></span>
                            </div>
                            <div class="user_info">
                                <span style="margin-bottom: 10px;">${user.firstname} ${user.lastname}</span>
                                <p>Kalid is online</p>
                            </div>
                        </div>
                        <input type="hidden" value='${user._id}' class="idUserChats">
                    </li> `
        }
        else{
            index = `<li class="onActive active2">
                        <div class="d-flex bd-highlight">
                            <div class="img_cont">
                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" class="rounded-circle user_img">
                                <span class="online_icon"></span>
                            </div>
                            <div class="user_info">
                                <span style="margin-bottom: 10px;">${user.firstname} ${user.lastname}</span>
                                <p>Kalid is online</p>
                            </div>
                        </div>
                        <input type="hidden" value='${user._id}' class="idUserChats">
                    </li> `            
        }
        var ui = $('#uiContacts')[0]
        $(ui).append(index)
        // đưa thẻ li lên đầu
        var children = $('#uiContacts').children()
        var n = children.length-1
        for(var i = 0; i < n; i++){
            $(children[i]).removeClass('active2')
        } 
        var li = $(children[n])
        $(li).insertBefore(children[0])


        // chạy lại hàm onActive
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
    })


    socket.on('userChatForTo', function(user){
        var index;
        // thêm thẻ li vào trong bảng những ng nhắn tin
        if(user.image){
            index = `<li class="onActive">
                        <div class="d-flex bd-highlight">
                            <div class="img_cont">
                                <img src="${user.image}" class="rounded-circle user_img">
                                <span class="online_icon"></span>
                            </div>
                            <div class="user_info user_info2">
                                <span style="margin-bottom: 10px;"><strong>${user.firstname} ${user.lastname}</strong></span>
                                <p>Kalid is online</p>
                            </div>
                        </div>
                        <input type="hidden" value='${user._id}' class="idUserChats">
                    </li> `
        }
        else{
            index = `<li class="onActive">
                        <div class="d-flex bd-highlight">
                            <div class="img_cont">
                                <img src="https://bootdey.com/img/Content/avatar/avatar7.png" class="rounded-circle user_img">
                                <span class="online_icon"></span>
                            </div>
                            <div class="user_info user_info2">
                                <span style="margin-bottom: 10px;"><strong>${user.firstname} ${user.lastname}</strong></span>
                                <p>Kalid is online</p>
                            </div>
                        </div>
                        <input type="hidden" value='${user._id}' class="idUserChats">
                    </li> `            
        }
        var ui = $('#uiContacts')[0]
        $(ui).append(index)
        // đưa thẻ li lên đầu
        var children = $('#uiContacts').children()
        var n = children.length-1
        var li = $(children[n])
        $(li).insertBefore(children[0])


        // chạy lại hàm onActive
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
    })
    
    // xử lý comment gửi từ serve về
    socket.on('commentFromServer', function(text, image, name, time){
        time = getDateAgo(time);
        var comment = ` <div class="card p-3 mt-2">
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="user d-flex flex-row align-items-center"> 
                                    <img src="${image}" width="50" class="user-img rounded-circle mr-2"> 
                                    <span><small class="font-weight-bold text-dark" style="font-size: 16px;">${name}</small> </span>
                                </div> 
                                <small>${time}</small>
                            </div>
                            <p style="padding: 0px; margin: 0px 0px 0px 55px;">${text}</p>
                        </div>`
        $('#div-comment').prepend(comment)
    })


    // login 
    socket.on('userLogin', function(idUser, timeLogin){
        // oke
        var idUserCurrent = document.getElementById('idUser').value
        if(idUserCurrent==idUser){
            var timeLoginCurent = $('#timeLogin').val()
            if(timeLoginCurent!=timeLogin){
                window.location = '/logout?_status=1'
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
        var chatByStoreFood = $('#chatByStoreFood').children()
        if(chatByStoreFood.length==1){
            var parent = $('#chatByStoreFood')[0]
            parent.removeChild(chatByStoreFood[0]) 
        }
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
            var chatByStoreFood = $('#chatByStoreFood').children()
            if(chatByStoreFood.length<2){
                if(chatByStoreFood.length==1){
                    var parent = $('#chatByStoreFood')[0]
                    parent.removeChild(chatByStoreFood[0])
                }
                var parent = $('#chatByStoreFood')[0]
                var div = ` <div class="bot-inbox inbox">
                                <div class="icon">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="msg-header">
                                    <p>Chào quý khách</p>
                                </div>
                            </div>`
                $(parent).append(div)
                div =   `<div class="bot-inbox inbox">
                            <div class="icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="msg-header">
                                <p>Quý khách đã chọn được món ăn ưa thích nào chưa?</p>
                            </div>
                        </div>`
                $(parent).append(div)    
            }
            $($('#checkInputMessage')[0]).css('visibility', '')
            var idUserChats = $('.idUserChats')
            var index = -1
            for(var i = 0; i < idUserChats.length; i++){
                if(idUserChats[i].value == chatIdUser){
                    index = i;
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

            if(index== -1){
                var idUserFrom =$('#idUserFrom').val()
                socket.emit('getChat', idUserFrom, chatIdUser)
                // gán lại idUserTo
                document.getElementById('idUserTo').value=chatIdUser
                socket.emit('getUserChatForFrom', chatIdUser)
            }
        }
        setCaretToPos(document.getElementsByClassName("textInputMessageChat")[0], 
            document.getElementsByClassName("textInputMessageChat")[0].value.length);
    })

    // Gửi tin nhắn đến server
    $('#btn-submit-comment').click(function(){
        var text = $('#comment').val().trim();
        var idUser = $('#idUser').val();
        var idUserFood = $('#chatIdUser').val()
        // reset text
        $('#comment').val("");
        setCaretToPos($(this),0);
        if(text!=null && text!=""){
            socket.emit('userComment', text, idUser,idUserFood)
        }
    })
    $('#comment').keypress(function(event){
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') {
            event.preventDefault()
            var text = $('#comment').val().trim();
            var idUser = $('#idUser').val();
            var idUserFood = $('#chatIdUser').val()
            $('#comment').val("");
            setCaretToPos($(this),0);
            if(text!=null && text!=""){
                socket.emit('userComment', text, idUser,idUserFood)
            }
        }
    });
    $('#comment').keyup(function(){
        var s = $(this).val();
        $(this).val(emoji(s));

    })

    // login
    var timeLogin = $('#timeLogin').val()
    if(timeLogin){
        var idUser = $('#idUser').val()
        socket.emit('userLogin', idUser, timeLogin)
    }

})




// đưa con trỏ đến vị trí bất kì trong thẻ input
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

function getDateAgo (time){
    var date = new Date(time);
    var dateAgo = date.getTime() / 1000;
    var dateNow = new Date().getTime() / 1000;
    var second = parseInt((dateNow - dateAgo)/60)
    if(second==0){
        second = "Ngay bây giờ"
    }
    else if(second<60) {
        second = second + " phút trước"
    }
    else if(second<(24*60)){
        second = parseInt(second/(60))
        second = second + " giờ trước"
    }
    else if(second<(24*60*30)){
        second = parseInt(second/(60*24))
        second = second + " ngày trước"
    }
    else {
        second = parseInt(second/(60*30*24))
        second = second + " tháng trước"        
    }
    return second;
}

function emoji(text){
    var s = text;
    var n = s.length;
    for(var i=0;i<n-1; i++){
      // icon buồn
      if(i<n-1&&s[i]==":"&&s[i+1]=="(") {
        s = s.substring(0,i) + "😞"+ s.substring(i+2,s.length);
        i++;
      }

      // icon fine
      else if(i<n-1&&s[i]==":"&&s[i+1]==")") {
        s = s.substring(0,i) + "🙂"+ s.substring(i+2,s.length);
        i++;
      }
      else if(i<n-1&&s[i]==":"&&s[i+1]=="D") {
        s = s.substring(0,i) + "😃"+ s.substring(i+2,s.length);
        i++;
      }
      else if(i<n-1&&s[i]==":"&&s[i+1]=="P") {
        s = s.substring(0,i) + "😛"+ s.substring(i+2,s.length);
        i++;
      }
      else if(i<n-1&&s[i]==":"&&s[i+1]=="O") {
        s = s.substring(0,i) + "😮"+ s.substring(i+2,s.length);
        i++;
      }
      else if(i<n-2&&s[i]=="3"&&s[i+1]==":"&&s[i+2]==")") {
        s = s.substring(0,i) + "😈"+ s.substring(i+3,s.length);
        i++;
      }
      else if(i<n-2&&s[i]=="T"&&s[i+1]=="_"&&s[i+2]=="T") {
        s = s.substring(0,i) + "😭"+ s.substring(i+3,s.length);
        i++;
      }
      else if(i<n-1&&s[i]==":"&&s[i+1]=="*") {
        s = s.substring(0,i) + "😘"+ s.substring(i+2,s.length);
        i++;
      }
      else if(i<n-1&&s[i]=="<"&&s[i+1]=="3") {
        s = s.substring(0,i) + "❤"+ s.substring(i+2,s.length);
        i++;
      }
      else if(i<n-1&&s[i]=="="&&s[i+1]=="b"){
        s = s.substring(0,i) + "👍"+ s.substring(i+2,s.length);
        i++;
      }
      else if(i<n-1&&s[i]==";"&&s[i+1]==")"){
        s = s.substring(0,i) + "😉"+ s.substring(i+2,s.length);
        i++;
      }
      // icon ngầu
      else if(i<n-1&&s[i]=="8"&&s[i+1]=="|"){
        s = s.substring(0,i) + "😎"+ s.substring(i+2,s.length);
        i++;
      }
      else if(i<n-5&&s[i]==":"&&s[i+1]=="p"&&s[i+2]=="o"&&s[i+3]=="o"&&s[i+4]=="p"&&s[i+5]==":"){
        s = s.substring(0,i) + "💩"+ s.substring(i+6,s.length);
        i++;
      }
      // code thêm thì làm theo form trên
    }
    return s;
    // console.log(s);
}
$('.textInputMessageChat').keyup(function(){
    var s = $(this).val()
    $(this).val(emoji(s))
})
/// header