

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
    var dataRealtime
    var deleteForm = document.forms['order-form-hiden']
    $('#delete-order').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        orderID = button.data('id') 
    })
    $('#delete-order-realtime').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget)
        dataRealtime = button.data('id') 
    })
    $('#btn-delete-order').click(function(){
        deleteForm.action = '/order/cancelled/'+orderID+'?_method=PATCH'
        deleteForm.submit()
    })
    var deleteFormRealtime2 = document.forms['order-form-hiden-realtime2']
    $('#btn-delete-order-realtime').click(function(){
        var formatDataRealtime = dataRealtime.split('_')
        var keyRandom = formatDataRealtime[0]
        var idAuthorFood = formatDataRealtime[1]
        var idUser = formatDataRealtime[2]
        input1 = `<input type='hidden' value=${keyRandom} name='keyRandom'/>`
        $('#order-div-hidden-realtime2').append(input1)
        input2 = `<input type='hidden' value=${idAuthorFood} name='idAuthorFood'/>`
        $('#order-div-hidden-realtime2').append(input2)
        input3 = `<input type='hidden' value=${idUser} name='idUser'/>`
        $('#order-div-hidden-realtime2').append(input3)
        deleteFormRealtime2.action = '/order/cancelledRealtime?_method=PATCH'
        deleteFormRealtime2.submit()
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
    socket.on('handleOrderInPreparePage',function(fullnameUser,imageUser,listCartName,listCartPrice,listCartQuantily,listCartImage,cost,keyRandom,idAuthorFood,idUser){
        var idUserAuthorFood = $('#idUser').val()
        if(idUserAuthorFood==idAuthorFood&&$('#pageRestaurantPrepare').length){
            var input = ''
            input+=`<div class="product-details mr-2 card" style="margin-bottom: 15px;">
                        <div class="d-flex justify-content-between align-items-center p-2">
                            <div class="d-flex flex-row">`
            if(imageUser){
                input+=`<img src="${imageUser}" width="30"
                            style="border-radius: 15px;border: 1px solid #BDB76B">`
            }
            else {
                input+=`<img src="https://bootdey.com/img/Content/avatar/avatar7.png" width="30"
                            style="border-radius: 15px; border: 1px solid #BDB76B">`
            }
            var dataRealtime = keyRandom+'_'+idAuthorFood+'_'+idUser
            input +=`<div class="ml-1"><span >${fullnameUser}</span></div>
                        </div>
                            <div class="d-flex flex-row align-items-center">
                            <button type="button" class="btn btn-danger" 
                                data-toggle="modal" data-target="#delete-order-realtime" data-id="${dataRealtime}"
                                style="margin-right: 5px; padding: 5px 10px 5px 10px; text-transform:none;">Hủy
                            </button>
                            <button type="button" class="btn btn-primary btn-ship-realtime"
                                style="padding: 5px 10px 5px 10px; text-transform:none;">Giao hàng
                            </button>
                            <input type="hidden" value="${keyRandom}"/>
                            <input type="hidden" value="${idAuthorFood}"/>
                            <input type="hidden" value="${idUser}"/>
                        </div>
                    </div>
                    <hr style="border: 1px solid #cfcfcf; margin: 8px 0px 0px 0px;">`
            for(var i = 0; i < listCartName.length; i++){
                input +=`<div class="d-flex justify-content-between align-items-center mt-3 p-2">
                            <div class="d-flex flex-row"><img src="${listCartImage[i]}" width="50">
                                <div class="ml-2"><span class="font-weight-bold d-block">${listCartName[i]}</span><span class="spec" style="font-size: 15px;">x ${listCartQuantily[i]}</span></div>
                            </div>
                            <div class="d-flex flex-row align-items-center"><span class="d-block"></span><span class="d-block ml-5 font-weight-bold">`
                var fomatListCartPrice = parseInt(listCartPrice[i])
                fomatListCartPrice=fomatListCartPrice.toLocaleString()
                input +=`${fomatListCartPrice}đ</span><i class="fa fa-trash-o ml-3 text-black-50"style="visibility: hidden;"></i></div>
                        </div>`
            }
            input +=`<div class="d-flex justify-content-between align-items-center mt-3 p-2 items rounded" style="background-color: #f8f8ec;">
                            <div class="d-flex flex-row align-items-center ml-auto" style="background-color: #f8f8ec;" >
                                <span class="d-block">Tổng số tiền:</span>
                                <span class="d-block ml-5 font-weight-bold" style="color: #EE4D2D;">`
            cost=parseInt(cost)
            cost=cost.toLocaleString()
            input +=`${cost}đ</span>
                                <i class="fa fa-trash-o ml-3 text-black-50" style="visibility: hidden;"></i>
                            </div>
                        </div>
                    </div>`
            $('#divHandlePreparePage').append(input)
            var deleteFormRealtime = document.forms['order-form-hiden-realtime']
            $('.btn-ship-realtime').click(function(){
                var div = $(this).parent()[0]
                var input1 = $(div).children()[2]
                var input2 = $(div).children()[3]
                var input3 = $(div).children()[4]
                var keyRandom = $(input1).val()
                var idAuthorFood = $(input2).val()
                var idUser = $(input3).val()
                input1 = `<input type='hidden' value=${keyRandom} name='keyRandom'/>`
                $('#order-div-hidden-realtime').append(input1)
                input2 = `<input type='hidden' value=${idAuthorFood} name='idAuthorFood'/>`
                $('#order-div-hidden-realtime').append(input2)
                input3 = `<input type='hidden' value=${idUser} name='idUser'/>`
                $('#order-div-hidden-realtime').append(input3)
                deleteFormRealtime.action = '/order/shippingRealtime?_method=PATCH'
                deleteFormRealtime.submit()
            })
        }        
    })
})