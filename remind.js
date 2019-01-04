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
  var dataRange = sheet.getDataRange();
  var tasks = dataRange.offset(OFFSET_ROW, OFFSET_COLUMN).getValues();
  const nowDateTime = Moment.moment().format('YYYY/MM/DD h:');
  const nowDate = Moment.moment().format('YYYY/MM/DD');
  Logger.log(nowDate);

  
  for(var i = 0; i < tasks.length; i++) {
    var task = tasks[i];
    Logger.log(task);
    var dueDateTime = Moment.moment(task[5]).format('YYYY/MM/DD h:');
    
    // 期限が空の場合は処理しない
    if(!dueDateTime){
      return;
    }
    var dueDate = Moment.moment(task[5]).format('YYYY/MM/DD');
    Logger.log(dueDate);
    
    // Moment.moment('2017/2/3').isBefore('2017/2/4'); //true
    // Moment.moment('2017/2/3 16:55').isSame('2017/2/3 17:00','day'); //true
    var isLateToDeadline = Moment.moment(dueDate).isBefore(nowDate);
    var isDeadlineDay = Moment.moment(dueDate).isSame(nowDate);
    if (isLateToDeadline = "TRUE" || isDeadlineDay == "TRUE" ) {
      var taskNumber = round(task[0]);
      var taskCategory = task[1]; 
      var taskName = task[2]; 
      var slackId = task[3]; 
      var status = task[6];
      Logger.log(status)
      
      // スタータスがDoingかAssignedの場合に通知を送る
      if ('todo' == status || 'doing' == status ) {
        var contents = writeReminders(taskNumber, taskCategory, taskName, slackId, dueDate, status, sheetUrl);
        sendReminders(contents);   
      }
    }
  }
}


function writeReminders(taskNumber, taskCategory, taskName, slackId, dueDateTime, status, sheetUrl){
  var reminders = "###締め切りのタスク### \n";
  reminders += "【担当者】 <@" + slackId + ">\n";
  reminders += "【No.】" + taskNumber +"\n";
  reminders += "【カテゴリー】" + taskCategory +"\n";
  reminders += "【タスク名】" + taskName +"\n";
  reminders += "【完了期日】" + dueDateTime +"\n";
  reminders += "【URL】"+ sheetUrl;
  return reminders;
}


function sendReminders(contents){
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
