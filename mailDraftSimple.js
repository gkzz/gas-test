/* 

source: GoogleAppsScriptでGmailの下書きを、より簡単に作成する方法
https://qiita.com/mkiyota/items/32d0fb2818bddf0d2e05 

*/

function myFunction() {
  
   
  var mailTo = "to@example.com" 
  // var mailCc = "cc@example.com" 
  
  var mailTitle = "日報　yyyy年MM月dd日(ddd曜) ほげほげ"
  
  //　テキストメールの場合はここに本文テキストを設定します。
  var mailBody = ''  
  
  // HTMLメールを作成する場合は、option引数に、htmlBodyとして本文を設定します。
  var mailHtmlBody = 'yyyy年MM月dd日(ddd曜)分の、ほげほげの日報をお送りします。<br><br>[コメント]<br><br>本日もお疲れ様でした。'  
  var date = new Date()

  mailTitle = myDateFormat(date, mailTitle)
  mailHtmlBody = myDateFormat(date, mailHtmlBody)
  var mailArgs = {
    // cc: mailCc,
    htmlBody: mailHtmlBody
  }
  
  GmailApp.createDraft(mailTo, mailTitle, mailBody, mailArgs)
    
}

/*
テキストデータ「text」内の'yyyy', 'MM', 'dd', 'hh', 'mm', 'ss', 'aaa'の日付形式文字を、
日時データdateに該当する年月日時分秒曜日に変換する
*/
function myDateFormat (date, text) {
  var result = text
  var timeZone = 'Asia/Tokyo'
  // ’aaa’を曜日に変換
  var yobi = ['日', '月', '火', '水', '木', '金', '土']
  var rep = yobi[date.getDay()]
  result = result.replace(/aaa/g, rep)

  // 'yyyy', 'MM', 'dd', 'hh', 'mm', 'ss'を年月日時分秒に変換
  var f = ['yyyy', 'MM', 'dd', 'hh', 'mm', 'ss']
  var i = 0
  for (i in f) {
    var reg = new RegExp(f[i] + '(.*?)', 'g')
    rep = Utilities.formatDate(date, timeZone, f[i])
    result = result.replace(reg, rep)
  }
  return result
}

