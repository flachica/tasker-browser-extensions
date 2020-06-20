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
                    var todoEl = getElementByXpath(item.xpath);
                    if (todoEl) todoText = todoEl.innerHTML;
                    else return;

                    var project = ''
                    if (item.project) {
                        var projectEl = getElementByXpath(item.project);
                        if (projectEl) project = projectEl.innerHTML;
                    }

                    var context = ''
                    if (item.context) {
                        var contextEl = getElementByXpath(item.context);
                        if (contextEl) context = contextEl.innerHTML;
                    }

                    if (!document.getElementById('taskerControl')) {
                        if (todoEl) {
                            todoEl.insertAdjacentHTML("afterend", taskerControlTemplate);
                            document.querySelector('#taskerControl').addEventListener('click', function() {
                                changeState(todoText, project,  context);
                            });
                        }
                    }
                    sendMessageBackground({type: 'getState', 'payload': {'todo': todoText}});
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

function changeState(todoText, project, context) {
    messageJSON = {type: 'changeState', 'payload': {'todo': todoText, 'project': project, 'context': context}};
    if (document.getElementById('taskerControl').classList.contains('fa-pause')) {
        var desc = prompt('Description for ' + todoText + '?');
        if (desc != null) {
            messageJSON['payload']['description'] = desc
        }
    }
    sendMessageBackground(messageJSON);
    sendMessageBackground({type: 'getState', 'payload': {'todo': todoText}});
}

function sendMessageBackground(payload) {
    var messageJSON = {message: {'type': 'sendMessageTasker', 'payload': payload}};
    chrome.runtime.sendMessage(extensionID, messageJSON);
    console.log('To Background: ' + payload.type);
}