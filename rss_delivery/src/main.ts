/*
Copyright (c) 2020 redpeacock78
This software is released under the MIT License, see LICENSE.
*/



//URLとHTMLタグ、SpreadSheetを指定
const url_life: string = 'https://www.kyoto-art.ac.jp/student/life/news/?paged=1';
const url_teach: string = 'https://www.kyoto-art.ac.jp/student/teaching/news/?paged=1';
const url_event: string = 'https://www.kyoto-art.ac.jp/student/event/news/?paged=1';
const html_tag = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
const spreadsheet = SpreadsheetApp.openById('1UbxPew3ki_mlJmU6B0uzU__g02awVu1J5a0kgaSFvC0');
const sheet_life = spreadsheet.getSheetByName('life');
const sheet_teach = spreadsheet.getSheetByName('teach');
const sheet_event = spreadsheet.getSheetByName('event');
const sheet_all = spreadsheet.getSheetByName('all');



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
  var conv_date: string[] = new Array();
  for (let i = 0;i < date.length;i=(i+1)|0) {
    let del = '/';
    let arr: any = date[i].split(del);
    let conv = new Date(arr[0], arr[1] - 1, arr[2]);
    let time = Utilities.formatDate(new Date(), "JST", "HH:mm:ss")
    conv_date[i] = Utilities.formatDate(conv, "JST", "E MMM dd yyyy " + time + " Z");
  }
  return conv_date;
}
////sheetに書き込み
function writing_sheet_life() {
  let url = get_life_url();
  let date = get_life_date();
  let title = get_life_title();
  let info = new Array();
  for (let i = 0;i < url.length;i=(i+1)|0) {
    info[i] = [title[i], url[i], date[i]];
  }
  let rows = info.length;
  let cols = info[0].length;
  let last_row = sheet_life.getLastRow();
  if (last_row === 0) {
    sheet_life.getRange(1, 1, rows, cols).setValues(info);
    CacheService.getScriptCache().put('life_data', JSON.stringify(info), 21600);
  } else {
    let cache = CacheService.getScriptCache();
    let life_data = cache.get('life_data');
    if (life_data == null) {
      let range = sheet_life.getRange(1, 1, last_row, 3).getValues();
      cache.put('life_data', JSON.stringify(range) ,21600);
    }
    let data = JSON.parse(cache.get('life_data'));
    let info_tit = new Array();
    let data_tit = new Array();
    for (let i = 0;i < info.length;i=(i+1)|0) {
      info_tit[i] = info[i][0];
    }
    for (let i = 0;i < data.length;i=(i+1)|0) {
      data_tit[i] = data[i][0];
    }
    let tit_diff = info_tit.filter(i => data_tit.indexOf(i) == -1);
    let diff = new Array();
    for (let i = 0;i < tit_diff.length;i=(i+1)|0) {
      var num = info_tit.indexOf(tit_diff[i]);
      diff[i] = info[num];
    }
    if (diff.length > 0) {
      let result = diff.concat(data);
      if (result.length < 200) {
        sheet_life.getRange(1, 1, result.length, cols).setValues(result);
        cache.remove('life_data');
        cache.put('life_data', JSON.stringify(result) ,21600);
      } else {
        let max_result = result.slice(0, 200);
        sheet_life.getRange(1, 1, max_result.length, cols).setValues(max_result);
        cache.remove('life_data');
        cache.put('life_data', JSON.stringify(max_result) ,21600);
      }
    } else {
      cache.remove('life_data');
      cache.put('life_data', JSON.stringify(data) ,21600);
    }
  }
}
////行データを取得
function get_life_data(row_num) {
  let range = sheet_life.getRange(1, 1, 20, 3);
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
  var conv_date: string[] = new Array();
  for (let i = 0;i < date.length;i=(i+1)|0) {
    let del = '/';
    let arr: any = date[i].split(del);
    let conv = new Date(arr[0], arr[1] - 1, arr[2]);
    let time = Utilities.formatDate(new Date(), "JST", "HH:mm:ss")
    conv_date[i] = Utilities.formatDate(conv, "JST", "E MMM dd yyyy " + time + " Z");
  }
  return conv_date;
}
////sheetに書き込み
function writing_sheet_teach() {
  let url = get_teach_url();
  let date = get_teach_date();
  let title = get_teach_title();
  let info = new Array();
  for (let i = 0;i < url.length;i=(i+1)|0) {
    info[i] = [title[i], url[i], date[i]];
  }
  let rows = info.length;
  let cols = info[0].length;
  let last_row = sheet_teach.getLastRow();
  if (last_row === 0) {
    sheet_teach.getRange(1, 1, rows, cols).setValues(info);
    CacheService.getScriptCache().put('tea_data', JSON.stringify(info), 21600);
  } else {
    let cache = CacheService.getScriptCache();
    let tea_data = cache.get('tea_data');
    if (tea_data == null) {
      let range = sheet_teach.getRange(1, 1, last_row, 3).getValues();
      cache.put('tea_data', JSON.stringify(range) ,21600);
    }
    var data = JSON.parse(cache.get('tea_data'));
    let info_tit = new Array();
    let data_tit = new Array();
    for (let i = 0;i < info.length;i=(i+1)|0) {
      info_tit[i] = info[i][0];
    }
    for (let i = 0;i < data.length;i=(i+1)|0) {
      data_tit[i] = data[i][0];
    }
    let tit_diff = info_tit.filter(i => data_tit.indexOf(i) == -1);
    let diff = new Array();
    for (let i = 0;i < diff.length;i=(i+1)|0) {
      let num = info_tit.indexOf(tit_diff[i]);
      diff[i] = info[num];
    }
    if (diff.length > 0) {
      let result = diff.concat(data);
      if (result.length < 200) {
        sheet_teach.getRange(1, 1, result.length, cols).setValues(result);
        cache.remove('tea_data');
        cache.put('tea_data', JSON.stringify(result) ,21600);
      } else {
        let max_result = result.slice(0, 200);
        sheet_teach.getRange(1, 1, max_result.length, cols).setValues(max_result);
        cache.remove('tea_data');
        cache.put('tea_data', JSON.stringify(max_result) ,21600);
      }
    } else {
      cache.remove('tea_data');
      cache.put('tea_data', JSON.stringify(data) ,21600);
    }
  }
}
////行データを取得
function get_teach_data(row_num) {
  let range = sheet_teach.getRange(1, 1, 20, 3);
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
  var conv_date: string[] = new Array();
  for (let i = 0;i < date.length;i=(i+1)|0) {
    let del = '/';
    let arr: any = date[i].split(del);
    let conv = new Date(arr[0], arr[1] - 1, arr[2]);
    let time = Utilities.formatDate(new Date(), "JST", "HH:mm:ss")
    conv_date[i] = Utilities.formatDate(conv, "JST", "E MMM dd yyyy " + time + " Z");
  }
  return conv_date;
}
////sheetに書き込み
function writing_sheet_event() {
  let url = get_event_url();
  let date = get_event_date();
  let title = get_event_title();
  let info = new Array();
  for (let i = 0;i < url.length;i=(i+1)|0) {
    info[i] = [title[i], url[i], date[i]];
  }
  let rows = info.length;
  let cols = info[0].length;
  let last_row = sheet_event.getLastRow();
  if (last_row === 0) {
    sheet_event.getRange(1, 1, rows, cols).setValues(info);
    CacheService.getScriptCache().put('eve_data', JSON.stringify(info), 21600);
  } else {
    let cache = CacheService.getScriptCache();
    let eve_data = cache.get('eve_data');
    if (eve_data == null) {
      let range = sheet_event.getRange(1, 1, last_row, 3).getValues();
      cache.put('eve_data', JSON.stringify(range) ,21600);
    }
    let data = JSON.parse(cache.get('eve_data'));
    let info_tit = new Array();
    let data_tit = new Array();
    for (let i = 0;i < info.length;i=(i+1)|0) {
      info_tit[i] = info[i][0];
    }
    for (let i = 0;i < data.length;i=(i+1)|0) {
      data_tit[i] = data[i][0];
    }
    let tit_diff = info_tit.filter(i => data_tit.indexOf(i) == -1);
    let diff = new Array();
    for (let i = 0;i < tit_diff.length;i=(i+1)|0) {
      let num = info_tit.indexOf(tit_diff[i]);
      diff[i] = info[num];
    }
    if (diff.length > 0) {
      let result = diff.concat(data);
      if (result.length < 200) {
        sheet_event.getRange(1, 1, result.length, cols).setValues(result);
        cache.remove('eve_data');
        cache.put('eve_data', JSON.stringify(result) ,21600);
      } else {
        let max_result = result.slice(0, 200);
        sheet_event.getRange(1, 1, max_result.length, cols).setValues(max_result);
        cache.remove('eve_data');
        cache.put('eve_data', JSON.stringify(max_result) ,21600);
      }
    } else {
      cache.remove('eve_data');
      cache.put('eve_data', JSON.stringify(data) ,21600);
    }
  }
}
////行データを取得
function get_event_data(row_num) {
  let range = sheet_event.getRange(1, 1, 20, 3);
  return range.getValues()[row_num];
}


//全ての情報について
function writing_sheet_all() {
  ////それぞれから情報を二次元配列で取得
  let life;
  let teach;
  let event;
  let cache = CacheService.getScriptCache();
  if (cache.get('life_data') == null 
      && cache.get('tea_data') == null 
      && cache.get('eve_data') == null) {
    life = sheet_life.getRange(1, 1, 20, 3).getValues();
    teach = sheet_teach.getRange(1, 1, 20, 3).getValues();
    event = sheet_event.getRange(1, 1, 20, 3).getValues();
  } else {
    life = JSON.parse(cache.get('life_data'));
    teach = JSON.parse(cache.get('tea_data'));
    event = JSON.parse(cache.get('eve_data'));
  }
  ////取得した二次元配列を全て連結し要素の日付で昇順にソートし上から20件取得
  let all = life.concat(teach, event).sort(sort_asc).slice(0, 20);
  function sort_asc(a,b) {
    let a_date = new Date(Utilities.formatDate(new Date(a[2]), 'JST', 'yyyy/MM/dd'));
    let b_date = new Date(Utilities.formatDate(new Date(b[2]), 'JST', 'yyyy/MM/dd'));
    if　(a_date > b_date) {
      return -1;
    } else if　(a_date < b_date) {
      return 1;
    } else {
      return 0;
    }
  }
  ////ソートした二次元配列をsheetの内容と比較して書き込み
  let rows = all.length;
  let cols = all[0].length;
  let last_row = sheet_all.getLastRow();
  if (last_row === 0) {
    sheet_all.getRange(1, 1, rows, cols).setValues(all);
    CacheService.getScriptCache().put('all_data', JSON.stringify(all), 21600);
  } else {
    let all_data = cache.get('all_data');
    if (all_data == null) {
      let range = sheet_all.getRange(1, 1, last_row, 3).getValues();
      cache.put('all_data', JSON.stringify(range), 21600);
    }
    let data = JSON.parse(cache.get('all_data'));
    let all_tit = new Array();
    let data_tit = new Array();
    for (let i = 0;i < all.length;i=(i+1)|0) {
      all_tit[i] = all[i][0];
    }
    for (let i = 0;i < data.length;i=(i+1)|0) {
      data_tit[i] = data[i][0];
    }
    let tit_diff = all_tit.filter(i => data_tit.indexOf(i) == -1);
    let diff = new Array();
    for (let i = 0;i < tit_diff.length;i=(i+1)|0) {
      let num = all_tit.indexOf(tit_diff[i]);
      diff[i] = all[num];
    }
    if (diff.length > 0) {
      let result = diff.concat(data);
      if (result.length < 200) {
        sheet_all.getRange(1, 1, result.length, cols).setValues(result);
        cache.remove('all_data');
        cache.put('all_data', JSON.stringify(result) ,21600);
      } else {
        let max_result = result.slice(0, 200);
        sheet_all.getRange(1, 1, max_result.length, cols).setValues(max_result);
        cache.remove('all_data');
        cache.put('all_data', JSON.stringify(max_result) ,21600);
      }
    } else {
      cache.remove('all_data');
      cache.put('all_data', JSON.stringify(data) ,21600);
    }
  }
}
////行データを取得
function get_all_data(row_num) {
  let range = sheet_all.getRange(1, 1, 20, 3);
  return range.getValues()[row_num];
}



//RSS生成
function doGet(e) {
  let page = e.parameter["p"];
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
  } else if (page==null) {
    //全ての情報
    //テンプレート呼び出し
    let output = HtmlService.createTemplateFromFile('rss_all');
    let result = output.evaluate();
    //コンテントタイプを指定
    return ContentService.createTextOutput(result.getContent()).setMimeType(ContentService.MimeType.XML);
  }
}