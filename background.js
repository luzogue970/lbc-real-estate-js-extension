// chrome.storage.onChanged.addListener((changes, namespace) => {
//     for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//         console.log(
//             `Storage key "${key}" in namespace "${namespace}" changed.`,
//             `Old value was "${oldValue}", new value is "${newValue}".`
//         );
//     }
// });
// // chrome.tabs.onUpdated.addListener(
// //     function(tabId, changeInfo, tab) {
// //         console.log("update found")
// //         if (changeInfo.url) {
// //             chrome.tabs.sendMessage( tabId, {
// //                 message: 'hello!',
// //                 url: changeInfo.url
// //             })
// //         }
// //     }
// // );
// chrome.tabs.onUpdated.addListener(
//     function(tabId, changeInfo, tab) {
//         if (changeInfo.url) {
//             chrome.tabs.sendMessage( tabId, {
//                 message: 'hello!',
//                 url: changeInfo.url
//             })
//         }
//     }
// );
//
