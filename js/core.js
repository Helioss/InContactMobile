var core = {
    connection: null,
    host: config.host,
    platform: "",
    seguir: null,
    current_user: null,
    current_user_option: null,
    current_message_edit: null,
    current_avatar: null,
    current_avatarURL: null,
    current_status: null,
    current_show : null,
    current_mood : "cool",
    current_img:{thumb:"",url:""},
    roster_array: [],
    roster_group_array: [],
    roster_elements_array:[],
    unread_message_array:[],
    unread_jid_message_array:[],
    chat_rooms: [],
    construido: false,
    construido_news: false,
    construido_roster: false,
    composing: false,
    reconected: false,
    registerData: null,
    captchaResult: null,
    chatService: config.chatService,
    room:'',
    nickname:'',
    contactsChecks: false,
    started: false,
    canvasForGroup:[],
    canvasOptions: null,
    getTime: function(){
        $now = new Date();
        $time = $now.getHours() + ":" + $now.getMinutes();
        return $time;
    },
    writeData: function(user,pass){
        if(!window.openDatabase){
            if(!localStorage){
                $(document).trigger('connect', {jid: $user,password: $pass});
            }else{
                localStorage["user"] = user;
                localStorage["pass"] = pass;
                //$(document).trigger('connect', {jid: user,password: pass});
            }
        }else{
            db = window.openDatabase($shortName, $version, $displayName, $maxSize);
            db.transaction(function(transaction){
            transaction.executeSql('SELECT * FROM user;',
                    [],
                    function (transaction, result) {
                        if(result.rows.length == 0){
                            db.transaction(function(transaction){
                                transaction.executeSql('INSERT INTO user (user, pass) VALUES (?,?);',
                                [user,pass],
                                function(){
                                    return false;
                                },
                                function(){
                                    return false;
                                });
                            });
                        }else{
                            return false;
                        }
                    },
                    function(){
                });
            });
        }
    },
    captcha: function(){
        var a, b;
        a = Math.ceil(Math.random() * 20);
        b = Math.ceil(Math.random() * 20);
        core.captchaResult = a+b;
        $("#captchaText").text("Escribe el resultado correcto de " + a + " + " + b +"? ");
        $("#captcha").val('');
    },
    log: function (from,msg,clase,time,timestamp,file,archiving,connection) {
        $divStamp = timestamp==""?"":"<div class='timestamp' timestamp=" + timestamp + ">" + 
            "<img class='imgclock' style='display:block' src='images/" + (connection?"send":"clock") + ".gif'>" + 
            "<img class='imgread' style='display:" + (archiving?"block":"none") + "' src='images/readed.gif'>" + 
            "<img class='imgrecv' style='display:" + (archiving?"block":"none") + "' src='images/received.gif'>" + 
        "</div>";
        $file = file?("<div class='progressbar' timestamp=" + timestamp + "><div id=\"progressbar\" class=\"meter animate\"> <span><span></span></span></div></div>"):"";
        $elemento = "";
        $elemento = core.getChatDivForJID(from);
        $data = "<div class='" + clase + "'>" + 
                    "<div class='box'>" +
                        (clase=="recv"?"":$divStamp) +
                        "<div class='arrow-" + clase + "'></div>" +
                        "<div class='mensaje'>" + ($file==""?msg:"<b>Archivo:</b>" + $file) +"</div>" + 
                        "<div class='hora-" + clase + "'>" + time + "</div>" +
                    "</div>" + 
                "</div>"
        if(archiving){
            $elemento.prepend($data);
        }else{
            $elemento.append($data);
            $.mobile.silentScroll($('#chat').find("#content")[0].scrollHeight);
        }
    },
    logPlace: function(from,msg,clase,time,timestamp,place_objects_array,connection){
        console.log(place_objects_array);
        $divStamp = timestamp==""?"":"<div class='timestamp' timestamp=" + timestamp + ">" + 
            "<img class='imgclock' style='display:block' src='images/" + (connection?"send":"clock") + ".gif'>" + 
            "<img class='imgread' style='display:none' src='images/readed.gif'>" + 
            "<img class='imgrecv' style='display:none' src='images/received.gif'>" + 
        "</div>";
        $lat = place_objects_array.lat || place_objects_array.geometry.location.lat();
        $lng = place_objects_array.lng || place_objects_array.geometry.location.lng();
        $hiddenElements = "<input type='hidden' id='place_id' value='" + place_objects_array.id + "'>";
        $hiddenElements += "<input type='hidden' id='place_name' value='" + place_objects_array.name + "'>";
        $hiddenElements += "<input type='hidden' id='place_reference' value='" + place_objects_array.reference + "'>";
        $hiddenElements += "<input type='hidden' id='place_icon' value='" + place_objects_array.icon + "'>";
        $hiddenElements += "<input type='hidden' id='place_lat' value='" + $lat + "'>";
        $hiddenElements += "<input type='hidden' id='place_lng' value='" + $lng + "'>";
        $hiddenElements += "<input type='hidden' id='place_address' value='" + place_objects_array.address + "'>";
        $block = clase=="recv"?"b":"a";
        msg = msg.replace(/"/g,"");
        $elemento = core.getChatDivForJID(from);
        $elemento.append("<div class='" + clase + "'>" + 
                    "<div class='box'>" +
                        (clase=="recv"?"":$divStamp) +
                        "<div class='arrow-" + clase + "'></div>" +
                        "<div class='grid_place_" + clase + "'>" + 
                            "<div class='block_" + $block + "'><div class='mensaje'>" + msg +"</div></div>" + 
                            "<div class='block_" + $block + "'>" + 
                                "<div class='img_place_" + clase + "' timestamp='" + timestamp + "' >" + 
                                    "<a href='#options_maps_send_dialog' class='msg_maps_dialog'>" +
                                        "<img src='images/google_maps_icon.png'>" + $hiddenElements +
                                    "</a>" +
                                "</div>" + 
                            "</div>" + 
                        "</div>" + 
                        "<div class='hora-" + clase + "'>" + time + "</div>" +
                    "</div>" + 
                "</div>");
        //"<a href='" + url + "' target='_blank'><img src='images/google_maps_icon.png'></a></div>"
        $.mobile.silentScroll($('#chat').find("#content")[0].scrollHeight);
    },
    logContact: function(from,data,clase,time,timestamp,connection){
        $divStamp = timestamp==""?"":"<div class='timestamp' timestamp=" + timestamp + ">" + 
            "<img class='imgclock' style='display:block' src='images/" + (connection?"send":"clock") + ".gif'>" + 
            "<img class='imgread' style='display:none' src='images/readed.gif'>" + 
            "<img class='imgrecv' style='display:none' src='images/received.gif'>" + 
        "</div>";
        $elemento = core.getChatDivForJID(from);
        $data = $(data);
        console.log("logContact");
        console.log($data.attr("displayname")); //poner hidden para elementos:
        $hiddenElements = "<input type='hidden' id='contact_id' value='contactrecived " + timestamp + "'>";
        $hiddenElements += "<input type='hidden' id='contact_name_formatted' value='" +     ($data.children().attr("formatted") || '') + "'>";
        $hiddenElements += "<input type='hidden' id='contact_name_familyName' value='" +    ($data.children().attr("familyName") || '') + "'>";
        $hiddenElements += "<input type='hidden' id='contact_name_givenName' value='" +     ($data.children().attr("givenName") || '') + "'>";
        $hiddenElements += "<input type='hidden' id='contact_name_middleName' value='" +    ($data.children().attr("middleName") || '') + "'>";
        $hiddenElements += "<input type='hidden' id='contact_displayname' value='" +        ($data.attr("displayname") || "") + "'>";
        $hiddenElements += "<input type='hidden' id='contact_mobile' value='" +             ($data.attr("mobile") || "") + "'>";
        $hiddenElements += "<input type='hidden' id='contact_home' value='" +               ($data.attr("home") || "") + "'>";
        $hiddenElements += "<input type='hidden' id='contact_work' value='" +               ($data.attr("work") || "") + "'>";
        $hiddenElements += "<input type='hidden' id='contact_workfax' value='" +            ($data.attr("workfax") || "") + "'>";
        $hiddenElements += "<input type='hidden' id='contact_homefax' value='" +            ($data.attr("homefax") || "") + "'>";
        $hiddenElements += "<input type='hidden' id='contact_emailhome' value='" +          ($data.attr("emailhome") || "") + "'>";
        $hiddenElements += "<input type='hidden' id='contact_emailwork' value='" +          ($data.attr("emailwork") || "") + "'>";
        $hiddenElements += "<input type='hidden' id='contact_emailother' value='" +         ($data.attr("emailother") || "") + "'>";
        $hiddenElements += "<input type='hidden' id='contact_photo' value='data:image/gif;base64," + $data.attr("photo") + "'>";
        var mensaje = $elemento.append("<div class='" + clase + "'>" + 
                "<div class='box'>" + 
                    (clase=="recv"?"":$divStamp) +
                    "<div class='arrow-" + clase + "'></div>" +
                    "<div class='msg_contact'>" + 
                        "<span class='contact_button'>" + 
                            "<a href='#select_data_contact_dialog' timestamp='" + timestamp + "' class='link_contact' clase='" + clase + "' data-role='button'>" + 
                                "<img src='data:image/gif;base64," + $data.attr("photo") + "' class='img_contact'>" + 
                                "<span>&nbsp;&nbsp;&nbsp;" + $data.attr("displayname") + "</span>" + $hiddenElements +
                            "</a>" + 
                        "</span>" + 
                    "</div>" +
                    "<div class='hora-" + clase + "'>" + time + "</div>" +
                "</div>" +
            "</div>");
        $span = $(mensaje).find(".msg_contact span");
        $.each($span.children(),function(i,v){
            if($(v).attr("timestamp") == timestamp){
                $(v).button();
            }
        });
        $.mobile.silentScroll($('#chat').find("#content")[0].scrollHeight);
    },
    status: function (status) {
        if (status == Strophe.Status.CONNECTING) {
        } else if (status == Strophe.Status.CONNFAIL) {
        } else if (status == Strophe.Status.DISCONNECTING) {
        } else if (status == Strophe.Status.DISCONNECTED) {
            console.log("Desconectado");
            $(document).trigger('disconnected');
        } else if (status == Strophe.Status.CONNECTED) {
            $(document).trigger('connected');
        }else if(status == Strophe.Status.ERROR){
            $(document).trigger('disconnected');
        }else if(status == Strophe.Status.AUTHFAIL){
            $(document).trigger('failConnected');
        }else if(status == Strophe.Status.ATTACHED){
            //$(document).trigger('connected');
            //$(document).trigger('failConnected');
        }
    },
    ping: function(jid){
        $id = this.connection.getUniqueId("ping");
        var iq = $iq({type:'get',to:jid,id:$id}).c('ping',{xmlns:"urn:xmpp:ping"}).tree();
        this.connection.sendIQ(iq,function(ev){},function(ev){});
    },
    registerUser: function (status) {
        if (status === Strophe.Status.REGISTER) {
            core.connection.register.fields.username = core.registerData.user;
            core.connection.register.fields.password = core.registerData.pswd;
            core.connection.register.fields.email = core.registerData.email;
            core.connection.register.fields.name = core.registerData.nick;
            core.connection.register.submit();
        } else if (status === Strophe.Status.REGISTERED) {
            core.writeData(core.registerData.user, core.registerData.pswd);
            /*localStorage.user = core.registerData.user;
            localStorage.pswd = core.registerData.pswd;*/
            core.connection.disconnect();
            $(document).trigger('connect', {jid: core.registerData.user, password: core.registerData.pswd});
            $("#dinamicLinkPage").attr("href","#roster-page").trigger('click');
        } else if (status === Strophe.Status.CONNECTED) {
        } else if (status === Strophe.Status.SBMTFAIL) {
        } else {
        }
    },
    onMessage: function (msg){
        console.log(msg);
        $from = $(msg).attr("from");
        $from = Strophe.getBareJidFromJid($from);
        $body = $(msg).find("body").text();
        $received = $(msg).find("received").attr("xmlns");
        $read =$(msg).find("x").attr("xmlns");
        $composing = $(msg).find("composing").attr("xmlns");
        $file = $(msg).find('body').attr('xmlns') || "";
        $time = $(msg).find("time").text() || "";
        $place = $(msg).attr('place') || "";
        $canvas = $(msg).attr('canvas') || "";
        $contact = $(msg).attr('contact') || "";
        if ($body.length > 0 && $file == "") {
            $timestamp = $(msg).find("request").attr("timestamp") || "";
            $(document).trigger('sendRecNotif',{from:core.connection.jid,to:$from,timestamp:$timestamp}); //he recibido el mensaje
            if(core.current_user == $from && $(".ui-page-active").attr("id") == "chat"){
                $("#statusChat").text("");
                $elemento = core.getChatListForJID($from,true);
                $elemento.find(".last-message").html("<span class='lastmess messrecv'>&nbsp;&nbsp;&nbsp;&nbsp;</span>" + $body);
                $elemento.find(".ui-li-aside").text($time);
                $elemento.find(".ui-li-count").text(0);
                $elemento.find(".ui-li-count").addClass("hidden");
                $(document).trigger('sendReadNotif',{from:core.connection.jid,to:$from,timestamp:$timestamp}); //he leido el mensaje
            }else{
                $notif_mess = "";
                $notif_body = "";
                if($place != ""){
                    $notif_mess = " te ha enviado su ubicación"
                    $notif_body = "ubicación..."
                }else if($contact != ""){
                    $notif_mess = "Te ha enviado un contacto...";
                    $notif_body = "contacto..."
                }else if($canvas != ""){
                    $notif_mess = " te han inivitado a compartir una pizarra.";
                    $notif_body = "Inicia pizarra";
                }else{
                    $notif_mess = $body.substr(0,30) + ($body.length>30?"...":"");
                    $notif_body = $body;
                }
                $(document).trigger('showNotif',{from:$from,body:$notif_body,time:$time});
                core.unread_message_array.push({
                    'JID': $from,
                    'timestamp': $timestamp
                });
                $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>" + core.getNameForJid($from) + ":<br/>" + $notif_mess + "</div>"});
            }
            if($place == "google_maps"){
                var place_objects_array = [];
                place_objects_array.push({
                    'id':           $(msg).attr('place_id') || "",
                    'name':         $(msg).attr('place_name') || "",
                    'reference':    $(msg).attr('place_reference') || "",
                    'icon':         $(msg).attr('place_icon') || "",
                    'lat':          $(msg).attr('place_lat'),
                    'lng':          $(msg).attr('place_lng'),
                    'address':      $(msg).attr('place_address') || ""
                });
                core.logPlace($from,"<p><b>" + core.getNameForJid($from) + ": </b>" + unescape($body) + "</p>","recv",$time,"",place_objects_array[0],true);
            }else if($contact == "phone_contact"){
                $data = $(msg).find("data");
                core.logContact($from,$data,"recv",$time,$timestamp);
            }else if($canvas == "canvas"){
                $currentCanvas = core.getCanvasDivForJID($from);
                $accesCanvas = "Te invita a visulizar una pizarra <a href='#whiteboard' onclick='core.setElementVisible(\"#canvas"+core.getOnlyJID($from)+"\");'><img src='images/icon_blackboard.png' width='40' height='40' /></a>";
                core.log($from,"<p><b>" + core.getNameForJid($from) + ": </b>" + $accesCanvas + "</p>","recv",$time, "",false);
            }else{
                core.log($from,"<p><b>" + core.getNameForJid($from) + ":</b>" + core.proccesMesage($body) + "</p>","recv",$time,"",false);
            }
        }else{
            if($received==="urn:xmpp:receipts"){//Primer paloma (entregado)
                $timestamp = $(msg).find("received").attr("timestamp");
                $(document).trigger('showTimeStamp',{from:$from,timestamp:$timestamp,readed:false});
            }
            if($read=="jabber:x:event"){//Segunda paloma (leido)
                $(document).trigger('showTimeStamp',{from:$from,timestamp:$(msg).find("delivered").children().text(),readed:true});
            }
            if ($composing=="http://jabber.org/protocol/chatstates") {
                if($from == core.current_user){
                    $("#statusChat").text("Esta escribiendo un mensaje...");
                }
            }
        }
        if($file === "http://jabber.org/protocol/ibb"){
            $id_file = $(msg).find('body').attr('sid');
            $data = $(msg).find("body").text();
            $timestamp = $(msg).attr('timestamp') || "";
            $fileType = $(msg).attr("filetype");
            $thumbail = $(msg).attr("thumbail");
            core.showFile($fileType,$data,$thumbail,$from,$timestamp,$id_file);;
        }else if($file === "http://jabber.org/protocol/muc#user"){
            $invite = $(msg).attr("from");
            $invite = Strophe.getBareJidFromJid($invite);
            var room = $(msg).find('invite').attr("to");
            if($invite != undefined){
                $razon = $(msg).find('invite').find('reason').text();
                if($razon === "auto_join_invitation"){
                    $nick = core.nickname;
                    $(document).trigger('printChatList',{msg:$nick + ' se ha unido.',to:room,time:core.getTime(),notif:false,send:false});
                    var pres = $pres({to: room + "/" + $nick, id:$nick})
                            .c('x',{xmlns:"http://jabber.org/protocol/muc"}).tree();
                    core.connection.send(pres);
                    //core.getChatRooms($room.substr(0, $room.indexOf("@")),true);
                    if(!muc.existMUC(core.getOnlyJID(room))){
                        muc.addRoom(core.getOnlyJID(room), "none");
                    }
                    
                }else{
                    $aliasLocal = core.getNameForJid(Strophe.getBareJidFromJid($invite));
                    $("#chatGroupInvitation_dialog").find("#contenido").find("#addMsg").text($aliasLocal + $razon);
                    $("#chatGroupInvitation_dialog").find("#contenido").find("#roomName").attr("roomName", core.getOnlyJID(room));
                    $("#dinamicLink").attr("href",'#chatGroupInvitation_dialog').trigger('click');
                }
            }
        }
        if($file === "jabber:x:data"){//Recive y manda datos para ser pintados
            //console.log($body);
            if($body != ""){
                var movements=$body.split("|");
                core.receivesAndPaints($from, movements, $time);
            }
        }
        return true;
    },
    receivesAndPaints: function(from, movements, time){//Recive y pinta en canvas correspondiente
        $isGroup = from.indexOf("@chat.")>-1?true:false;
        if($isGroup){
            $sender = from.substr(from.indexOf("/")+1, from.length)+config.host;
            $sender = core.getNameForJid($sender);
            from = from.substr(0, from.indexOf("/"));
        }
        $currentCanvas = core.getCanvasDivForJID(from);
        ctxt = $currentCanvas.ctxt;
        cond = movements[0];
        if(cond == "draw"){
            ctxt.strokeStyle = movements[1].split(",")[0];
            ctxt.lineWidth = movements[1].split(",")[1];

            var mt, lt;

            for(var i=2; i<movements.length; i=i+2){
                mt = movements[i].split(",");
                lt = movements[i+1].split(",");
                ctxt.beginPath();
                ctxt.moveTo(mt[0], mt[1]);
                ctxt.lineTo(lt[0], lt[1]);
                ctxt.stroke();
                ctxt.closePath();
            }
        }
        if(cond == "colorBack"){
            rgba = movements[1];
            ctxt.fillStyle = rgba;
            ctxt.fillRect(0, 0, 270, 250);
        }
        if(cond == "efect"){
            if(movements[1] == "gray"){
                var drawing = ctxt.getImageData(0, 0, 270, 250);
                var avg;
                // skip 4 entries (1 px) at a time
                for (var i = 0; i < drawing.data.length; i = i + 4) {
                avg = (drawing.data[i] + drawing.data[i+1] + drawing.data[i+2]) / 3;
                drawing.data[i] = drawing.data[i+1] = drawing.data[i+2] = avg;
                }
                ctxt.putImageData(drawing, 0, 0);
            }
            if(movements[1] == "negative"){
                var drawing = ctxt.getImageData(0, 0, 270, 250);
                var avg;
                // skip 4 entries (1 px) at a time
                for (var i = 0; i < drawing.data.length; i = i + 4) {
                    drawing.data[i] = 255 - drawing.data[i]; // invert red
                    drawing.data[i+1] = 255 - drawing.data[i+1]; // invert green
                    drawing.data[i+2] = 255 - drawing.data[i+2]; // invert blue
                }
                ctxt.putImageData(drawing, 0, 0);
            }

        }
        if(cond == "backImg"){
            var img = new Image();
                img.src = movements[1];
            img.onload = function() {
                    ctxt.drawImage(img, 0, 0, img.width, img.height, 0, 0, 270, 250);
            };
        }
        if(cond == "endCanvasGroup"){
            $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>La pizarra del grupo: <br/>"+ core.getNameForJid(from) +"<br/>ha sido terminada." + "</div>"});
            $("#"+$currentCanvas.id).parent().remove();
            core.canvasForGroup.splice(from, 1);
            core.log(from, "<p><b>"+ $sender +":</b> Imagen final: <a href='#view_img' onclick=\"core.downFile(\'" + movements[1] + "\',"+true+","+ true+", \'image\');\"><img width='35px' heigth='35px' class='avatarIcon' src='"+movements[1]+"'/></a></p>", "recv",time, "",false);
        }
        if(cond == "showEndCanvas"){
            $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>"+ core.getNameForJid(from) +"<br/> ha enviado el resultado <br/>de la pizarra terminada." + "</div>"});
            core.log(from, "<p><b>"+ core.getNameForJid(from) +":</b> Imagen final: <a href='#view_img' onclick=\"core.downFile(\'"  + movements[1] + "\',"+true+","+ true+", \'image\');\"><img width='35px' heigth='35px' class='avatarIcon' src='"+movements[1]+"'/></a></p>", "recv",time, "",false);
        }
    },
    muc_message: function(msg){
        console.log(msg);
        $body = $(msg).find("body").text();
        $from = $(msg).attr("from");
        $bareFrom = Strophe.getBareJidFromJid($from);
        $jidRoom = $from.substr(0, $from.indexOf("/"));
        $sender = $from.substr($from.indexOf("/")+1, $from.length);
        $chat = $from.substr(0, $from.indexOf("@"));
        $file = $(msg).find('body').attr('xmlns') || "";
        $canvas = $(msg).attr('canvas') || "";
        if($jidRoom.length == 0){
            $jidRoom = $from;
        }
        if ($body.length > 0 && $file=="") {
            $time = $(msg).find("time").text();
            if(core.current_user == null || core.current_user!=$bareFrom){
                $(document).trigger('showNotif',{from:$jidRoom,body:$body,time:$time});
                if($sender.length > 0 && $sender != core.nickname && $from.indexOf("/")>-1){
                    $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>" + $sender + " - " + $chat
                                + ":<br/>" + $body.substr(0,30) + ($body.length>30?"...":"") + "</div>"});
                }
            }
            if($canvas == "canvas" && $sender != core.nickname){
                $currentCanvas = core.createCanvasToSee($from);
                $accesCanvas = "Te invita a visulizar una pizarra <a href='#whiteboard' onclick='core.setElementVisible(\"#canvas"+core.getOnlyJID($from)+"\");'><img src='images/icon_blackboard.png' width='40' height='40' /></a>";
                core.log($from," <p><b>" + core.getNameForJid($sender+core.host) + ":</b>" + $accesCanvas + "</p>","recv",$time, "",false);
                $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>" + $sender + " - " + $chat + ":<br/>"
                        + "Pizarra iniciada." + "</div>"});
            }
            if($canvas == "" && muc.existMUC($chat) && core.verifyMsgGroup($body)){
                if($sender + core.host != Strophe.getBareJidFromJid(core.connection.jid)){
                    core.log($bareFrom,"<p><b>" + core.getNameForJid($sender + core.host) + ":</b>" + core.proccesMesage($body) + "</p>","recv",$time, "",false);
                }
            }
        }
        if($file === "http://jabber.org/protocol/ibb" && $sender != core.nickname){
            $id_file = $(msg).find('body').attr('sid');
            $data = $(msg).find("body").text();
            $timestamp = $(msg).attr('timestamp') || "";
            $fileType = $(msg).attr("filetype");
            $thumbail = $(msg).attr("thumbail");
            core.showFile($fileType,$data,$thumbail,$from,$timestamp,$id_file);;
        }
        if($file === "jabber:x:data"){//Recive y manda datos para ser pintados
            $time = $(msg).find("time").text();
            if($sender.length > 0 && $sender != core.nickname){
                if($body != ""){
                    var movements=$body.split("|");
                    core.receivesAndPaints($from, movements, $time);
                }
            }
        }
        return true;
    },
    setElementVisible: function(elementId){
        $isGroup = core.current_user.indexOf("@chat.")>-1;
        $(elementId).css('display','');
        if($isGroup){
            $("#canvasFooter").css('display','none');
        }
        $("#backChat").attr("href", "#chat");
        $("#BtnBackCanvas").html("Chat");
    },
    onData: function(data){
        console.log(data);
        $type = $(data).attr("type");
        $from = $(data).attr("from");
        $from = Strophe.getBareJidFromJid($from);
        if(typeof($type)==="undefined"){
            $event = $(data).find("event").attr("xmlns");
            $x = $(data).find("x").attr("xmlns");
            $data = $(data).find("data").text();
            $status = $(data).find("status").text();
            $mood = $(data).find("status").attr("mood");
            if($event == "http://jabber.org/protocol/pubsub#event" && $data.length > 0){
                core.setDataForJid($from,$data);
                if($from == Strophe.getBareJidFromJid(core.connection.jid)){
                    core.current_avatar = "data:image/png;base64," + $data;
                }
                $(document).trigger('updateAvatar',{from:$from});
                if(typeof($(data).find("data").attr("uri")) != "undefined"){
                    if($from == Strophe.getBareJidFromJid(core.connection.jid)){
                        core.current_avatarURL = $(data).find("data").attr("uri");
                        $("#descarga_url").val($(data).find("data").attr("uri"));
                        console.log($("#descarga_url").val());
                    }else{
                        core.setDataURLForJid($from, $(data).find("data").attr("uri"));
                    }
                }
            }
            if($x=="http://jabber.org/protocol/muc#user"){
                $invite = $(data).find('invite').attr("from");
                var room = $(data).attr("from");
                if($invite != undefined){
                    $razon = $(data).find('reason').text();
                    if($razon === "auto_join_invitation"){
                        $nick = core.nickname;
                        var pres = $pres({to: room + "/" + $nick, id:$nick})
                                .c('x',{xmlns:"http://jabber.org/protocol/muc"}).tree();
                        core.connection.send(pres);
                        //core.getChatRooms($room.substr(0, $room.indexOf("@")),true);
                        if(!muc.existMUC(core.getOnlyJID(room))){
                            muc.addRoom(core.getOnlyJID(room), "none");
                        }
                        $(document).trigger('printChatList',{msg:$nick + ' se ha unido.',to:room,time:core.getTime(),notif:false,send:false});
                        //$(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>" + core.getNameForJid($room) + "<br/> te haz unido a la sala!</div>"});
                    }else{
                        $aliasLocal = core.getNameForJid(Strophe.getBareJidFromJid($invite));
                        $("#chatGroupInvitation_dialog").find("#contenido").find("#addMsg").text($aliasLocal + $razon);
                        $("#chatGroupInvitation_dialog").find("#contenido").find("#roomName").attr("roomName", core.getOnlyJID(room));
                        $("#dinamicLink").attr("href",'#chatGroupInvitation_dialog').trigger('click');
                    }
                }
            }
            if($status.length > 0){
                $(document).trigger('setStatus',{from:$from,status:$status,press:false});
            }
            if(typeof($mood) != "undefined" && $mood.length > -1){
                $(document).trigger('setMood',{from:$from,mood:$mood});
            }
            //Modificacion, para lanzar invitacion de Pizarra
            if($x == "pizarra"){
                $razon = $(data).find('reason').text();
                $aliasLocal = core.getNameForJid(Strophe.getBareJidFromJid($from));
                
                if($razon == "invitation"){
                    $("#invitationWhiteboard").find("#contenido").find("#addMsg").text($aliasLocal);
                    $("#msgWhieboard").text("Te ha invitado a compartir una pizarra");
                    $("#dinamicLink").attr("href",'#invitationWhiteboard').trigger('click');
                }
                if($razon == "accepted"){
                    //
                    console.log("aceptado");
                }
            }
        }else if($type=="chat"){
            $file = $(data).find('body').attr('xmlns') || "";
            if($file === "http://jabber.org/protocol/muc#user"){
                $invite = $(data).attr("from");
                $invite = Strophe.getBareJidFromJid($invite);
                room = $(data).find('invite').attr("to");
                if($invite != undefined){
                    $razon = $(data).find('invite').find('reason').text();
                    if($razon === "auto_join_invitation"){
                        $nick = core.nickname;
                        var press = $pres({to: room + "/" + $nick, id:$nick})
                                .c('x',{xmlns:"http://jabber.org/protocol/muc"}).tree();
                        core.connection.send(press);
                        $(document).trigger('printChatList',{msg:$nick + ' se ha unido.',to:room,time:core.getTime(),notif:false,send:false});
                    }else{
                        $aliasLocal = core.getNameForJid(Strophe.getBareJidFromJid($invite));
                        $("#chatGroupInvitation_dialog").find("#contenido").find("#addMsg").text($aliasLocal + $razon);
                        $("#chatGroupInvitation_dialog").find("#contenido").find("#roomName").attr("roomName", room.substr(0, room.indexOf("@")));
                        $("#dinamicLink").attr("href",'#chatGroupInvitation_dialog').trigger('click');
                    }
                }
            }
        }
        return true;
    },
    showFile: function(type,data,thumbail,sender,timestamp,id_file){
        var msg;
        $timestamp = timestamp;
        if(id_file==="urlimage"){
            switch(type){
                case "image":
                    msg = "<p><b>Imagen:</b></p><a href='#view_img' onclick=\"core.downFile(\'" + data + "\'," + true + "," + true + ",\'" + type + "\');\"><img src='" + unescape(thumbail) + "' /></a>";
                break;
                case "video":
                    msg = "<p><b>Video:</b></p><a href='#view_img' onclick=\"core.downFile(\'" + data + "\'," + true + "," + false + ",\'" + type + "\');\"><img src='" + unescape(thumbail) + "' /></a>";
                break;
                case "audio":
                    msg = "<p><b>Audio:</b></p><a href='#view_img' onclick=\"core.downFile(\'" + data + "\'," + true + "," + false + ",\'" + type + "\');\"><img src='" + unescape(thumbail) + "' /></a>";
                break;
            }
            core.log($from, msg,"recv",core.getTime(),$timestamp,false);
        }else{
            core.log(sender,msg,"recv",core.getTime(),$timestamp,false);
        }
        
        $type = core.getChatType(sender);
        if($type==="chat"){
            $(document).trigger('sendRecNotif',{from:core.connection.jid,to:sender,timestamp:$timestamp}); //he recibido el mensaje
            if(core.current_user == null || core.current_user!=$from){
                $(document).trigger('showNotif',{from:sender,body:"archivo...",time:core.getTime()});
                core.unread_message_array.push({
                    'JID': sender,
                    'timestamp': $timestamp
                });
                $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>" + core.getNameForJid(sender) + ":<br/>" + " te ha enviado un archivo" + "</div>"});
                $div = core.getChatListForJID(data.from,true);
                if($div==null){
                    $(document).trigger('printChatList',{msg:data.body,to:data.from,time:data.time,notif:true,send:false});
                }else{
                    $div = core.getChatListForJID(data.from,true);
                }
            }else{
                $div.find(".last-message").html("<span class='lastmess messrecv'>&nbsp;&nbsp;&nbsp;&nbsp;</span>Archivo...");
                $div.find(".ui-li-aside").text(core.getTime());
                $div.find(".ui-li-count").text(0);
                $div.find(".ui-li-count").addClass("hidden");
                $(document).trigger('sendReadNotif',{from:core.connection.jid,to:sender,timestamp:$timestamp}); //he leido el mensaje
            }
        }
    },
    on_roster: function (iq) {
        console.log(iq);
        $(iq).find('item').each(function () {
            $jid = $(this).attr('jid');
            $name = $(this).attr('name') || $jid.substring(0,$jid.indexOf("@"));
            $group = [];
            $(this).find('group').each(function(){
                $group.push({
                    'grupo':$(this).text()
                });
            });
            if($group.length == 0){
                $group.push({
                    'grupo':'Otros'
                });
            }
            //$group = $(this).children().text() || "Otros";
            core.roster_array.push({
                'JID':$jid,
                'name':$name,
                'show': "offline",
                'status': "",
                'last': "none",
                'data': "none",
                'mood': "cool",
                'dataURL': "none",
                'chatDiv': null
            });
            core.roster_group_array.push({
                'JID':$jid,
                'group':$group
            });
            core.roster_elements_array.push({
                'JID': $jid,
                'chatDiv': null,
                'rosterList': [],
                'chatList': null,
                'canvasDiv': null
            });
        });
        console.log(core.roster_group_array);
        // set up presence handler and send initial presence
        core.connection.addHandler(core.on_presence, null, "presence");
        core.connection.send($pres());
        core.current_show = "chat";
        if(!core.reconected){
            if(core.roster_array.length!==0){
                /*Ordena el arreglo del roster*/
                core.roster_array.sort(function(a, b){
                    if (a.name == b.name) {return 0;}
                    if (a.name > b.name){
                        return 1;
                    }else{return -1;}
                });
                $(document).trigger('llenaRoster');
                core.construido_roster = true;
            }
        }
    },
    set_icon: function(icon){
        core.current_mood = icon;
        $("#status").find(".mood_icon").attr("src", "images/"+icon+".png");
    },
    on_presence: function(presence){
        console.log(presence);
        var type = $(presence).attr('type');
        $from = $(presence).attr("from");
        $from = Strophe.getBareJidFromJid($from);
        $show = $(presence).find("show").text();
        $mood = $(presence).find("icono").text();
        $status = $(presence).find("status").text();
        if(type !== "error"){
            if(core.getChatType($from) == "groupchat"){
                if(type == "unavailable"){
                    var jid = $(presence).find("x").find("item").attr("jid") || "";
                    var affiliation = $(presence).find("x").find("item").attr("affiliation") || "";
                    var member = core.getOnlyJID(jid);
                    var room = core.getOnlyJID($from);
                    $elemento = core.getChatDivForJID($from);
                    if(jid != "" && core.nickname != core.getOnlyJID(jid)){
                        jid = Strophe.getBareJidFromJid(jid);
                        $elemento.append("<div class='notification_group'><div class='alert'>" + core.getNameForJid(jid) + " salio de la sala</div></div>");
                        muc.removeMemberMUC(room, member);
                    }
                    if(jid == "" && affiliation == "none"){
                        $elemento.append("<div class='notification_group'><div class='alert'> ChatGroup Terminado</div></div>");
                        muc.roomsArray[room].status = "finished";
                        if(core.current_user == $from){
                            $("#chat_footer").css('display', 'none');
                        }
                    }
                }
            }
            $show = type=="unavailable"?"offline":$show;
            //status
            if($status.length > 0 && core.getStatusForJid($from)!=$status){
                $(document).trigger('setStatus',{from:$from,status:$status,press:true});
            }
            //Mood
            if($mood.length > 0 && core.getMoodForJid($from)!=$mood){
                $(document).trigger('setMood',{from:Strophe.getBareJidFromJid($from),mood:$mood});
            }
            if($show.length >= 0){
                if(type === 'subscribe'){
                    var accepted = $(presence).find("accepted").text();
                    if(accepted==="accepted"){
                        core.connection.send($pres({to: $from, type: "subscribed"}));
                        $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>" + "El usuario " + core.getNameForJid($from) + " te ha aceptado"});
                        //$("#accepted_dialog").find("#contenido").find("#addAceptMsg").text("El usuario " + $from + "te ha aceptado");
                        //$("#dinamicLink").attr("href",'#accepted_dialog').trigger('click');
                    }else{
                        //Disparar dialogo
                        $("#accept_reject_dialog").find("#contenido").find("#jid").attr("jid",$from);
                        $("#accept_reject_dialog").find("#contenido").find("#addMsg").text($from + " te ha invitado a ser amigos.");
                        $("#dinamicLink").attr("href",'#accept_reject_dialog').trigger('click');
                    }
                }else{
                    core.setShowForJid($from,$show==""?"chat":$show);
                    core.setLastForJid($from,"none");
                    if(core.current_user !== null && core.current_user === $from && core.getChatType($from) == "chat"){
                        $header = $("#chat").find(".ui-header").find("#userHeader");
                        $header.attr("class",($show==""?"chat":$show));
                        $header.addClass("ui-title");
                    }
                }
            }
            //se unió a chat - group
            if(core.getChatType($from) == "groupchat" && type != "unavailable"){
                $jid = $(presence).find("x").find("item").attr("jid");
                $jid = Strophe.getBareJidFromJid($jid);
                var member = core.getOnlyJID($jid);
                var room = core.getOnlyJID($from);
                if($jid != Strophe.getBareJidFromJid(core.connection.jid) && muc.roomsArray[room].members[member] == undefined){
                    muc.roomsArray[room].members[member] = member;
                    $elemento = core.getChatDivForJID($from);
                    $elemento.append("<div class='notification_group'><div class='info'>" + core.getNameForJid($jid) + " se ha unido</div></div>");
                }
            }
        }
        return true;
    },
    accept_reject: function(val, from){
        if(val){//Si acepta
           core.connection.send($pres({type: 'subscribed', to:from}));
           core.connection.send($pres({type: 'subscribe', to:from}).c("accepted").t("accepted"));
        }
        else{
            //core.connection.send($pres({to: from, type: 'unsubscribe'}));
            core.connection.send($pres({to: from, type: "unsubscribed"}));
            core.connection.send($pres({to: from, type: "unavailable"}));
        }
        return true;
    },
    sendMessage: function(msg) {
        $from = core.connection.jid;
        $to = core.current_user;
        $type = core.getChatType(core.current_user);
        $now = new Date();
        $time = $now.getHours() + ":" + $now.getMinutes();
        $(document).trigger('sendTimeMessage',{msg:msg,from:$from,to:$to,type:$type,time:$time,file:false,timestamp:""});
        core.composing = false;
        $("#txtmsg").val('');
        $(document).trigger('printChatList',{msg:msg,to:$to,time:$time,notif:false,send:true});
    },
    sendNotify:function(){
        $jid = core.current_user;
        $comp = core.composing;
        if(!$comp){
            var notify = $msg({
                to:$jid,
                type:"chat"})
                .c('composing',{xmlns:"http://jabber.org/protocol/chatstates"}).tree();
            core.connection.send(notify);
            core.composing = true;
        }
    },
    jid_to_id: function (jid) {
        return Strophe.getBareJidFromJid(jid).replace("@", "-").replace(".", "-");
    },
    proccesMesage: function(msg){
        var urlPattern = /(https?:\/\/|w{3}[.])\w+([\.\-\w]+)?\.([a-z]{2,4}|travel)(:\d{2,5})?(\/.*)?/gi;
        var emailPattern = /[\w.]+@{1}[\w-]+\.[a-z]{2,3}/gi;
        
        if (emailPattern.test(msg)){
            var elementos = msg.match(emailPattern);
            var numMatch = msg.match(emailPattern).length;
            for(i=0; i<numMatch; i++){
                var current = elementos[i];
                var link = "<a href=\"mailto:" + current + "\" target=\"_blank\">" + current + "</a>";
                msg = msg.replace(current, link);
            }
        }
        if(urlPattern.test(msg)){
            var elementos = msg.match(urlPattern);
            var numMatch = msg.match(urlPattern).length; 
            for(i=0; i<numMatch; i++){ 
                var current = elementos[i]; 
                if((/http:\/\//).test(current)){ 
                    var curr = current; 
                }else { 
                    var curr = "http://"+current; 
                } 
                var link = "<a href=\"" + curr + "\" target=\"_blank\">" + current + "</a>"; 
                msg = msg.replace(current, link); 
            } 
        }
        return msg; 
    },
    verifyMsgGroup: function(msg){
        var roomBlocked = "La entrada a la sala está bloqueada hasta que se confirme la configuración";
        var roomUnBlocked = "Esta sala está desbloqueada";
        var noAnonim = "Esta sala no es anónima";
        
        if(msg == roomBlocked || msg == roomUnBlocked || msg == noAnonim)
            return false;
        else
            return true;
    },
    unique: function (arrayName){
        var newArray=new Array();
        label:for(var i=0; i<arrayName.length;i++){
            for(var j=0; j<newArray.length;j++ ){
                if(newArray[j]==arrayName[i])
                    continue label;
            }
            newArray[newArray.length] = arrayName[i];
        }
        return newArray;
    },
    getChatDivForJID: function(jid){
        $div = "";
        $.each(core.roster_elements_array, function(i, v){
            if(v.JID==jid){
                $div = v.chatDiv;
                return false;
            }
        });
        if($div == ""){//chat group
            $.each($("#chat").find("#content").children(),function(idx,val){
                if($(val).attr("id")==core.jid_to_id(jid)){
                    $div = $(val);
                    return false;
                }
            });
        }
        if($div == null || $div == ""){//no existe
            $("#chat").find("#content").append("<div id='" + core.jid_to_id(jid) + "' " + (core.current_user != jid?"class='hidden'":"") + "></div>");
            $.each($("#chat").find("#content").children(),function(idx,val){
                if($(val).attr("id")==core.jid_to_id(jid)){
                    $div = $(val);
                    return false;
                }
            });
            core.setChatDivForJID(jid,$div);
        }
        return $div;
    },
    setChatDivForJID: function(jid,div){
        $.each(core.roster_elements_array, function(i, v) {
            if(v.JID==jid){
                v.chatDiv = div;
                return false;
            }
        });
    },
    getRosterListForJID: function(jid){
        $rosterList = "";
        $.each(core.roster_elements_array, function(i, v){
            if(v.JID==jid){
                $rosterList = v.rosterList;
                return false;
            }
        });
        return $rosterList;
    },
    getChatListForJID: function(jid,construir){
        $chatList = null;
        $.each(core.roster_elements_array, function(i, v){ 
            if(v.JID==jid){
                $chatList = v.chatList;
                return false;
            }
        });
        if(core.getChatType(jid) == "groupchat"){//groupchat
            $.each($("#chats").find("#chats-content ul").children(),function(idx,val){
                if($(val).find(".pruebas").attr("id") == jid){
                    $chatList = $(val);
                    return false;
                }else if($(val).find(".pruebas").attr("id") == "nochats"){
                    $(val).remove();
                }
            });
        }
        if($chatList == null && construir){//no existe
            $data = "<li>" +
                "<a class='pruebas' id='" + jid + "' href='#chat'>" + 
                    "<p class='my_icon_wrapper'>" + 
                        "<img src='" + core.getDataForJid(jid) + "' class='my_icon_img'>" + 
                    "</p>" +
                    "<h3 class='my_text_wrapper'>" + core.getNameForJid(jid) + "</h3>" +
                    "<p class='last-message'>" + "<span class='lastmess mess'>&nbsp;&nbsp;&nbsp;&nbsp;</span></p>" +
                    "<span class='ui-li-aside'></span>" +
                    "<span class='ui-li-count hidden'>0</span>" +
                "</a>" +
            "</li>";
            $("#chats").find("#chats-content ul").append($data);
            $.each($("#chats").find("#chats-content ul").children(),function(idx,val){
                if($(val).find(".pruebas").attr("id") == jid){
                    $chatList = $(val);
                    return false;
                }else if($(val).find(".pruebas").attr("id") == "nochats"){
                    $(val).remove();
                }
            });
            if(core.getChatType(jid) == "chat"){
                core.setChatListForJID(jid, $chatList);
            }
        }
        return $chatList;
    },
    setChatListForJID: function(jid,chatList){
        $.each(core.roster_elements_array, function(i, v) {
            if(v.JID==jid){
                v.chatList = chatList;
                return false;
            }
        });
    },
    getNameForJid: function(jid) {
        var name = "";
        $.each(core.roster_array, function(i, v){
            if(v.JID==jid){
                name = v.name;
                return false;
            }
        });
        if(name == ""){
            //name = jid.substr(0, jid.indexOf("@"));
            var a = jid.indexOf("_")+1;
            var b = jid.indexOf("@");
            name = jid.substr(a, b-a);
        }
        return name;
    },
    setNameForJid: function(jid,name){
        $.each(core.roster_array, function(i, v) {
            if(v.JID==jid){
                v.name = name;
                return false;
            }
        });
    },
    getShowForJid: function(jid){
        var show = "";
        $.each(core.roster_array, function(i, v){
            if(v.JID==jid){
                show = v.show;
                return false;
            }
        });
        if(show == "" && core.getChatType(jid) == "groupchat"){
            show = "chat"
        }
        return show;
    },
    setShowForJid: function(jid,show){
        $.each(core.roster_array, function(i, v) {
            if(v.JID==jid){
                v.show = show;
                return false;
            }
        });
    },
    getStatusForJid: function(jid){
        var status = "";
        $.each(core.roster_array, function(i, v){
            if(v.JID==jid){
                status = v.status;
                return false;
            }
        });
        return status;
    },
    setStatusForJid: function(jid,status){
        $.each(core.roster_array, function(i, v) {
            if(v.JID==jid){
                v.status = status;
                return false;
            }
        });
    },
    getMoodImgForJid: function(jid){
        $mood = "";
        $.each(core.roster_array, function(i, v){
            if(v.JID==jid){
                $mood = "&nbsp;&nbsp;<img class='mood_icon' id='img" + core.getOnlyJID(jid) + "' src='images/" + v.mood + ".png'/>";
                return false;
            }
        });
        return $mood;
    },
    getMoodForJid: function(jid){
        var mood = "";
        $.each(core.roster_array, function(i, v){
            if(v.JID==jid){
                mood = v.mood;
                return false;
            }
        });
        return mood;
    },
    setMoodForJid: function(jid,mood){
        $.each(core.roster_array, function(i, v) {
            if(v.JID==jid){
                v.mood = mood;
                return false;
            }
        });
    },
    getLastForJid: function(jid){
        $last = "";
        $.each(core.roster_array, function(i, v){
            if(v.JID==jid){
                $last = v.last;
                return false;
            }
        });
        return $last;
    },
    formatLastForJid: function(last){
        var miliseconds = parseInt(last)*1000;
        $date = new Date();
        var dateMili = $date.getTime();
        $date.setTime(dateMili-miliseconds);
        $fecha = $date.getDate() + "/" + ($date.getMonth() + 1) + "/" + $date.getFullYear();
        $hoy = new Date();
        $hoy = $hoy.getDate() + "/" + ($hoy.getMonth() + 1) + "/" + $hoy.getFullYear();
        $ayer = new Date();
        $ayer = ($ayer.getDate() - 1) + "/" + ($ayer.getMonth() + 1) + "/" + $ayer.getFullYear();
        $fecha = $hoy===$fecha?"hoy a las":($fecha);
        $fecha = $ayer===$fecha?"ayer a las":($fecha);
        $last = "últ. vez " + $fecha + ", " + $date.getHours() + ":" + ($date.getMinutes().toString().length==1?"0"+$date.getMinutes():$date.getMinutes());
        return $last;
    },
    setLastForJid: function(jid,last){
        $.each(core.roster_array, function(i, v) {
            if(v.JID==jid){
                v.last = last;
                return false;
            }
        });
    },
    getGroupForJid: function(jid){
        $group = "";
        $.each(core.roster_group_array, function(i, v) {
            if(v.JID==jid){
                $group = v.group;
                return false;
            }
        });
        return $group;
    },
    setGroupForJid: function(jid,group){
        $.each(core.roster_group_array, function(i, v) {
            if(v.JID==jid){
                v.group = group;
            }
        });
    },
    getDataForJid: function(jid){
        $data = "";
        $img = "";
        $.each(core.roster_array, function(i, v) {
            if(v.JID==jid){
                $data = v.data;
                return false;
            }
        });
        if($data == "none"){
            $img = "images/user1.png";
        }else if($data == ""){
            $img = "images/group.png";
        }else{
            $img = "data:image/png;base64," + $data;
        }
        return $img;
    },
    setDataForJid: function(jid,data){
        $.each(core.roster_array, function(i, v) {
            if(v.JID==jid){
                v.data = data;
            }
        });
    },
    getDataURLForJid: function(jid){
        $data = "";
        $.each(core.roster_array, function(i, v) {
            if(v.JID==jid){
                $data = v.dataURL;
                return false;
            }
        });
        return $data;
    },
    setDataURLForJid: function(jid,data){
        $.each(core.roster_array, function(i, v) {
            if(v.JID==jid){
                v.dataURL = data;
            }
        });
    },
    getUnreadMessageForJid: function(jid){
        $unread = false;
        $for_save = [];
        $.each(core.unread_message_array, function(i, v) {
            if(v.JID==jid){
                $unread = true;
                core.unread_jid_message_array.push({
                    'timestamp':v.timestamp
                });
            }else{
                $for_save.push({
                    'JID':v.JID,
                    'timestamp':v.timestamp
                });
            }
        });
        core.unread_message_array = $for_save;
        return $unread;
    },
    getGroups: function(){
        $grupos = [];
        $.each(core.roster_group_array, function(i, v){
            $.each(v.group,function(id,val){
                $grupos.push({
                    'grupo':$.trim(val.grupo)
                });
            });
        });
        $gruposA = [$grupos.length];
        $.each($grupos,function(i,v){
            $gruposA[i] = $.trim(v.grupo);
        });
        $gruposA = core.unique($gruposA);
        $gruposA.sort();
        return $gruposA;
    },
    isInGroup: function(group,jid){
        $is = false
        $groupJID = core.getGroupForJid(jid);
        $.each($groupJID,function(id,val){
            if(group == val.grupo){
                $is = true;
            }
        });
        return $is;
    },
    getAvatar: function(jid){
        var iqAvatar = $iq({type:'get',
            from:Strophe.getBareJidFromJid(core.connection.jid),
            to:jid,
            id:'retrieve1'
        }).c('pubsub',{xmlns:'http://jabber.org/protocol/pubsub'})
        .c('items',{node:'urn:xmpp:avatar:data'}).tree();
        core.connection.sendIQ(iqAvatar, function(ev){
            $(document).trigger('printMyAvatar',{item:$(ev).find("items").children().last()});
        },function(ev){
        });
    },
    setAvatar: function(data){
        var iqAvatar = $iq({type: 'set', 
            from: Strophe.getBareJidFromJid(core.connection.jid), 
            id: 'avat1'
        }).c('pubsub', {xmlns: 'http://jabber.org/protocol/pubsub'})
        .c('publish', {node: 'urn:xmpp:avatar:data'})
        .c('item', {id: data.sha1})
        .c('data', {xmlns: 'urn:xmpp:avatar:data', uri:data.uri}).t(data.img_b64).tree();
        core.connection.sendIQ(iqAvatar);
    },
    getStatus: function(jid){
        var iqStatus = $iq({type:'get',
            from:Strophe.getBareJidFromJid(core.connection.jid),
            to:jid,
            id:'status1'
        }).c('pubsub',{xmlns:'http://jabber.org/protocol/pubsub'})
        .c('items', {node: 'princely_musings'}).tree();
        core.connection.sendIQ(iqStatus, function(ev){
            $(document).trigger('printMyStatus',{item:$(ev).find("items").children().last().children()});
        },function(ev){
        });
    },
    setStatus: function(jid,data){
        var iqStatus = $iq({
            type: 'set', 
            from: jid, 
            id: 'status1'})
        .c('pubsub', {xmlns: 'http://jabber.org/protocol/pubsub'})
        .c('publish', {node: 'princely_musings'})
        .c('item', {entry: "http://www.w3.org/2005/Atom"})
        .c('status',{'mood':data.mood}).t(data.status).tree();
        core.connection.sendIQ(iqStatus,function(ev){},function(ev){});
    },
    getChatRooms: function(room,push){
        $data = false;
        $.each(core.chat_rooms, function(i, v) {
            if(v.room==room){
                $data = true;
                return false;
            }
        });
        if(!$data && push){
            core.chat_rooms.push({
                'room':room
            });
        }
        return $data;
    },
    downFile: function(id_file,isUrl,isImage,type){
        $width = 280;
        if(isUrl){
            if(isImage){
                $("#view_img").find("#content").find("#full_image").removeClass("hidden");
                $("#view_img").find("#content").find("#full_image").attr("src",unescape(id_file));
                $("#view_img").find("#content").find("#full_image").css({'max-width' : $width , 'height' : 'auto','background':'url(\'images/loading.gif\') no-repeat center top'});
                $link = "<a href='' uri='" + id_file + "' file_type='image' id='open_local_file'>Descargar</a>";
                $("#view_img").find("#content").append($link);
                $("#view_img").find("#content").find("#open_local_file").button();
            }else{
                Cordova.downloadFile(id_file,type);
            }
        }
    },
    updateProgress: function(id,to,elemento){
        var time = new Date().getTime();
        $.ajax({url:'php/getprogress.php', data:{uid:id, t:time}, type:"POST", dataType:"text", complete: function (data) {
            var progress = parseInt(data.responseText, 10);
            if (progress < 100 || !core.started) {
                core.started = progress < 100;
                $element = core.getChatDivForJID(to);
                elemento.children().css('width', progress+'%');
                core.updateProgress(id,to,elemento);
            }
            if(progress ==100){
                core.started = true;
            }
        }
    });
 
    },
    /*stopInterval: function(){
        clearInterval(core.seguir);
    },*/
    showImage: function($timemoment,to){
        core.seguir = setInterval("core.getImage('"+$timemoment+"','" + to + "');",5000);
    },
    getImage: function($timemoment,to){
        $element = core.getChatDivForJID(core.current_user);
        $elemento = null;
        $.ajax({
            type: "POST",url: "php/getImageInfo.php",data: {file:"get"},cache: false,dataType: "json",
            success: function(data){
                $data = "";
                $image = "";
                var decode_json = eval(data);
                $data = decode_json.data;
                $image = decode_json.image
                if($image!="none"){
                    core.stopInterval();
                    $.each($element.children(),function(id,va){
                        if($(va).find(".box").find(".progressbar").attr("timestamp") == $timemoment){
                            $elemento = $(va).find(".box").find(".progressbar").find("#progressbar");
                            return false;
                        }
                    });
                    if($elemento!=null){
                        $elemento.children().css("width","0px");
                        $elemento.children().remove();
                        $elemento.removeClass("meter animate");
                        $elemento.append("<a href='#view_img' onclick=\"core.downFile(\'" + $image + "\'," + true + "," + true + ", \'\');\"><img class='avatarIcon' src='" + unescape($data) + "' /></a>");
                    }
                    var from = core.connection.jid;
                    $type = core.getChatType(to);
                    $msgSend = $msg({
                        to:to,
                        type:$type,
                        from:from,
                        fileType:"image",
                        thumbail:$data,
                        timestamp:$timemoment}).c('body', {
                        xmlns:'http://jabber.org/protocol/ibb',
                        seq: 0,
                        chunks:1,
                        sid:"urlimage"
                    }).t($image != "" ? $image : ""  ).up().c("time").t(core.getTime()).tree();
                    core.connection.send($msgSend);
                }
            }
        });
    },
    sendStroke: function(stroke) {
        $from = core.connection.jid;
        $to = core.current_user;
        $type = core.getChatType($to);

        var msgStroke = $msg({to:$to, from:$from, type: $type}).c('body', {xmlns:'jabber:x:data'}).t(stroke).up().c("time").t(core.getTime()).tree();
        core.connection.send(msgStroke);
    },
    getCanvasDivForJID: function(jid){
        $isGroup = jid.indexOf("@chat.")>-1?true:false;
        if($isGroup){
            $canvas = core.getCanvasDivForGroup(jid);
            return $canvas;
        }
        $canvas = "";
        var isNew;
            $.each(core.roster_elements_array, function(i, v){
                if(v.JID==jid){
                    if(v.canvasDiv != null && v.canvasDiv != ""){
                        isNew = false;
                        $canvas = v.canvasDiv;
                        $colorWidth = $("#colorWidth").val();
                        core.canvasOptions = {id:$canvas, size: $colorWidth,ctxt:$canvas.ctxt};
                        $canvas.isNew = isNew;
                        $canvas.exist = true;
                        return;
                    }
                    else{
                        isNew = true;
                        var currentCanvas = document.createElement("canvas");
                        currentCanvas.id = core.getOnlyJID(jid);
                        currentCanvas.ctxt = currentCanvas.getContext("2d");
                        currentCanvas.width = 270;
                        currentCanvas.height = 250;
                        currentCanvas.isNew = isNew;
                        $("#canvasContent").append("<div id='canvas" + currentCanvas.id + "'style='display:none'></div>");
                        $("#canvasContent").find("#canvas"+currentCanvas.id).append(currentCanvas);
                        currentCanvas.div = $("#canvasContent").find("#canvas"+currentCanvas.id)[0];
                        $canvas = currentCanvas;
                        $colorWidth = $("#colorWidth").val();
                        core.canvasOptions = {id:currentCanvas.id, size: $colorWidth,ctxt:currentCanvas.ctxt};
                        v.canvasDiv = $canvas;
                    }
                    var pizarra = new CanvasDrawr(isNew);
                    return false;
                }
            });
        return $canvas;
    },
    getCanvasDivForGroup: function(jidGroup){
        var isNew = true;
        $.each(core.canvasForGroup, function(i, v){
            if(v.groupChat == jidGroup){
                isNew = false;
                $canvas = v.canvasDiv;
                $canvas.isNew = isNew;
                if(v.creator){
                    $colorWidth = $("#colorWidth").val();
                    core.canvasOptions = {id:$canvas, size: $colorWidth,ctxt:$canvas.ctxt};
                    var pizarra = new CanvasDrawr(isNew);
                    return;
                }
                else{
                    $canvas.invited = true;
                }
            }
        });
        if(isNew){
            var currentCanvas = document.createElement("canvas");
            currentCanvas.id = core.getOnlyJID(jidGroup);
            currentCanvas.ctxt = currentCanvas.getContext("2d");
            currentCanvas.width = 270;
            currentCanvas.height = 250;
            currentCanvas.isNew = isNew;
            $("#canvasContent").append("<div id='canvas" + currentCanvas.id + "'style='display:none'></div>");
            $("#canvasContent").find("#canvas"+currentCanvas.id).append(currentCanvas);
            currentCanvas.div = $("#canvasContent").find("#canvas"+currentCanvas.id)[0];
            $canvas = currentCanvas;
            $colorWidth = $("#colorWidth").val();
            core.canvasOptions = {id:currentCanvas.id, size: $colorWidth,ctxt:currentCanvas.ctxt};

            core.canvasForGroup.push({
                'groupChat':jidGroup,
                'canvasDiv':$canvas,
                'creator':true
            });
            var pizarra = new CanvasDrawr(isNew);
        }
        return $canvas;
    },
    createCanvasToSee: function(jidGroup){
        //isNew = true;
        var currentCanvas = document.createElement("canvas");
        currentCanvas.id = core.getOnlyJID(jidGroup);
        currentCanvas.ctxt = currentCanvas.getContext("2d");
        currentCanvas.width = 270;
        currentCanvas.height = 250;
        currentCanvas.ctxt.fillStyle = "white";
        currentCanvas.ctxt.fillRect(0, 0, currentCanvas.width, currentCanvas.height);
        //currentCanvas.isNew = isNew;
        $("#canvasContent").append("<div id='canvas" + currentCanvas.id + "'style='display:none'></div>");
        $("#canvasContent").find("#canvas"+currentCanvas.id).append(currentCanvas);
        currentCanvas.div = $("#canvasContent").find("#canvas"+currentCanvas.id)[0];
        $canvas = currentCanvas;

        core.canvasForGroup.push({
            'groupChat': jidGroup.substr(0, jidGroup.indexOf("/")),
            'canvasDiv':$canvas,
            'creator':false
        });
        return $canvas;        
    },
    getOnlyJID: function(jid){
        return jid.substr(0, jid.indexOf("@"));
    },
    getChatType: function(jid){
        $type = jid.indexOf(config.chatService)>-1?"groupchat":"chat";
        return $type;
    },
    iqLastForJid:function(jid,callback){
        var iq = $iq({
            from: core.connection.jid,
            id: 'last1',
            to: jid,
            type: 'get'
        }).c('query', {xmlns: "jabber:iq:last"}).tree();
        core.connection.sendIQ(iq,function(activity){
            $from = $(activity).attr("from");
            $last = core.formatLastForJid($(activity).find("query").attr("seconds"));
            core.setLastForJid($from, $last);
            callback.call(this,$last);
        });
    },
    sendStanzaConnection: function(stanza,jid,timestamp,interval,callback){
        var sendStatus = false;
        if(Cordova.CONNECTION_STATUS == "online"){
            sendStatus = true;
            core.connection.send(stanza);
        }else if(interval){
            core.intervalStanzaConnection(stanza,jid,timestamp);
        }
        callback.call(this,sendStatus);
    },
    intervalStanzaConnection: function(stanza,jid,timestamp){
        var interval = setInterval(function(){
            core.sendStanzaConnection(stanza,jid,timestamp, false, function(send){
                console.log("interval");
                if(send){           //confirmar envio
                    core.stopInterval(interval);
                    $(document).trigger('showSendStamp',{timestamp:timestamp,jid:jid});
                }
            });
        }, 5000);
    },
    stopInterval: function(intervalID){
        clearInterval(intervalID);
    }
}
$(document).ready(function () {
    core.captcha();
    $shortName = "inContact";
    $version = "1.0";
    $displayName = "InContact";
    $maxSize = 65536;
    var db = null;
    if(!window.openDatabase){
        if(!localStorage){
            
        }else{
            if(localStorage["user"] != "" && localStorage["pass"] != ""){
                /*$("#user").val(localStorage["user"]);
                $("#pass").val(localStorage["pass"]);*/
                $(document).trigger('connect', {jid: localStorage["user"],password: localStorage["pass"]});
                $("#dinamicLinkPage").attr("href","#roster-page").trigger('click');
            }
        }
    }else{
        db = window.openDatabase($shortName, $version, $displayName, $maxSize);
        db.transaction(function(transaction){
            transaction.executeSql('CREATE TABLE IF NOT EXISTS user ' + 
            ' (user TEXT NOT NULL PRIMARY KEY, ' + 
            ' pass TEXT NOT NULL);');
        });
        $user = "";
        $pass = "";
        db.transaction(function(transaction){
            transaction.executeSql('SELECT * FROM user;',
                [],
                function (transaction, result) {
                    for (var i=0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        $user = row.user;
                        $pass = row.pass;
                    }
                    if($user != "" && $pass != ""){
                        /*$("#user").val($user);
                        $("#pass").val($pass);*/
                        $(document).trigger('connect', {jid: $user,password: $pass});
                        $("#dinamicLinkPage").attr("href","#roster-page").trigger('click');
                    }
                },
                function(){
                });
        });
    }
    if (navigator.platform=="iPhone" || navigator.platform=="iPad" || navigator.platform=="iPod" || navigator.platform=="iPhone Simulator" ) {
        core.platform = "iPhone";
        var currentParams = {}
        // We'll check the hash when the page loads in-case it was opened in a new page
        // due to memory constraints
        Picup.checkHash();
        // Set some starter params	
        currentParams = {
                'callbackURL'               : 'http://' + config.SERV + '/InContactP/response.php',
                'referrername'              : escape('InContact'),
                'referrerfavicon'           : escape('http://www.parorrey.com/downloads/Picup-demo/favicon.ico'),
                'purpose'                   : escape('Elige tu imagen para enviar.'),
                'debug'                     : 'false',
                'returnThumbnailDataURL'    : 'true',
                'thumbnailSize'             : '80'
        };
        Picup.convertFileInput('sendfile', currentParams);
    }else{
        core.platform = navigator.platform;
    }

});
$(document).bind("mobileinit",function(){
    
});
$(function(){
    $('#entrar').click(function (ev) {
        $user = $("#user").val();
        $pass = $("#pass").val();
        if($user != "" && $pass != ""){
            core.writeData($user,$pass);
            $(document).trigger('connect', {jid: $user,password: $pass});
            $("#dinamicLinkPage").attr("href","#roster-page").trigger('click');
        }else{
            $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification error'>Falló al iniciar sesión. <br/>Bad User!</div>"});
            $("#dinamicLinkPage").attr("href","#login").trigger('click');
        }
    });
    $("#registerBtn").click(function(ev){
        var d = $("#captcha").val();
        if (d == core.captchaResult){
            $(document).trigger('register',{
                user:$("#register").find("#userReg").val(),
                pswd:$("#register").find("#passReg").val(),
                email:$("#register").find("#emailReg").val(),
                nick:$("#register").find("#nickReg").val()
            });
        }else{
            core.captcha();
            return false;
        }
    });
    $('.pruebas').live('click',function(){
        core.current_user = $(this).attr('id');
    });
    $("#chats").find("#chats-content ul").find('.pruebas').live('taphold',function(){
        //$("#chats").find("#chats-content").find("#opciones-button").trigger('click');
        core.current_user_option = $(this).attr('id');
        
        if(core.getChatType(core.current_user_option) == "groupchat"){
            var aff = muc.roomsArray[core.getOnlyJID(core.current_user_option)].affiliation;
            console.log(aff);
            if(aff == "owner"){
                $("#opciones").html("<option value=''>Seleccione...</option> <option value='3'>Terminar ChatGroup</option>");
            }
            else{
                $("#opciones").html("<option value=''>Seleccione...</option> <option value='2'>Salir de ChatGroup</option>");
            }
            $("#opciones").selectmenu("refresh");
            $("#chats").find("#chats-content").find("#opciones-button").trigger('click');
        }
        else{
            $("#opciones").html("<option value=''>Seleccione...</option> <option value='0'>Ver contacto</option> <option value='1'>Eliminar Chat</option>");
            $("#opciones").selectmenu("refresh");
            $("#chats").find("#chats-content").find("#opciones-button").trigger('click');
        }
    });
    $("#opciones").bind( "change", function(event, ui) {
        if(event.target.value == 0){
            core.current_user = core.current_user_option;
            $("#chat").find(".ui-header").find("#contact_profile").trigger('click');
            $("#dinamicLinkPage").attr("href","#jid_profile").trigger('click');
            event.target.value = "";
        }else if(event.target.value == 1 || event.target.value == 2){ //Eliminar Chat de la lista de CHATS
            $.each($("#chats").find("#chats-content ul").children(),function(idx,val){
                if($(val).find(".pruebas").attr("id") == core.current_user_option){
                    $(val).remove();
                    return false;
                }
            });
            $element = core.getChatDivForJID(core.current_user_option);
            $element.remove();
            core.setChatDivForJID(core.current_user_option,null);
            core.setChatListForJID(core.current_user_option,null);
            if(event.target.value == 2){ //Salir del chatGroup y eliminar de la lista de CHATS
                var pres = $pres({from: core.connection.jid, to: core.current_user_option, type: 'unavailable'});
                core.connection.send(pres);
                muc.removeRoom(core.getOnlyJID(core.current_user_option));
            }
            event.target.value = "";
        }
        else if(event.target.value == 3){ //Terminar/Destruir chatGroup y eliminar de la lista de CHATS (solo el owner)
            alert("Destruiras la sala, eres el owner");
            var iq = $iq({from: core.connection.jid, id: 'destroyMUC', to: core.current_user_option, type: 'set'})
                    .c("query", {xmlns:'http://jabber.org/protocol/muc#owner'}).c("destroy").tree();
            console.log(iq);
            core.connection.sendIQ(iq,
                function(result){
                    console.log(result);
                    var type = $(result).attr('type');
                    var room = core.getOnlyJID($(result).attr('from'));

                    $.each($("#chats").find("#chats-content ul").children(),function(idx,val){
                        if($(val).find(".pruebas").attr("id") == core.current_user_option){
                            $(val).remove();
                            return false;
                        }
                    });
                    $element = core.getChatDivForJID(core.current_user_option);
                    $element.remove();
                    core.setChatDivForJID(core.current_user_option,null);
                    core.setChatListForJID(core.current_user_option,null);
                    muc.removeRoom(room);

                    event.target.value = "";

                },
                function(e){console.log(e);}
            );
        }
    });
    $(".box").live('taphold',function(){
        $("#dinamicLink").attr("href","#chat_message_options").trigger('click');
        core.current_message_edit = this;
    });
    /*---------------OPCIONES DE MENSAJE---------------*/
    $("#copy_chat_message").live('click',function(ev){
        $elemento = $(core.current_message_edit);
        $mensaje = $elemento.find(".mensaje").children().text();
        //copiar
    });
    $("#forward_chat_message").live('click',function(ev){
        $elemento = $(core.current_message_edit);
        //reenviar
    });
    $("#delete_chat_message").live('click',function(ev){
        $elemento = $(core.current_message_edit);
        $elemento.parent().remove();
    });
    /*---------------OPCIONES DE MENSAJE---------------*/
    $('#txtmsg').live('keypress',function(ev) {
        var msg = $(this).val();
        $is_muc = core.getChatType(core.current_user)=="groupchat"?true:false;
        if(ev.which == 13){
            ev.preventDefault();
            if($.trim(msg) != ""){
                core.sendMessage(msg);
            }
        }else if(core.current_user != null && !$is_muc){
            core.sendNotify(); 
        }
    });
    $("#enviar").live('click',function(){
        var msg = $("#txtmsg").val();
        if(msg === ""){
            return false;
        }else{
            core.sendMessage(msg);
        }
    });
    $("#bck-chats").live('click',function(){
        $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#change_group").val('');
        $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#change_nick_name").val('');
    });
    $("#bck_chat").live('click',function(){
        /*$("#view_img").find("#content").find("#full_image").addClass("hidden");
        $("#view_img").find("#content").find(".file_position").html("");
        if(typeof($("#view_img").find("#content").find("#open_local_file")).attr("uri") == "string"){
            $("#view_img").find("#content").find("#open_local_file").button().remove();
        }
        $("#view_img").find("#content").find(".download_file_bar").find(".progressbar").find("#progressbar").css("display","none").children().css('width','0%');*/
    });
    $('#profilebtn').click(function (ev) {
        core.ping(Strophe.getBareJidFromJid(core.connection.jid));
        if(core.current_avatar==null){
            core.getAvatar(Strophe.getBareJidFromJid(core.connection.jid));
        }
        if(core.current_status==null){
            core.getStatus(Strophe.getBareJidFromJid(core.connection.jid));
        }
    });
    var options = {
        type: "POST", 
        dataType: "json",
        url: "php/upload_avatar.php",
        beforeSubmit: function(){
            $(document).trigger('showDialogNotif', {clase:"success",html:"<div class='notification error'>Listo, tu avatar <br/>se cargara en unos momentos!</div>"});
            $("#profile").find("#profile_content").find("#profileimg img").attr('src',"images/loading.gif");
        },
        complete: function(data){
            if(data.responseText == ""){
                $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification error'>Uy!, hubo un errorr <br/>vuleve a intentar!</div>"});
                $("#profile").find("#profile_content").find("#profileimg").attr('src', core.current_avatar);
            }else{
                $data = eval("(" + data.responseText + ")");
                core.setAvatar($data);
            }
        },error: function(){
            $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification error'>Uy!, hubo un errorr <br/>vuleve a intentar!</div>"});
            $("#profile").find("#profile_content").find("#profileimg").attr('src', core.current_avatar);
        }
    };
    $('#formAvatar').ajaxForm(options);
    $('#filebtn').change(function (ev) {
        $('#formAvatar').submit();f
    });
    $("#status").live('click',function(){
        $("#txtStatus").text(core.current_status);
        $("#dinamicLink").attr("href","#changeStatus").trigger('click');
    });
    $("#saveStatus").live('click',function(){
        $(document).trigger('setEdo',{
            status:$("#changeStatus").find("#contenido").find("#txtStatus").val()===""?core.current_status:$("#changeStatus").find("#contenido").find("#txtStatus").val(),
            show:$("#changeStatus").find("#contenido").find(".ui-select").find(".ui-btn-text").text(),
            mood:core.current_mood
        });
        $("#changeStatus").find("#contenido").find("#txtStatus").val('');
        $("#changeStatus").dialog('close');
    });
    $("#chatsbtn").live('click',function(){
        core.construido = true;
        core.ping(Strophe.getBareJidFromJid(core.connection.jid));
    });
    $("#newsbtn").live('click',function(){
        core.construido_news = true;
        $("#news").find("#news-content ul").listview('refresh');
    });
    $("#btnAddContact").click(function(ev) {
        var data = {
            "jid" : $("#settings").find("#settings-content").find("#addJid").val() + core.host || "",
            "name": $("#settings").find("#settings-content").find("#addName").val() || "",
            "group":$("#settings").find("#settings-content").find("#addGroup").val() || "Otros"
        };
        var iq = $iq({type: "set"}).c("query", {xmlns: "jabber:iq:roster"}).c("item", data).c('group').t(data.group).tree();
        if(data.name != "" && data.jid != ""){
            core.connection.sendIQ(iq,function(ev){
                $(document).trigger('addToList', {jid:data.jid,name:data.name,group:data.group});
                var subscribe = $pres({to: data.jid, type: "subscribe"});
                core.connection.send(subscribe);
                $(document).trigger('showDialogNotif', {clase:"success",html:"<div class='notification success'>Listo. <br/> Contacto agregado!</div>"});
                setTimeout(function(ev){
                    $.mobile.changePage($("#roster-page"));
                },500);
            },function(ev){
                $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification error'>Ha ocurrido un error al agregar al usuario. <br/> Intente más tarde!</div>"});
            });
        }else{
            $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification error'>Faltan datos. <br/>Verifique los campos.</div>"});
        }
        $("#settings").find("#settings-content").find("#addJid").val('');
        $("#settings").find("#settings-content").find("#addName").val('');
        $("#settings").find("#settings-content").find("#addGroup").val('');
    });
    $("#acceptFriendship").live('click',function(){
        $from = $("#accept_reject_dialog").find("#contenido").find("#jid").attr("jid");
        $name = $("#accept_reject_dialog").find("#contenido").find("#addName").val();
        $group = $("#accept_reject_dialog").find("#contenido").find("#addGroup").val() || "Otros";
        $group = $group.charAt(0).toUpperCase() + $group.slice(1);
        $group = $group.replace(/ /g,"_");
        $("#accept_reject_dialog").find("#contenido").find("#jid").attr("jid",'');
        $("#accept_reject_dialog").find("#contenido").find("#addName").val('');
        $("#accept_reject_dialog").find("#contenido").find("#addGroup").val('');
        core.accept_reject(true, $from);
        $(document).trigger('addToList', {jid:$from,name:$name,group:$group});
        $(document).trigger('changeNickName', {jid:$from,name:$name,change:false});
        $(document).trigger('changeGroup', {jid:$from,groups:[$group],change:false,borrar:false});
        setTimeout(function(ev){
            $.mobile.changePage($("#roster-page"));
        },500);
    });
    $("#rejectFriendship").live('click',function(){
        $from = $("#accept_reject_dialog").find("#contenido").find("#jid").attr("jid");
        core.accept_reject(false, $from);
    });
    $("#contact_profile").live('click',function(){
        if($(this).attr("href")!="#inviteContactToChatGroup"){
            /*$grupos = core.getGroups();
            $elemento = $("#jid_profile").find("#jid_profile_content").find("#jid_profile_controlgroup");
            $elemento_delete = $("#jid_profile").find("#jid_profile_content").find("#jid_profile_controlgroup_delete");
            $contentList = "";
            $contentDeleteList = "";
            for(var i=0; i<$grupos.length; i++){
                if(!core.isInGroup($grupos[i], core.current_user) && $grupos[i] != "Otros"){
                    $contentList += "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' grupo='" + $grupos[i] + "' class='custom' />" + 
                    "<label for='checkbox-" + i + "'>" + $grupos[i] + "</label>\n";
                }else{
                    if($grupos[i] != "Otros"){
                        $contentDeleteList += "<input type='checkbox' checked='checked' name='checkbox-" + i + "' id='checkbox-" + i + "' grupo='" + $grupos[i] + "' class='custom' />" + 
                        "<label for='checkbox-" + i + "'>" + $grupos[i] + "</label>\n";
                    }
                }
            }
            $elemento.html($contentList);
            $elemento_delete.html($contentDeleteList);
            setTimeout(function(){
                $("#jid_profile").find("#jid_profile_header").find("#jid").html(core.getNameForJid(core.current_user) + "<h2 class='last'>" + core.getStatusForJid(core.current_user) + "</h2>");
                $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#jid_jid_profile").val(core.current_user).textinput('disable');
                $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#jid_name").val(core.current_user + "/" + core.getNameForJid(core.current_user)).textinput('disable');
                $('#jid_profile').page('destroy').page();
            },1000);*/
        }
    });
    $("#btnNickname").live('click',function(){
        $apodo = $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#change_nick_name").val();
        $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#change_nick_name").val('');
        $(document).trigger('changeNickName', {jid:core.current_user,name:$.trim($apodo),change:true});
    });
    $("#btnGroup").live('click',function(){
        $controlGroup = $("#jid_profile").find("#jid_profile_content").find("#jid_profile_controlgroup div");
        $grupos = [];
        $.each($controlGroup.children(),function(id,val){
            $input = $(val).find("input");
            if($input.attr("checked") == "checked"){
                console.log($input.attr("grupo"));
                $grupos.push({
                    'grupo':$input.attr("grupo")
                });
            }
        });
        $grupo = $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#change_group").val();
        if($grupo!="" && !core.isInGroup($grupo,core.current_user)){
            $grupo = $grupo.charAt(0).toUpperCase() + $grupo.slice(1);
            $grupo = $grupo.replace(/ /g,"_");
            $grupos.push({
                'grupo':$grupo
            });
            $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#change_group").val('');
        }
        $gruposA = [$grupos.length];
        $.each($grupos,function(i,v){
            $gruposA[i] = $.trim(v.grupo);
        });
        $gruposA = core.unique($gruposA);
        console.log($gruposA);
        $(document).trigger('changeGroup', {jid:core.current_user,groups:$gruposA,change:true,borrar:false});
    });
    $("#btnGroup_delete").live('click',function(){
        $controlGroup = $("#jid_profile").find("#jid_profile_content").find("#jid_profile_controlgroup_delete div");
        $grupos = [];
        $.each($controlGroup.children(),function(id,val){
            $input = $(val).find("input");
            if($input.attr("checked") != "checked"){
                if($input.attr("grupo") != "" && $input.attr("grupo") != undefined){
                    $grupos.push({
                        'grupo':$input.attr("grupo")
                    });
                }
            }
        });
        $gruposA = [$grupos.length];
        $.each($grupos,function(i,v){
            $gruposA[i] = $.trim(v.grupo);
        });
        $gruposA = core.unique($gruposA);
        console.log($gruposA);
        if($gruposA.length != 0){
            $(document).trigger('changeGroup', {jid:core.current_user,groups:$gruposA,change:true,borrar:true});
        }
    });
    $("#btnDelete").live('click',function(){
        $(document).trigger('deleteContact', {jid:core.current_user});
    });
    $("#select_image_icon").live('click',function(ev){
        $("#opcfile_dialog").find("#opcfile_dialog_content").find("#select_image-button").trigger('click');
    });
    $("#select_video_icon").live('click',function(ev){
        $("#opcfile_dialog").find("#opcfile_dialog_content").find("#select_video-button").trigger('click');
    });
    $("#select_audio_icon").live('click',function(ev){
        $("#opcfile_dialog").find("#opcfile_dialog_content").find("#select_audio-button").trigger('click');
    });
    $("#select_image").bind( "change", function(event,ui){
        var opcion = parseInt(event.target.value);
        switch(opcion){
            case 1://camara
                Cordova.captureImage('message');
            break;
            case 2://galeria
                Cordova.getPhoto(Cordova.pictureSource.PHOTOLIBRARY,'message');
            break;
        }
        console.log(opcion);
        $(this)[0].selectedIndex = 0;
        opcion = "";
    });
    $("#select_video").bind( "change", function(event,ui){
        var opcion = parseInt(event.target.value);
        switch(opcion){
            case 1://videocamara
                Cordova.captureVideo();
            break;
            case 2://galeria
                Cordova.getVideo(Cordova.pictureSource.PHOTOLIBRARY,Cordova.mediaType.VIDEO);
            break;
        }
        console.log(opcion);
        $(this)[0].selectedIndex = 0;
        opcion = "";
        $("#dinamicLinkPage").attr("href",'#chat').trigger('click');
    });
    $("#select_audio").bind( "change", function(event,ui){
        var opcion = parseInt(event.target.value);
        switch(opcion){
            case 1://grabadora
                Cordova.captureAudio();
            break;
            case 2://galeria
                Cordova.getAudio(Cordova.pictureSource.PHOTOLIBRARY,Cordova.mediaType.ALLMEDIA);
            break;
        }
        console.log(opcion);
        $(this)[0].selectedIndex = 0;
        opcion = "";
        $("#dinamicLinkPage").attr("href",'#chat').trigger('click');
    });
    $("#select_location").bind("change",function(event,ui){
        var opcion = parseInt(event.target.value);
        switch(opcion){
            case 1://ubicacion actual
            break;
            case 2://lugares cercanos
            break;
        }
        console.log(opcion);
        $(this)[0].selectedIndex = 0;
        opcion = "";
    });
    $("#link_maps_page").live('click',function(){
        mapapp.place_objects_array = [];
        mapapp.getMapDiv($('#maps_page').find("#maps_content").find('#map_square'));
        /*setTimeout(function(){
            mapapp.searchPlaces();
        },5000);*/
    });
    /*$("#btn_maps_location").live('click',function(){
        var url = "geo:" + mapapp.lat + "," + mapapp.lng + "?z=16";
        var msg = "<a href='" + url + "' data-role='button'>Ver</a>";
        Cordova.buildTimePlace(core.connection.jid, core.current_user,msg,url);
    });*/
    $("#link_contacts_page").live('click',function(){
        Contacts.contacts_array = [];
        Cordova.getContacts();
   });
    
    var optionsSendFile = {
        type: "POST", 
        dataType: "json",
        //url: "php/upload.php",
        url: "php/send_file.php",
        beforeSubmit: function(){
            $timer= $('#formSendFile').find("#timestamp").val();
            //solo imprime, no envía
            $(document).trigger('sendTimeMessage',{msg:"",from:core.connection.jid ,to:core.current_user ,type:"chat",time:core.getTime(),file:true,timestamp:$timer});
            $element = core.getChatDivForJID(core.current_user);
            $elemento = null;
            $.each($element.children(),function(id,va){
                if($(va).find(".box").find(".progressbar").attr("timestamp") == $timer){
                    $elemento = $(va).find(".box").find(".progressbar").find("#progressbar");
                    $elemento.children().css('width','0%');
                    $elemento.css('display','block');
                    return false;
                }
            });
            setTimeout(function () {
                core.updateProgress($('#uid').val(),core.current_user,$elemento);
            }, 100);
        },
        complete: function(data){
            var decode_json = eval("(" + data.responseText + ")");
            var type = decode_json.type;
            var error = decode_json.error;
            var id_file = decode_json.id_file;
            $timestamp = decode_json.timestamp;
            if(!error){
                var msg;
                if(type == "audio/mp3"){
                    msg = "<img src='images/dwn_mp3.png' />";
                }else if(type.indexOf("image/") >=  0){
                    $file = decode_json.thumbnail;
                    msg = "<a href='#view_img' onclick=\"core.downFile(\'" + id_file + "\'," + false + "," + true + ", \'\');\"><img class='avatarIcon' src='data:" + type + ";base64," + $file + "'/></a>";
                }else if(type == "audio/wav"){
                    msg = "<img src='images/dwn_mp3.png' />";
                }
                else if(type == "text/plain"){
                    msg = "<img src='images/txt_icon.png' />";
                }
                else if(type == "application/pdf"){
                    msg = "<img src='images/pdf_icon.png' />";
                }
                else{
                    alert('Tipo de archivo no valido! ' + type + " - " + type.indexOf("image/"));
                    return false;
                }
            }
            else{
                alert('Tipo de archivo no valido! : ' + type);
                return false;
            }
            $element = core.getChatDivForJID(core.current_user);
            $elemento = null;
            $.each($element.children(),function(id,va){
                if($(va).find(".box").find(".progressbar").attr("timestamp") === $timestamp){
                    $elemento = $(va).find(".box").find(".progressbar").find("#progressbar");
                    return false;
                }
            });
            $(document).trigger('printChatList',{msg:"archivo...",to:core.current_user,time:core.getTime(),notif:false,send:true});
            var from = core.connection.jid;
            var to = core.current_user;
            $type = core.getChatType(to);
            $msgSend = $msg({
                to:to,
                type:$type,
                from:from,
                fileType:type,timestamp:$timestamp}).c('body', {
                xmlns:'http://jabber.org/protocol/ibb',
                sid:id_file
            }).t($file != "" ? $file : ""  ).tree();
            core.connection.send($msgSend);
            $elemento.children().css("width","0%");
            $elemento.children().remove();
            $elemento.removeClass("meter animate");
            $elemento.append(msg);
        }
    };
    $('#formSendFile').ajaxForm(optionsSendFile);
    $('#sendfile').change(function () {
        $timestamp = new Date().getTime();
        $('#formSendFile').find("#sender").val(Strophe.getBareJidFromJid(core.connection.jid));
        $('#formSendFile').find("#target").val(core.current_user);
        $('#formSendFile').find("#timestamp").val($timestamp);
        $('#formSendFile').submit();
    });
    
    $("#btnCreateChatGroup").click(function(ev) {
        muc.createMUC();
    });
    $("#readyInvited").click(function(){
        //if(core.room == ""){}
            core.room = core.current_user.substr(0, core.current_user.indexOf("@"));
        
        //lanzar stanzas con invitaciones a los contactos seleccionados
        //core.getChatRooms(core.room,true);
        $controlGroup = $("#listContactsChatGroup").find("#checkContacts .ui-controlgroup-controls");;
        console.log($controlGroup);
        $encontrados = [];
        $.each($controlGroup.children(),function(id,val){
            $input = $(val).find("input");
            if($input.attr("checked") == "checked"){
                $encontrados.push({jid:$input.attr("id")});
                console.log($input.attr("id"));
            }
        });
        if($encontrados.length >= 0){
            $.each($encontrados,function(i,v){
                //var joinP = $pres({to: core.room + core.chatService + "/" + core.nickname}).c('x',{xmlns:"http://jabber.org/protocol/muc"}).tree();
                var join = $msg({to: core.room + config.chatService})
                    .c('x',{xmlns:"http://jabber.org/protocol/muc#user"})
                    .c('invite',{to:v.jid}).c('reason').t(", Te invita a unirte a la conversacion: " + core.room).tree();//enviar invitacion
                if(core.getShowForJid(v.jid) === "offline"){
                    var mens = $msg({
                        to: v.jid, 
                        from: core.connection.jid,
                        type: "chat"}).c('body', {
                        xmlns:'http://jabber.org/protocol/muc#user'
                    }).t("muc_invite").up().c('invite',{to:core.room + core.chatService}).c('reason').t(", Te invita a unirte a la conversacion: " + core.room).tree();//enviar invitacion
                    core.connection.send(mens);
                }
                core.connection.send(join);
            });
        }
    });
    $("#btn_acceptJoin").click(function(){
        if(core.nickname == ""){//generar mi nickname
            $nick = core.connection.jid
            core.nickname = $nick.substr(0, $nick.indexOf("@"));
        }
        if(!core.contactsChecks){
            $element = $("#listContactsChatGroup").find("#checkContacts");
            $.each(core.roster_array, function(i, v){
                $data = "<label id=\"elemento\" for=\"" + v.JID + "\">" + v.name + "</label> <input type=\"checkbox\" id=\"" + v.JID + "\" name=\"" + v.JID + "\" value=\"yes\">";
                $element.append($data);
            });
            core.contactsChecks = true;
        }
        
        $room = $("#chatGroupInvitation_dialog").find("#contenido").find("#roomName").attr("roomName");
        //Crear el link en chats
        $time = core.getTime();
        $(document).trigger('printChatList',{msg: core.nickname + ' se ha unido.',to:$room+core.chatService ,time:$time ,notif:false,send:false});
        var pres = $pres({to: $room + config.chatService + "/" + core.nickname, id: core.nickname})
                .c('x',{xmlns:"http://jabber.org/protocol/muc"}).tree();
        //console.log(pres);
        core.connection.send(pres);
        //core.getChatRooms($room,true);
        muc.addRoom($room, "none");
    });
    $("#roster_chat_group").live('click',function(){
        $grupo = $(this).html();
        $grupo = $grupo.replace(/ /g,"_");
        $contactos = [];
        $.each(core.roster_group_array, function(i, v){
            if(core.isInGroup($grupo, v.JID)){
                $contactos.push({'JID':v.JID});
            }
        });
        //$room = "grupo_" + $grupo.toLowerCase();
        $room = core.getOnlyJID(core.connection.jid) + "_" + $grupo.toLowerCase();
        $to = $room + core.chatService + "/" + core.nickname;
        //if(core.getChatRooms($room,true)){//si existe el room
        if(muc.existMUC($room)){
            core.current_user = $room + core.chatService;
            $("#dinamicLinkPage").attr("href","#chat").trigger('click');
        }else{
            muc.addRoom($room, "owner");
            var pres = $pres({from: core.connection.jid, to: $room + core.chatService + "/" + core.nickname}).c('x',{xmlns:"http://jabber.org/protocol/muc"}).tree();
            console.log(pres);
            core.connection.send(pres);
            $time = core.getTime();
            var iq = $iq({
                from: $room + core.chatService + "/"  + core.nickname,
                id: 'createChatRoom',
                to: $room + core.chatService,
                type: 'set'
            }).c('query', {xmlns: 'http://jabber.org/protocol/muc#owner'}).c('x',{xmlns:'jabber:x:data', type:'submit'}).tree();//permisos de la sala
            core.connection.sendIQ(iq,
                function(ev){
                    if(!core.contactsChecks){
                        $element = $("#listContactsChatGroup").find("#checkContacts");
                        $.each(core.roster_array, function(i, v){
                            $data = "<label id=\"elemento\" for=\"" + v.JID + "\">" + v.name + "</label> <input type=\"checkbox\" id=\"" + v.JID + "\" name=\"" + v.JID + "\" value=\"yes\">";
                            $element.append($data);
                        });
                        core.contactsChecks = true;
                    }
                },function(e){}
            );
            $.each($contactos, function(i, v){
                var join = $msg({from: core.connection.jid, to: $room + core.chatService, id:$grupo.toLowerCase()})
                    .c('x',{xmlns:"http://jabber.org/protocol/muc#user"})
                    .c('invite',{to:v.JID}).c('reason').t("auto_join_invitation").tree();//enviar invitacion
                core.connection.send(join);
                if(core.getShowForJid(v.JID)==="offline"){
                    var mens = $msg({
                        to: v.JID, 
                        from: core.connection.jid,
                        type: "chat"}).c('body', {
                        xmlns:'http://jabber.org/protocol/muc#user'
                    }).t("muc_invite").up().c('invite',{to:$room + core.chatService}).c('reason').t("auto_join_invitation").tree();//enviar invitacion
                    core.connection.send(mens);
                }
            });
            $(document).trigger('printChatList',{msg:'Sala de ' + $grupo,to:$room + core.chatService,time:$time,notif:false,send:false});
            core.current_user = $room + core.chatService;
            $("#dinamicLinkPage").attr("href","#chat").trigger('click');
        }
    });
    $("#contact_image").live("click",function(ev){
        $datURL = core.getDataURLForJid(core.current_user);
        if($datURL != "none"){
            core.downFile($datURL, true, true, "image");
        }
    });
});
$(document).bind('register', function (ev, data) {
    core.registerData = data;
    var conn = new Strophe.Connection(config.BOSH_SERVICE);
    conn.register.connect(config.SERV, core.registerUser);
    core.connection = conn;
});
$(document).bind('connect', function (ev, data) {
    var conn = new Strophe.Connection(config.BOSH_SERVICE);
    conn.connect(data.jid  + core.host + "/InContact", data.password, core.status);
    /*
    setTimeout(function(){
        conn.attach(conn.jid, conn.sid, conn.rid, core.status);
    }, 500);
    */
    core.connection = conn;
});
$(document).bind('connected', function () {
    core.connection.attach(core.connection.jid, core.connection.sid, core.connection.rid, core.status);
    core.connection.addHandler(core.onMessage, null, "message", "chat", null, null);
    core.connection.addHandler(core.muc_message, null, "message", "groupchat", null, null);
    core.connection.addHandler(core.onData, null, "message", null, null, null);
    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    if(!core.reconected){
        core.connection.sendIQ(iq, core.on_roster);
        $(document).trigger('showDialogNotif', {clase:"success",html:"<div class='notification success'>Se ha iniciado sesión. <br/>Bienvenido!</div>"});
    }else{
        core.connection.addHandler(core.on_presence, null, "presence");
        core.connection.send($pres());
        //Reconectar a MUC activos
        muc.reconnectMUC();
    }
    $("#roster-page").find("#roster_header").find("#jid_name").text(core.connection.jid.substring(0,core.connection.jid.indexOf("@")));
    core.nickname = core.getOnlyJID(core.connection.jid);
});
$(document).bind('showDialogNotif',function(ev,data){
    $me = data.clase;
    var aclass = "";
    if($me==="success") aclass = "ui-body-suc";
    if($me==="error") aclass = "ui-body-err";
    if($me==="info") aclass = "ui-body-info";
    if($me==="warning") aclass = "ui-body-e";
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>"+ data.html + "</h1></div>").css({
        "display": "block",
        "opacity": 0.96,
        "top": "45%",
        "margin-left": "-130px",
        "margin-top": "-35px",
        "font-size": "12px",
        "width":"250px",
        "height":"66px"
    }).addClass(aclass).appendTo( $.mobile.pageContainer ).delay( 1800 + (400 * 1) ).fadeOut( 1400 + (400*1), function(){
        $(this).remove();
    });
});
$(document).bind('disconnected', function () {
    core.connection = null;
    core.composing = false;
    $user="",$pass="";
    $shortName = "inContact";
    $version = "1.0";
    $displayName = "InContact";
    $maxSize = 65536;
    if(!window.openDatabase){
        if(!localStorage){
            $("#dinamicLink").attr("href",'#login').trigger('click');
        }else{
            if(localStorage["user"] != "" && localStorage["pass"] != ""){
                $user = localStorage["user"];
                $pass = localStorage["pass"];
                console.log("LS: Reconectando...");
                $(document).trigger('connect', {jid: $user,password:$pass});
                core.reconected = true;
            }
        }
    }else{
        db = window.openDatabase($shortName, $version, $displayName, $maxSize);
        db.transaction(function(transaction){
            transaction.executeSql('SELECT * FROM user;',
                [],
                function (transaction, result) {
                    for (var i=0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        $user = row.user;
                        $pass = row.pass;
                    }
                    if($user != "" && $pass != ""){
                        console.log("oDB: Reconectando...");
                        $(document).trigger('connect', {jid: $user,password:$pass});
                        core.reconected = true;
                    }
                },
                function(){
                });
        });
    }
});
$(document).bind('failConnected', function () {
    $shortName = "inContact";
    $version = "1.0";
    $displayName = "InContact";
    $maxSize = 65536;
    if(!window.openDatabase){
        if(!localStorage){
            $("#entrando").find("#contenido").find("#mensaje").text("Hubo un error, intente de nuevo");
            $("#entrando").find("#contenido").find("#roster").attr("href","#login");
            $("#user").val("");
            $("#pass").val("");
        }else{
            if(localStorage["user"] != "" && localStorage["pass"] != ""){
                localStorage["user"] = "";
                localStorage["pass"] = "";
                $("#entrando").find("#contenido").find("#mensaje").text("Hubo un error, intente de nuevo");
                $("#entrando").find("#contenido").find("#roster").attr("href","#login");
                $("#user").val("");
                $("#pass").val("");
            }
        }
    }else{
        db = window.openDatabase($shortName, $version, $displayName, $maxSize);
        db.transaction(function(transaction){
            transaction.executeSql('DELETE FROM user;',
                [],
                function () {
                    $("#login").find(".ui-content").find("#user").val('');
                    $("#login").find(".ui-content").find("#pass").val('');
                    $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification error'>Falló al iniciar sesión. <br/>Bad User!</div>"});
                    $("#dinamicLinkPage").attr("href","#login").trigger('click');
                },
                function(){
                });
        });
    }
});
$(document).bind('llenaRoster',function(ev,data){
    $("#roster-page").find("#roster-content ul").html("");
    $element = $("#roster-page").find("#roster-content ul");
    $grupos = core.getGroups();
    console.log($grupos);
    for(var i=0; i < $grupos.length; i++){
        $grupo = $grupos[i];
        $grupo = $grupo.charAt(0).toUpperCase() + $grupo.slice(1);
        $grupo = $grupo.replace(/_/g," ");
        $data = "<li data-role='list-divider' id='roster_chat_group'>" +$grupo + "</li>";
        $element.append($data);
        $.each(core.roster_array, function(id, val){
            $grupoXcontacto = core.getGroupForJid(val.JID);
            $.each($grupoXcontacto,function(idx,valx){
                //if(core.getGroupForJid(val.JID) === $grupos[i]){
                if(valx.grupo === $grupos[i]){
                    $data = "<li>" +
                        "<a class='pruebas' id='" + val.JID + "' href='#chat'>" + 
                            "<p class='my_icon_wrapper'><img src='" + core.getDataForJid(val.JID) + "' class='my_icon_img'></p>" +
                            "<h3 class='my_text_wrapper'><img class='mood_icon' id='img" + core.getOnlyJID(val.JID) + "' src='images/" + val.mood + ".png'/> " +  val.name + "</h3>" +
                            "<p class='last-message'>" + core.getStatusForJid(val.JID) + "</p>" +
                    "</a></li>";
                    $element.append($data);
                }
            });
        });
    }
    $("#roster-page").find("#roster-content ul").listview('refresh');
    //setRosterListForJID
    $.each(core.roster_elements_array, function(i,v){
        $.each($("#roster-page").find("#roster-content ul").children(),function(idx,val){
            if($(val).find(".pruebas").attr("id") == v.JID){
                v.rosterList.push({
                    'val': $(val).find(".pruebas")
                });
            }
        });
    });
});
$(document).bind('printChatList',function(ev,data){
    $element = "";
    $element = core.getChatListForJID(data.to,true);
    //cuando tu envias
    if(!data.notif){
        $element.find(".last-message").html("<span class='lastmess mess" + (data.send?"":"recv") + "'>&nbsp;&nbsp;&nbsp;&nbsp;</span>" + data.msg);
        $element.find(".ui-li-aside").text(data.time);
        $element.find(".ui-li-count").text(0);
    }
});
$(document).bind('showNotif',function(ev,data){
    $elemento = core.getChatListForJID(data.from,true);
    $elemento.find(".last-message").html("<span class='lastmess messrecv'>&nbsp;&nbsp;&nbsp;&nbsp;</span>" + data.body);
    $elemento.find(".ui-li-aside").text(data.time);
    $elemento.find(".ui-li-count").text((parseInt($elemento.find(".ui-li-count").text())+1));
    $elemento.find(".ui-li-count").removeClass("hidden");
    if($(".ui-page-active").attr("id") == "chats"){
        $("#chats").find("#chats-content ul").listview('refresh');
    }
});
$(document).bind('updateAvatar',function(ev,data){
    if(data.from == Strophe.getBareJidFromJid(core.connection.jid)){
        $("#profile").find("#profile_content").find("#profileimg img").attr('src',core.current_avatar);
    }else{
        $elemento = core.getRosterListForJID(data.from);
        $.each($elemento,function(i,v){
            $(v.val).find(".my_icon_wrapper").children().attr("src",core.getDataForJid(data.from));
        });
        $chatElement = core.getChatListForJID(data.from,false);
        if($chatElement != null){
            $chatElement.find(".my_icon_wrapper").children().attr("src",core.getDataForJid(data.from));
        }
    }
});
$(document).bind('setStatus',function(ev,data){
    $elemento = core.getRosterListForJID(data.from);
    $.each($elemento,function(i,v){
        $(v.val).find(".last-message").text(data.status);
    });
    /*actualizar noticia*/
    if(data.press){
        $element = $("#news").find("#news-content ul");
        $data = "<li>" +
            "<a class='profile' id='" + data.from + "' href='#profile'>" + 
                "<p class='my_icon_wrapper'><img src='" + core.getDataForJid(data.from) + "' class='my_icon_img'></p>" +
                "<h3 class='my_text_wrapper'>" + core.getNameForJid(data.from) + "</h3>" +
                "<p class='last-message'>" + data.status + "</p>" +
            "</a>" +
        "</li>";
        $element.prepend($data);
        if($("#news").find("#news-content ul").children().length > 1 || core.construido_news){
            $("#news").find("#news-content ul").listview('refresh');
        }
    }
    core.setStatusForJid(data.from,data.status);
});
$(document).bind('setMood',function(ev,data){
    $("#img"+core.getOnlyJID(data.from)).attr("src", "images/"+data.mood+".png");
    /*$elemento = core.getRosterListForJID(data.from);
    $elemento.find();*/
    /*Codigo opcinal para mostrar los cambios realizados en la seccion de noticias*/
    core.setMoodForJid(data.from,data.mood);
});
$(document).bind('sendTimeMessage',function(ev,data){
    $timestamp = ev.timeStamp;
    var mens = $msg({
        to: data.to, 
        from: data.from,
        type: data.type}).c('body').t(data.msg).up().c("time").t(data.time).up().c('request',{xmlns:'urn:xmpp:receipts',timestamp:data.file?data.timestamp:$timestamp}).tree();
    if(!data.file){
        core.sendStanzaConnection(mens, data.to, $timestamp, true, function(send){
            if(send){
                core.log(core.current_user,"<p><b>yo: </b>" + core.proccesMesage(data.msg) + "</p>","send",data.time,data.file?data.timestamp:$timestamp,data.file,false,true);
            }else{
                core.log(core.current_user,"<p><b>yo: </b>" + core.proccesMesage(data.msg) + "</p>","send",data.time,data.file?data.timestamp:$timestamp,data.file,false,false);
            }
        });
    }else{
        core.log(core.current_user,"<p><b>yo: </b>" + core.proccesMesage(data.msg) + "</p>","send",data.time,data.file?data.timestamp:$timestamp,data.file,false,false);
    }
});
$(document).bind('sendTimePlace',function(ev,data){
    $timestamp = ev.timeStamp;
    var msg = data.place==""?(data.object.name + ": " + data.object.address):"<a href='" + data.place.website + "' target='_blank'>" + data.object.name  + " </a>" + data.object.address;
    if(data.isImage){
        msg += "<a href='#view_img' onclick=\"core.downFile(\'" + data.datos[1] + "\'," + true + "," + true + ",\'image\')\"><img clas='avatarIcon' src='" + data.datos[0] + "'></a>";
    }
    var mens = $msg({
        to: data.to, 
        from: data.from,
        type: data.type,
        place:"google_maps",
        place_id:data.object.id,
        place_name:data.object.name,
        place_reference: data.object.reference,
        place_icon: data.object.icon,
        place_lat: data.object.geometry.location.lat(),
        place_lng: data.object.geometry.location.lng(),
        place_address: data.object.address}).c('body').t(escape(msg)).up().c("time").t(data.time).up().c('request',{xmlns:'urn:xmpp:receipts',timestamp:data.timestamp}).tree();
    //core.connection.send(mens);
    core.sendStanzaConnection(mens, data.to, $timestamp, true, function(send){
        if(send){
            core.logPlace(core.current_user,"<p><b>yo: </b>" + msg + "</p>","send",data.time,data.timestamp,data.object,true);
        }else{
            core.logPlace(core.current_user,"<p><b>yo: </b>" + msg + "</p>","send",data.time,data.timestamp,data.object,false);
        }
    });
});
$(document).bind('sendTimeContact',function(ev,data){
    $timestamp = ev.timeStamp;
    $type = core.getChatType(data.to);
    $elementos = data.elementos;
    $datos = $('<data />',$elementos[0]);
    var mens = $msg({
        to: data.to, 
        from: data.from,
        type: $type,
        contact:"phone_contact"}).c('body').t("phone_contact").up().c("time").t(core.getTime()).up().c('request',{xmlns:'urn:xmpp:receipts',timestamp:$timestamp}).up().c('data',$elementos[0]).c('name',$elementos[0].name).tree();
    //core.connection.send(mens);
    core.sendStanzaConnection(mens, data.to, $timestamp, true, function(send){
        if(send){
            core.logContact(core.current_user,$datos,"send",core.getTime(),$timestamp,true);
        }else{
            core.logContact(core.current_user,$datos,"send",core.getTime(),$timestamp,false);
        }
    });
});
$(document).bind('showTimeStamp', function (ev, data) {
    $element = core.getChatDivForJID(data.from);
    $.each($element.children(),function(id,va){
        $.each($(va).children(),function(i,v){
            if($(v).children().attr("timestamp")==data.timestamp){
                $(v).children().find(".imgclock").css('display','');
                $(v).children().find(".imgrecv").css('display','');
                if(data.readed){
                    $(v).children().find(".imgread").css('display','');
                }
                return false;
            }
        });
    });
    /*palomitas para chat list*/
    $chatListElement = core.getChatListForJID(data.from,true);
    if(!data.readed){
        $chatListElement.find(".last-message").children().remove();
    }
    $valor = $chatListElement.find(".last-message").html();
    $chatListElement.find(".last-message").html("<span class='lastmess messenv'>&nbsp;&nbsp;&nbsp;&nbsp;</span>" + $valor);
    if(data.readed){
        $chatListElement.find(".last-message").html("<span class='lastmess messreaded'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>" + $valor);
    }
});
$(document).bind('showSendStamp',function(ev,data){
    $element = core.getChatDivForJID(data.jid);
    $.each($element.children(),function(id,va){
        $.each($(va).children(),function(i,v){
            if($(v).children().attr("timestamp")==data.timestamp){
                $(v).children().find(".imgclock").attr('src','images/send.gif');
                return false;
            }
        });
    });
});
$(document).bind('sendRecNotif',function(ev,data){ //recibido
    var mens = $msg({
        from:data.from,
        to:data.to,
        type:"chat",
        typereceipts:"receipts"
    }).c('received', {xmlns:'urn:xmpp:receipts', id:core.jid_to_id($from), timestamp:data.timestamp}).tree();
    core.connection.send(mens);
});
$(document).bind('sendReadNotif', function (ev, data){ //leido
    var mens = $msg({
        from:data.from,
        to:data.to,
        type:"chat",
        typereceipts:"receipts"
    }).c('x',{xmlns:'jabber:x:event'}).c('delivered').c('timestamp').t(data.timestamp).tree();
    core.connection.send(mens);
});
$(document).bind('printMyAvatar', function (ev, data) {
    $("#profile").find("#profile_content").find("#profileimg img").attr('src',"data:image/png;base64," + $(data.item).find("data").text());
    core.current_avatar = "data:image/png;base64," + $(data.item).find("data").text();
    $("#descarga_url").val($(data.item).find("data").attr("uri"));
    console.log($("#descarga_url").val());
    core.setDataURLForJid($from, $(data.item).find("data").attr("uri"));
    core.current_avatarURL = $(data.item).find("data").attr("uri");
});
$(document).bind('printMyStatus', function (ev, data) {
    core.current_mood = $(data.item).attr("mood")=="undefined"?core.current_mood:$(data.item).attr("mood");
    $("#profile").find("#profile_content").find("#status").html("<span class='estado " + core.current_show + " my_text_wrapper'>"+ core.getOnlyJID(core.connection.jid) + "&nbsp;&nbsp;<img class='mood_icon' src='images/"+ core.current_mood+".png'/> </span><br/><span class='last'> " + $(data.item).text() + "</span>");
    core.current_status = $(data.item).text();
});
$(document).bind('setEdo', function (ev, data) {
    $show = "";
    switch(data.show){
        case 'Disponible':
            $show = 'chat';
        break;
        case 'Ausente':
            $show = 'away';
        break;
        case 'No molestar':
            $show = 'dnd';
        break;
        case 'No disponible':
            $show = 'xa';
        break;
    }
    var pres = null;
    if($show=="chat"){
        pres = $pres().c("status").t(data.status).up().c("icono").t(data.mood).tree();
    }else{
        pres = $pres().c("show").t($show).up().c("status").t(data.status).up().c("icono").t(data.mood).tree();
    }
    core.connection.send(pres);
    core.setStatus(Strophe.getBareJidFromJid(core.connection.jid),data);
    $("#profile").find("#profile_content").find("#status").html("<span class='estado " + $show + " my_text_wrapper'>"+ core.getOnlyJID(core.connection.jid) + "&nbsp;&nbsp;<img class='mood_icon' src='images/"+ core.current_mood+".png'/> </span><br/><span class='last'> " + data.status + "</span>");
    core.current_status = data.status;
    core.current_show = $show;
});
$(document).bind('changeNickName', function (ev, data) {
    var msg = $iq({
        from:Strophe.getBareJidFromJid(core.connection.jid),
        id:'rs1',
        type:'set'
    }).c('query',{
        xmlns:Strophe.NS.ROSTER
    }).c('item',{
        jid:data.jid,
        name:data.name
    });
    $grupos = core.getGroupForJid(data.jid);
    $.each($grupos,function(i,v){
        msg.c('group').t(v.grupo).up().tree();
    });
    core.connection.sendIQ(msg,function(ev){
        //$("#dinamicLink").attr("href",'#jid_profile_dialog').trigger('click');
        console.log(ev);
        $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>Listo!<br/>" + "Los datos han cambiado" + "</div>"});
        $header = $("#jid_profile").find("#jid_profile_header").find("#jid");
        $header.html(data.name + "<img class='mood_icon' src='images/" + core.getMoodForJid(core.current_user) + ".png'>");
        $header.attr("class",core.getShowForJid(core.current_user));
        $header.addClass("ui-title");
        core.setNameForJid(data.jid, data.name);
    },function(e){});
    if(data.change){
        core.setNameForJid(data.jid, data.name);
        core.roster_array.sort(function(a, b){
            if (a.name == b.name) {return 0;}
            if (a.name > b.name){
                return 1;
            }else{return -1;}
        });
        $(document).trigger('llenaRoster');
    }
});
$(document).bind('changeGroup', function (ev, data) {
    var msg = $iq({
        from:Strophe.getBareJidFromJid(core.connection.jid),
        id:'rs1',
        type:'set'
    }).c('query',{
        xmlns:Strophe.NS.ROSTER
    }).c('item',{
        jid:data.jid,
        name:core.getNameForJid(data.jid)
    });
    $grupos = [];
    if(data.borrar){
        $gruposA = core.getGroupForJid(data.jid);
        $.each($gruposA,function(id,val){
            for(var i=0; i<data.groups.length; i++){
                if(data.groups[i] != val.grupo){    //armar mismo arreglo quitando el q se elimina
                    $grupos.push({
                        'grupo':val.grupo
                    });
                }
            }
        });
        if($grupos.length == 0){
            $grupos.push({'grupo':'Otros'});
        }
        $.each($grupos,function(i,v){
            msg.c('group').t(v.grupo).up();
        });
    }else{
        $.each(core.getGroupForJid(data.jid),function(i,v){ //los que ya existen
            if(v.grupo != "Otros"){
                msg.c('group').t(v.grupo).up();
                $grupos.push({'grupo':v.grupo});
            }
        });
        for(var i=0; i<data.groups.length; i++){ //los nuevos
            msg.c('group').t(data.groups[i]).up();
            $grupos.push({'grupo':data.groups[i]});
        }
    }
    console.log($grupos);
    core.connection.sendIQ(msg,function(ev){
        console.log(ev);
        $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>Listo!<br/>" + "Los datos han cambiado" + "</div>"});
    },function(e){});   
    //if(data.change){
        core.setGroupForJid(data.jid,$grupos);
        $(document).trigger('llenaRoster');
    //}
});
$(document).bind('deleteContact', function (ev, data) {
    var iq = $iq({
        from:Strophe.getBareJidFromJid(core.connection.jid),
        id:'rs1',
        type:'set'
    }).c('query',{
        xmlns:Strophe.NS.ROSTER
    }).c('item',{
        jid:data.jid,
        name:core.getNameForJid(data.jid),
        subscription: "remove"
    });
    $.each(core.getGroupForJid(data.jid),function(id,val){
        iq.c('group').t(val.grupo).up();
        console.log(iq);
    });
    core.connection.sendIQ(iq,function(ev){
        $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>Listo!<br/>" + "Los datos han cambiado" + "</div>"});
        setTimeout(function(ev){
            $.mobile.changePage($("#roster-page"));
        },500);
    },function(e){});
    core.roster_array = jQuery.grep(core.roster_array,function(a){  //eliminar del arreglo
        return a.JID != data.jid
    });
    core.roster_group_array = jQuery.grep(core.roster_group_array,function(a){
        return a.JID != data.jid
    });
    if(core.roster_array.length > 0 && core.roster_group_array > 0){
        $(document).trigger('llenaRoster');
    }else{
        $("#roster-page").find("#roster-content ul").html("");
    }
});
$(document).bind('addToList', function (ev, data) {
    core.roster_array.push({
        'JID':data.jid,
        'name':data.name,
        'show':"offline",
        'status':"",
        'last':"none",
        'mood':"cool",
        'dataURL': "none",
        'data':"none"
    });
    core.roster_group_array.push({
        'JID':data.jid,
        'group':[{"grupo":data.group}]
    });
    core.roster_array.sort(function(a, b){
        if (a.name == b.name) {return 0;}
        if (a.name > b.name){
            return 1;
        }else{return -1;}
    });
    core.roster_elements_array.push({
        'JID': data.jid,
        'chatDiv': null,
        'rosterList': [],
        'chatList': null,
        'canvasDiv': null
    });
    $(document).trigger('llenaRoster');
});
$(document).delegate('#chats','pageshow',function(){
    $("#chats").find("#chats-content ul").listview('refresh');
    $.each($("#chat").find("#content").children(),function(i,v){
        console.log($(v));
        $(v).addClass("hidden");
    });
});
$(document).delegate('#chat','pageshow',function(){
    setTimeout(function(){
        $datos = {
            show:core.getShowForJid(core.current_user),
            name:core.getNameForJid(core.current_user),
            mood:"",
            lastAct:"",
            type:core.getChatType(core.current_user),
            data:core.getDataForJid(core.current_user)
        };
        $header = $("#chat").find(".ui-header").find("#userHeader");
        if($datos.type == "chat"){
            $("#chat_footer").css('display', '');
            $datos.mood = core.getMoodForJid(core.current_user);
            $header.html($datos.name + "<img class='mood_icon' src='images/" + $datos.mood + ".png'>");
            $header.attr("class",$datos.show);
            $header.addClass("ui-title");
            $("#imgProfile").attr("src", $datos.data);
            $("#chat").find(".ui-header").find("#contact_profile").attr("href","#jid_profile");
            if($datos.show == "offline"){
                $datos.lastAct = core.getLastForJid(core.current_user);
                if($datos.lastAct == "none"){
                    core.iqLastForJid(core.current_user,function(last){
                        $("#statusChat").text(last);
                    });
                }else{
                    $("#statusChat").text($datos.lastAct);
                }
            }
            if(core.unread_message_array.length >0 && core.getUnreadMessageForJid(core.current_user)){
                $.each(core.unread_jid_message_array, function(i, v) {
                    $(document).trigger('sendReadNotif',{from:core.connection.jid,to:core.current_user,timestamp:v.timestamp});
                });
                core.unread_jid_message_array = [];
            }
        }else{
            if(muc.roomsArray[core.getOnlyJID(core.current_user)].status != "active"){
                $("#chat_footer").css('display', 'none');
            }
            $header.html($datos.name);
            $header.attr("class",$datos.show);
            $header.addClass("ui-title");
            $("#imgProfile").attr("src", $datos.data);
            $("#chat").find(".ui-header").find("#contact_profile").attr("href","#inviteContactToChatGroup");
        }
        $element = core.getChatDivForJID(core.current_user);
        $element.removeClass('hidden');
        $.mobile.silentScroll($('#chat').find("#content")[0].scrollHeight);
        if(archiving.chats[core.current_user] == undefined){
            archiving.getlistCollection(core.current_user, function(chats){
                if(chats){
                    $date = archiving.chats[core.current_user].dates.start[0];
                    $element.prepend("<a href='#' data-inline='true' class='getMessages' id='getMessages_" + Strophe.getNodeFromJid(core.current_user) + "'>Actualizar " + archiving.formateDate($date) + "</a>");
                    $element.find(".getMessages").button();
                }
            });
        }
    },100);
});
$(document).delegate("#chat","pagehide",function(){
    $("#chat").find(".ui-header").find("#userHeader").html("");
    $("#txtmsg").val("");
    $("#statusChat").text("");
    $("#imgProfile").attr("src","");
    $("#chat_footer").css('display', '');
    $elemento = core.getChatListForJID(core.current_user, false);
    console.log("chat pagehide");
    if($elemento != null){
        $($elemento).find(".ui-li-count").text(0);
        $($elemento).find(".ui-li-count").addClass("hidden");
    }
});
$(document).delegate("#jid_profile","pageshow",function(ev,data){
    $grupos = core.getGroups();
    $elemento = $("#jid_profile").find("#jid_profile_content").find("#jid_profile_controlgroup");
    $elemento_delete = $("#jid_profile").find("#jid_profile_content").find("#jid_profile_controlgroup_delete");
    $contentList = "";
    $contentDeleteList = "";
    for(var i=0; i<$grupos.length; i++){
        if(!core.isInGroup($grupos[i], core.current_user) && $grupos[i] != "Otros"){
            $contentList += "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' grupo='" + $grupos[i] + "' class='custom' />" + 
            "<label for='checkbox-" + i + "'>" + $grupos[i] + "</label>\n";
        }else{
            if($grupos[i] != "Otros"){
                $contentDeleteList += "<input type='checkbox' checked='checked' name='checkbox-" + i + "' id='checkbox-" + i + "' grupo='" + $grupos[i] + "' class='custom' />" + 
                "<label for='checkbox-" + i + "'>" + $grupos[i] + "</label>\n";
            }
        }
    }
    $elemento.html($contentList);
    $elemento_delete.html($contentDeleteList);
    $("#contact_image img").attr("src",core.getDataForJid(core.current_user));
    $dataURL = core.getDataURLForJid(core.current_user);
    if($dataURL != "none"){
        $("#contact_image").attr("href","#view_img");
    }else{
        $("#contact_image").attr("href","#");
    }
    setTimeout(function(){
        $header = $("#jid_profile").find("#jid_profile_header").find("#jid");
        $header.html(core.getNameForJid(core.current_user) + "<img class='mood_icon' src='images/" + core.getMoodForJid(core.current_user) + ".png'>");
        $header.attr("class",$datos.show);
        $header.addClass("ui-title");
        $("#jid_profile").find("#jid_profile_header").find(".lastActivity").html(core.getStatusForJid(core.current_user));
        $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#jid_jid_profile").val(core.current_user).textinput('disable');
        $("#jid_profile").find("#jid_profile_content").find("#settings_content").find("#jid_name").val(core.current_user + "/" + core.getNameForJid(core.current_user)).textinput('disable');
        $('#jid_profile').page('destroy').page();
    },100);
});
$(document).delegate("#jid_profile","pagehide",function(){
    $("#contact_image img").attr("src","");
    $("#jid_profile").find("#jid_profile_header").find("#jid").html("");
    $("#jid_profile").find("#jid_profile_header").find(".lastActivity").html("");
});
$(document).delegate("#view_img","pagebeforeshow",function(ev,data){
    console.log("the previous page was: " + data.prevPage.attr("id"));
    $("#view_img").find("#bck_chat").attr("href","#" + data.prevPage.attr("id"));
});
$(document).delegate("#view_img","pagehide",function(){
    $("#view_img").find("#content").find("#full_image").addClass("hidden");
    $("#view_img").find("#content").find(".file_position").html("");
    if(typeof($("#view_img").find("#content").find("#open_local_file")).attr("uri") == "string"){
        $("#view_img").find("#content").find("#open_local_file").button().remove();
    }
    $("#view_img").find("#content").find(".download_file_bar").find(".progressbar").find("#progressbar").css("display","none").children().css('width','0%');
});
$(document).delegate("#settings","pageshow",function(ev,data){
    //Strophe.addNamespace("ARCHIVE", "http://www.xmpp.org/extensions/xep-0136.html#ns");
    //var iqGet = $iq({type:'get', id:'pref1'}).c('pref',{xmlns:Strophe.NS.ARCHIVE}).tree();
    //var iqSet = $iq({type:'set', id:'pref2'}).c('pref',{xmlns:Strophe.NS.ARCHIVE}).c('default',{expire:'31536000',otr:'require',save:'message'}).tree();
    //var iqDefaultModes = $iq({type:'set',id:'pref1'}).c('pref',{xmlns:Strophe.NS.ARCHIVE}).c('default',{otr:'require',save:'message',unset:'true'}).tree();
    //var iqSet = $iq({type:'set', id:'pref2'}).c('auto',{save:'true',scope:'global'}).up().c('default',{expire:'630720000',otr:'oppose',save:'message'}).up().c('method',{type:'auto',use:'prefer'}).up().c('method',{type:'local',use:'forbid'}).up().c('method',{type:'manual',use:'concede'}).tree();
    Strophe.addNamespace("ARCHIVE", "urn:xmpp:archive");
    if(Strophe.getBareJidFromJid(core.connection.jid) == "pruebas4@10.1.1.25"){
        var iqTres = $iq({type:'get', id:'pruebas4'}).c('list',{xmlns:Strophe.NS.ARCHIVE,'end':new Date().toISOString()})
        .c('set',{xmlns:"http://jabber.org/protocol/rsm"}).c('max').t("100").tree();
        var iqCuatro = $iq({type:'get', id:'page1'}).c('retrieve',{xmlns:Strophe.NS.ARCHIVE,'with':'pruebas3@10.1.1.25'})
        .c('set',{xmlns:"http://jabber.org/protocol/rsm"}).c('max').t("100").tree();
        setTimeout(function(){
            console.log(iqTres);
            core.connection.sendIQ(iqTres,function(data){
                console.log("success");
                console.log(data);
            },function(data){
                console.log("error");
                console.log(data);
            });
            console.log(iqCuatro);
            core.connection.sendIQ(iqCuatro,function(data){
                console.log("success");
                console.log(data);
            },function(data){
                console.log("error");
                console.log(data);
            });
            var date = new Date().toISOString();
            //date.format("yyyy-mm-dd'T'HH:MM:ss'Z'");
            console.log(date);
        },2500);
    }
});