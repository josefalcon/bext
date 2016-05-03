chrome.storage.local.promise = {
  set: state => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(state, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        }
        return resolve();
      });
    });
  },

  get: keys => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(keys, items => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        return resolve(items);
      });
    });
  },

  remove: keys => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(keys, () => {
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }
        return resolve();
      });
    });
  }
}
