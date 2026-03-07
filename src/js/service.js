
const API = (() => {
  if (typeof browser !== 'undefined') return browser;
  if (typeof chrome !== 'undefined') return chrome;
  throw new Error('Extension API not found');
})();

const klak = {
    "error": function(){
        return API.runtime.lastError;
    },
    "version": function () {
        return API.runtime.getManifest().version;
    },
    "homepage": function(){
        return API.runtime.getManifest().homepage_url;
    },
    "config": {
        "default": {
            "interface": {
                "size": {
                    "width": 1400, 
                    "height": 800
                }
            }
        },
        "welcome": {
            set lastupdate (val) {klak.storage.write("lastupdate", val)},
            get lastupdate () {return klak.storage.read("lastupdate") !== undefined ? klak.storage.read("lastupdate") : 0}
        }
    },
    "on": {
        "management": function (callback) {
            API.management.getSelf(callback);
        },
        "uninstalled": function (url) {
            API.runtime.setUninstallURL(url, function () {
                if (klak.error()) {
                    console.error("Error setting uninstall URL:", klak.error());
                }
            });
        },
        "installed": function (callback) {
            API.runtime.onInstalled.addListener(function (e) {
                callback(e);
            });
        },
        "clicked": function(callback) {
            if(API.action) {
                API.action.onClicked.addListener(function(e) {
                    callback(e);
                });
            } else if(API.browserAction){
                API.browserAction.onClicked.addListener(function(e) {
                    callback(e);
                });
            }
        }
    },
    "tab": {
        "open": function (url, index, active, callback) {
            let properties = {
                "url": url, 
                "active": active !== undefined ? active : true
            };
            /*  */
            if (index !== undefined) {
                if (typeof index === "number") {
                    properties.index = index + 1;
                }
            }
            /*  */
            API.tabs.create(properties, function (tab) {
                if (callback) callback(tab);
            }); 
        },
        "query": {
            "index": function (callback) {
                API.tabs.query({"active": true, "currentWindow": true}, function (tabs) {
                    if (tabs && tabs.length) {
                        callback(tabs[0].index);
                    } else callback(undefined);
                });
            }
        },
    },
    "storage": {
        "local": {},
        "read": function (id) {
            return klak.storage.local[id];
        },
        "write": function (id, data, callback) {
            let tmp = {};
            tmp[id] = data;
            klak.storage.local[id] = data;

            API.storage.local.set(tmp, function (e) {
                if (callback) {
                    callback(e);
                }
            });
        }
    }, 
    "window": {
        "create": function (options, callback) {
            API.windows.create(options, function (e) {
                if (callback) callback(e);
            });
        },
        "query": {
            "current": function (callback) {
                API.windows.getCurrent(callback);
            }
        },
        "get": function(windowId, callback) {
            API.windows.get(windowId, function(e) {
                if (callback) callback(e);
            });
        },
        "update": function(windowId, options, callback) {
            API.windows.update(windowId, options, function(e) {
                if (callback) callback(e);
            });
        },
        "on": {
            "removed": function(callback) {
                API.windows.onRemoved.addListener(function(e) {
                    callback(e);
                });
            }
        }
    },
    "interface": {
        set id(e) {
            klak.storage.write("interface.id", e);
        },
        get id() {
            return klak.storage.read("interface.id") !== undefined ? klak.storage.read("interface.id") : '';
        },
        "path": API.runtime.getURL("data/theme/theme.html"),
        "create": function(url, callback) {
            klak.window.query.current(function(win) {
                url = url ? url : klak.interface.path;

                const width = klak.config.default.interface.size.width;
                const height = klak.config.default.interface.size.height;

                const top = (win.top + Math.round((win.height - height) / 2));
                const left = (win.left + Math.round((win.width - width) / 2));
                klak.window.create({
                    "url": url,
                    "top": top,
                    "left": left,
                    "width": width,
                    "type": "popup",
                    "height": height
                }, function(e) {
                    klak.interface.id = e.id;
                    if (callback) callback(e);
                });
            });
        }
    },

}

klak.on.clicked(function(){
    if(klak.interface.id){
        try {
            klak.window.get(klak.interface.id, function(win) {
                if (win) {
                    klak.window.update(klak.interface.id, {
                        "focused": true
                    });
                } else {
                    klak.interface.id = '';
                    klak.interface.create();
                }
            });
        } catch (error) {
            console.log("Window does not exist");
        }
    } else{
        klak.interface.create();
    }
});

klak.window.on.removed(function(e){
    if (e === klak.interface.id) {
        klak.interface.id = '';
    }
});

if (!navigator.webdriver){
    klak.on.uninstalled(klak.homepage());
    klak.on.installed(function(e){
        klak.on.management(function(result){
            if (result.installType === "normal") {
                klak.tab.query.index(function(index) {
                    let previous = e.previousVersion !== undefined && e.previousVersion !== klak.version();
                    let doupdate = previous && parseInt((Date.now() - klak.config.welcome.lastupdate) / (24 * 3600 * 1000)) > 45;

                    if (e.reason === "install" || (e.reason === "update" && doupdate)) {
                        klak.tab.open(klak.homepage(), index, e.reason === "install");
                        klak.config.welcome.lastupdate = Date.now();
                    }
                });
            }
        })
    });
}