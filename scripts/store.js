const matchPattern = require('match-pattern');
const handlers = require('./handlers.json');
const d = require('debug')('store');
require('./local-promise')

class Store {
  constructor(state) {
    this.state = state;
  }

  handlerForTab(tab) {
    for (var key of Object.keys(handlers)) {
      let pattern = matchPattern.parse(handlers[key].match);
      if (pattern.test(tab.url)) {
        return {
          id: tab.id,
          handler: key
        };
      }
    }
    return false;
  }

  setControlledTab(tab) {
    // this is the tab being controlled
    let tabInfo = this.handlerForTab(tab);
    if (tabInfo) {
      d('Setting controlledTab=%o', tabInfo)
      chrome.storage.local.promise.set({controlledTab: tabInfo})
        .then(() => {
          this.state.controlledTab = tabInfo;
        });
    } else {
      d('Uncontrollable tab.url=%s', tab.url);
      if (this.state.controlledTab && tab.id === this.state.controlledTab.id) {
        chrome.storage.local.promise.remove('controlledTab')
          .then(() => {
            this.state.controlledTab = null;
          });
      }
    }
  }

  updateTab(tab) {
    if (this.state.controlledTab && tab.id === this.state.controlledTab.id) {
      this.setControlledTab(tab);
    }
  }

  removeTab(tabId) {
    if (this.state.controlledTab && tabId === this.state.controlledTab.id) {
      chrome.storage.local.promise.remove('controlledTab')
        .then(() => {
          this.state.controlledTab = null;
        });
    }
  }

  dispatchInTab(action, tab) {
    tab = tab || this.state.controlledTab;
    if (!tab || !action) {
      d('Ignoring dispatch action=%o tab=%o', action, tab);
      return;
    }

    let handler = handlers[tab.handler];
    if (handler) {
      let code = handler[action.type];
      if (code) {
        chrome.tabs.executeScript(tab.id, {code: code});
      }
    }
  }

  static create() {
    return chrome.storage.local.promise.get().then(state => new Store(state));
  }
}

module.exports = Store;
