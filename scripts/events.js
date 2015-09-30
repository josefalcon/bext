import { UPDATE_TAB, REMOVE_TAB } from './actions';
import { dispatch, initializeTabs, subscribe } from './store';

const GREEN = '#2ECC40';
const RED = '#FF4136';

// order matters here, since the following subscriptions can set state.
// listener for setting various extension attributes.
subscribe(state => {
  if (state.activeTab && state.tabs[state.activeTab]) {
    let tabTitle = state.tabs[state.activeTab].title;
    chrome.browserAction.getTitle({}, currentTitle => {
      if (tabTitle !== currentTitle) {
        chrome.browserAction.setTitle({title: tabTitle});
      }
    });
  }

  let tabCount = Object.keys(state.tabs).length.toString();
  chrome.browserAction.getBadgeText({}, badgeText => {
    if (tabCount !== badgeText) {
      if (tabCount === '0') tabCount = '';
      chrome.browserAction.setBadgeText({text: tabCount});
    }
  });

  let color = state.isPlaying ? GREEN : RED;
  chrome.browserAction.setBadgeBackgroundColor({color: color});
});

chrome.commands.onCommand.addListener(command => {
  dispatch({type: command});
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Note: 'audible' changes are for Chrome 46
  if (changeInfo.hasOwnProperty('url') || changeInfo.hasOwnProperty('audible')) {
    dispatch({type: UPDATE_TAB, tab: tab});
  }
});

chrome.tabs.onRemoved.addListener(tabId => {
  dispatch({type: REMOVE_TAB, tabId: tabId});
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message && message.title) dispatch({type: UPDATE_TAB, tab: sender.tab});
});

chrome.runtime.onStartup.addListener(initializeTabs);
chrome.runtime.onInstalled.addListener(initializeTabs);
