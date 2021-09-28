// ==UserScript==
// @name        Trello easy progressbar [33/100]
// @name:ru     Прогресс бар для Trello [33/100]
// @namespace   https://github.com/adelobosko/TrelloProgressBar
// @match       https://trello.com/*
// @grant       none
// @version     1.1
// @author      Alexey Delobosko
// @description Easy progress bar for list items, just enter: [33/100]
// @description:ru Простой индикатор выполнения для элементов списка, просто введите: [33/100] 
// ==/UserScript==


var interval = setInterval(replaceCustomProgressBar, 3000);

// [539/1337]
const progressRegex = /\[(\d+)\/(\d+)\]/g;


function replaceCustomProgressBar(){
  
  if(!document.location.href.startsWith("https://trello.com/c/")){
    return;
  }
    
  var checklists = document.querySelectorAll(".checklist .checklist-item-details-text");
  for(var i = 0 ; i < checklists.length; i++){
    if (checklists.hasOwnProperty(i)) {
      var checklist = checklists[i];
      
      var replacedInnerHtml = getReplacedInnerHtml(checklist.innerHTML);
      if(replacedInnerHtml){
        checklist.innerHTML = replacedInnerHtml;
      }
    }
  }
}

function getReplacedInnerHtml(checklistInnerHtml){
  var regexIterator = checklistInnerHtml.matchAll(progressRegex);
  let params = Array.from(regexIterator, function (x) { return x; });
  if(params.length === 0){
    return '';
  }
  
    
  var result = checklistInnerHtml;
  for(var i = 0; i < params.length; i++){
    if (params.hasOwnProperty(i)) {
      var matchParams = params[i];
      var match = matchParams[0];
      var value = parseInt(matchParams[1]);
      var maxValue = parseInt(matchParams[2]);
      if(maxValue === 0){
        continue;
      }
      
      var progressBarHtml = getProgressBarHtml(value, maxValue);
      console.log(progressBarHtml);
      result = result.replace(match, progressBarHtml);
    }
  }
  
  return result;
}


function getProgressBarHtml(value, maxValue){
  var percent = value >= maxValue ? 100 : (Math.round(value * 100) / maxValue).toFixed(1);
  var completed = value >= maxValue ? 'checklist-progress-bar-current-complete' : '';
  
  var progressBarHtml = '<div class="checklist-progress">'
    + '<span class="checklist-progress-percentage">' + percent + '%</span>'
    + '<div class="checklist-progress-bar">'
      + '<div class="checklist-progress-bar-current checklist-progress-bar-current-delay ' + completed + '" style="width: ' + percent + '%;"></div>'
    + '</div>'
  + '</div>';
  
  return progressBarHtml;
}
