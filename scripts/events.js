import { UPDATE_TAB, REMOVE_TAB } from './actions';
import { dispatch, initializeTabs } from './store';

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
