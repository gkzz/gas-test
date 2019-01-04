/*
sources;
Googleスプレッドシートをハック！Apps Scriptを使ったToDoリストの実装
https://blog.btrax.com/jp/apps_script/

日付＆時刻の便利ライブラリ「Moment.js」をGoogle Apps Scriptで使う方法
https://tonari-it.com/gas-moment-js-moment/

SlackのIncoming Webhooksでメンションを飛ばす方法
https://qiita.com/ryo-yamaoka/items/7677ee4486cf395ce9bc


No.	: 0
カテゴリ : 1
タスク名 ,担当, Slack User ID, 期日,
ステータス : 6
*/

var OFFSET_ROW = 2;
var OFFSET_COLUMN = 0;


function main(){
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('190101');
  const sheetUrl = ss.getUrl();
  const cell = sheet.getActiveCell().getA1Notation();
  //[19-01-04 11:18:47:870 JST] G4
  const columnNameInAlphabet = cell.replace(/\d+/,'');
  if('G' == columnNameInAlphabet){
    //var editedTask = sheet.getRange(OFFSET_ROW, OFFSET_COLUMN, sheet.getLastRow(), sheet.getLastColumn()+1).getValues()[0];
    var editedTask = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues()[0];
    // [1.0, 要件定義, ヒアリング, gkz, UF47K67V1, Thu Sep 20 15:00:00 GMT+09:00 2018, done]
    var taskNumber = round(editedTask[0]);
    var taskCategory = editedTask[1]; 
    var taskName = editedTask[2]; 
    var slackId = editedTask[4]; 
    var dueDate = Moment.moment(editedTask[5])  
    .format('YYYY年MM月DD日 hh時');
    var status = editedTask[6];  
    var contents = writeMessages(taskNumber, taskCategory, taskName, slackId, dueDate, status, sheetUrl);
    sendMessage(contents);
  }
}


function writeMessages(taskNumber, taskCategory, taskName, slackId, dueDate, status, sheetUrl){
  var message = "【担当者】 <@" + slackId + ">\n";
  if( 'done' == status ){
    message += "【進捗】Done\n";
  }
  else if( 'todo' == status ){
    message += "【進捗】ToDo\n";
  }
  else if( 'doing' == status ){
    message += "【進捗】Doing\n";
  }
  message += "【No.】" + taskNumber +"\n";
  message += "【カテゴリー】" + taskCategory +"\n";
  message += "【タスク名】" + taskName +"\n";
  message += "【完了期日】" + dueDate +"\n";
  message += "【URL】"+ sheetUrl;
  return message;
}


function sendMessage(contents){
  // Incoming Webhooks
  var webHooktUrl = "https://hooks.slack.com/services/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";
  
  var options = {
    "method" : "POST",
    "headers": {"Content-type": "application/json"},
    "payload" : '{"text":"' + contents + '"}',
  };
  UrlFetchApp.fetch(webHooktUrl, options);
}



function round(n){
  return Math.floor(n * 10) / 10;
}
