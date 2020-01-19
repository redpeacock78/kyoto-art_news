//URLとHTMLタグ、SpreadSheetを指定
const url_life: string = 'https://www.kyoto-art.ac.jp/student/life/news/?paged=1';
const url_teach: string = 'https://www.kyoto-art.ac.jp/student/teaching/news/?paged=1';
const url_event: string = 'https://www.kyoto-art.ac.jp/student/event/news/?paged=1';
const html_tag = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
const spreadsheet = SpreadsheetApp.openById('1UbxPew3ki_mlJmU6B0uzU__g02awVu1J5a0kgaSFvC0');
const sheet_life = spreadsheet.getSheetByName('life');
const sheet_teach = spreadsheet.getSheetByName('teach');
const sheet_event = spreadsheet.getSheetByName('event');



//学生生活情報について
////URLから指定範囲をスクレイピング
function get_life(): string {
  let responce: string[] = UrlFetchApp.fetch(url_life).getContentText().split(/\r\n|\r|\n/);
  let start_num: number = responce.indexOf('          <section class="news-sect">');
  let last_num: number = responce.indexOf('<span class="page-numbers dots">&hellip;</span>');
  let news_block: string = String(responce.slice(start_num, last_num)).replace(/,/g, '\n').replace(/ +/g, ' ').trim();
  return news_block;
}
////get_lifeから記事のURLを取得し配列に格納
function get_life_url(): string[] {
  let news = get_life();
  let news_url: string[] = String(news.match(/<a href=".*">/g)).replace(/<a href="/g, '').replace(/">/g, '').split(',');
  return news_url;
}
////get_lifeから記事のタイトルを取得し配列に格納
function get_life_title(): string[] {
  let news = get_life();
  let title: string[] = String(news.match(/<p class="tit">.*/g)).replace(html_tag, '').split(',');
  return title;
}
////get_lifeから記事の日付をを取得し変換したのち配列に格納
function get_life_date(): string[] {
  let news = get_life();
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
////sheetに書き込み
function writing_sheet_life() {
  let url = get_life_url();
  let date = get_life_date();
  let title = get_life_title();
  let info = [];
  for (let i = 0;i < url.length;i++) {
    let news = [title[i], url[i], date[i]];
    info.push(news);
  }
  let rows = info.length;
  let cols = info[0].length;
  sheet_life.insertRows(1, rows);
  sheet_life.getRange(1, 1, rows, cols).setValues(info);
  let last_row = sheet_life.getLastRow();
  let data = sheet_life.getRange(1, 1, last_row, 3);
  data.removeDuplicates();
}
////行データを取得
function get_life_data(row_num) {
  let range = sheet_life.getRange(1, 1, 20, 20);
  return range.getValues()[row_num];
}


//学習について
////URLから指定範囲をスクレイピング
function get_teach(): string {
  let responce: string[] = UrlFetchApp.fetch(url_teach).getContentText().split(/\r\n|\r|\n/);
  let start_num: number = responce.indexOf('          <section class="news-sect">');
  let last_num: number = responce.indexOf('<span class="page-numbers dots">&hellip;</span>');
  let news_block: string = String(responce.slice(start_num, last_num)).replace(/,/g, '\n').replace(/ +/g, ' ').trim();
  return news_block;
}
////get_teachから記事のURLを取得し配列に格納
function get_teach_url(): string[] {
  let news = get_teach();
  let news_url: string[] = String(news.match(/<a href=".*">/g)).replace(/<a href="/g, '').replace(/">/g, '').split(',');
  return news_url;
}
////get_teachから記事のタイトルを取得し配列に格納
function get_teach_title(): string[] {
  let news = get_teach();
  let title: string[] = String(news.match(/<p class="tit">.*/g)).replace(html_tag, '').split(',');
  return title;
}
////get_teachから記事の日付をを取得し変換したのち配列に格納
function get_teach_date(): string[] {
  let news = get_teach();
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
////sheetに書き込み
function writing_sheet_teach() {
  let url = get_teach_url();
  let date = get_teach_date();
  let title = get_teach_title();
  let info = [];
  for (let i = 0;i < url.length;i++) {
    let news = [title[i], url[i], date[i]];
    info.push(news);
  }
  let rows = info.length;
  let cols = info[0].length;
  sheet_teach.insertRows(1, rows);
  sheet_teach.getRange(1, 1, rows, cols).setValues(info);
  let last_row = sheet_teach.getLastRow();
  let data = sheet_teach.getRange(1, 1, last_row, 3);
  data.removeDuplicates();
}
////行データを取得
function get_teach_data(row_num) {
  let range = sheet_teach.getRange(1, 1, 20, 20);
  return range.getValues()[row_num];
}


//イベントについて
////URLから指定範囲をスクレイピング
function get_event(): string {
  let responce: string[] = UrlFetchApp.fetch(url_event).getContentText().split(/\r\n|\r|\n/);
  let start_num: number = responce.indexOf('          <section class="news-sect">');
  let last_num: number = responce.indexOf('<span class="page-numbers dots">&hellip;</span>');
  let news_block: string = String(responce.slice(start_num, last_num)).replace(/,/g, '\n').replace(/ +/g, ' ').trim();
  return news_block;
}
////get_eventから記事のURLを取得し配列に格納
function get_event_url(): string[] {
  let news = get_event();
  let news_url: string[] = String(news.match(/<a href=".*">/g)).replace(/<a href="/g, '').replace(/">/g, '').split(',');
  return news_url;
}
////get_eventから記事のタイトルを取得し配列に格納
function get_event_title(): string[] {
  let news = get_event();
  let title: string[] = String(news.match(/<p class="tit">.*/g)).replace(html_tag, '').split(',');
  return title;
}
////get_eventから記事の日付をを取得し変換したのち配列に格納
function get_event_date(): string[] {
  let news = get_event();
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
////sheetに書き込み
function writing_sheet_event() {
  let url = get_event_url();
  let date = get_event_date();
  let title = get_event_title();
  let info = [];
  for (let i = 0;i < url.length;i++) {
    let news = [title[i], url[i], date[i]];
    info.push(news);
  }
  let rows = info.length;
  let cols = info[0].length;
  sheet_event.insertRows(1, rows);
  sheet_event.getRange(1, 1, rows, cols).setValues(info);
  let last_row = sheet_event.getLastRow();
  let data = sheet_event.getRange(1, 1, last_row, 3);
  data.removeDuplicates();
}
////行データを取得
function get_event_data(row_num) {
  let range = sheet_event.getRange(1, 1, 20, 20);
  return range.getValues()[row_num];
}



//RSS生成
function doGet(e) {
  let page = e.parameter["e"];
  if (page == "life" ) {
    //生活情報について
    //テンプレート呼び出し
    let output = HtmlService.createTemplateFromFile('rss_life');
    let result = output.evaluate();
    //コンテントタイプを指定
    return ContentService.createTextOutput(result.getContent()).setMimeType(ContentService.MimeType.XML);
  } else if (page == "teach") {
    //学習について
    //テンプレート呼び出し
    let output = HtmlService.createTemplateFromFile('rss_teach');
    let result = output.evaluate();
    //コンテントタイプを指定
    return ContentService.createTextOutput(result.getContent()).setMimeType(ContentService.MimeType.XML);
  } else if (page == "event") {
    //イベントについて
    //テンプレート呼び出し
    let output = HtmlService.createTemplateFromFile('rss_event');
    let result = output.evaluate();
    //コンテントタイプを指定
    return ContentService.createTextOutput(result.getContent()).setMimeType(ContentService.MimeType.XML);
  }
}