

document.addEventListener('DOMContentLoaded', function(){
    $('#div-edit-profile').click(function(){
        window.location = '/me/stored/foods'
    })
    // lưu dữ liệu của hàng
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
    // sự kiện click vào các thẻ li
    $('li.rederect').click(function(){
        var hrefLi = $(this).attr('hrefLi')
        window.location = '/me/restaurant/' + hrefLi
    })
    // sự kiện xóa đơn hàng đang chuẩn bị
        // lấy ra orderID
    var orderID
    var deleteForm = document.forms['order-form-hiden']
    $('#delete-order').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        orderID = button.data('id') 
    })
    $('#btn-delete-order').click(function(){
        deleteForm.action = '/order/cancelled/'+orderID+'?_method=PATCH'
        deleteForm.submit()
    })

    // sự kiện ấn vào button giao hàng
    $('#btn-ship').click(function(){
        var div = $(this).parent()[0]
        var input = $(div).children()[2]
        var orderIDShip = $(input).val()
        deleteForm.action = '/order/shipping/'+orderIDShip+'?_method=PATCH'
        deleteForm.submit()
    })
})