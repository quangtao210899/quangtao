
var position
var inputUpdateAddress
var addressID
var deleteDiv
socket.on('newIdAddress', function(newIdAddress){
    var inputNewAddress =  $('#input-new-address').val().trim()
    var countLength = $('#div-add-address').children().length - 1 
    $('#add-address-profile').modal('hide')
    $input = `  <div class="row">
                    <div class="col-sm-3">
                        <h6 class="mb-0" style="font-size: 16px; margin-top: 18px;">Địa chỉ ${countLength}: </h6>
                    </div>
                    <div class="col-sm-9 text-secondary d-flex">
                        <input type="text" class="form-control" value="${inputNewAddress}"
                            style="min-height: 10px; font-size: 15px; margin-top: 10px;" class='address123' readonly/>
                        <i class="fas fa-trash-restore restore" data-toggle="modal" data-target="#modal-update-address"
                            data-id="${newIdAddress}" name='${countLength}'></i>
                        <i class="fas fa-trash-alt trash" data-toggle="modal" data-target="#delete-address-person" 
                            data-id="${newIdAddress}" name='${countLength}'></i>
                    </div>
                </div>`
    $('#div-add-address').append($input)
    $('#div-add-address').append($('#div-add-address-2'))
    $('#input-new-address')[0].value=''
    $('.trash').click(function(){
        position = $(this).attr('name')
    })
    $('.restore').click(function(){
        document.getElementById('error-address-update').innerHTML=''
        var parent = $(this).parent()[0]
        inputUpdateAddress = $(parent).children()[0]
        var text = $(inputUpdateAddress).val().trim()
        $('#input-new-address-update').val(text)
    })
})
// chờ đến khi load xong thư viện
document.addEventListener('DOMContentLoaded', function(){
    var inputHiddenGenderProfile = $('#input-hidden-profile-gender').val()
    if(inputHiddenGenderProfile=='noSelect'){
        $('#gender-profile').prop('selectedIndex',0);
    }
    else if(inputHiddenGenderProfile=='man'){
        $('#gender-profile').prop('selectedIndex',1);
    }
    else if(inputHiddenGenderProfile=='woman'){
        $('#gender-profile').prop('selectedIndex',2);
    }
    else{
        $('#gender-profile').prop('selectedIndex',0);
    }
    
    $('#btn-save-info-user').click(function(e){
        var userID = $('#user-id-profile').val().trim()
        var firstname = $('#first-name-profile').val().trim()
        var lastname = $('#last-name-profile').val().trim()
        var phone= $('#phone-profile').val().trim()
        var fullNameProfile = document.getElementById('full-name-profile')
        var gender= $('#gender-profile option:selected').val()
        var kt = 1;
        //firstname
        if(firstname==''||firstname==null){
            kt=0
        }
        //lastname
        if(lastname==''||lastname==null){
            kt=0
        }
        //phone
        if(phone==''||phone==null){
            kt=0
        }
        else {
            function isNumber(n) { return /^-?[\d.]+(?:e-?\d+)?$/.test(n); }
            if(phone[0]!='0'){
                kt=0
            }
            if(!isNumber(phone)){
                kt=0
            }
            if(phone.length>12||phone.length<10){
                kt=0
            }
        }
        // text-to-check-data
        if(kt==1){
            socket.emit('saveInfoUser', userID, firstname, lastname, phone, gender)
            fullNameProfile.innerHTML= firstname + ' ' + lastname
            $('#text-to-check-data')[0].innerHTML = ''
            $('.header-fullname-profile')[0].innerHTML = firstname + ' ' + lastname
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alert").slideUp(500);
            });
        }
        else {
            $('#text-to-check-data')[0].innerHTML = 'Vui lòng nhập chính xác'
        }
    })

    // my-foods-profile
    $('#my-foods-profile').click(function(){
        window.location = '/me/stored/foods'
    })

    // preview image ở trang profile
    $('#file').change(function(){
        var file = document.getElementById('file').files;
        var filename = $('input[type=file]').val().split('\\').pop();
        // socket.emit('previewFileProfile', file[0])
        // resize(file[0])
        if(file.length>0){
            var userID = $('#user-id-profile').val().trim()
            var url = URL.createObjectURL(file[0]);
            socket.emit('previewFileProfile', userID, file[0], filename)
            document.getElementById('preview-iamge-profile').setAttribute('src', url);
        }
    })

    // xử lý thay mật khẩu mới
    $('#btn-save-password-user').click(function(){
        var userID = $('#user-id-profile').val().trim()
        var password = $('#user-password-profile').val().trim()
        var oldPassword = $('#oldPassword').val().trim()
        var newPassword = $('#newPassword').val().trim()
        var newPasswordAgain = $('#newPasswordAgain').val().trim()
        var kt = 1;
        if(password==oldPassword){
            if(newPassword!=newPasswordAgain) kt = 0;
            if(newPassword.length<6) kt=0
        }
        else{
            kt=0
        }
        if(kt==1){
            socket.emit('saveNewPassword', newPassword, userID)
            $('#text-to-check-data-password')[0].innerHTML = '' 
            $('#oldPassword')[0].value = ''
            $('#newPassword')[0].value = ''
            $('#newPasswordAgain')[0].value = ''
            $('#user-password-profile').value = newPassword
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alert").slideUp(500);
            });
        }else{
            $('#text-to-check-data-password')[0].innerHTML = 'Vui lòng nhập chính xác' 
        }
    })
    // xử lý ấn vào button thêm của thêm địa chỉ
    $('#input-new-address').keypress(function(event) {
        if (event.keyCode == 13 || event.which == 13) {  
            document.getElementById('error-address').innerHTML=''
            var inputNewAddress =  $('#input-new-address').val().trim()
            if(inputNewAddress){
                var userID = $('#user-id-profile').val().trim()
                socket.emit('addAddressUser', userID, inputNewAddress)
            }
            else {
                document.getElementById('error-address').innerHTML='*Địa chỉ không được trống'
            }   
        }
    });
    $('#btn-add-address').click(function(){
        document.getElementById('error-address').innerHTML='' 
    })
    $('#btn-add-address-modal').click(function(){
        var inputNewAddress =  $('#input-new-address').val().trim()
        if(inputNewAddress){
            var userID = $('#user-id-profile').val().trim()
            socket.emit('addAddressUser', userID, inputNewAddress)
        }
        else {
            document.getElementById('error-address').innerHTML='*Địa chỉ không được trống'
        }
    })

    // xử lý xóa địa chỉ
    $('#delete-address-person').on('show.bs.modal', function (event) {
        // lấy ra addressID
        var button = $(event.relatedTarget)
        addressID = button.data('id') 
    })
    $('#modal-update-address').on('show.bs.modal', function (event) {
        // lấy ra addressID
        var button = $(event.relatedTarget)
        addressID = button.data('id') 
    })
    $('.trash').click(function(){
        position = $(this).attr('name')
    })
    $('#btn-delete-address').click(function(){
        var userID = $('#user-id-profile').val().trim()
        socket.emit('deleteAddress', userID, addressID)
        deleteDiv = $('#div-add-address').children()
        deleteDiv = deleteDiv[position]
        deleteDiv.remove()

        // cập nhật lại
        var n = $('#div-add-address').children().length
        for(var i = position; i < n-1; i++){
            var children = $('#div-add-address').children()[i]
            children = $(children).children()
            var children0 = $(children).children()[0]
            var children3 = $(children).children()[3]
            children0.innerHTML = "Địa chỉ " + i +":"
            $(children3).attr('name', i)
        }
    })

    // update địa chỉ
    $('.restore').click(function(){
        document.getElementById('error-address-update').innerHTML=''
        var parent = $(this).parent()[0]
        inputUpdateAddress = $(parent).children()[0]
        var text = $(inputUpdateAddress).val().trim()
        $('#input-new-address-update').val(text)
    })

    
    $('#btn-update-address-modal').click(function(){
        var text = $('#input-new-address-update').val().trim()
        if(text){
            $(inputUpdateAddress).val(text)
            var userID = $('#user-id-profile').val().trim()
            socket.emit('updateAddress', userID, addressID, text)
            $('#modal-update-address').modal('hide')
        }
        else{
            document.getElementById('error-address-update').innerHTML='*Địa chỉ không được trống'
        }
    })

})