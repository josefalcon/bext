// a bit of a hack to get debug working with chrome extensions.
// use chrome.debug.enable/disable and then reload the ext.
const debug = require('debug');
debug.storage = localStorage;
debug.enable(debug.load());

const Store = require('./store');
const d = debug('events');

d('Waking up event page...');

chrome.commands.onCommand.addListener(command => {
  // not exactly clear why, but this avoids dropping events when the event
  // page is woken up from the inactive state because of a key command.
  // it does nothing, but seems to permit the listener below fire...¯\_(ツ)_/¯
});

Store.create().then(store => {

  chrome.commands.onCommand.addListener(command => {
    d('Received keyboard command=%s', command);
    store.dispatchInTab({type: command});
  });

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.hasOwnProperty('url')) {
      d('Tab updated tabId=%s url=%o', tabId, changeInfo.url);
      store.updateTab(tab);
    }
  });

  chrome.tabs.onRemoved.addListener(tabId => {
    d('Tab removed tabId=%s', tabId);
    store.removeTab(tabId);
  });

  chrome.browserAction.onClicked.addListener(tab => {
    d('browserAction clicked tab=%o', tab);
    store.setControlledTab(tab);
  });

});

// expose a function for enabling debug logs.
chrome.debug = {
  enable: (k) => debug.enable(k || '*'),
  disable: () => debug.disable(),
  dumpLocalStorage: () => chrome.storage.local.promise.get().then(s => d('localStorage=%o', s))
}
