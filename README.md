# tasker-browser-extensions

It is very common for the tasks to be performed to be communicated through a web page.
With this extension you can add a button to any website using a regular expression. 
With this button and the power of [Tasker](https://github.com/atareao/tasker) no task will escape.

To use it you need create a file here $HOME/.config/google-chrome/NativeMessagingHosts/tasker_integration.json

The content must be:

{
  "name": "tasker_integration",
  "description": "Tasker integration",
  "path": "/opt/extras.ubuntu.com/tasker/src/plugins/browser_integration/browser_integration.py",
  "type": "stdio",
  "allowed_origins": [ "chrome-extension://kejbjmcifabkmfijiohnbllogajnfggb/" ]
}

[+INFO:](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Native_messaging#Exchanging_messages) App Manifest