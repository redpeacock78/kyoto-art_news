//URLとHTMLタグ、SpreadSheetを指定
const url: string = 'https://www.kyoto-art.ac.jp/student/life/news/?paged=1';
const html_tag = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
const spreadsheet = SpreadsheetApp.openById('1UbxPew3ki_mlJmU6B0uzU__g02awVu1J5a0kgaSFvC0');
const sheet = spreadsheet.getSheetByName('news');

//URLから指定範囲をスクレイピング
function get_news(): string {
  let responce: string[] = UrlFetchApp.fetch(url).getContentText().split(/\r\n|\r|\n/);
  let start_num: number = responce.indexOf('          <section class="news-sect">');
  let last_num: number = responce.indexOf('<span class="page-numbers dots">&hellip;</span>');
  let news_block: string = String(responce.slice(start_num, last_num)).replace(/,/g, '\n').replace(/ +/g, ' ').trim();
  return news_block;
}

//get_newsから記事のURLを取得し配列に格納
function get_news_url(): string[] {
  let news = get_news();
  let news_url: string[] = String(news.match(/<a href=".*">/g)).replace(/<a href="/g, '').replace(/">/g, '').split(',');
  return news_url;
}

//get_newsから記事のタイトルを取得し配列に格納
function get_news_title(): string[] {
  let news = get_news();
  let title: string[] = String(news.match(/<p class="tit">.*/g)).replace(html_tag, '').split(',');
  return title;
}

//get_newsから記事の日付をを取得し変換したのち配列に格納
function get_news_date(): string[] {
  let news = get_news();
  let date = String(news.match(/<p class="date font-roboto">.*/g)).replace(html_tag, '').replace(/\./g, '/').split(',');
  var conv_date: string[] = [];
  for (let i = 0;i < date.length;i++) {
    let del = '/';
    let arr: any = date[i].split(del);
    let conv = new Date(arr[0], arr[1] - 1, arr[2]);
    conv_date.push(Utilities.formatDate(conv, "JST", "E MMM dd yyyy Z"));
  }
  return conv_date;
}

//sheetに書き込み
function writing_sheet() {
  let url = get_news_url();
  let date = get_news_date();
  let title = get_news_title();
  let info = [];
  for (let i = 0;i < url.length;i++) {
    let news = [title[i], url[i], date[i]];
    info.push(news);
  }
  let rows = info.length;
  let cols = info[0].length;
  sheet.insertRows(1, rows);
  sheet.getRange(1, 1, rows, cols).setValues(info);
  let last_row = sheet.getLastRow();
  let data = sheet.getRange(1, 1, last_row, 3);
  data.removeDuplicates();
}

//行データを取得
function get_raw_data(row_num) {
  let range = sheet.getRange(1, 1, 20, 20);
  return range.getValues()[row_num];
}

//RSS生成
function doGet() {
  //テンプレート呼び出し
  let output = HtmlService.createTemplateFromFile('rssTemplate');
  let result = output.evaluate();
  //コンテントタイプを指定
  return ContentService.createTextOutput(result.getContent()).setMimeType(ContentService.MimeType.XML);
}