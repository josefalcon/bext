import { UPDATE_TAB, REMOVE_TAB } from './actions';
import { dispatch } from './store';

chrome.commands.onCommand.addListener(function(command) {
  dispatch({type: command});
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url) dispatch({type: UPDATE_TAB, tab: tab});
});

chrome.tabs.onRemoved.addListener(function(tabId) {
  dispatch({type: REMOVE_TAB, tabId: tabId});
})
