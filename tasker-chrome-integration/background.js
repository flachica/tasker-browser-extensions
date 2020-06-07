var port = chrome.runtime.connectNative("tasker_integration");

port.onMessage.addListener((response) => {
  console.log("From Tasker: " + response);
  if (response.type == 'stateGetted')
    sendMessageContentScript("taskerStateGetted", response)
  else
    console.log(response)
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('To Tasker: ' + request.message.type);
    if (request.message.type == 'sendMessageTasker') {
        if (port) port.postMessage(JSON.stringify(request.message.payload));
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        var preferences = window.localStorage.getItem('preferences');
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
}

function sendMessageContentScript(type, payload) {
    console.log('To Content: ' + type);
    chrome.tabs.query({active: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {'message':
        {
            'type': type,
            'payload': payload
        }
    }, function(response) {});
    });
}