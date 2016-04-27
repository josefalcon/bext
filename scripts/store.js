import { UPDATE_TAB, REMOVE_TAB, TOGGLE_TRACK, PREV_TRACK, NEXT_TRACK, SET_ACTIVE_TAB } from './actions';
import matchPatterns from 'match-pattern';
const handlers = require('./handlers.json');

const initialState = {
  activeTab: false,
  tabs: {},
  isPlaying: false
}

export function getState() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('state', items => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(items.state || initialState);
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

export function initializeTabs() {
  chrome.tabs.query({}, tabs => {
    let matchedTabs = tabs.map(matchTab).filter(x => x);
    getState()
      .then(state => {
        state.isPlaying = matchedTabs.some(t => t.audible);
        // reset tab state.
        state.tabs = {};
        matchedTabs.forEach(tab => {
          trackTabTitle(tab.id);
          state.tabs[tab.id] = tab
        });
        saveState(state);
      })
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

function matchTab(tab) {
  for (var key of Object.keys(handlers)) {
    let pattern = matchPatterns.parse(handlers[key].match);
    if (pattern.test(tab.url)) {
      return {
        id: tab.id,
        url: tab.url,
        title: tab.title,
        audible: tab.audible, // another way would be to tabs.query for audible...
        handler: key
      };
    }
  }
  return false;
}

function trackTabTitle(tabId) {
  chrome.tabs.sendMessage(tabId, {}, response => {
    if (response !== 'alive') {
      chrome.tabs.executeScript(tabId, {file: 'src/title-observer.js'});
    }
  });
}

function updateTab(tab) {
  let tabInfo = matchTab(tab);
  if (tabInfo) {
    getState()
      .then(state => {
        trackTabTitle(tab.id);
        state.tabs[tab.id] = tabInfo
        state.isPlaying = Object.keys(state.tabs).some(t => state.tabs[t].audible);
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

      // attempt to pause all other tabs
      Object.keys(state.tabs).forEach(t => {
        if (t === state.activeTab) {
          return;
        }

        let tab = state.tabs[t];
        let handler = handlers[tab.handler];
        if (handler.pause) {
          chrome.tabs.executeScript(tab.id, {code: handler.pause});
        }
      })
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
        if (code) {
          chrome.tabs.executeScript(activeTab.id, {code: code});
        }
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
