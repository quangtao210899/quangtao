

document.addEventListener('DOMContentLoaded', function(){
    $('#div-edit-profile').click(function(){
        window.location = '/me/stored/foods'
    })
    // lưu dữ liệu cửa hàng
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
    $('.btn-ship').click(function(){
        var div = $(this).parent()[0]
        var input = $(div).children()[2]
        var orderIDShip = $(input).val()
        deleteForm.action = '/order/shipping/'+orderIDShip+'?_method=PATCH'
        deleteForm.submit()
    })
    // sự kiện ấn vào button hoàn thành
    $('.btn-sold').click(function(){
        var div = $(this).parent()[0]
        var input = $(div).children()[2]
        var orderIDShip = $(input).val()
        deleteForm.action = '/order/sold/'+orderIDShip+'?_method=PATCH'
        deleteForm.submit()
    })

    // thông báo ra màn hình
    var notificationType = $('#notificationType').val()
    if(notificationType=='cancelled'){
        $("#success-alert-delete").fadeTo(2000, 500).slideUp(500, function(){
            $("#success-alert-delete").slideUp(500);
        });        
    }
    else if(notificationType=='shipping'){
        $("#success-alert-shipping").fadeTo(2000, 500).slideUp(500, function(){
            $("#success-alert-shipping").slideUp(500);
        });       
    }
    else if(notificationType=='sold'){
        $("#success-alert-sold").fadeTo(2000, 500).slideUp(500, function(){
            $("#success-alert-sold").slideUp(500);
        });       
    }
    // real time trang đơn hàng đang chuẩn bị
    socket.on('handleOrderInPreparePage',function(fullnameUser,imageUser,listCartName,listCartPrice,listCartQuantily,listCartImage,cost){
        if($('#pageRestaurantPrepare').length){
            var input = '<p>Chào</p>'
            // input+=`<div class="product-details mr-2 card" style="margin-bottom: 15px;">
            //             <div class="d-flex justify-content-between align-items-center p-2">
            //                 <div class="d-flex flex-row">`
            // if(imageUser){
            //     input+=`<img src="${imageUser}" width="30"
            //                 style="border-radius: 15px;border: 1px solid #BDB76B">`
            // }
            // else {
            //     input+=`<img src="https://bootdey.com/img/Content/avatar/avatar7.png" width="30"
            //                 style="border-radius: 15px; border: 1px solid #BDB76B">`
            // }
            // input +=`<div class="ml-1"><span >${fullnameUser}</span></div>
            //         </div>
            //         <div class="d-flex flex-row align-items-center">`
            

            $('#divHandlePreparePage').append(input)
        }        
    })
})