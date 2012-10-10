var Cordova = {
    pictureSource: null,
    mediaType: null,
    destinationType: null,
    CONNECTION_TYPE: null,
    CONNECTION_STATUS: null,
    onDeviceReady: function(){
        Cordova.pictureSource = navigator.camera.PictureSourceType;
        Cordova.destinationType = navigator.camera.DestinationType;
        Cordova.mediaType = navigator.camera.MediaType;
        Cordova.checkConnection();
        document.addEventListener("pause",Cordova.onPause,false);
        document.addEventListener("online", Cordova.onOnLine, false);
        document.addEventListener("offline", Cordova.onOffLine, false);
        window.requestFileSystem(LocalFileSystem.PERSISTENT,0,Cordova.onFileSystemSuccess,Cordova.fail);
        document.addEventListener("offline", Cordova.offlineService, false);
        document.addEventListener("online", Cordova.onlineService, false);
        Cordova.checkConnection();
    },
    onPause: function(){
    },
    checkConnection: function(){
        var networkState = navigator.network.connection.type;
        var states = {};
        states[Connection.UNKNOWN] = 'unknow';
        states[Connection.ETHERNET] = 'ethernet';
        states[Connection.WIFI] = 'wifi';
        states[Connection.CELL_2G] = '2g';
        states[Connection.CELL_3G] = '3g';
        states[Connection.CELL_4G] = '4g';
        states[Connection.NONE] = 'none';
        Cordova.CONNECTION_TYPE = states[networkState];
    },
    onOnLine: function(){
        Cordova.checkConnection();
        Cordova.CONNECTION_STATUS = "online";
        console.log(Cordova.CONNECTION_STATUS);
    },
    onOffLine: function(){
        Cordova.checkConnection();
        Cordova.CONNECTION_STATUS = "offline";
    },
    onFileSystemSuccess: function(fileSystem){
        console.log("fileSystem");
        console.log(fileSystem.name);
    },
    fail: function(evt){
        console.log(evt.target.error.code);
    },
    availableConnection: function(){
        var connectionStatus = navigator.network.connection.type;        
        if(connectionStatus === Connection.NONE)
            return false
        else
            return true;
    },
    offlineService: function(){
        
    },
    onlineService: function(){
    
    },
    buildTimeMessage: function(from,to,msg,file){
        $("#dinamicLinkPage").attr("href",'#chat').trigger('click');
        $timemoment = new Date().getTime();
        $chatDivElement = core.getChatDivForJID(core.current_user);
        $elemento = null;
        $(document).trigger('sendTimeMessage',{msg:msg,from:from ,to:to ,type:"chat",time:core.getTime(),file:file,timestamp:$timemoment});
        $(document).trigger('printChatList',{msg:"archivo...",to:to,time:core.getTime(),notif:false,send:true});
        $.each($chatDivElement.children(),function(id,va){
            if($(va).find(".box").find(".progressbar").attr("timestamp") == $timemoment){
                $elemento = $(va).find(".box").find(".progressbar").find("#progressbar");
                return false;
            }
        });
        var options = {'elemento':$elemento,'timemoment':$timemoment};
        return options;
    },
    buildTimePlace: function(from,to,place,object,isImage,datos){
        $("#dinamicLinkPage").attr("href",'#chat').trigger('click');
        $timemoment = new Date().getTime();
        $(document).trigger('sendTimePlace',{place:place,object:object,isImage:isImage,datos:datos,from:from ,to:to ,type:"chat",time:core.getTime(),timestamp:$timemoment});
        $(document).trigger('printChatList',{msg:"Ubicación...",to:to,time:core.getTime(),notif:false,send:true});
    },
    captureSuccess: function(mediaFiles,send){
        var i, len, options;
        if(send == "map"){
            options = {'elemento': $("#options_maps_send_dialog").find("#contenido").find(".map_location_photo").find(".progressbar").find("#progressbar"), 'timemoment': new Date().getTime()};
        }else if(send == "message"){
            options = Cordova.buildTimeMessage(core.connection.jid,core.current_user,"",true);
        }else if(send == "avatar"){
            $(document).trigger('showDialogNotif', {clase:"success",html:"<div class='notification error'>Listo, tu avatar <br/>se cargara en unos momentos!</div>"});
            $("#profile").find("#profile_content").find("#profileimg img").attr('src',"images/loading.gif");
            options = {'elemento': $("#profile").find("#profile_content").find("#profileimg img"), 'timemoment':new Date().getTime()};
        }else if(send == "bkgCanvas_cam"){
            $.blockUI({message: '<h4><img src="images/loading42.gif" width="25px" heigth="25px" /> Procesando... </h4>'});
            options = {'elemento': null, 'timemoment':new Date().getTime()};
        }
        for(i=0, len=mediaFiles.length; i<len; i+=1){
            Cordova.uploadFile(mediaFiles[i],options.elemento,options.timemoment,core.connection.jid,core.current_user,send);
        }
    },
    captureError: function(error){
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg,null,'Uh oh!');
    },
    onPhotoURISuccess: function(imageURI,type,send){
        console.log(imageURI);
        if(send=="message"){
            var options = Cordova.buildTimeMessage(core.connection.jid,core.current_user,"",true);
        }else if(send == "avatar"){
            $(document).trigger('showDialogNotif', {clase:"success",html:"<div class='notification error'>Listo, tu avatar <br/>se cargara en unos momentos!</div>"});
            $("#profile").find("#profile_content").find("#profileimg img").attr('src',"images/loading.gif");
            options = {'elemento': $("#profile").find("#profile_content").find("#profileimg img"), 'timemoment':new Date().getTime()};
        }else if(send == "bkgCanvas_cam"){
            $.blockUI({message: '<h4><img src="images/loading42.gif" width="25px" heigth="25px" /> Procesando... </h4>'});
            options = {'elemento': null, 'timemoment':new Date().getTime()};
        }
        var name = imageURI.substring(imageURI.lastIndexOf('/')+1) + "." + type.substring(type.indexOf("/")+1,type.length);
        var mediaFile = {'fullPath':imageURI,'name':name,'type':type};
        Cordova.uploadFile(mediaFile, options.elemento, options.timemoment,core.connection.jid,core.current_user,send);
    },
    onFail: function(message){
        alert('Failed because: ' + message);
    },
    captureAudio: function(){
        navigator.device.capture.captureAudio(function(mediaFiles){
            Cordova.captureSuccess(mediaFiles,"message");
        },Cordova.captureError,{limit:1});
    },
    captureImage: function(send){
        navigator.device.capture.captureImage(function(mediaFiles){
            Cordova.captureSuccess(mediaFiles,send);
        },function(error){
            if(send=="map"){
                $("#options_maps_send_dialog").find("#contenido").find("#checkbox_map_pic").attr("checked",false).checkboxradio("refresh");
                $("#options_maps_send_dialog").find("#contenido").find("#checkbox_map_pic").checkboxradio("enable");
                $("#options_maps_send_dialog").find("#contenido").append("<a href='#' id='place_button' data-role='button'>ok!</a>");
                $("#options_maps_send_dialog").find("#contenido").find("#place_button").button();
                Cordova.captureError(error);
            }else{
                Cordova.captureError(error);
            }
        },{limit:1});
    },
    captureVideo: function(){
        navigator.device.capture.captureVideo(function(mediaFiles){
            Cordova.captureSuccess(mediaFiles,"message");
        },Cordova.captureError,{limit:1});
    },
    getPhoto: function(source,send){
        navigator.camera.getPicture(function(imageURI){
            Cordova.onPhotoURISuccess(imageURI,"image/jpeg",send);
        },Cordova.onFail,{quality:30,destinationType:Cordova.destinationType.FILE_URI,sourceType:source});  //checar quality!
    },
    getVideo: function(source,media){
        navigator.camera.getPicture(function(imageURI){
            Cordova.onPhotoURISuccess(imageURI,"video/m4v","message");
        },Cordova.onFail,{quality:50,destinationType:Cordova.destinationType.FILE_URI,sourceType:source,mediaType:media});
    },
    getAudio: function(source,media){
        navigator.camera.getPicture(function(imageURI){
            Cordova.onPhotoURISuccess(imageURI,"audio/3gpp","message");
        },Cordova.onFail,{quality:50,destinationType:Cordova.destinationType.FILE_URI,sourceType:source,mediaType:media});
    },
    uploadFile: function(mediaFile,elemento,timemoment,from,to,send){
        var path = mediaFile.fullPath, name = mediaFile.name, type = mediaFile.type;
        //send = typeof(send)==="undefined"?true:send;
        console.log(JSON.stringify(mediaFile));
        var ft = new FileTransfer();
        ft.upload(
            path,
            encodeURI("http://" + config.SERV + "/" + config.DOMAIN +"/php/upload_file.php"),
            function(info){
                Cordova.onUploadSuccess(info,elemento,timemoment,send);
            },
            Cordova.onUploadError,
            {"fileKey":"file", "fileName":name, "mimeType":type, "params":{from:from,to:to,timemoment:timemoment,send:send}},
            true
        );
    },
    downloadFile: function(uri,type){
        console.log(type);
        var dir = "/mnt/sdcard/InContact/media/" + $.trim(type);
        console.log(dir);
        plugins.downloader.downloadFile(
            uri,
            {dirName:dir,overwrite:true},
            function(res){
                Cordova.onDownloadSuccess(res,type,uri);
                console.log(JSON.stringify(res));
            },function(error){
                $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification error'>Falló la descarga. <br/>" + error + "</div>"});
            }
        );
    },
    onUploadSuccess: function(info,elemento,timemoment,send){
        //$elemento = $("#progressbar");
        console.log(JSON.stringify(info));
        if(typeof(info.progress) != "undefined"){
            $progress = Math.round((info.progress / info.total)*100);
            elemento.css("display","block");
            elemento.children().css('width', $progress + '%');
        }
        //if(typeof info.result !== "undefined"){
        if(typeof info.response !== "undefined"){
            //var decode_json = eval("(" + info.result + ")");
            var decode_json = eval("(" + info.response + ")");
            $fileType = decode_json.type;
            if(elemento != null){
                elemento.children().css("width","0px");
            }            
            if(send == "message"){
                elemento.children().remove();
                elemento.removeClass("meter animate");
                var msg;
                switch($fileType){
                    case "image":
                        msg = "<a href='#view_img' onclick=\"core.downFile(\'" + decode_json.url + "\'," + true + "," + true + ", \'" + $fileType +" \');\"><img class='avatarIcon' src='" + unescape(decode_json.thumbnail) + "' /></a>";
                    break;
                    case "video":
                        msg = "<a href='#view_img' onclick=\"core.downFile(\'" + decode_json.url + "\'," + true + "," + false + ", \'" + $fileType +" \');\"><img class='avatarIcon' src='" + unescape(decode_json.thumbnail) + "' /></a>";
                    break;
                    case "audio":
                        msg = "<a href='#view_img' onclick=\"core.downFile(\'" + decode_json.url + "\'," + true + "," + false + ", \'" + $fileType +" \');\"><img class='avatarIcon' src='" + unescape(decode_json.thumbnail) + "' /></a>";
                    break;
                }
                elemento.append(msg);
                //elemento.append("<a href='#view_img' onclick=\"core.downFile(\'" + decode_json.url + "\'," + true + "," + ($fileType=="image"?true:false) + ");\"><img class='avatarIcon' src='" + decode_json.thumbnail + "' /></a>");
                $type = decode_json.to.indexOf("@chat.")>-1?"groupchat":"chat";
                var msgSend = $msg({
                    to:decode_json.to,
                    type:$type,
                    from:decode_json.from,
                    fileType:$fileType,
                    thumbail:decode_json.thumbnail,timestamp:timemoment}).c('body', {
                    xmlns:'http://jabber.org/protocol/ibb',
                    seq: 0,
                    chunks:1,
                    sid:"urlimage"
                }).t(decode_json.url != "" ? decode_json.url : ""  ).up().c("time").t(core.getTime()).tree();
                core.sendStanzaConnection(msgSend, decode_json.to, timemoment, true, function(send){
                    if(send){
                        $(document).trigger('showSendStamp',{timestamp:timemoment,jid:decode_json.to});
                    }
                });
                //core.connection.send($msgSend);
            }else if(send == "map"){
                $("#options_maps_send_dialog").find("#contenido").find("#place_thumb_url").val(decode_json.thumbnail + "|" + decode_json.url);
                var object = mapapp.getPlaceObject($("#options_maps_send_dialog").find("#contenido").find("#place_id").val());
                var request = {reference: object.reference};
                if(object.id === "my_actual_location"){
                    mapapp.buildAndSendMapPlace("",object,elemento); //se tomo foto
                }else{
                    mapapp.service.getDetails(request,function(place,status){
                        if(status == google.maps.places.PlacesServiceStatus.OK){
                            mapapp.buildAndSendMapPlace(place,object,elemento);
                        }
                    });
                }
            }else if(send == "avatar"){
                console.log(decode_json.sha1);
                console.log(decode_json.url);
                core.current_avatar = "data:image/png;base64," + decode_json.img_b64;
                $(elemento).attr("src",core.current_avatar);
                $("#profile").find("#profile_content").find("#descarga_url").val(decode_json.url);
                $data = {img_b64:decode_json.img_b64,sha1:decode_json.sha1,uri:decode_json.url};
                core.setAvatar($data);
            }else if(send == "bkgCanvas_cam"){
                var img = new Image();
                console.log(JSON.stringify(info));
                var id_file = decode_json.url;
                img.src = id_file;
                route = "backImg|"+id_file;
                core.sendStroke(route);
                var canvas = core.getCanvasDivForJID(core.current_user);
                img.onload = function() {
                    canvas.ctxt.drawImage(img, 0, 0, img.width, img.height, 0, 0, 270, 250);
                    $.unblockUI();
                    $("#backgroundDialog").dialog('close');
                };                
            }
        }
    },
    onUploadError: function(error){
        console.log("FAIL " + error);
        console.log(JSON.stringify(error));
    },
    onDownloadSuccess:function(res,type,uri){
        if(res.status == 0){
            $elemento = $("#view_img").find("#content").find(".download_file_bar").find(".progressbar").find("#progressbar");
            $elemento.css("display","block");
            $elemento.children().css('width', res.progress + '%');
        }else if(res.status == 1){
            console.log($.trim(type));
            if($.trim(type)=="audio"){
                $link = "<a href='' uri='" + uri + "' id='open_local_file'>Reproducir</a>";
                $("#view_img").find("#content").append($link);
                $("#view_img").find("#content").find("#open_local_file").button();
            }else if($.trim(type)=="video"){
                var videoURI =  "file://" + res.dir + "/" + res.file;
                $link = "<a href='' uri='" + videoURI + "' file_type='video' id='open_local_file'>Reproducir</a>";
                $("#view_img").find("#content").append($link);
                $("#view_img").find("#content").find("#open_local_file").button();
            }
            $(document).trigger('showDialogNotif', {clase:"success",html:"<div class='notification error'>Listo. <br/>se ha descargado!</div>"});
        }
    },
    getContacts: function(){
        var fields = ["displayName","name","phoneNumbers","photos","emails"];
        navigator.contacts.find(fields,Contacts.onContactsSuccess,Cordova.onUploadError);
        $('#contacts_page').find("#contacts_content ul").html("");
    },
    playAudio: function(uri){
        var my_media = new Media(
            uri,
            function(){
                $(document).trigger('showDialogNotif', {clase:"success",html:"<div class='notification error'>Listo. <br/>se cargó el archivo!</div>"});
            }
            ,function(error){
                $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification error'>Falló al reproducir. <br/>" + error + "</div>"});
            }
        );
        my_media.play();
        Cordova.getAudioProgress(my_media);
    },
    getAudioProgress: function(my_media){
        var mediaTimer = null;
        var i = 0;
        mediaTimer = setInterval(function(){
            my_media.getCurrentPosition(function(position){
                var duration = my_media.getDuration();
                i = i+100;
                console.log(duration);
                console.log(position);
                if(position > -1){
                    $("#view_img").find("#content").find(".file_position").html((position) + " seg.");
                }
                if(duration > -1 && (position+1) > duration){
                    clearInterval(mediaTimer);
                }
                if(i==10000 && duration == -1){ //pasaron 5 seg. y no se reproduce
                    $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification error'>Falló al reproducir. <br/>Intente mas tarde</div>"});
                    my_media.stop();
                    $("#view_img").find("#content").find(".file_position").html("");
                    clearInterval(mediaTimer);
                }
            },function(e){
                console.log("Error getting pos: " + e);
                $("#view_img").find("#content").find(".file_position").html("0 sec");
            });
        },100);
    }
}
$(document).ready(function () {
    document.addEventListener("deviceready",Cordova.onDeviceReady,false);
});
$(function(){
    $("#open_local_file").live('click',function(ev){
        console.log($(this).attr("uri"));
        if($(this).attr("file_type") == "image"){
            Cordova.downloadFile($(this).attr("uri"),$(this).attr("file_type"));
        }else if($(this).attr("file_type") == "video"){
            console.log("video");
            console.log($(this).attr("uri"));
            plugins.videoPlayer.play($(this).attr("uri"));
        }else{
            Cordova.playAudio($(this).attr("uri"));
        }
    });
});