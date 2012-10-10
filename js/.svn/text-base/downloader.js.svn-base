function Downloader() {}

Downloader.prototype.downloadFile = function(fileUrl, params, win, fail) {

	//Make params hash optional.
	if (!fail) win = params;
	cordova.exec(win, fail, "Downloader", "downloadFile", [fileUrl, params]);
};

cordova.addConstructor(function() {
    if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.downloader = new Downloader();
});

/*cordova.addConstructor(function() {
	PhoneGap.addPlugin("downloader", new Downloader());
	PluginManager.addService("Downloader", "com.phonegap.plugins.downloader.Downloader");
});*/