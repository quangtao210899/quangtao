document.addEventListener('DOMContentLoaded', function(){

    $('.card-course-item').click(function(){
        window.location = '/foods/' + $(this).attr('slug')
    })
    if($('#searchFood').val()){
        var value=$('#searchFood').val()

        $('#searchFood').css('width', '100%')
        $('#searchFood').css('color', 'black')
        $('#searchFood').css('border-color', '#66CC75')
        $('#searchFood').css('background-color', '#fff')
        $('#searchFood').css('padding-left', '32px')
        $('#searchFood').css('cursor', 'auto')
        $('#searchFood').css('cursor', 'auto')
        $('#searchFood').css('cursor', 'auto')
        $('#searchFood').css('cursor', 'auto')      
    }
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

    $('#seach-homepage').submit(function(e){
        e.preventDefault()
        var query = $('#searchFood').val().trim()
        if(query){
            window.location= '/?query='+query
        }
    })

    $('#seach-homepage-type').submit(function(e){
        e.preventDefault()
        var query = $('#searchFood').val().trim()
        var typeFood = $('#inputHiddenTypeFood').val()
        if(query){
            window.location= '/foods?type='+typeFood+'&&query='+query
        }
    })


})