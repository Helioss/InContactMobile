var Canvas = function() {};

Canvas.prototype.toDataURL = function(canvas, mimeType, successCallback, failCallback){
    var canvasProps = {
        "mimeType": "image/png",
        "xpos": 0,
        "ypos": 0,
        "width": 0,
        "height": 0,
        "screenWidth": document.getElementsByTagName('html')[0].scrollWidth // no WebView.getContentWidth(), use this instead
        //"screenWidth": document.getElementById('pruebas1').scrollWidth // no WebView.getContentWidth(), use this instead
    };
    if ( canvas.toString().indexOf("HTMLCanvasElement") != -1 ) {
        canvasProps.mimeType = mimeType;
        canvasProps.xpos = canvas.offsetLeft+3;
        canvasProps.ypos = canvas.offsetTop+3;
        canvasProps.width = canvas.width-3;
        canvasProps.height = canvas.height-3;
    }
    function success(args) {
        successCallback(args);
    }
    function fail(args) {
        failCallback(args);
    }
    return PhoneGap.exec(
        function(args) {
            success(args);
        },
        function(args) {
            fail(args);
        },
        'CanvasPlugin',
        'toDataURL',
        [canvasProps.mimeType,
        canvasProps.xpos,
        canvasProps.ypos,
        canvasProps.width,
        canvasProps.height,
        canvasProps.screenWidth]
    );
};

cordova.addConstructor(function() {
if (!window.plugins) {
window.plugins = {};
}
window.plugins.canvas = new Canvas();
});

/*PhoneGap.addConstructor(function() {
	PhoneGap.addPlugin('canvas', new Canvas());
	PluginManager.addService("CanvasPlugin","com.phonegap.plugin.canvas.CanvasPlugin");
});*/