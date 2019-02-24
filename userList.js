/*
*---------source----------------------------------
https://api.slack.com/methods/users.list
GASを使ったSlackアカウント管理
http://blog.songs-inside.com/entry/gas-slack

*---------Select Permission Scopes----------------------
View email addresses of people on this workspace
users:read.email
https://api.slack.com/apps/AF6LX41D3/oauth?

■Your Apps
At First, Click "Your Apps"
https://api.slack.com/apps

■Basic Information
Next, Select bellow step by step,

(1)Basic Information
(2)Add features and functionality
(3)Permissions

https://api.slack.com/apps/AF6LX41D3

■OAuth & Permissions
Finally, Copy and paste value of "OAuth Access Token" your script.
OAuth Access Token is what start with "xoxp-".
https://api.slack.com/apps/AF6LX41D3/oauth?


*/

function main() {
  /*---Args-----------------------------------------------------------------------------------------*/
  const SLACK_TEAM = "xxxxxxxxxxxxxxx";
  const SLACK_TOKEN = "xoxp-yyyyyyyyyyyyyyyyyyyyyyyy";
  const REAL_NAME_ARRAY = new Array();
  const EMAIL_ADDRESS_ARRAY = new Array();
  const SHEET_NAME = "masterDB"; //<SheetName>
  const COLUMN_NUMBER_REAL_NAME = 1;
  const COLUMN_NUMBER_EMAIL_ADDRESS = 2;
  /*----------------------------------------------------------------------------------------------*/
  
  // Get All Slack Usernames & Emailaddresses
  var listjson = getListjson(SLACK_TEAM, SLACK_TOKEN);
  
  for each(var member in listjson["members"]) {
    //Logger.log(member);
    //return;
    REAL_NAME_ARRAY.push(getValue(member, "real_name"));
    EMAIL_ADDRESS_ARRAY.push(getValue(member, "email"));
  }
  //Logger.log(REAL_NAME_ARRAY.join(","));
  //Logger.log(EMAIL_ADDRESS_ARRAY.join(","));
  REAL_NAME_ARRAY.join(",");
  EMAIL_ADDRESS_ARRAY.join(",");
  //Logger.log(REAL_NAME_ARRAY.length);
  //Logger.log(EMAIL_ADDRESS_ARRAY.length);
  for ( var rowNumber = 0; rowNumber < REAL_NAME_ARRAY.length; rowNumber++ ){
       setValues(REAL_NAME_ARRAY, rowNumber, COLUMN_NUMBER_REAL_NAME, SHEET_NAME);
  } 
  for ( var rowNumber = 0; rowNumber < EMAIL_ADDRESS_ARRAY.length; rowNumber++ ){
      setValues(EMAIL_ADDRESS_ARRAY, rowNumber, COLUMN_NUMBER_EMAIL_ADDRESS, SHEET_NAME);
  } 
  
}

// Get All Slack Usernames & Emailaddresses
function getListjson(SLACK_TEAM, SLACK_TOKEN) { 
  var listurl = 'https://' + SLACK_TEAM + '.slack.com/api/users.list?token=' + SLACK_TOKEN;
  var listres = UrlFetchApp.fetch(listurl);
  var listjson = JSON.parse(listres.getContentText());
  //Logger.log(listjson);
  return listjson;
} 


function getValue(member, value) {
  if ( !member["profile"][value] ) {
      return "not found";
    } else {
      return member["profile"][value];
    }
}

function setValues(array, rowNumber, COLUMN_NUMBER, SHEET_NAME){
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  const SHEET = SS.getSheetByName(SHEET_NAME);
  var value = array[rowNumber];
  Logger.log(value);
  //return;
  SHEET.getRange(rowNumber+2, COLUMN_NUMBER).setValue(value);
}