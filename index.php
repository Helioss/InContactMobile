<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>InContact</title>
        <link rel="apple-touch-icon" href="images/logo.png" size="57x57"/> 
        <link rel="apple-touch-icon-precomposed" sizes="android-only" href="images/logo.png"> 
        <meta name="apple-mobile-web-app-capable" content="yes">
        <link rel="stylesheet" href="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.css" />
        <script src="http://code.jquery.com/jquery-1.8.2.min.js"></script>
        <script src="http://code.jquery.com/mobile/1.2.0/jquery.mobile-1.2.0.min.js"></script>
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?libraries=places&sensor=true"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="style/style.css">
        <link rel="stylesheet" href="style/barStyle.css"/>
        <script src="js/config.js"></script>
        <script src="js/strophe.js"></script>
        <script src="js/strophe.register.js"></script>
        <script src="js/core.js"></script>
        <script src="js/cordova.js"></script>
        <script src="js/myprofile.js"></script>
        <script src="js/messageArchiving.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/mapapp.complete.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/contacts.js"></script>
        <script src="js/whiteboard.js"></script>
        <script src="js/muc.js"></script>
        <script src="js/blockUI.js"></script>
        <script src="js/jquery.form.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/cordova-2.0.0.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/LocalNotification.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/fileuploader.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/downloader.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/canvas.js"></script>
        <script type="text/javascript" charset="utf-8" src="js/video.js"></script>
    </head>
    <body>
        <!--Mi comnetario paera pruebas Atte. John HELIOS!! :D-->
        <div data-role="page" id="register" data-full-screen="true">
            <div data-role="header">
                <h1>Registro</h1>
            </div>
            <div data-role="content">
                <h2>Registrarse</h2>
                <hr>
                <label for="userReg">Usuario</label>
                <input type="text" id="userReg" name="userReg" required placeholder="Usuario..." />
                <label for="passReg">Password</label>
                <input type="password" id="passReg" name="passReg" required />
                <label for="emailReg">Email</label>
                <input type="text" id="emailReg" name="emailReg" required />
                <label for="nickReg">Nick</label>
                <input type="text" id="nickReg" name="nickReg" required />
                <label for="captcha" id="captchaText"></label>
                <input type="text" id="captcha" name="captcha" required />
                <a id="registerBtn" href="#" data-role="button" data-inline="true" data-rel="dialog" data-transition="pop">Registrar</a>
                <a id="loginReg" href="#login" data-role="button" data-inline="true" data-rel="dialog" data-transition="pop">Login</a>
            </div>
        </div>
        <div data-role="page" id="login" data-full-screen="true">
            <div data-role="header">
                <h1>InContact</h1>
            </div>
            <div data-role="content">
                <h2>Iniciar Sesión</h2>
                <hr>
                <label for="user">Usuario</label>
                <input type="text" id="user" name="user" value="Helios" required placeholder="Usuario...">
                <label for="pass">Password</label>
                <input type="password" id="pass" name="pass" value="chocolate" required>
                <a id="entrar" href="#" data-role="button">Entrar</a>
            </div>
        </div>
        
        <!-- ------------ INICIA SECCIÓN DE DIALOGOS!!!! ------------ -->
        <div data-role="page" id="entrando" data-full-screen="true">
            <div id="header" data-role="header" data-position="fixed">
                <h1>Conectando...</h1>
            </div>
            <div id="contenido" data-role="content">
                <h2 id="mensaje"></h2>
                <a id="roster" href="#" data-role="button" data-inline="true" class="hidden">Ok!</a>
            </div>
        </div>
        <div data-role="page" id="changeStatus" data-full-screen="true">
            <div id="header" data-role="header" data-position="fixed">
                <h1>Estado</h1>
                <a href="#" id="saveStatus" data-icon="arrow-r" data-iconpos="right" data-role="button" data-inline="true">Guardar</a>
            </div>
            <div id="contenido" data-role="content">
                <textarea id="txtStatus" required placeholder="Estado..."></textarea>
                <select id="estado" name="estado" data-native-menu="false">
                    <option value="chat">Disponible</option>
                    <option value="away">Ausente</option>
                    <option value="dnd">No molestar</option>
                    <option value="xa">No disponible</option>
                </select>
                <!--Inicia selector de Estado de animo-->
                <div data-role="collapsible" data-theme="c" data-content-theme="d" data-mini="true">
                    <h3>Moods</h3>
                    <div id="mood" class="ui-grid-c moods">
                        <div class="ui-block-a">
                            <img class="imgicono" onclick="javascript:core.set_icon('afraid')" src="images/afraid.png" />
                        </div>
                        <div class="ui-block-b">
                            <img class="imgicono" onclick="javascript:core.set_icon('crazy')" src="images/crazy.png" />                       
                        </div>
                        <div class="ui-block-c">
                            <img class="imgicono" onclick="javascript:core.set_icon('furious')" src="images/furious.png" />                      
                        </div>
                        <div class="ui-block-d">
                            <img class="imgicono" onclick="javascript:core.set_icon('prrrr')" src="images/prrrr.png" />
                        </div>

                        <div class="ui-block-a">
                            <img class="imgicono" onclick="javascript:core.set_icon('angry')" src="images/angry.png" />
                        </div>
                        <div class="ui-block-b">
                            <img class="imgicono" onclick="javascript:core.set_icon('disappointed')" src="images/disappointed.png" />                     
                        </div>
                        <div class="ui-block-c">
                            <img class="imgicono" onclick="javascript:core.set_icon('happy')" src="images/happy.png" />                     
                        </div>
                        <div class="ui-block-d">
                            <img class="imgicono" onclick="javascript:core.set_icon('sad')" src="images/sad.png" />
                        </div>

                        <div class="ui-block-a">
                            <img class="imgicono" onclick="javascript:core.set_icon('cool')" src="images/cool.png" />
                        </div>
                        <div class="ui-block-b">
                            <img class="imgicono" onclick="javascript:core.set_icon('endiablado')" src="images/endiablado.png" />                        
                        </div>
                        <div class="ui-block-c">
                            <img class="imgicono" onclick="javascript:core.set_icon('inlove')" src="images/inlove.png" />                       
                        </div>
                        <div class="ui-block-d">
                            <img class="imgicono" onclick="javascript:core.set_icon('tired')" src="images/tired.png" />
                        </div>
                        
                        <div class="ui-block-a">
                            <img class="imgicono" onclick="javascript:core.set_icon('clik')" src="images/clik.png" />
                        </div>
                        <div class="ui-block-b">
                            <img class="imgicono" onclick="javascript:core.set_icon('heaa')" src="images/heaa.png" />                        
                        </div>
                        <div class="ui-block-c">
                            <img class="imgicono" onclick="javascript:core.set_icon('nervous')" src="images/nervous.png" />                       
                        </div>
                        <div class="ui-block-d">
                            <img class="imgicono" onclick="javascript:core.set_icon('stars')" src="images/stars.png" />
                        </div>
                    </div>
                </div>
                <!--Inicia selector de color de fondo-->
                <div data-role="collapsible" data-theme="c" data-content-theme="d" data-mini="true">
                    <h3>Background Color</h3>
                    <div class="ui-grid-d moods">
                        <div class="ui-block-a">
                            <a href="#" class="bkg_color" id="black">
                                <p><img class="imgicono" src="images/black.png"></p>
                            </a>
                        </div>
                        <div class="ui-block-b">
                            <a href="#" class="bkg_color" id="red">
                                <p><img class="imgicono" src="images/red.png"></p>
                            </a>
                        </div>
                        <div class="ui-block-c">
                            <a href="#" class="bkg_color" id="green">
                                <p><img class="imgicono" src="images/green.png"></p>
                            </a>
                        </div>
                       <div class="ui-block-d">
                            <a href="#" class="bkg_color" id="yellow">
                                <p><img class="imgicono" src="images/yellow.png"></p>
                            </a>
                        </div>
                       <div class="ui-block-e">
                            <a href="#" class="bkg_color" id="blue">
                                <p><img class="imgicono" src="images/blue.png"></p>
                            </a>
                        </div>

                       <div class="ui-block-a">
                            <a href="#" class="bkg_color" id="orange">
                                <p><img class="imgicono" src="images/orange.png"></p>
                            </a>
                        </div>
                        <div class="ui-block-b">
                            <a href="#" class="bkg_color" id="pink">
                                <p><img class="imgicono" src="images/pink.png"></p>
                            </a>
                        </div>
                        <div class="ui-block-c">
                            <a href="#" class="bkg_color" id="aqua">
                                <p><img class="imgicono" src="images/aqua.png"></p>
                            </a>
                        </div>
                       <div class="ui-block-d">
                            <a href="#" class="bkg_color" id="brown">
                                <p><img class="imgicono" src="images/brown.png"></p>
                            </a>
                        </div>
                       <div class="ui-block-e">
                            <a href="#" class="bkg_color" id="white">
                                <p><img class="imgicono" src="images/white.png"></p>
                            </a>
                        </div>
                   </div>
                </div>
            </div>
        </div>
        <div data-role="page" id="accept_reject_dialog" data-full-screen="true">
            <div id="header" data-role="header" data-position="fixed">
                <h1>Invitaci&oacute;n</h1>
            </div>
            <div id="contenido" data-role="content">
                <span id="jid" jid="" class="hidden"></span>
                <h3 id="addMsg"></h3>
                <div data-role="fieldcontain">
                    <label for="addName"> Nombre: </label>
                    <input type="text" name="addName" id="addName" value="" required />
                </div>
                    <div data-role="fieldcontain">
                    <label for="addName"> Grupo: </label>
                    <input type="text" name="addGroup" id="addGroup" value="" required />
                </div>
                <a id="acceptFriendship" href="#roster-page" data-role="button" data-inline="true">Aceptar</a>
                <a id="rejectFriendship" href="#roster-page" data-role="button" data-inline="true">Rechazar</a>
            </div>
        </div>
        <div data-role="page" id="jid_profile_dialog" data-full-screen="true">
            <div data-role="header" data-position="fixed">
                <h1>Listo!</h1>
            </div>
            <div data-role="content">
                <h3>Los datos han cambiado</h3>
                <a href="#jid_profile" data-role="button" data-inline="true">Ok!</a>
            </div>
        </div>
        <div data-role="page" id="chatGroupInvitation_dialog" data-full-screen="true">
            <div id="header" data-role="header" data-position="fixed">
                <h1>Invitación</h1>
            </div>
            <div id="contenido" data-role="content">
                <h3 id="addMsg"></h3>
                <span id="roomName" roomName="" class="hidden"></span>
                <a id="btn_acceptJoin" href="#chats" data-role="button" data-inline="true">Aceptar</a>
            </div>
        </div>
        <div data-role="dialog" id="chat_message_options">
            <div data-role="header" data-position="fixed">
                <h1>Seleccione</h1>
            </div>
            <div data-role="content">
                <div data-role="content" data-theme="a">
                    <ul data-role="listview" data-mini="true">
                        <li><a href="#chat" id="copy_chat_message"><h3 class="my_text_dialog_wrapper">Copiar</h3></a></li>
                        <li><a href="#chat" id="forward_chat_message"><h3 class="my_text_dialog_wrapper">Reenviar</h3></a></li>
                        <li><a href="#chat" id="delete_chat_message"><h3 class="my_text_dialog_wrapper">Eliminar</h3></a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div data-role="dialog" id="image_capture_options">
            <div data-role="header" data-position="fixed">
                <h1>Seleccione</h1>
            </div>
            <div data-role="content">
                <div data-role="content" data-theme="a">
                    <ul data-role="listview" data-mini="true">
                        <li><a href="#profile" id="copy_chat_message"><h3 class="my_text_dialog_wrapper">Camara</h3></a></li>
                        <li><a href="#profile" id="forward_chat_message"><h3 class="my_text_dialog_wrapper">Galeria</h3></a></li>
                    </ul>
                </div>
            </div>
        </div>
        <div data-role="page" id="opcfile_dialog">
            <div id="opcfile_dialog_header" data-role="header" data-position="fixed">
                <h1>Compartir</h1>
            </div>
            <div id="opcfile_dialog_content" data-role="content">
                <div id="opcfile" data-role="controlgroup" data-type="horizontal" data-theme="a" class="hidden">
                    <select id="select_image" data-native-menu="false" data-inline="true" data-icon="camera-file">
                        <option value=""></option>
                        <option value="1">Camara</option>
                        <option value="2">Galeria</option>
                    </select>
                    <select id="select_video" data-native-menu="false" data-inline="true" data-icon="video-file">
                        <option value=""></option>
                        <option value="1">Videocamara</option>
                        <option value="2">Galeria</option>
                    </select>
                    <select id="select_audio" data-native-menu="false" data-inline="true" data-icon="audio-file">
                        <option value=""></option>
                        <option value="1">Grabadora</option>
                        <option value="2">Galeria</option>
                    </select>
                </div>
                <div id="opcfileS" data-role="content" data-theme="a">
                    <ul data-role="listview" data-mini="true">
                        <li>
                            <a href="#" id="select_image_icon">
                                <p class="my_icon_wrapper"><img src="images/86-camera.png" class="my_icon_img"></p>
                                <h3 class="my_text_dialog_wrapper">Imagen</h3>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="select_video_icon">
                                <p class="my_icon_wrapper"><img src="images/43-film-roll.png" class="my_icon_img"></p>
                                <h3 class="my_text_dialog_wrapper">Video</h3>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="select_audio_icon">
                                <p class="my_icon_wrapper"><img src="images/65-note.png" class="my_icon_img"></p>
                                <h3 class="my_text_dialog_wrapper">Audio</h3>
                            </a>
                        </li>
                        <li>
                            <a href="#maps_page" id="link_maps_page">
                                <p class="my_icon_wrapper"><img src="images/07-map-marker.png" class="my_icon_img"></p>
                                <h3 class="my_text_dialog_wrapper">Ubicación</h3>
                            </a>
                        </li>
                        <li>
                            <a href="#contacts_page" id="link_contacts_page">
                                <p class="my_icon_wrapper"><img src="images/contacts.png" class="my_icon_img"></p>
                                <h3 class="my_text_dialog_wrapper">Contacto</h3>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="initWhiteboard">
                                <p class="my_icon_wrapper"><img src="images/whiteboard.png" class="my_icon_img"></p>
                                <h3 class="my_text_dialog_wrapper">Pizarra</h3>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div data-role="dialog" id="select_data_contact_dialog">
            <div id="contenido" data-role="content">
                <span id="contact_data"></span>
                <div data-role="fieldcontain">
                    <fieldset data-role="controlgroup" id="contact_controlgroup">
                        
                    </fieldset>
                    <a href="#chat" id="ok_send_contact" data-role="button">ok!</a>
                </div>
            </div>
        </div>
        <div data-role="dialog" id="select_data_avatar_dialog">
            <div data-role="header">
                <h1>Seleccione</h1>
            </div>
            <div id="contenido" data-role="content">
                <div data-role="content" data-theme="a">
                    <ul data-role="listview" data-mini="true">
                        <li>
                            <a href="#" id="avatar_camara">
                                <p class="my_icon_wrapper"><img src="images/86-camera.png" class="my_icon_img"></p>
                                <h3 class="my_text_dialog_wrapper">Camara</h3>
                            </a>
                        </li>
                        <li>
                            <a href="#" id="avatar_galeria">
                                <p class="my_icon_wrapper"><img src="images/43-film-roll.png" class="my_icon_img"></p>
                                <h3 class="my_text_dialog_wrapper">Galeria</h3>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div data-role="dialog" id="options_maps_send_dialog">
            <div id="contenido" data-role="content">
                <span id="map_data"></span>
                <div id="map_info_square"></div>
                <div id="place_info"></div>
                <div data-role="fieldcontain">
                    <fieldset data-role="controlgroup" id="map_controlgroup">
                        <input type='checkbox' name='checkbox_map_pic' id='checkbox_map_pic' class='custom' /><label for='checkbox_map_pic'>Tomar Foto</label>
                    </fieldset>
                    <div class="map_location_photo">
                        <div class="progressbar"><div id="progressbar" class="meter animate"><span><span></span></span></div></div>
                    </div>
                    <a href="#" id="place_button" data-role="button">ok!</a>
                    <input type="hidden" id="place_id" value="" />
                    <input type="hidden" id="place_thumb_url" value="" />
                </div>
            </div>
        </div>
        
        <!-- ------------ TERMINA SECCIÓN DE DIALOGOS!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE CHATS!! ------------ -->
        <div data-role="page" id="chats" data-full-screen="true">
            <div id="header" data-role="header" data-position="fixed">
                <a href="#roster-page" data-icon="arrow-l" data-direction="reverse">Contactos</a>
                <h1>Chats</h1>
            </div>
            <div id="chats-content" data-role="content">
                <ul data-role="listview" data-filter="true" data-filter-placeholder="Buscar chats...">
                    <li>
                        <a class="pruebas" id="nochats" href="#roster-page">
                            <h3>Aún no tienes chats abiertos!</h3>
                        </a>
                    </li>
                </ul>
                <div class="hidden">
                    <select id="opciones" name="opciones" data-native-menu="false" class='hidden'>
                        <option value="">Seleccione...</option>
                        <!--<option value="0">Ver contacto</option>
                        <option value="1">Eliminar Chat</option>-->
                    </select>
                </div>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE CHATS!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE NOTICIAS!! ------------ -->
        <div data-role="page" id="news" data-full-screen="true">
            <div data-role="header" data-position="fixed">
                <a href="#roster-page" data-icon="arrow-l" data-direction="reverse">Contactos</a>
                <h1>Noticias</h1>
            </div>
            <div id="news-content" data-role="content">
                <ul data-role="listview" data-filter="true" data-filter-placeholder="Buscar noticias...">
                    
                </ul>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE NOTICIAS!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE CONTACTOS!! ------------ -->
        <div data-role="page" data-id="main" id="roster-page" data-full-screen="true">
            <div id="roster_header" data-role="header" data-position="fixed">
                <!--<a href="news.php" data-icon="arrow-l" data-direction="reverse">Noticias</a>-->
                <h1 id="jid_name">Contactos</h1>
                <div id="log"></div>
            </div>
            <div id="roster-content" data-role="content">
                <ul data-role='listview' data-filter='true' data-filter-placeholder='Buscar contactos...'>
                    
                </ul>
            </div>
            <div data-role="footer" data-position="fixed">
                <div data-role="navbar">
                    <ul>
                        <li><a href="#chats" id="chatsbtn" data-icon="chat-fb">Chats</a></li>
                        <li><a href="#news" id="newsbtn" data-icon="menu-news">Noticias</a></li>
                        <li><a href="#roster-page" data-icon="menu-groups" class="ui-btn-active ui-state-persist">Grupos</a></li>
                        <li><a href="#profile" id='profilebtn' data-icon="menu-profile">Perfil</a></li>
                        <li><a href="#settings" data-icon="menu-gear">Opciones</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE CONTACTOS!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE PERFIL!! ------------ -->
        <div data-role="page" id="profile" data-full-screen="true">
            <div data-role="header" data-position="fixed">
                <a href="#roster-page" data-icon="arrow-l" data-direction="reverse">Contactos</a>
                <h1>Perfil</h1>
            </div>
            <div id="profile_content" data-role="content">
                <div>
                    <div class="mensaje_edo" id="status">Loading...</div>
                    <a href="#select_data_avatar_dialog" data-rel="dialog" id="profileimg">
                        <img src="images/loading.gif" class="profileimg">
                    </a>
                </div>
                <a id="descarga" href="#view_img" data-icon="down-avatar" data-role="button" data-inline="true">&nbsp;&nbsp;</a>
                <input type="hidden" id="descarga_url" value="">
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE PERFIL!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE JID PERFIL!! ------------ -->
        <div data-role="page" id="jid_profile" data-full-screen="true">
            <div id="jid_profile_header" data-role="header" data-position="fixed">
                <a href="#chat" data-icon="arrow-l" data-direction="reverse">Chat</a>
                <h1 id="jid">Perfil</h1>
                <div> <h2 class="lastActivity"> </h2> </div>
                <a href="#" data-transition="fade" data-theme="b" data-icon-pos="right" id="contact_image">
                    <img id="urlImgProfile" class="my_icon_img" src=""/>
                </a>
            </div>
            <div id="jid_profile_content" data-role="content">
                <div id="settings_content" data-role="content">
                    <div data-role="collapsible-set">
                        <div data-role="collapsible" data-collapsed="true">
                            <h2>Ver JID</h2>
                            <div data-role="fieldcontain">
                                <label for="change_nick_name"> JID: </label>
                                <input type="text" name="jid_jid_profile" id="jid_jid_profile" value="" />
                            </div>
                        </div>
                        <div data-role="collapsible" data-collapsed="true">
                            <h2>Cambiar Apodo</h2>
                            <div data-role="fieldcontain">
                                <label for="change_nick_name"> Apodo: </label>
                                <input type="text" name="change_nick_name" id="change_nick_name" value="" required />
                                <a id="btnNickname" href="" data-role="button" data-inline="true">Cambiar</a>
                            </div>
                        </div>
                        <div data-role="collapsible" data-collapsed="true">
                            <h2>Unir a un grupo</h2>
                            <div data-role="fieldcontain">
                                <label for="change_group"> Grupo: </label>
                                <input type="text" name="change_group" id="change_group" value="" required />
                                <div data-role="fieldcontain" class="jid_profile_fieldcontain">
                                    <fieldset data-role="controlgroup" id="jid_profile_controlgroup">
                                        
                                    </fieldset>
                                </div>
                                <a id="btnGroup" href="" data-role="button" data-inline="true">Cambiar</a>
                            </div>
                        </div>
                        <div data-role="collapsible" data-collapsed="true">
                            <h2>Eliminar de un grupo</h2>
                            <div data-role="fieldcontain">
                                <div data-role="fieldcontain" class="jid_profile_fieldcontain">
                                    <fieldset data-role="controlgroup" id="jid_profile_controlgroup_delete">
                                        
                                    </fieldset>
                                </div>
                                <a id="btnGroup_delete" href="" data-role="button" data-inline="true">Cambiar</a>
                            </div>
                        </div>
                        <div data-role="collapsible" data-collapsed="true">
                            <h2>Eliminar Amigo</h2>
                            <div data-role="fieldcontain">
                                <label for="jid_name"> Amigo: </label>
                                <input type="text" name="jid_name" id="jid_name" value="" required />
                                <a id="btnDelete" href="" data-role="button" data-inline="true">Eliminar</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE JID PERFIL!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE OPCIONES!! ------------ -->
        <div data-role="page" id="settings" data-full-screen="true">
            <div data-role="header" data-position="fixed">
                <a href="#roster-page" data-icon="arrow-l" data-direction="reverse">Contactos</a>
                <h1>Ajustes</h1>
            </div>
            <div id="settings-content" data-role="content">
                <div data-role="collapsible-set">
                    <div data-role="collapsible" data-collapsed="true">
                        <h2>Agregar contacto</h2>
                        <div data-role="fieldcontain">
                            <label for="addJid"> JID: </label>
                            <input type="text" name="addJid" id="addJid" value="" required />
                        </div>
                        <div data-role="fieldcontain">
                            <label for="addName"> Nombre: </label>
                            <input type="text" name="addName" id="addName" value="" required />
                        </div>
                            <div data-role="fieldcontain">
                            <label for="addName"> Grupo: </label>
                            <input type="text" name="addGroup" id="addGroup" value="" required />
                        </div>
                        <a id="btnAddContact" href="#succesAddContact" data-role="button" data-inline="true" data-rel="dialog" data-transition="pop">Send</a>
                    </div>
                    <div data-role="collapsible" data-collapsed="true">
                        <h2>Iniciar Chat-Group</h2>
                        <div data-role="fieldcontain">
                            <label for="topic"> Tematica: </label>
                            <input type="text" name="topic" id="topic" value="" required />
                        </div>
                        <a id="btnCreateChatGroup" href="#" data-role="button" data-inline="true" data-rel="dialog" data-transition="pop" data-theme="a">Send</a>
                    </div>
                </div>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE OPCIONES!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE CHAT!! ------------ -->
        <div data-role="page" id="chat" data-full-screen="true">
            <div data-role="header" data-position="fixed">
                <a href="#chats" data-icon="arrow-l" data-direction="reverse" id="bck-chats">Chats</a>
                <h1 id="userHeader"></h1>
                <div> <h2 class="lastActivity" id="statusChat"> </h2> </div>
                <a href="#jid_profile" data-transition="fade" data-theme="b" data-icon-pos="right" id="contact_profile">
                    <img id="imgProfile" class="my_icon_img" src=""/>
                </a>
            </div>
            <div id="content" data-role="content"></div>
            <div data-role="footer" id="chat_footer" data-id="main" data-position="fixed">
                <div data-role="navbar" data-iconpos="bottom">
                    <ul>
                        <li><a href="#opcfile_dialog" data-role="button" data-theme="b" data-rel="dialog" data-icon="add-file">&nbsp;</a></li>
                        <li><input type="text" id="txtmsg" placeholder="Escribir un mensaje..."></li>
                        <li><a href="#" data-icon="send-mess" id="enviar">&nbsp;</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE CHAT!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE IMAGEN GRANDE!! ------------ -->
        <div data-role="page" id="view_img" data-full-screen="true">
            <div data-role="header" data-position="fixed">
                <a href="#" data-icon="arrow-l" id="bck_chat" data-direction="reverse">Atrás</a>
                <h1 id="img_header"></h1>
            </div>
            <div id="content" data-role="content">
                <img class="full_image hidden" id="full_image" src="">
                <div class="download_file_bar">
                    <div class='progressbar'><div id="progressbar" class="meter animate"><span><span></span></span></div></div>
                </div>
                <div class="file_position"></div>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE IMAGEN GRANDE!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE AÑADIR CONTACTOS A CHAT_GROUP!! ------------ -->
        <div data-role="page" id="inviteContactToChatGroup" data-full-screen="true">
            <div id="roster_header" data-role="header" data-position="fixed">
                <a id="readyInvited" href="#chat" data-icon="check" data-direction="reverse">Listo!</a>
                <h1>Invitar Contactos</h1>
                <div id="log"></div>
            </div>
            <div id="listContactsChatGroup" data-role="content">
                <legend>Selecciona tus contactos a invitar.</legend>
                <div id="checkContacts" data-role="controlgroup">
                </div>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE AÑADIR CONTACTOS A CHAT_GROUP!!!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE MAPAS DE GOOGLE!! ------------ -->
        <div data-role="page" id="maps_page" data-full-screen="true">
            <div data-role="header" data-position="fixed">
                <a href="#chat" data-icon="arrow-l" data-direction="reverse">Chat</a>
                <h1>Mapas</h1>
            </div>
            <div id="maps_content" data-role="content">
                <div id="map_square"></div>
                <a href="#options_maps_send_dialog" class="place_element" id="my_actual_location" data-role="button">Enviar ubicación actual</a>
                </br>
                <ul data-role='listview' data-filter='true' data-filter-placeholder='Buscar lugares...'>
                    
                </ul>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE MAPAS DE GOOGLE!!!! ------------ -->
        
        <!-- ------------ INICIA SECCIÓN DE LISTA CONTACTOS TELEFONO!! ------------ -->
        <div data-role="page" id="contacts_page" data-full-screen="true">
            <div data-role="header" data-position="fixed">
                <a href="#chat" data-icon="arrow-l" data-direction="reverse">Chat</a>
                <h1>Contactos del telefono</h1>
            </div>
            <div id="contacts_content" data-role="content">
                <ul data-role='listview' data-filter='true' data-filter-placeholder='Buscar contacto...'>
                    
                </ul>
            </div>
        </div>
        <!-- ------------ TERMINA SECCIÓN DE LISTA CONTACTOS TELEFONO!!!! ------------ -->
        <!-- ------------ INICIA SECCIÓN DE PIZARRA!! ------------ -->
        <div data-role="page" id="whiteboard" data-full-screen="true">

            <div id="headerCanvas" data-role="header" data-position="fixed">
                <a href="" id="backChat" data-icon="arrow-l" data-direction="reverse"><span id="BtnBackCanvas"></span></a>
                <h1>Pizarra</h1>
            </div><!-- /header -->

            <div data-role="content" id="canvasContent">
                <!--<canvas id="whiteboardCanvas"></canvas>-->
            </div><!-- /content -->

            <div data-role="footer" data-position="fixed">
                <!--<fieldset data-role="controlgroup" data-type="horizontal" data-inline="true" data-mini="true">-->
                <div data-role="navbar" id="canvasFooter">
                    <ul>
                        <li><a href="#colorDialog" data-rel="dialog" data-icon="star" data-iconpos="right" data-theme="a" data-inline="true" data-mini="true">Colors</a></li>
                        <li><a href="#backgroundDialog" data-rel="dialog" data-icon="star" data-iconpos="right" data-theme="a" data-inline="true" data-mini="true">BackG</a></li>
                        <li><a href="#efectsDialog" data-rel="dialog" data-icon="star" data-iconpos="right" data-theme="a" data-inline="true" data-mini="true">Efects</a></li>
                        <li><a href="#optionsDialog" data-rel="dialog" data-icon="star" data-iconpos="right" data-theme="a" data-inline="true" data-mini="true">Options</a></li>
                    </ul>
                </div><!-- /navbar -->
            </div><!-- /footer -->
    </div>
        <!-- ------------ TERMINA SECCIÓN DE PIZARRA!! ------------ -->
    <!-- ******************************************Dialogos Pizarra******************************************************* -->
    <div data-role="page" id="colorDialog">
        <div data-role="header">
            <h3>Opciones de color</h3>
        </div>
        <div data-role="content">
           <label for="colorWidth" class="select">Width:</label>
           <input type="range" id="colorWidth" name="colorWidth" value="1" min="1" max="10"/>
           <label for="drawingType" class="select">Drawing type:</label>
            <select data-native-menu="false" data-icon="grid" data-iconpos="right" id="drawingType" name="drawingType" data-mini="true">
                <option value="pencil" selected="selected"> Pencil </option>
                <option value="line"> Line </option>
            </select>
           <label for="colorPoint" class="select">Color:</label>
           <div class="ui-grid-d moods">
                <div class="ui-block-a">
                    <a href="#" class="select-color" id="black">
                        <p><img class="imgicono" src="images/black.png"></p>
                    </a>
                </div>
                <div class="ui-block-b">
                    <a href="#" class="select-color" id="red">
                        <p><img class="imgicono" src="images/red.png"></p>
                    </a>
                </div>
                <div class="ui-block-c">
                    <a href="#" class="select-color" id="green">
                        <p><img class="imgicono" src="images/green.png"></p>
                    </a>
                </div>
               <div class="ui-block-d">
                    <a href="#" class="select-color" id="yellow">
                        <p><img class="imgicono" src="images/yellow.png"></p>
                    </a>
                </div>
               <div class="ui-block-e">
                    <a href="#" class="select-color" id="blue">
                        <p><img class="imgicono" src="images/blue.png"></p>
                    </a>
                </div>
               
               <div class="ui-block-a">
                    <a href="#" class="select-color" id="orange">
                        <p><img class="imgicono" src="images/orange.png"></p>
                    </a>
                </div>
                <div class="ui-block-b">
                    <a href="#" class="select-color" id="pink">
                        <p><img class="imgicono" src="images/pink.png"></p>
                    </a>
                </div>
                <div class="ui-block-c">
                    <a href="#" class="select-color" id="aqua">
                        <p><img class="imgicono" src="images/aqua.png"></p>
                    </a>
                </div>
               <div class="ui-block-d">
                    <a href="#" class="select-color" id="brown">
                        <p><img class="imgicono" src="images/brown.png"></p>
                    </a>
                </div>
               <div class="ui-block-e">
                    <a href="#" class="select-color" id="white">
                        <p><img class="imgicono" src="images/white.png"></p>
                    </a>
                </div>
           </div>
        </div>
    </div>
    <div data-role="page" id="backgroundDialog">
        <div data-role="header">
            <h3>Background</h3>
        </div>
        <div data-role="content">
           <label for="colorBack" class="select">Color:</label>
            <select data-native-menu="false" data-icon="arrow-d" data-iconpos="right" id="colorBack" name="colorBack" data-mini="true">
                <option value=""> -- </option>
                <option value="255,255,255"> White </option>
                <option value="0,0,0"> Black </option>
                <option value="255,64,64"> Red </option>
                <option value="0,255,0"> Green </option>
                <option value="255,255,0"> Yellow </option>
                <option value="0,0,255"> Blue </option>
                <option value="255,127,0"> Orange </option>
                <option value="255,0,255"> Magenta </option>
                <option value="153,50,204"> Violet </option>
            </select>
           <br/>
           <label class="select">Background:</label>
           <ul data-role="listview" data-mini="true" data-inset="true" data-theme="a">
                <li>
                    <a href="" id="imgCanvasBackground_cam">
                        <p class="my_icon_wrapper"><img src="images/86-camera.png" class="my_icon_img"></p>
                        <h3 class="my_text_dialog_wrapper">Camera</h3>
                    </a>
                </li>
                <li>
                    <a href="" id="imgCanvasBackground_gallery">
                        <p class="my_icon_wrapper"><img src="images/galleryIcon.png" class="my_icon_img"></p>
                        <h3 class="my_text_dialog_wrapper">Galary</h3>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div data-role="page" id="efectsDialog">
        <div data-role="header">
            <h3>Efects</h3>
        </div>
        <div data-role="content">
            <a href="#" id="gray" data-role="button" data-icon="star" data-iconpos="right" data-theme="c" data-mini="true">B & W</a>
            <a href="#" id="negative" data-role="button" data-icon="star" data-iconpos="right" data-theme="c" data-mini="true">Negative</a>
        </div>
    </div>
    <div data-role="page" id="optionsDialog">
        <div data-role="header">
            <h3>Opciones</h3>
        </div>
        <div data-role="content">
            <a href="#" id="clean" data-role="button" data-icon="delete" data-iconpos="right" data-theme="c" data-mini="true">Clean</a>
            <a href="#" id="saveSend" data-role="button" data-icon="star" data-iconpos="right" data-theme="c" data-mini="true">Save and Send</a>
        </div>
    </div>
    <div data-role="page" id="invitationWhiteboard" data-full-screen="true">
        <div id="header" data-role="header" data-position="fixed">
            <h1>Invitación</h1>
        </div>
        <div id="contenido" data-role="content">
            <h3 id="addMsg"></h3>
            <span id="msgWhieboard"></span>
            <a id="btn_acceptWhiteboard" href="#whiteboard" data-role="button" data-inline="true">Aceptar</a>
        </div>
    </div>
    <!--*****************Final de dialosgos de Pizarra*****************-->
        <a id="dinamicLink" href="#" data-rel="dialog" data-transition="pop" class="hidden">Ok!</a>
        <a id="dinamicLinkPage" href="#" class="hidden">Ok!</a>
        <form id="formSendFile" action="" method="POST" enctype="multipart/form-data" target="upload-frame" data-ajax="false">
            <div>
                <input type="hidden" id="uid" name="<?php echo ini_get('session.upload_progress.name'); ?>" value="123" >
                <input type="file" name="transfer" id="sendfile" class="file_transfer">
                <input type="hidden" type="text" id="sender" name="sender" value="" />
                <input type="hidden" type="text" id="target" name="target" value="" />
                <input type="hidden" type="text" id="timestamp" name="timestamp"value="" />
            </div>
            <iframe id="respSendFiel" src="" class="hidden"></iframe>
        </form>
    </body>
</html>