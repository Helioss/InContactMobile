var Contacts = {
    contacts_array: [],
    onContactsSuccess: function(contacts){
        contacts.contacts_array = [];
        for(var i=0; i<contacts.length; i++){
            var datos = {id: "", name:{formatted:"",familyName:"",givenName:"",middleName:""}, displayName: "", nickname: "", mobile: "", home: "", work: "", workfax: "", homefax: "", emailhome: "", emailwork: "", emailother: "", photo: ""};
            if(contacts[i].displayName != null && $.trim(contacts[i].displayName) != ""){
                datos.displayName = contacts[i].displayName;
                if(contacts[i].id != null){
                    datos.id = contacts[i].id;
                }
                if(typeof(contacts[i].name) != "undefined"){
                    datos.name.formatted = contacts[i].name.formatted || "";
                    datos.name.familyName = contacts[i].name.familyName || "";
                    datos.name.givenName = contacts[i].name.givenName || "";
                    datos.name.middleName = contacts[i].name.middleName || "";
                }
                if(contacts[i].nickname != null){
                    datos.nickname = contacts[i].nickname;
                }
                if(contacts[i].phoneNumbers != null){
                    for(var j=0; j<contacts[i].phoneNumbers.length; j++){
                        if(contacts[i].phoneNumbers[j].type == "mobile"){
                            datos.mobile = contacts[i].phoneNumbers[j].value;
                        }else if(contacts[i].phoneNumbers[j].type == "home"){
                            datos.home = contacts[i].phoneNumbers[j].value;
                        }else if(contacts[i].phoneNumbers[j].type == "work"){
                            datos.work = contacts[i].phoneNumbers[j].value;
                        }else if(contacts[i].phoneNumbers[j].type == "workfax"){
                            datos.workfax = contacts[i].phoneNumbers[j].value;
                        }else if(contacts[i].phoneNumbers[j].type == "homefax"){
                            datos.homefax = contacts[i].phoneNumbers[j].value;
                        }
                    }
                }
                if(contacts[i].emails != null){
                    for(var k=0; k<contacts[i].emails.length; k++){
                        if(contacts[i].emails[k].type == "home"){
                            datos.emailhome = contacts[i].emails[k].value;
                        }else if(contacts[i].emails[k].type == "work"){
                            datos.emailwork = contacts[i].emails[k].value;
                        }else if(contacts[i].emails[k].type == "other"){
                            datos.emailother = contacts[i].emails[k].value;
                        }
                    }
                }
                if(contacts[i].photos != null){
                    datos.photo = contacts[i].photos[0].value;
                }
                if(datos.mobile=="" && datos.home=="" && datos.work=="" && datos.workfax=="" && datos.homefax=="" && datos.emailhome=="" && datos.emailwork=="" && datos.emailother==""){
                }else{
                    Contacts.contacts_array.push(datos);
                }
            }
        }
        Contacts.printContactsList(Contacts.contacts_array);
    },
    getDataContact: function(id){
        $datos = null;
        $.each(Contacts.contacts_array, function(i, v){
            if(v.id == id){
                $datos = v;
                return false;
            }
        });
        return $datos;
    },
    getDataElementsContact: function(id,elementos,callback){
        $objeto = Contacts.getDataContact(id);
        $elementos = [];
        $base64 = "";
        Contacts.getbase64($objeto.photo,function(data){
            console.log("data");
            console.log(data);
            $base64 = data;
            $elementos.push({
                'name':$objeto.name,
                'displayName':$objeto.displayName,
                'photo':$base64
            });
            for(var i=0; i<elementos.length; i++){
                switch(elementos[i]){
                    case 'mobile':
                        $elementos[0].mobile = $objeto.mobile;
                        break;
                    case 'home':
                        $elementos[0].home = $objeto.home;
                        break;
                    case 'work':
                        $elementos[0].work = $objeto.work;
                        break;
                    case 'workfax':
                        $elementos[0].workfax = $objeto.workfax;
                        break;
                    case 'homefax':
                        $elementos[0].homefax = $objeto.homefax;
                        break;
                    case 'emailhome':
                        $elementos[0].emailhome = $objeto.emailhome;
                        break;
                    case 'emailwork':
                        $elementos[0].emailwork = $objeto.emailwork;
                        break;
                    case 'emailother':
                        $elementos[0].emailother = $objeto.emailother;
                        break;
                }
            }
            callback.call(this,$elementos);
        });
    },
    printContactsList: function(contacts_array){
        console.log(contacts_array.length);
        contacts_array.sort(function(a, b){
            if (a.displayName == b.displayName) {return 0;}
            if (a.displayName > b.displayName){
                return 1;
            }else{return -1;}
        });
        $element = $('#contacts_page').find("#contacts_content ul");
        $html = "";
        $.each(contacts_array, function(i, v){
            if(v.displayName != ""){
                $html += "<li><a href='#select_data_contact_dialog' class='llenaContactSelect' id_contact='" + v.id + "'>" + 
                    "<p class='my_icon_wrapper'>" + "<img src='" + v.photo + "' class='my_icon_img'></p>" +
                    "<h3 class='my_text_wrapper'>" + v.displayName + "</h3>" +
                "</a></li>\n";
            }
        });
        $element.html($html);
        $element.listview('refresh');
    },
    llenaContactSelect: function(id,isRecv){
        //$.mobile.changePage('#select_data_contact_dialog', {transition: 'pop', role: 'dialog'});
        console.log(id);
        $data = Contacts.getDataContact(id);
        console.log($data.displayName);
        $datos = "";
        $id = "";
        $checked = isRecv?" checked='checked'":"";
        $hidden =   "<input type='hidden' id='contact_name_formatted' value='" + ($data.name.formatted || '') + "'>";
        $hidden +=  "<input type='hidden' id='contact_name_familyName' value='" + ($data.name.familyName || '') + "'>";
        $hidden +=  "<input type='hidden' id='contact_name_givenName' value='" + ($data.name.givenName || '') + "'>";
        $hidden +=  "<input type='hidden' id='contact_name_middleName' value='" + ($data.name.middleName || '') + "'>";
        var i = 0;
        if($data.mobile!=""){
            $mobile = $data.mobile.replace("+","&#43;");
            $id = "id_contact='" + id + "_mobile'";
            $datos = "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' " + $id + " class='custom' " + $checked + "/>" + 
                "<label for='checkbox-" + i + "'>Móvil <p class='last-message'>" + $mobile + "</p></label>\n";
            i++;
        }
        if($data.home!=""){
            $id = "id_contact='" + id + "_home'";
            $datos = $datos + "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' " + $id + " class='custom' " + $checked + "/>" + 
                "<label for='checkbox-" + i + "'>Casa <p class='last-message'>" + $data.home + "</p></label>\n";
            i++;
        }
        if($data.work!=""){
            $id = "id_contact='" + id + "_work'";
            $datos = $datos + "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' " + $id + " class='custom' " + $checked + "/>" + 
                "<label for='checkbox-" + i + "'>Trabajo <p class='last-message'>" + $data.work + "</p></label>\n";
            i++;
        }
        if($data.workfax!=""){
            $id = "id_contact='" + id + "_workfax'";
            $datos = $datos + "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' " + $id + " class='custom' " + $checked + "/>" + 
                "<label for='checkbox-" + i + "'>Fax de trabajo <p class='last-message'>" + $data.workfax + "</p></label>\n";
            i++;
        }
        if($data.homefax!=""){
            $id = "id_contact='" + id + "_homefax'";
            $datos = $datos + "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' " + $id + " class='custom' " + $checked + "/>" + 
                "<label for='checkbox-" + i + "'>Fax de casa <p class='last-message'>" + $data.homefax + "</p></label>\n";
            i++;
        }
        if($data.emailhome!=""){
            $id = "id_contact='" + id + "_emailhome'";
            $datos = $datos + "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' " + $id + " class='custom' " + $checked + "/>" + 
                "<label for='checkbox-" + i + "'>email de casa <p class='last-message'>" + $data.emailhome + "</p></label>\n";
            i++;
        }
        if($data.emailwork!=""){
            $id = "id_contact='" + id + "_emailwork'";
            $datos = $datos + "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' " + $id + " class='custom' " + $checked + "/>" + 
                "<label for='checkbox-" + i + "'>email de trabajo <p class='last-message'>" + $data.emailwork + "</p></label>\n";
            i++;
        }
        if($data.emailother!=""){
            $id = "id_contact='" + id + "_emailother'";
            $datos = $datos + "<input type='checkbox' name='checkbox-" + i + "' id='checkbox-" + i + "' " + $id + " class='custom' " + $checked + "/>" + 
                "<label for='checkbox-" + i + "'>email <p class='last-message'>" + $data.emailother + "</p></label>\n";
            i++;
        }
        console.log($datos);
        setTimeout(function(){
            console.log("un segundo!!");
            $name = $("#select_data_contact_dialog").find("#contenido").find("#contact_data");
            $controlGroup = $("#select_data_contact_dialog").find("#contenido fieldset");
            $name.html("<h3><img src='" + $data.photo + "' class='img_contact'> &nbsp;&nbsp;" + $data.displayName + "</h3>");
            $controlGroup.html($datos + "\n" + $hidden);
            $('#select_data_contact_dialog').page('destroy').page();
        },1000);
    },
    getbase64: function(fileURI,callback){
        var path = fileURI, name = 'photo.png', type = "image/png";
        $base64 = "";
        console.log(path + "-->" + name + "-->" + type);
        var ft = new FileTransfer();
        ft.upload(
            path,
            encodeURI("http://200.39.128.160/InContactMobile/php/encodeb64.php"),
            function(info){
                if(typeof info.response !== "undefined"){
                    var decode_json = eval("(" + info.response + ")");
                    $base64 = decode_json.img_b64;
                    callback.call(this,$base64);
                }
            },
            Cordova.onUploadError,
            {"fileKey":"file", "fileName":name, "mimeType":type, "params":{info:"getBase64"}},
            true
        );
        /*if(typeof plugins !== "undefined" && typeof plugins.fileuploader !== "undefined"){
            plugins.fileuploader.uploadByUri(
                "http://200.39.128.160/InContactMobile/php/encodeb64.php",
                path,
                {info:"getBase64"},
                "file",
                name,
                type,
                function(info){
                    if(typeof info.result !== "undefined"){
                        var decode_json = eval("(" + info.result + ")");
                        $base64 = decode_json.img_b64;
                        callback.call(this,$base64);
                    }
                },Contacts.onUploadError
            );
        }else{
            console.log("undefined");
        }*/
    },
    addContact: function(id,valores){
        $objeto = Contacts.getDataContact(id);
        console.log(JSON.stringify($objeto));
        var phoneNumbers = [], emails = [];
        var j = 0, k = 0;
        for(var i=0; i<valores.length; i++){
            switch(valores[i]){
                case 'mobile':
                    phoneNumbers[j] = new ContactField('mobile',$objeto.mobile,true);
                    j++;
                    break;
                case 'home':
                    phoneNumbers[j] = new ContactField('home',$objeto.home,true);
                    j++;
                    break;
                case 'work':
                    phoneNumbers[j] = new ContactField('work',$objeto.work,true);
                    j++;
                    break;
                case 'workfax':
                    phoneNumbers[j] = new ContactField('workfax',$objeto.workfax,true);
                    j++;
                    break;
                case 'homefax':
                    phoneNumbers[j] = new ContactField('homefax',$objeto.homefax,true);
                    j++;
                    break;
                case 'emailhome':
                    emails[k] = new ContactField('home',$objeto.emailhome,true);
                    k++;
                    break;
                case 'emailwork':
                    emails[k] = new ContactField('work',$objeto.emailwork,true);
                    k++;
                    break;
                case 'emailother':
                    emails[k] = new ContactField('other',$objeto.emailother,true);
                    k++;
                    break;
            }
        }
        var contact = navigator.contacts.create();
        var name = new ContactName();
        name.formatted = $objeto.name.formatted;
        name.familyName = $objeto.name.familyName;
        name.givenName = $objeto.name.givenName;
        name.middleName = $objeto.name.middleName;
        contact.name = name;
        contact.displayName = $objeto.displayName;
        var photos = new ContactField();
        photos.type = 'base64';
        photos.value = $objeto.photo;
        photos.pref = true;
        contact.photos = photos;
        if(typeof(phoneNumbers[0]) != "undefined"){
            contact.phoneNumbers = phoneNumbers;
            console.log("phoneNumbers");
            console.log(phoneNumbers[0].value);
        }
        if(typeof(emails[0]) != "undefined"){
            contact.emails = emails;
            console.log("emails");
            console.log(emails[0].value);
        }
        contact.save(function(ev){
            $(document).trigger('showDialogNotif', {clase:"info",html:"<div class='notification info'>" + $objeto.displayName + ":<br/> se ha agregado</div>"});
        },function(ev){
            $(document).trigger('showDialogNotif', {clase:"error",html:"<div class='notification info'>" + $objeto.displayName + ":<br/> no se pudo agregar</div>"});
        });
    }
}
$(function(){
    $(".llenaContactSelect").live('click',function(ev){
        $id = $(this).attr("id_contact");
        Contacts.llenaContactSelect($id,false);
    });
    $("#ok_send_contact").live('click',function(ev){
        $controlGroup = $("#select_data_contact_dialog").find("#contenido fieldset");
        $id = "";
        $valores = "";
        $.each($controlGroup.children(),function(id,val){
            $.each($(val).children(),function(i,v){
                $input = $(v).find("input");
                if($input.attr("checked") == "checked"){
                    $datos = $input.attr("id_contact").split("_");
                    $id = $datos[0];
                    $valores += $datos[1] + "_";
                }
            });
        });
        if($id != ""){
            console.log($id);
            console.log($valores);
            $valores = $valores.split("_");
            $elementos = null;
            Contacts.getDataElementsContact($id,$valores,function(elementos){
                console.log("tengo elementos!");
                $(document).trigger('sendTimeContact',{from:core.connection.jid,to:core.current_user,elementos:$elementos});
                $(document).trigger('printChatList',{msg:"Contacto: " + $elementos[0].displayName + "...",to:core.current_user,time:core.getTime(),notif:false,send:true});
            });
        }
        $("#select_data_contact_dialog").find("#contenido").find("#contact_data").html("");
        $controlGroup.html("");
    });
    $(".link_contact").live('click',function(ev){
        var datos = {
            id: ($(this).find("#contact_id").val() || ""),
            name: {
                formatted: ($(this).find("#contact_name_formatted").val() || ""),
                familyName: ($(this).find("#contact_name_familyName").val() || ""),
                givenName: ($(this).find("#contact_name_givenName").val() || ""),
                middleName:($(this).find("#contact_name_middleName").val() || "")
            },
            displayName: ($(this).find("#contact_displayname").val() || ""),
            nickname: ($(this).find("#contact_nickname").val() || ""),
            mobile: ($(this).find("#contact_mobile").val() || ""),
            home: ($(this).find("#contact_home").val() || ""),
            work: ($(this).find("#contact_work").val() || ""),
            workfax: ($(this).find("#contact_workfax").val() || ""),
            homefax: ($(this).find("#contact_homefax").val() || ""),
            emailhome: ($(this).find("#contact_emailhome").val() || ""),
            emailwork: ($(this).find("#contact_emailwork").val() || ""),
            emailother: ($(this).find("#contact_emailother").val() || ""),
            photo: ($(this).find("#contact_photo").val() || "")
        };
        Contacts.contacts_array.push(datos);
        Contacts.llenaContactSelect(datos.id,true);
        $clase = $(this).attr("clase");
        setTimeout(function(){
            $("#select_data_contact_dialog").find("#contenido").find("#ok_send_contact").button().remove();
            $("#select_data_contact_dialog").find("#contenido").append("<a href='#chat' id='ok_return' data-role='button'>ok</a>");
            $("#select_data_contact_dialog").find("#contenido").find("#ok_return").button();
            if($clase === "recv"){
                $("#select_data_contact_dialog").find("#contenido").append("<a href='#chat' id='ok_add_contact' data-role='button'>Agregar a contactos</a>");
                $("#select_data_contact_dialog").find("#contenido").find("#ok_add_contact").button();
            }
        },500);
    });
    $("#ok_return").live('click',function(ev){
        $("#select_data_contact_dialog").find("#contenido").find("#ok_return").button().remove();
        $("#select_data_contact_dialog").find("#contenido").find("#ok_add_contact").button().remove();
        $("#select_data_contact_dialog").find("#contenido").append("<a href='#chat' id='ok_send_contact' data-role='button'>ok</a>");
        $("#select_data_contact_dialog").find("#contenido").find("#ok_send_contact").button();
    });
    $("#ok_add_contact").live('click',function(ev){
        $("#select_data_contact_dialog").find("#contenido").find("#ok_return").button().remove();
        $("#select_data_contact_dialog").find("#contenido").find("#ok_add_contact").button().remove();
        $("#select_data_contact_dialog").find("#contenido").append("<a href='#chat' id='ok_send_contact' data-role='button'>ok</a>");
        $("#select_data_contact_dialog").find("#contenido").find("#ok_send_contact").button();
        $controlGroup = $("#select_data_contact_dialog").find("#contenido fieldset");
        $id = "";
        $valores = "";
        $.each($controlGroup.children(),function(id,val){
            $.each($(val).children(),function(i,v){
                $input = $(v).find("input");
                if($input.attr("checked") == "checked"){
                    $datos = $input.attr("id_contact").split("_");
                    $id = $datos[0];
                    $valores += $datos[1] + "_";
                }
            });
        });
        if($id != ""){
            console.log($id);
            console.log($valores);
            $valores = $valores.split("_");
            Contacts.addContact($id,$valores);
        }
    });
});