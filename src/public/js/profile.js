var socket = io.connect(`http://localhost:3000`)


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
})