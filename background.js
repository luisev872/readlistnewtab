// background.js
chrome.action.onClicked.addListener((tab) => {
    chrome.readingList.addEntry({
        title: tab.title,
        url: tab.url,
        hasBeenRead: false
    }).then(() => {
        console.log('Added to reading list');
    }).catch((error) => {
        console.log('Error adding to reading list', error);
    });
});