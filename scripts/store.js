import { UPDATE_TAB, REMOVE_TAB, TOGGLE_TRACK, PREV_TRACK, NEXT_TRACK, SET_ACTIVE_TAB } from './actions';
const handlers = require('./handlers.json');


export function getState() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('state', items => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(items.state || {});
    });
  });
}

export function subscribe(listener) {
  // we can't use a traditional EventEmitter in this case.
  // there is no persisted runtime environment. 
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message && message.updateState) listener(message.updateState);
  });
}

function saveState(state) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({state: state}, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        chrome.runtime.sendMessage({'updateState': state});
        resolve();
      }
    });
  });
}

function match(url) {
  for (var key of Object.keys(handlers)) {
    if (url.indexOf(handlers[key].urlToMatch) > -1) {
      return key;
    }
  }
  return false;
}

function updateTab(tab) {
  let handler = match(tab.url);
  if (handler) {
    getState()
      .then(state => {
        if (!state.tabs) {
          state.tabs = {};
        }

        // start tracking the tab. and add a title observer.
        if (!state.tabs.hasOwnProperty(tab.id)) {
          chrome.tabs.executeScript(tab.id, {file: 'src/title-observer.js'});
        }

        state.tabs[tab.id] = {
          id: tab.id,
          uri: tab.uri,
          title: tab.title,
          handler: handler
        }
        return saveState(state);
      });
  } else {
    // remove it since it doesn't match.
    // this is a noop if we don't already track this tab.
    removeTab(tab.id);
  }
}

function removeTab(tabId) {
  getState()
    .then(state => {
      if (state.tabs[tabId]) {
        delete state.tabs[tabId];

        if (state.activeTab === tabId) {
          state.activeTab = null;
        }
        return saveState(state);
      }
    });
}

function setActiveTab(tabId) {
  getState()
    .then(state => {
      state.activeTab = tabId;
      return saveState(state);
    });
}

function dispatchInTab(action) {
  getState()
    .then(state => {
      if (!state.activeTab) return;

      let activeTab = state.tabs[state.activeTab];
      let handler = handlers[activeTab.handler];

      if (handler) {
        let code = handler[action.type];
        if (code) chrome.tabs.executeScript(activeTab.id, {code: code});
      }
    });
};

export function dispatch(action) {
  switch(action.type) {
    case UPDATE_TAB: updateTab(action.tab); break;
    case REMOVE_TAB: removeTab(action.tabId); break;
    case SET_ACTIVE_TAB: setActiveTab(action.tabId); break;
    case TOGGLE_TRACK:
    case PREV_TRACK:
    case NEXT_TRACK:
      dispatchInTab(action); break;
    default: console.log('unknown action'); break;
  }
}
