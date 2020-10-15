var module = (function() {
    return {
        invoke: function(subview, script, params) {
            return new Promise(function(resolve, reject) {
                const request_id = (Math.random() * 10000).toFixed(0);

                global["actions__on_request_" + request_id] = function(result) { 
                    if (result["callback"] === "resolve") {
                        resolve(result);
                    } else {
                        reject(result);
                    }

                    delete global["actions__on_request_" + request_id];
                }        
                
                controller.action("script", Object.assign(params, {
                    "script": script,
                    "subview": subview,
                    "return-script": "actions__on_request_" + request_id,
                    "return-subview": $data["SUBVIEW"]
                }));
            });
        },

        resolve: function(params, data) {
            controller.action("script", Object.assign(data, {
                "script": params["return-script"],
                "subview": params["return-subview"],
                "callback": "resolve"
            }));
        },

        reject: function(params, error) {
            controller.action("script", Object.assign(error, {
                "script": params["return-script"],
                "subview": params["return-subview"],
                "callback": "reject"
            }));
        },
    }
})();

__MODULE__ = module;
