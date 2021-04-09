

document.addEventListener('DOMContentLoaded', function(){
    $('#div-edit-profile').click(function(){
        window.location = '/me/stored/foods'
    })

    $('#btn-save-restaurant-info').click(function(){
        var checkData = 1;
        var restaurantAddress = $('#restaurantAddress').val().trim()
        var restaurantName = $('#restaurantName').val().trim()
        var idUser = $('#idUser').val()
        // kiểm tra dữ liệu
        if(restaurantAddress==null||restaurantAddress==''){
            checkData = 0
        }
        if(restaurantName==null||restaurantName==''){
            checkData = 0
        }
        // tiến hành lưu trữ dữ liệu
        if(checkData==0){
            $('#text-to-check-data-restaurant-info').text('Vui lòng nhập chính xác')
        }
        else{
            socket.emit('saveRestaurantInfo', idUser, restaurantName, restaurantAddress)
            $('#StrongRestaurantName').text('Shop '+restaurantName)
            // thông báo thành công
            $("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
                $("#success-alert").slideUp(500);
            });
            $('#text-to-check-data-restaurant-info').text('')
        }
    })
})