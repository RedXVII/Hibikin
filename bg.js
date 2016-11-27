// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function matches(rule, item) {
  var url = item.url.toLowerCase();
  if (rule.matcher == 'begins') 
    return url.indexOf(rule.match_param.toLowerCase()) == 0;
  if (rule.matcher == 'ends')
    return url.lastIndexOf(rule.match_param.toLowerCase()) == url.length - rule.match_param.length;
  if (rule.matcher == 'url-regex')
    return (new RegExp(rule.match_param, "i")).test(url);
  return false;
}

chrome.runtime.onInstalled.addListener(function (details) {

  if (details.reason = "install") {
    chrome.tabs.create({url:"options.html"});
  }

});

chrome.browserAction.onClicked.addListener(function(activeTab)
{
    chrome.tabs.create({ url: "options.html" });
});

chrome.downloads.onDeterminingFilename.addListener(function(item, __suggest) {
  function suggest(filename, conflictAction) {
    __suggest({filename: filename,
               conflictAction: conflictAction,
               conflict_action: conflictAction});
    // conflict_action was renamed to conflictAction in
    // http://src.chromium.org/viewvc/chrome?view=rev&revision=214133
    // which was first picked up in branch 1580.
  }
  var rules = localStorage.rules;
  try {
    rules = JSON.parse(rules);
  } catch (e) {
    localStorage.rules = JSON.stringify([]);
  }
  for (var index = 0; index < rules.length; ++index) {
    var rule = rules[index];
    if (rule.enabled && matches(rule, item)) {
      suggest(rule.match_folder + '/' + item.filename, 'uniquify');
      break;
    }
  }
});
