var myProfile = {
    
}

$(function(){
    $("#avatar_camara").live('click',function(){
        Cordova.captureImage('avatar');
        $("#select_data_avatar_dialog").dialog('close');
    });
    $("#avatar_galeria").live('click',function(){
        Cordova.getPhoto(Cordova.pictureSource.PHOTOLIBRARY, "avatar");
        $("#select_data_avatar_dialog").dialog('close');
    });
    $("#descarga").live('click',function(){
        console.log($("#descarga_url").val());
        core.downFile($("#descarga_url").val(), true, true, "image/jpeg");
    });
});