function notify(title) {
  try {
    chrome.runtime.sendMessage({'title': title});
  } catch(e) {
    observer.disconnect();
  }
}

let observer = new window.MutationObserver(mutations => {
  mutations.forEach(mutation => notify(mutation.target.textContent));
});

let target = document.querySelector('head > title');
observer.observe(target, { subtree: true, characterData: true, childList: true });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse('alive');
});
