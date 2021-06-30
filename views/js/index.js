$(function(){
    $('#ytBtn').click(function(event){
        const endpoint = `${window.location.origin}/youtube`
        const data = {
            channelId: $('#channelId').val()
        }
        $.ajax({
            type: "POST",
            url: endpoint,
            dataType: "text", //預期回傳的型態 不對會觸發error
            data: data,
            success: function(response) {
                $('#ytSuccess').show()
                $('#ytError').hide()
            },
            error: function (thrownError) {
                $('#ytSuccess').hide()
                $('#ytError').show()
            }
        })
    })

    $('#fbBtn').click(function(event){
        const endpoint = `${window.location.origin}/facebook`
        const data = {
            facebookId: $('#facebookId').val()
        }
        $.ajax({
            type: "POST",
            url: endpoint,
            dataType: "text", //預期回傳的型態 不對會觸發error
            data: data,
            success: function (response) {
                $('#fbSuccess').show()
                $('#fberror').hide()
            },
            error: function (thrownError) {
                $('#fbSuccess').hide()
                $('#fberror').show()
            }
        });
    })

    $('#igBtn').click(function(event){
        const endpoint = `${window.location.origin}/instagram`
        const data = {
            instagramUserName: $('#instagramUserName').val()
        }
        $.ajax({
            type: "POST",
            url: endpoint,
            dataType: "text", //預期回傳的型態 不對會觸發error
            data: data,
            success: function(response) {
                $('#igSuccess').show()
                $('#igError').hide()
            },
            error: function (thrownError) {
                $('#igSuccess').hide()
                $('#igError').show()
            }
        })
    })
})