
# Sample Script To Manage Tasks, Reminders (Half Automatically), And To Save Time, By GAS

## Script's Line Up
### mailDraft.js
Draft is created regularary, NOT sent to someone.

### onMyEdit.js
Bot post contents of updated row to slack, when status is updated.

### remind.js
Bot post past-due tasks, and the assignees to slack regularly.

### taskMng.js
onMyEdit.js + remind.js

#### To Do Before Run onMyEdit.js, remind.js, taskMng.js

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

