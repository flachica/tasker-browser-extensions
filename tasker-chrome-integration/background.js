var port = chrome.runtime.connectNative("tasker_integration");
var preferences;

port.onMessage.addListener((response) => {
  console.log("From Tasker: " + response);
  if (response.type == 'stateGetted')
    sendMessageContentScript("taskerStateGetted", response)
});

port.onDisconnect.addListener((p) => {
  if (p.error) {
    console.log(`Disconnected due to an error: ${p.error.message}`);
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('To Tasker: ' + request.message.type);
    if (request.message.type == 'sendMessageTasker') {
        if (port) {
            port.postMessage(JSON.stringify(request.message.payload));
        } else {
            console.log('Port is undefined. Cannot communicate with Tasker')
        }
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        preferences = window.localStorage.getItem('preferences');
        if (preferences) {
            JSON.parse(preferences).forEach(
                function(item) {
                    var re = new RegExp(item.url);
                    if (re.test(tab.url))
                        sendInitPreferences(preferences);
                }
            );
        }
    }
});

function sendInitPreferences() {
    var preferences = window.localStorage.getItem('preferences');
    if (preferences)
        sendMessageContentScript('initWithPreferences', preferences);
    else
        console.log('Configure this extension please');
}

function sendMessageContentScript(type, payload) {
    chrome.tabs.query({active: true}, function(tabs){
        JSON.parse(preferences).forEach(
            function(item) {
                var re = new RegExp(item.url);
                tabs.forEach(
                    function (tab) {
                        if (re.test(tab.url)) {
                            var messageJSON = {'message':{'type': type, 'payload': payload}};
                            chrome.tabs.sendMessage(tab.id, messageJSON, function(response) {
                                console.log('Message sended')
                            });
                        }
                    }
                );
            }
        );
    });
}
