/**
 * PW Medharthi Career Intelligence — Lead Capture Webhook
 * -----------------------------------------------------------------------
 * Deploy this as a Google Apps Script Web App (see README.md > "Google
 * Sheets setup" for step-by-step instructions). The deployed /exec URL
 * goes into GOOGLE_SHEETS_WEBHOOK_URL on the Next.js server - it is never
 * called directly from the browser, so this script and its secret are
 * never exposed to end users.
 *
 * SETUP (also in README):
 * 1. Open your Google Sheet > Extensions > Apps Script, paste this file.
 * 2. Project Settings > Script Properties > add SHARED_SECRET with a long
 *    random string (must match GOOGLE_SHEETS_SHARED_SECRET in .env).
 * 3. Deploy > New deployment > Web app > Execute as: Me > Who has
 *    access: Anyone. Copy the /exec URL into GOOGLE_SHEETS_WEBHOOK_URL.
 * 4. Re-run "Deploy > Manage deployments > Edit > New version" every time
 *    you change this script - the URL stays the same.
 */

var SHEET_NAME = 'Leads';

var COLUMNS = [
  'Timestamp', 'Full Name', 'Email', 'Phone', 'City', 'Profession',
  'Tool Used', 'User Inputs', 'Result Summary', 'Source Page',
  'UTM Source', 'UTM Medium', 'UTM Campaign', 'Referrer', 'Device Type',
  'Consent', 'Submission Date', 'Submission Time', 'IP (partial)'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000); // Serialize concurrent writes to avoid row collisions.

  try {
    var body = JSON.parse(e.postData.contents);

    var expectedSecret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!expectedSecret || body.secret !== expectedSecret) {
      return jsonResponse({ success: false, message: 'Unauthorized' }, 401);
    }

    var sheet = getOrCreateSheet();
    var now = new Date();

    // Basic server-side duplicate guard: skip if the same email submitted
    // for the same tool within the last 2 minutes (handles double-clicks).
    if (isDuplicate(sheet, body.email, body.toolUsed, now)) {
      return jsonResponse({ success: true, message: 'Already recorded.' });
    }

    sheet.appendRow([
      now,
      body.fullName || '',
      body.email || '',
      body.phone || '',
      body.city || '',
      body.profession || '',
      body.toolUsed || '',
      body.userInputsSummary || '',
      body.resultSummary || '',
      body.sourcePage || '',
      body.utmSource || '',
      body.utmMedium || '',
      body.utmCampaign || '',
      body.referrer || '',
      body.deviceType || '',
      body.consent ? 'Yes' : 'No',
      Utilities.formatDate(now, 'Asia/Kolkata', 'yyyy-MM-dd'),
      Utilities.formatDate(now, 'Asia/Kolkata', 'HH:mm:ss'),
      maskIp(body.ip || '')
    ]);

    return jsonResponse({ success: true, message: 'Lead recorded.' });
  } catch (err) {
    return jsonResponse({ success: false, message: 'Server error: ' + err.message }, 500);
  } finally {
    lock.releaseLock();
  }
}

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function isDuplicate(sheet, email, toolUsed, now) {
  if (!email) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var checkRows = Math.min(20, lastRow - 1); // only scan the most recent rows
  var range = sheet.getRange(lastRow - checkRows + 1, 1, checkRows, 7).getValues();
  for (var i = 0; i < range.length; i++) {
    var rowTime = range[i][0];
    var rowEmail = range[i][2];
    var rowTool = range[i][6];
    if (rowEmail === email && rowTool === toolUsed && (now - new Date(rowTime)) < 120000) {
      return true;
    }
  }
  return false;
}

function maskIp(ip) {
  if (!ip) return '';
  var parts = ip.split('.');
  if (parts.length === 4) return parts[0] + '.' + parts[1] + '.x.x';
  return ip.slice(0, 8) + '…'; // best-effort mask for IPv6
}

function jsonResponse(obj, statusCode) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run this once manually from the Apps Script editor to sanity-check
 * your SHARED_SECRET is set, before wiring up the real endpoint. */
function testSetup() {
  var secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
  Logger.log(secret ? 'SHARED_SECRET is set.' : 'SHARED_SECRET is MISSING - set it in Project Settings > Script Properties.');
}
