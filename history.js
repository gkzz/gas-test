/*
sources;
Slackのログをスプレッドシートと連携して技術メモの整理に使っている話
https://qiita.com/kan_dai/items/c0c548cbf716ad392fe7

You have to register library key of "moment.js" before you write "momentToday()".
library key;
moment.js
MHMchiX6c1bwSqGM1PZiW_PxhMjh3Sh48

moment.js
https://tonari-it.com/gas-moment-js-moment/
*/


function main() {
    /*-------Args----------------------------------------------*/
    const SLACK_TOKEN = "xoxp-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"; 
    // cf. channel url = "https://<YOUR_SLACK_TEAM>.slack.com/messages/<CHANNEL_ID>"";
    const CHANNEL_ID = "<CHANNEL_ID>"; //e.g. general
    const REQUEST_URL = "https://slack.com/api/channels.history?";
    const SHEET_NAME = "history"; //<SheetName>
    const COLUMN_NUMBER_TIMESTAMP = 1;
    const COLUMN_NUMBER_CONTENT = 2;
    const COLUMN_NUMBER_LINK = 3;
    /*---------------------------------------------------------*/
    
    /*--------InitialSetUp--------------------------------------------------------------------------*/
    const SS = SpreadsheetApp.getActiveSpreadsheet();
    const SHEET = SS.getSheetByName(SHEET_NAME);
    var lastrow = SHEET.getLastRow();
    /*---------------------------------------------------------*/
    
    var messages = JSON.parse(getSlackLog(SLACK_TOKEN, CHANNEL_ID, REQUEST_URL))
        .messages
        .reverse();
    
    if ( !messages ) {
        return;
    }
    //Logger.log(messages);
    //return;
    
    setSlackLog(messages, SHEET, lastrow, COLUMN_NUMBER_TIMESTAMP, COLUMN_NUMBER_CONTENT, COLUMN_NUMBER_LINK);
}


/**
* setSlackLog Function
*
* properties in the objects/rows
* @param {string} SLACK_TOKEN 
* @param {string} CHANNEL_ID   
* @param {string} REQUEST_URL
* @return {string} REQUEST_URL with payload 
*/
function getSlackLog(SLACK_TOKEN, CHANNEL_ID, REQUEST_URL) {
    var payload = {
      // Slack Token
      'token': SLACK_TOKEN,
      // Channel ID
      'channel': CHANNEL_ID,
      // 24 Hours/day * 8 days
      'oldest': parseInt( new Date() / 1000 ) - (60 * 60 * 24 * 8)
    }
    
    // URL Of Param 
    var param = [];
    for (var key in payload) {
        param.push(key + '=' + payload[key]);
    }
    REQUEST_URL += param.join('&');
    return UrlFetchApp.fetch(REQUEST_URL);
}

/**
* setSlackLog Function
*
* properties in the objects/rows
* @param {string} messages - JSON.parse(getSlackLog(SLACK_TOKEN, CHANNEL_ID, REQUEST_URL)).messages.reverse();
* @param {string} SHEET - SHEET_NAME Of Activaed SpreadsheetAppObj
* @param {string} lastrow
* @param {string} COLUMN_NUMBER_TIMESTAMP - 1
* @param {string} COLUMN_NUMBER_CONTENT - 2
* @param {string} COLUMN_NUMBER_LINK - 3
*/
function setSlackLog(messages, SHEET, lastrow, COLUMN_NUMBER_TIMESTAMP, COLUMN_NUMBER_CONTENT, COLUMN_NUMBER_LINK) {
    // Log messages on SpreadSheet
    for ( var i = 0; i < messages.length; i++ ){
        //Logger.log(messages);
        //return;
      
        // DateTime
        SHEET.getRange(lastrow + i + 1, COLUMN_NUMBER_TIMESTAMP).setValue(momentDateTime(messages[i].ts));
        // Contents
        SHEET.getRange(lastrow + i + 1, COLUMN_NUMBER_CONTENT).setValue(messages[i].text);
        // (Link)
        if (messages[i].attachments) {
            //Logger.log(messages[i].attachments.length);
            //return;
            for (var j = 0; j < messages[i].attachments.length; j++ ) {
                SHEET.getRange(lastrow + i + 1, COLUMN_NUMBER_LINK).setValue(messages[i].attachments[j].title + String.fromCharCode(10) + messages[i].attachments[j].title_link);
            }
        }
    }
}


/**
* momentDateTime Function
*
* properties in the objects/rows
* @param {string} obj 
* @return {string} 'YYYY年MM月DD日(ddd) HH:mm:ss'
*/
function momentDateTime(obj) {
    //Logger.log(obj);
    // Register lang:ja
    Moment.moment.lang(
      'ja', {
        weekdays: ["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],
        weekdaysShort: ["日","月","火","水","木","金","土"],
      }
    );
    return Moment.moment(obj * 1000).format('YYYY年MM月DD日(ddd) HH:mm:ss');
}