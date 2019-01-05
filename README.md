
# Sample Script To Automate Routine Works, And To Save Time, By GAS

## Script's Line Up
### mailDraft.js
Draft is created regularary, NOT sent to someone.

### onMyEdit.js
Bot post contents of updated row to slack, when status is updated,
https://github.com/gkzz/gas-test/blob/master/onMyEdit.js

### remind.js
Bot post past-due tasks, and the assignees to slack regularly
https://github.com/gkzz/gas-test/blob/master/remind.js

#### To Do Before Run onMyEdit.js and remind.js

1) Create spreadsheet and to 2 sheets.
2) Label 1st sheet "<SheetName, e.g. Sheet1>" and to copy and to paste it contents of "csv/<onMyEdit/remind>_sheet1_container_bound.csv". 
3) Label 2nd sheet "<SheetName, e.g. id>" and to copy and to paste it contents of "csv/<onMyEdit/remind>_id_container_bound.csv". 
4) Create container-bound-script by clicking "Tool" button and "Script editor" button.
5) Copy and paste your script editor  from all contents of this js-file.
6) Save and get permissions.

+α) How to change automatically <Slack User ID> of the sheet named "<SheetName, e.g. sheet1>"
Write Only at the cell of Slack User ID one by one bellow;
=VLOOKUP(D2,slackID!$A$2:$B$5,2,FALSE)


## If Your Script Doesn't Work Well, 
>1. When "This app isn't verified" is displayed, click "Advanced".
>2. Click "Go to filename(unsafe)".
>3. Confirm scopes and click "ALLOW".

source: "getting “This app isn't verified” for Google Sheets script that only touches my sheet", stackoverflow.com
https://stackoverflow.com/questions/48482260/getting-this-app-isnt-verified-for-google-sheets-script-that-only-touches-my


cf. "OAuth Client Verification" , official guide
https://developers.google.com/apps-script/guides/client-verification

## cf. Official Docs
https://developers.google.com/apps-script/


## If You're Faced with Some Troubles...
plz give me comments!

