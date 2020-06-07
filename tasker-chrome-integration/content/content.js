const taskerControlTemplate = '<button id="taskerControl" class="ml-1 btn btn-primary fa fa-play" style="margin-left: 0.25em;"/>'
const extensionID = 'kejbjmcifabkmfijiohnbllogajnfggb'

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.message.type == 'initWithPreferences') {
        preferences = request.message.payload;
        JSON.parse(preferences).forEach(
            function(item) {
                var re = new RegExp(item.url);
                if (re.test(window.location.href)) {
                    var element = getElementByXpath(item.xpath);
                    messagetext = element.innerHTML;
                    if (!document.getElementById('taskerControl')) {
                        if (element) {
                            element.insertAdjacentHTML("afterend", taskerControlTemplate);
                            document.querySelector('#taskerControl').addEventListener('click', function() {
                                sendMessageBackground({type: 'changeState', 'payload': {'todo': messagetext}});
                                sendMessageBackground({type: 'getState', 'payload': {'todo': messagetext}});
                            });
                        }
                    }
                    var element = getElementByXpath(item.xpath);
                    sendMessageBackground({type: 'getState', 'payload': {'todo': messagetext}});
                }
            }
        );
    } else if (request.message.type == 'taskerStateGetted') {
        classList = document.getElementById('taskerControl').classList;
        classList.remove("fa-play");
        classList.remove("fa-pause");
        if (request.message.payload.state == 'started') {
            classList.add('fa-pause');
        } else {
            classList.add('fa-play');
        }
    }
});

function sendMessageBackground(payload) {
    var messageJSON = {message: {'type': 'sendMessageTasker', 'payload': payload}};
    chrome.runtime.sendMessage(extensionID, messageJSON);
    console.log('To Background: ' + payload.type);
}