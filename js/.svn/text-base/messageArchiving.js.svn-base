var archiving = {
    chats: [],
    addChats: function(jid,start){
        if(archiving.chats[jid] == undefined){
            archiving.chats[jid] = {'name':jid,'dates':{'start':start,'end':""}};
        }else{
            archiving.chats[jid].dates.start += "," + start;
        }
    },
    getlistCollection: function(jid,callback){
        Strophe.addNamespace("ARCHIVE", "urn:xmpp:archive");
        var xml = $iq({type:'get', id:core.connection.getUniqueId('list')}).c('list',{xmlns:Strophe.NS.ARCHIVE,'with':jid})
        .c('set',{xmlns:"http://jabber.org/protocol/rsm"}).c('max').t("100").tree();
        core.connection.sendIQ(xml,this._handleListResponse.bind(this, callback),function(data){
            console.log("error");
            console.log(data);
        });
    },
    _handleListResponse: function(callback,stanza){
        $chats = false;
        console.log($(stanza));
        $(stanza).find("chat").each(function(){
            archiving.addChats($(this).attr("with"),$(this).attr("start"));
            $chats = true;
        });
        if(archiving.chats[core.current_user] != undefined){
            $fechas = archiving.chats[core.current_user].dates.start.split(",");
            $fechas.sort(function(a, b){
                if (a == b) {return 0;}
                if (a > b){
                    return -1;
                }else{return 1;}
            });
            archiving.chats[core.current_user].dates.start = $fechas;
            archiving.chats[core.current_user].dates.end = new Date().toISOString();
        }else{
            archiving.chats[core.current_user] = {'name':core.current_user};
        }
        callback.call(this,$chats);
    },
    getChatColection: function(jid,start,end,callback){
        var xml = $iq({type:'get', id:core.connection.getUniqueId('retrieve')}).c('retrieve',{xmlns:Strophe.NS.ARCHIVE,'with':jid,start:start,end:end})
        .c('set',{xmlns:"http://jabber.org/protocol/rsm"}).c('max').t("100").tree();
        core.connection.sendIQ(xml,this._handleRetrieveResponse.bind(this, callback),function(data){
            console.log("error");
            console.log(data);
        });
    },
    _handleRetrieveResponse: function(callback,stanza){
        console.log($(stanza));
        $with = $(stanza).find("chat").attr("with");
        $start = new Date($(stanza).find("chat").attr("start"));
        $chatDiv = core.getChatDivForJID($with);
        $elemento = [];
        $(stanza).find("chat").children().each(function(id,val){
            $who = val.nodeName;
            if($who != "set"){
                $elemento[id] = $(val);
            }
        });
        $elemento.reverse();
        $.each($elemento,function(id,val){
            $who = $(val)[0].nodeName;
            console.log($who);
            $time = new Date($start.getTime() + (Number($(val).attr("secs")) || 0));
            $time = $time.getHours() + ":" + $time.getMinutes();
            if($who == "from"){
                core.log($with,"<p><b>" + core.getNameForJid($with) + ":</b>" + core.proccesMesage($(val).text()) + "</p>","recv",$time,"0",false,true,true);
            }else if($who == "to"){
                core.log($with,"<p><b>yo: </b>" + core.proccesMesage($(val).text()) + "</p>","send",$time,"0",false,true,true);
            }
            if((id+1) == $elemento.length){
                $(document).trigger('printChatList',{msg:$(val).text(),to:$with,time:$time,notif:false,send:($who=="to"?true:false)});
            }
        });
        $chatDiv.prepend("<div class='notification_group'><div class='info'>" + archiving.formateDate($start) + "</div></div>");
        callback.call(this);
    },
    formateDate: function(date){
        var formatDate = new Date(date);
        formatDate = formatDate.getDay() + "/" + (formatDate.getMonth() + 1) + "/" + formatDate.getFullYear() + ", " + formatDate.getHours() + ":" + formatDate.getMinutes();
        return formatDate;
    }
};
$(function(){
    $(".getMessages").live('click',function(ev){
        //console.log(JSON.stringify(archiving.chats[core.current_user].dates));
        $elemento = $(this).find('.ui-btn-text');
        $elemento.html("<img src='images/loadingC.gif' style='width:30px' height:auto>");
        $fechas = archiving.chats[core.current_user].dates;
        archiving.getChatColection(core.current_user,$fechas.start[0],$fechas.end,function(){
            console.log("termino");
            $fechas.end = $fechas.start[0];
            $fechas.start.splice(0, 1);
            console.log(JSON.stringify($fechas));
            if($fechas.start.length == 0){
                $("#getMessages_" + Strophe.getNodeFromJid(core.current_user)).button().remove();
            }else{
                $("#getMessages_" + Strophe.getNodeFromJid(core.current_user)).find('.ui-btn-text').html("Actualizar " + archiving.formateDate($fechas.start[0]));
                $("#getMessages_" + Strophe.getNodeFromJid(core.current_user)).prependTo(core.getChatDivForJID(core.current_user));
            }
        });
    });
});