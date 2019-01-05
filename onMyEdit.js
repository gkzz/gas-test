/*


*----------------- sources --------------------

Googleスプレッドシートをハック！Apps Scriptを使ったToDoリストの実装
https://blog.btrax.com/jp/apps_script/

日付＆時刻の便利ライブラリ「Moment.js」をGoogle Apps Scriptで使う方法
https://tonari-it.com/gas-moment-js-moment/

SlackのIncoming Webhooksでメンションを飛ばす方法
https://qiita.com/ryo-yamaoka/items/7677ee4486cf395ce9bc


*----------------- To Do Before Run This Script --------------------

1) Create spreadsheet and to 2 sheets.
2) Label 1st sheet "<SheetName, e.g. Sheet1>" and to copy and to paste it contents of "csv/onMyEdit_sheet1_container_bound.csv". 
3) Label 2nd sheet "<SheetName, e.g. id>" and to copy and to paste it contents of "csv/onMyEdit_id_container_bound.csv". 
4) Create container-bound-script by clicking "Tool" button and "Script editor" button.
5) Copy and paste your script editor  from all contents of this js-file.
6) Save and get permissions.

+α) How to change automatically <Slack User ID> of the sheet named "<SheetName, e.g. sheet1>"
Write Only at the cell of Slack User ID one by one bellow;
=VLOOKUP(D2,slackID!$A$2:$B$5,2,FALSE)

*------------------ Let's run this script! ------------------------------

Click "Run" button, after that "main".


*/


var OFFSET_ROW = 2;
var OFFSET_COLUMN = 0;


function main() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('<SheetName, e.g. Sheet1>');
    const sheetUrl = ss.getUrl();
    const cell = sheet.getActiveCell().getA1Notation();
    //[19-01-04 11:18:47:870 JST] G4
    const columnNameInAlphabet = cell.replace(/\d+/,'');
    if ('G' == columnNameInAlphabet) {
        var editedTask = sheet.getRange(2, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues()[0];
        /*
        * No.	: 0
        * Task Category : 1
        * Task Name ,Assignee, Slack User ID, Due Date,
        * Status : 6
        */
        //No.
        var taskNumber = round(editedTask[0]);
        //Task Category, カテゴリ
        var taskCategory = editedTask[1]; 
        //Task Name, タスク名
        var taskName = editedTask[2];
        //Slack User ID of Assignee, 担当者のslackのプロフィールページからコピペするUser ID
        var slackId = editedTask[4]; 
        //Due Date, 締切
        var dueDateTime = Moment.moment(editedTask[5]).format('YYYY年MM月DD日  hh時');
        //Status, done, doing, or todo???
        var status = editedTask[6];  
        var contents = writeMessages(taskNumber, taskCategory, taskName, slackId, dueDateTime, status, sheetUrl);
        sendMessage(contents);
    }
}


function writeMessages(taskNumber, taskCategory, taskName, slackId, dueDateTime, status, sheetUrl) {
    var messages = "###Update is complete. 更新完了### \n";
    messages += "【Assignee】 <@" + slackId + ">\n";
    messages += "【No.】" + taskNumber +"\n";
    messages += "【Task Category】" + taskCategory +"\n";
    messages += "【Task Name】" + taskName +"\n";
    messages += "【Due Date】" + dueDateTime +"\n";
    messages += "【Status】" + status +"\n";
    messages += "【URL】"+ sheetUrl;
    return messages;
}


function sendMessage(contents) {
    //Incoming Webhooks
    var webHooktUrl = "https://hooks.slack.com/services/xxxxxxxxxxxxxxxxxx";
    
    var options = {
        "method" : "POST",
        "headers": {"Content-type": "application/json"},
        "payload" : '{"text":"' + contents + '"}',
    };

    UrlFetchApp.fetch(webHooktUrl, options);
}


//round "number of No."（e.g. 3.0　→ 3）
function round(n) {
    return Math.floor(n * 10) / 10;
}
