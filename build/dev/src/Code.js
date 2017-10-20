function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Angular4 Demo')
      .addItem('Open Modal', 'showModal')
      .addToUi();
}

function showModal() {
  var html = HtmlService.createTemplateFromFile('index');
  var page = html.evaluate()
             .setWidth(400)
             .setHeight(300);
  SpreadsheetApp.getUi().showModalDialog(page, 'Angular 4 x Apps Script');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}