/*
*----------------- sources --------------------

Googleスプレッドシートをハック！Apps Scriptを使ったToDoリストの実装
https://blog.btrax.com/jp/apps_script/

日付＆時刻の便利ライブラリ「Moment.js」をGoogle Apps Scriptで使う方法
https://tonari-it.com/gas-moment-js-moment/

slack API Docs
https://api.slack.com/#read_the_docs

SlackのIncoming Webhooksでメンションを飛ばす方法
https://qiita.com/ryo-yamaoka/items/7677ee4486cf395ce9bc


*----------------- To Do Before Run This Script --------------------

1) Create spreadsheet and to 2 sheets.
2) Label 1st sheet "<SheetName, e.g. Sheet1>" and to copy and to paste it contents of "csv/taskMng_sheet1_container_bound.csv". 
3) Label 2nd sheet "<SheetName, e.g. id>" and to copy and to paste it contents of "csv/taskMng_id_container_bound.csv". 
4) Create container-bound-script by clicking "Tool" button and "Script editor" button.
5) Copy and paste your script editor  from all contents of this js-file.
6) Import Libraries of "moment.js" and "slack app".
   6-1) key: library/key.txt
7) Save and get permissions.

+α) How to change automatically <Slack User Name> and <Slack User ID> of the sheet named "<SheetName, e.g. sheet1>"
Write Only at the cells one by one bellow;

<Slack User Name>
=VLOOKUP(D2,<2nd SheetName>!$A$2:$C$100,2,FALSE)

<Slack User ID> 
=VLOOKUP(D2,<2nd SheetName>!$A$2:$C$100,3,FALSE)


*------------------ Let's run this script! ------------------------------

Click "Run" button, after that "remind".


*/


/*
*----------------- function remind() ----------------------------
*
*  remind()
*          >> round() 
*                    >> writeReminders() 
*                                       >> sendMessages()
*
*/

function remind() {
    var OFFSET_ROW = 2;
    var OFFSET_COLUMN = 0;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Jan');
    //URL
    var sheetUrl = ss.getUrl();
    var dataRange = sheet.getDataRange();
    var tasks = dataRange.offset(OFFSET_ROW, OFFSET_COLUMN).getValues();
    const nowDate = Moment.moment().format('YYYY/MM/DD');
    //Logger.log(nowDate);
    
    for ( var i = 0; i < tasks.length; i++ ) {
        var task = tasks[i];
        Logger.log(task);
        //Due Date, 締切
        var dueDateTime = Moment.moment(task[6]).format('YYYY/MM/DD hh:');
        
        if(!dueDateTime){
        return;
        }

        var dueDate = Moment.moment(task[6]).format('YYYY/MM/DD');
        //Logger.log(dueDate);
        
        //Moment.moment('2017/2/3').isBefore('2017/2/4'); //true
        //Moment.moment('2017/2/3 16:55').isSame('2017/2/3 17:00','day'); //true
        var isLateToDeadline = Moment.moment(dueDate).isBefore(nowDate);
        var isDeadlineDay = Moment.moment(dueDate).isSame(nowDate);

        if ( isLateToDeadline = "TRUE" || isDeadlineDay == "TRUE" ) {
            /*
            * No.	: 0
            * Task Category : 1
            * Task Name ,Assignee, Slack User Name, Slack User ID, Due Date,
            * Status : 7
            */

            //No.
            var taskNumber = round(task[0]);
            //Logger.log(taskNumber);
            //Task Category, カテゴリ
            var taskCategory = task[1];
            //Logger.log(taskCategory);
            //Task Name, タスク名
            var taskName = task[2]; 
            //Logger.log(taskName);
            //Slack User ID of Assignee, 担当者のslackのプロフィールページからコピペするUser ID
            var slackId = task[5]; 
            //Logger.log(slackId);
            //Status, done, doing, or todo???
            var status = task[7];
            //Logger.log(status)
            
            if ( 'todo' == status || 'doing' == status ) {
                var contents = writeReminders(taskNumber, taskCategory, taskName, slackId, dueDateTime, status, sheetUrl);
                sendMessages(contents);   
            }
        }
    }
}


function writeReminders(taskNumber, taskCategory, taskName, slackId, dueDateTime, status, sheetUrl) {
    var dueDateTime = Moment.moment(dueDateTime).format('YYYY年MM月DD日　hh時');

    var reminders = "###Past-due Tasks  締切日より遅れているタスク### \n";
    reminders += "【Assignee】 <@" + slackId + ">\n";
    reminders += "【No.】" + taskNumber +"\n";
    reminders += "【Task Category】" + taskCategory +"\n";
    reminders += "【Task Name】" + taskName +"\n";
    reminders += "【Due Date】" + dueDateTime +"\n";
    reminders += "【Status】" + status +"\n";
    reminders += "【URL】"+ sheetUrl;
    return reminders;
}



function sendMessages(contents) {
    // Incoming Webhooks
    //var webHooktUrl = "https://hooks.slack.com/services/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";
    var webHooktUrl = "https://hooks.slack.com/services/xxxxxxxxxxxxxxxx";
    
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