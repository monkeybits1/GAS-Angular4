function onInstall(){
  onOpen();
}

function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Angular4 Demo')
      .addItem('Open Modal', 'showModal')
      .addToUi();
}

function showModal() {
  var html = HtmlService.createTemplateFromFile('index');
  var page = html.evaluate()
             .setWidth(800)
             .setHeight(500);
  SpreadsheetApp.getUi().showModalDialog(page, 'Angular 4 x Apps Script');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function getSSName(){

  var names = [];
  var sheets = SpreadsheetApp.getActive().getSheets();
  for (var i = 0; i < sheets.length; i++) {
    names.push(sheets[i].getName());
  }
  return names;
}
