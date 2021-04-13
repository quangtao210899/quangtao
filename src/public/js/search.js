document.addEventListener('DOMContentLoaded', function(){
    $('#searchFood').blur(function(){
        $(this).css('border-color', '#D65106')
        $(this).css('background-color', '#ededed')
        if($('#searchFood').val()){
            $(this).css('width', '100%')
            $(this).css('padding-left', '32px')
            $(this).css('color', '#000')
            $(this).css('cursor', 'auto')
        }
        else {
            $(this).css('width', '-20px')
            $(this).css('padding-right', '4px')
        }
    })

    $('#searchFood').focus(function(){
        $(this).css('width', '100%')
        $(this).css('border-color', '#66CC75')
        $(this).css('background-color', '#fff')
        $(this).css('padding-left', '32px')
        $(this).css('cursor', 'auto')
        $(this).css('cursor', 'auto')
        $(this).css('cursor', 'auto')
        $(this).css('cursor', 'auto')

    })

    // $('#searchFood').click(function(){
    //     $(this).addClass('search-focus')
    // })


})