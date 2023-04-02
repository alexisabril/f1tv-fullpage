const tabs = {}

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId)

  if (tabs[tab.id]) {
    await chrome.action.setIcon({ path: "../icons/helmet-on-38.png" })
  } else {
    await chrome.action.setIcon({ path: "../icons/helmet-off-38.png" })
  }
})

chrome.tabs.onRemoved.addListener(async (tabId) => {
  delete tabs[tabId]
})

chrome.action.onClicked.addListener(async (tab) => {
  const on = !tabs[tab.id]
  tabs[tab.id] = on

  if (!on) {
    // TODO: removing css doesn't restore the page to its original state
    await chrome.scripting.removeCSS({
      files: ["src/overrides.css"],
      target: { tabId: tab.id },
    })

    await chrome.action.setIcon({ path: "../icons/helmet-off-38.png" })
  } else {
    await chrome.scripting.insertCSS({
      files: ["src/overrides.css"],
      target: { tabId: tab.id },
    })

    await chrome.action.setIcon({ path: "../icons/helmet-on-38.png" })
  }
})
