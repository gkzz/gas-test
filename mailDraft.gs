/* 
source: GoogleAppsScriptでGmailの下書きを、より簡単に作成する方法
https://qiita.com/mkiyota/items/32d0fb2818bddf0d2e05 
*/

function myFunction() {
  
  var mailTo = "to@example.com" 
  // var mailCc = "cc@example.com" 
  
  var mailTitle = "【日報　yyyy年MM月dd日】"
  
  //　テキストメールの場合はここに本文テキストを設定します。
  // Header
  var mailHeader = 'xxx様 \n\nお世話になります。\n yyyyyyyyyy\n本日MM/ddのzzzzzzzzz\n\n1.勤務時間\n\n9am-9pm\n\n'
  
  // mailContent
  // what you did today
  var todaysContent = '2.本日の内容\n\n9am- Morning MTG\n\n'
  // what you will do tomorrow
  var tomorrowsContent = '3.明日の予定\n9am- Morning MTG\n\n'
  var todaysOpinion = '4.所感\n\n'
  var mailContent = todaysContent + tomorrowsContent + todaysOpinion
  var mailFooter = '以上、よろしくお願いします。'
  var mailBody =  mailHeader + mailContent + mailFooter
 
  var date = new Date()

  mailTitle = myDateFormat(date, mailTitle)
  mailBody = myDateFormat(date, mailBody)
  var mailArgs = {
    // cc: mailCc,
    mailBody: mailBody
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
