

function doPost(e) {
  var lock = LockService.getScriptLock();
  // Wait up to 10 seconds for any concurrent writes to clear
  lock.tryLock(10000);
  
  try {
    var sheetName = '';
    var headers = [];
    var rowData = [];
    
    // Parse JSON payload or POST parameters
    var params = e.parameter || {};
    if (e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        // Fallback to text parsing if needed
      }
    }
    
    var formType = params.formType || 'contact';
    
    if (formType === 'contact') {
      sheetName = 'Contact Submissions';
      headers = ['Timestamp', 'Full Name', 'Email Address', 'Phone Number', 'Project Message'];
      rowData = [
        new Date(),
        params.name || '',
        params.email || '',
        params.phone || '',
        params.message || ''
      ];
    } else if (formType === 'newsletter') {
      sheetName = 'Newsletter Subscribers';
      headers = ['Timestamp', 'Email Address'];
      rowData = [
        new Date(),
        params.email || ''
      ];
    } else {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Invalid submission form type.'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Connect to the active Spreadsheet
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName(sheetName);
    
    // Create the sheet and set headers if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet(sheetName);
      sheet.appendRow(headers);
      
      // Auto-style headers: Bold, dark gray background, white text
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1f2937');
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    
    // Check for duplicate newsletter emails server-side
    if (formType === 'newsletter') {
      var data = sheet.getDataRange().getValues();
      var emailToFind = (params.email || '').toLowerCase().trim();
      
      // Skip row 0 (headers)
      for (var i = 1; i < data.length; i++) {
        if (data[i][1] && data[i][1].toString().toLowerCase().trim() === emailToFind) {
          return ContentService.createTextOutput(JSON.stringify({
            status: 'error',
            message: 'duplicate'
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }
    
    // Write submission values to sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns to fit content cleanly
    sheet.autoResizeColumns(1, headers.length);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Submission recorded successfully.'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } finally {
    // Release lock for other writes
    lock.releaseLock();
  }
}
