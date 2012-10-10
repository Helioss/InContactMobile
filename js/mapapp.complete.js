var mapapp = {
    map: null,
    infowindow: null,
    service: null,
    place_objects_array:[],
    lat: null,
    lng: null,
    getMapDiv: function(mapElement){
        navigator.geolocation.getCurrentPosition(function(position){
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            mapapp.lat = lat;
            mapapp.lng = lng;
            var pyrmont = new google.maps.LatLng(lat,lng);
            var map = mapapp.printMap(mapElement, pyrmont);
            mapapp.createMyLocationMarker(map,pyrmont);
            var request = {
                location: pyrmont,
                radius: 100,
                types: ['store','restaurant','gym','food','lawyer','finance','establishment',
                'electronics_store','clothing_store','casino','cafe','book_store','bar','bank','amusement_park',
                'airport','subway_station','travel_agency','university']
            };
            mapapp.infowindow = new google.maps.InfoWindow();
            mapapp.service = new google.maps.places.PlacesService(mapapp.map);
            mapapp.service.search(request,mapapp.callback);
            mapapp.place_objects_array.push({
                'id':"my_actual_location",
                'name':"Ubicación Actual",
                'reference':"",
                'icon':"images/google_maps_icon.png",
                'geometry':{'location':pyrmont},
                'address':""
            });
        },function(error){
            console.log(error);
        });
    },
    printMap: function(mapElement,pyrmont){
        $map = mapElement;
        mapapp.map = new google.maps.Map($map[0],{
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: pyrmont,
            mapTypeControl:false,
            streetViewControl:false,
            zoom: 16
        });
        return mapapp.map;
    },
    callback: function(results,status){
        if(status === google.maps.places.PlacesServiceStatus.OK){
            $('#maps_page').find("#maps_content ul").html("");
            for(var i=0; i<results.length; i++){
                mapapp.createPlaceMarker(results[i]);
            }
        }
    },
    createMyLocationMarker: function(mapElement,pyrmont){
        var marker = new google.maps.Marker({
            map: mapElement,
            position: pyrmont,
            animation:google.maps.Animation.BOUNCE,
            icon: new google.maps.MarkerImage("http://200.39.128.160/InContactMobile/images/away.png",new google.maps.Size(16,16))
        });
        google.maps.event.addListener(marker,'click',function(){
            mapapp.infowindow.setContent("Usted esta aquí");
            mapapp.infowindow.open(mapapp.map,this);
        });
    },
    createPlaceMarker: function(place){
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: mapapp.map,
            position: place.geometry.location,
            animation:google.maps.Animation.DROP,
            icon: new google.maps.MarkerImage("http://200.39.128.160/InContactMobile/images/dnd.png",new google.maps.Size(16,16))
        });
        google.maps.event.addListener(marker,'click',function(){
            mapapp.infowindow.setContent(place.name);
            mapapp.infowindow.open(mapapp.map,this);
        });
        mapapp.createPlaceList(place, marker);
    },
    createPlaceList: function(place,marker){
        var name = place.name, address = place.vicinity, id = place.id, reference = place.reference;
        mapapp.place_objects_array.push({
            'id':id,
            'name':name,
            'reference':reference,
            'icon':place.icon,
            'geometry':place.geometry,
            'address':address
        });
        $html = "<li><a href='#options_maps_send_dialog' class='place_element' id='" + id + "'><h3 class='my_text_wrapper'>" + name + "</h3><p class='last-message'>" + address + "</p></a></li>";
        $element = $('#maps_page').find("#maps_content ul");
        $element.append($html);
        $element.listview('refresh');
    },
    getPlaceObject: function(id){
        $object = null;
        $.each(mapapp.place_objects_array, function(i, v){
            if(v.id==id){
                $object = v;
                return false;
            }
        });
        return $object;
    },
    buildMapPlaceDialog: function(id,isRecv){
        var object = mapapp.getPlaceObject(id);
        $lat = object.geometry.location.lat();
        $lng = object.geometry.location.lng();
        $url = "geo:" + $lat + "," + $lng + "?z=16";
        $contenido = $("#options_maps_send_dialog").find("#contenido");
        $map = $contenido.find("#map_info_square");
        $contenido.find("#map_data").html("<h3><img src='" + object.icon + "' class='map_icon'>" + object.name + "</h3>");
        $contenido.find("#place_info").html("<br/>" + object.address + "<a href='" + $url + "' target='_blank'> Ver en google maps</a>");
        $contenido.find("#place_id").val(id);
        setTimeout(function(){
            if(isRecv){
                $("#options_maps_send_dialog").find("#contenido").find("#map_controlgroup").addClass('hidden');
                $("#options_maps_send_dialog").find("#contenido").find("#place_button").button().remove();
                $("#options_maps_send_dialog").find("#contenido").append("<a href='#chat' id='ok_place_button' data-role='button'>ok!</a>");
                $("#options_maps_send_dialog").find("#contenido").find("#ok_place_button").button();
            }else{
                $("#options_maps_send_dialog").find("#contenido").find("#map_controlgroup").removeClass('hidden');
            }
            var map = mapapp.printMap($map,object.geometry.location);
            mapapp.createMyLocationMarker(map,object.geometry.location);
        },700);
    },
    buildAndSendMapPlace: function(place,object,elemento){
        $datos = "";
        var isImage = false
        if($("#options_maps_send_dialog").find("#contenido").find("#place_thumb_url").val() != "" && elemento != null){     //limpiar dialogo pq tiene imagen
            isImage = true;
            $datos = $("#options_maps_send_dialog").find("#contenido").find("#place_thumb_url").val().split("|")
            elemento.css("display","none");
            $("#options_maps_send_dialog").find("#contenido").find("#checkbox_map_pic").attr("checked",false).checkboxradio("refresh");
            $("#options_maps_send_dialog").find("#contenido").find("#checkbox_map_pic").checkboxradio("enable");
            $("#options_maps_send_dialog").find("#contenido").append("<a href='#' id='place_button' data-role='button'>ok!</a>");
            $("#options_maps_send_dialog").find("#contenido").find("#place_button").button();
        }
        Cordova.buildTimePlace(core.connection.jid, core.current_user,place,object,isImage,$datos);
        //Cordova.buildTimePlace(core.connection.jid, core.current_user,msg,url);
    }
}

$(function(){
    $(".place_element").live('click',function(){
        mapapp.buildMapPlaceDialog($(this).attr("id"),false);
    });
    $(".msg_maps_dialog").live('click',function(){
        mapapp.place_objects_array = [];
        mapapp.place_objects_array.push({
            'id':           $(this).find('#place_id').val() || "",
            'name':         $(this).find('#place_name').val() || "",
            'reference':    $(this).find('#place_reference') || "",
            'icon':         $(this).find('#place_icon').val() || "",
            'geometry':     {'location':new google.maps.LatLng(Number($(this).find('#place_lat').val()),Number($(this).find('#place_lng').val()))} || "",
            'address':      $(this).find('#place_address').val() || ""
        });
        console.log($(this).find('#place_id').val());
        mapapp.buildMapPlaceDialog($(this).find('#place_id').val(),true);
    });
    $("#checkbox_map_pic").bind("change",function(event,ui){
        console.log($(this).attr("checked"));
        if($(this).attr("checked") === "checked"){
            $("#options_maps_send_dialog").find("#contenido").find("#place_button").button().remove();
            $(this).checkboxradio("disable");
            Cordova.captureImage('map');
            //tomar foto y obtener url
        }
    });
    $("#place_button").live('click',function(){
        var object = mapapp.getPlaceObject($("#options_maps_send_dialog").find("#contenido").find("#place_id").val());
        var request = {reference: object.reference};
        if(object.id === "my_actual_location"){
            mapapp.buildAndSendMapPlace("",object,null); //no se tomo foto
        }else{
            mapapp.service.getDetails(request,function(place,status){
                if(status == google.maps.places.PlacesServiceStatus.OK){
                    mapapp.buildAndSendMapPlace(place,object,null);
                }
            });
        }
    });
    $("#ok_place_button").live('click',function(){
        $("#options_maps_send_dialog").find("#contenido").find("#cmap_controlgroup").removeClass('hidden');
        $("#options_maps_send_dialog").find("#contenido").find("#ok_place_button").button().remove();
        $("#options_maps_send_dialog").find("#contenido").append("<a href='#chat' id='place_button' data-role='button'>ok!</a>");
        $("#options_maps_send_dialog").find("#contenido").find("#place_button").button();
    });
});