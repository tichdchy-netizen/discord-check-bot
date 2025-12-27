function doGet(e) {
  const name = e?.parameter?.name;
  if (!name) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: "no name" })
    ).setMimeType(ContentService.MimeType.JSON);
  }

  const sheet = SpreadsheetApp
    .openById("PUT_SHEET_ID_HERE") // 👈 ใส่ Sheet ID
    .getSheetByName("Sheet1");    // 👈 ชื่อชีท

  const data = sheet.getDataRange().getValues();

  const input = name.replace(/\s+/g, "").toLowerCase();

  for (let i = 1; i < data.length; i++) {
    const target = data[i][0]
      ?.toString()
      .replace(/\s+/g, "")
      .toLowerCase();

    if (target && target.includes(input)) {
      return ContentService.createTextOutput(
        JSON.stringify({
          status: "found",
          name: data[i][0]
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
  }

  return ContentService.createTextOutput(
    JSON.stringify({ status: "not_found" })
  ).setMimeType(ContentService.MimeType.JSON);
}
