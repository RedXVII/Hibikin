// Copyright (c) 2013 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function Rule(data) {
  var rules = document.getElementById('rules');
  this.node = document.getElementById('rule-template').cloneNode(true);
  this.node.id = 'rule' + (Rule.next_id++);
  this.node.rule = this;
  rules.appendChild(this.node);
  this.node.hidden = false;

  if (data) {
    this.getElement('matcher').value = data.matcher;
    this.getElement('match-param').value = data.match_param;
    this.getElement('match-folder').value = data.match_folder;
    this.getElement('enabled').checked = data.enabled;
  }


  this.render();

  this.getElement('matcher').onchange = storeRules;
  this.getElement('match-param').onkeyup = storeRules;
  this.getElement('match-folder').onchange = storeRules;
  this.getElement('enabled').onchange = storeRules;

  var rule = this;
  this.getElement('move-up').onclick = function() {
    var sib = rule.node.previousSibling;
    rule.node.parentNode.removeChild(rule.node);
    sib.parentNode.insertBefore(rule.node, sib);
    storeRules();
  };
  this.getElement('move-down').onclick = function() {
    var parentNode = rule.node.parentNode;
    var sib = rule.node.nextSibling.nextSibling;
    parentNode.removeChild(rule.node);
    if (sib) {
      parentNode.insertBefore(rule.node, sib);
    } else {
      parentNode.appendChild(rule.node);
    }
    storeRules();
  };
  this.getElement('remove').onclick = function() {
    rule.node.parentNode.removeChild(rule.node);
    storeRules();
  };
  storeRules();
}

Rule.prototype.getElement = function(name) {
  return document.querySelector('#' + this.node.id + ' .' + name);
}

Rule.prototype.render = function() {
  this.getElement('move-up').disabled = $(this.node).prev('.rule').length == 0;
  this.getElement('move-down').disabled = $(this.node).next('.rule').length == 0;
}

Rule.next_id = 0;

function loadRules() {

  var rules = localStorage.rules;
  try {
    JSON.parse(rules).forEach(function(rule) {new Rule(rule);});
  } catch (e) {
    localStorage.rules = '[{"matcher":"ends","match_param":".gif","match_folder":"gifs","enabled":true},{"matcher":"begins","match_param":"http://images.4chan.org/a/","match_folder":"animu","enabled":true},{"matcher":"begins","match_param":"http://images.4chan.org/v/","match_folder":"viddya","enabled":true},{"matcher":"url-regex","match_param":".*\\\\.fbcdn\\\\.net/.*","match_folder":"facebook","enabled":true}]';
    rules = localStorage.rules;
    JSON.parse(rules).forEach(function(rule) {new Rule(rule);});
  }
}

function storeRules() {
  localStorage.rules = JSON.stringify(Array.prototype.slice.apply(
      $("#rules .rule")).map(function(node) {
    node.rule.render();
    return {matcher: node.rule.getElement('matcher').value,
            match_param: node.rule.getElement('match-param').value,
            match_folder: node.rule.getElement('match-folder').value,
            enabled: node.rule.getElement('enabled').checked};
  }));
}

window.onload = function() {
  loadRules();
  document.getElementById('new').onclick = function() {
    new Rule();
  };
}
