/*
Copyright (c) 2020 redpeacock78
This software is released under the MIT License, see LICENSE.
*/

//URLとHTMLタグ、SpreadSheetを指定
const url_life = "https://www.kyoto-art.ac.jp/student/life/news/?paged=1";
const url_teach = "https://www.kyoto-art.ac.jp/student/teaching/news/?paged=1";
const url_event = "https://www.kyoto-art.ac.jp/student/event/news/?paged=1";
const html_tag = new RegExp(/<("[^"]*"|'[^']*'|[^'">])*>/g);
const spreadsheet = SpreadsheetApp.openById(
  "1UbxPew3ki_mlJmU6B0uzU__g02awVu1J5a0kgaSFvC0"
);
const sheet_life = spreadsheet.getSheetByName("life");
const sheet_teach = spreadsheet.getSheetByName("teach");
const sheet_event = spreadsheet.getSheetByName("event");
const sheet_all = spreadsheet.getSheetByName("all");

//学生生活情報について
////URLから指定範囲をスクレイピング
function get_life(): string {
  const responce: string[] = UrlFetchApp.fetch(url_life)
    .getContentText()
    .split(/\r\n|\r|\n/);
  const start_num: number = responce.indexOf(
    '          <section class="news-sect">'
  );
  const last_num: number = responce.indexOf(
    '<span class="page-numbers dots">&hellip;</span>'
  );
  const news_block: string = String(responce.slice(start_num, last_num))
    .replace(/,/g, "\n")
    .replace(/ +/g, " ")
    .trim();
  return news_block;
}
////get_lifeから記事のURLを取得し配列に格納
function get_life_url(): string[] {
  const news = get_life();
  const news_url: string[] = String(news.match(/<a href=".*">/g))
    .replace(/<a href="/g, "")
    .replace(/">/g, "")
    .split(",");
  return news_url;
}
////get_lifeから記事のタイトルを取得し配列に格納
function get_life_title(): string[] {
  const news = get_life();
  const title: string[] = String(news.match(/<p class="tit">.*/g))
    .replace(html_tag, "")
    .split(",");
  return title;
}
////get_lifeから記事の日付をを取得し変換したのち配列に格納
function get_life_date(): string[] {
  const news = get_life();
  const date = String(news.match(/<p class="date font-roboto">.*/g))
    .replace(html_tag, "")
    .replace(/\./g, "/")
    .split(",");
  const conv_date: string[] = [];
  for (let i = 0; i < date.length; i = (i + 1) | 0) {
    const del = "/";
    const arr: any = date[i].split(del);
    const conv = new Date(arr[0], arr[1] - 1, arr[2]);
    const time = Utilities.formatDate(new Date(), "JST", "HH:mm:ss");
    conv_date[i] = Utilities.formatDate(
      conv,
      "JST",
      "E MMM dd yyyy " + time + " Z"
    );
  }
  return conv_date;
}
////sheetに書き込み
function writing_sheet_life() {
  const url = get_life_url();
  const date = get_life_date();
  const title = get_life_title();
  const info = [];
  for (let i = 0; i < url.length; i = (i + 1) | 0) {
    info[i] = [title[i], url[i], date[i]];
  }
  const rows = info.length;
  const cols = info[0].length;
  const last_row = sheet_life.getLastRow();
  if (last_row === 0) {
    sheet_life.getRange(1, 1, rows, cols).setValues(info);
    CacheService.getScriptCache().put("life_data", JSON.stringify(info), 21600);
  } else {
    const cache = CacheService.getScriptCache();
    const life_data = cache.get("life_data");
    if (life_data == null) {
      const range = sheet_life.getRange(1, 1, last_row, 3).getValues();
      cache.put("life_data", JSON.stringify(range), 21600);
    }
    const data = JSON.parse(cache.get("life_data"));
    const info_tit = [];
    const data_tit = [];
    for (let i = 0; i < info.length; i = (i + 1) | 0) {
      info_tit[i] = info[i][0];
    }
    for (let i = 0; i < data.length; i = (i + 1) | 0) {
      data_tit[i] = data[i][0];
    }
    const tit_diff = info_tit.filter(i => data_tit.indexOf(i) == -1);
    if (tit_diff.length > 0) {
      const diff = [];
      for (let i = 0; i < tit_diff.length; i = (i + 1) | 0) {
        const num = info_tit.indexOf(tit_diff[i]);
        diff[i] = info[num];
      }
      const result = diff.concat(data);
      if (result.length < 200) {
        sheet_life.getRange(1, 1, result.length, cols).setValues(result);
        cache.remove("life_data");
        cache.put("life_data", JSON.stringify(result), 21600);
      } else {
        const max_result = result.slice(0, 200);
        sheet_life
          .getRange(1, 1, max_result.length, cols)
          .setValues(max_result);
        cache.remove("life_data");
        cache.put("life_data", JSON.stringify(max_result), 21600);
      }
    } else {
      cache.remove("life_data");
      cache.put("life_data", JSON.stringify(data), 21600);
    }
  }
}
////行データを取得
function get_life_data(row_num) {
  const range = sheet_life.getRange(1, 1, 20, 3);
  return range.getValues()[row_num];
}

//学習について
////URLから指定範囲をスクレイピング
function get_teach(): string {
  const responce: string[] = UrlFetchApp.fetch(url_teach)
    .getContentText()
    .split(/\r\n|\r|\n/);
  const start_num: number = responce.indexOf(
    '          <section class="news-sect">'
  );
  const last_num: number = responce.indexOf(
    '<span class="page-numbers dots">&hellip;</span>'
  );
  const news_block: string = String(responce.slice(start_num, last_num))
    .replace(/,/g, "\n")
    .replace(/ +/g, " ")
    .trim();
  return news_block;
}
////get_teachから記事のURLを取得し配列に格納
function get_teach_url(): string[] {
  const news = get_teach();
  const news_url: string[] = String(news.match(/<a href=".*">/g))
    .replace(/<a href="/g, "")
    .replace(/">/g, "")
    .split(",");
  return news_url;
}
////get_teachから記事のタイトルを取得し配列に格納
function get_teach_title(): string[] {
  const news = get_teach();
  const title: string[] = String(news.match(/<p class="tit">.*/g))
    .replace(html_tag, "")
    .split(",");
  return title;
}
////get_teachから記事の日付をを取得し変換したのち配列に格納
function get_teach_date(): string[] {
  const news = get_teach();
  const date = String(news.match(/<p class="date font-roboto">.*/g))
    .replace(html_tag, "")
    .replace(/\./g, "/")
    .split(",");
  const conv_date: string[] = [];
  for (let i = 0; i < date.length; i = (i + 1) | 0) {
    const del = "/";
    const arr: any = date[i].split(del);
    const conv = new Date(arr[0], arr[1] - 1, arr[2]);
    const time = Utilities.formatDate(new Date(), "JST", "HH:mm:ss");
    conv_date[i] = Utilities.formatDate(
      conv,
      "JST",
      "E MMM dd yyyy " + time + " Z"
    );
  }
  return conv_date;
}
////sheetに書き込み
function writing_sheet_teach() {
  const url = get_teach_url();
  const date = get_teach_date();
  const title = get_teach_title();
  const info = [];
  for (let i = 0; i < url.length; i = (i + 1) | 0) {
    info[i] = [title[i], url[i], date[i]];
  }
  const rows = info.length;
  const cols = info[0].length;
  const last_row = sheet_teach.getLastRow();
  if (last_row === 0) {
    sheet_teach.getRange(1, 1, rows, cols).setValues(info);
    CacheService.getScriptCache().put("tea_data", JSON.stringify(info), 21600);
  } else {
    const cache = CacheService.getScriptCache();
    const tea_data = cache.get("tea_data");
    if (tea_data == null) {
      const range = sheet_teach.getRange(1, 1, last_row, 3).getValues();
      cache.put("tea_data", JSON.stringify(range), 21600);
    }
    const data = JSON.parse(cache.get("tea_data"));
    const info_tit = [];
    const data_tit = [];
    for (let i = 0; i < info.length; i = (i + 1) | 0) {
      info_tit[i] = info[i][0];
    }
    for (let i = 0; i < data.length; i = (i + 1) | 0) {
      data_tit[i] = data[i][0];
    }
    const tit_diff = info_tit.filter(i => data_tit.indexOf(i) == -1);
    if (tit_diff.length > 0) {
      const diff = [];
      for (let i = 0; i < diff.length; i = (i + 1) | 0) {
        const num = info_tit.indexOf(tit_diff[i]);
        diff[i] = info[num];
      }
      const result = diff.concat(data);
      if (result.length < 200) {
        sheet_teach.getRange(1, 1, result.length, cols).setValues(result);
        cache.remove("tea_data");
        cache.put("tea_data", JSON.stringify(result), 21600);
      } else {
        const max_result = result.slice(0, 200);
        sheet_teach
          .getRange(1, 1, max_result.length, cols)
          .setValues(max_result);
        cache.remove("tea_data");
        cache.put("tea_data", JSON.stringify(max_result), 21600);
      }
    } else {
      cache.remove("tea_data");
      cache.put("tea_data", JSON.stringify(data), 21600);
    }
  }
}
////行データを取得
function get_teach_data(row_num) {
  const range = sheet_teach.getRange(1, 1, 20, 3);
  return range.getValues()[row_num];
}

//イベントについて
////URLから指定範囲をスクレイピング
function get_event(): string {
  const responce: string[] = UrlFetchApp.fetch(url_event)
    .getContentText()
    .split(/\r\n|\r|\n/);
  const start_num: number = responce.indexOf(
    '          <section class="news-sect">'
  );
  const last_num: number = responce.indexOf(
    '<span class="page-numbers dots">&hellip;</span>'
  );
  const news_block: string = String(responce.slice(start_num, last_num))
    .replace(/,/g, "\n")
    .replace(/ +/g, " ")
    .trim();
  return news_block;
}
////get_eventから記事のURLを取得し配列に格納
function get_event_url(): string[] {
  const news = get_event();
  const news_url: string[] = String(news.match(/<a href=".*">/g))
    .replace(/<a href="/g, "")
    .replace(/">/g, "")
    .split(",");
  return news_url;
}
////get_eventから記事のタイトルを取得し配列に格納
function get_event_title(): string[] {
  const news = get_event();
  const title: string[] = String(news.match(/<p class="tit">.*/g))
    .replace(html_tag, "")
    .split(",");
  return title;
}
////get_eventから記事の日付をを取得し変換したのち配列に格納
function get_event_date(): string[] {
  const news = get_event();
  const date = String(news.match(/<p class="date font-roboto">.*/g))
    .replace(html_tag, "")
    .replace(/\./g, "/")
    .split(",");
  const conv_date: string[] = [];
  for (let i = 0; i < date.length; i = (i + 1) | 0) {
    const del = "/";
    const arr: any = date[i].split(del);
    const conv = new Date(arr[0], arr[1] - 1, arr[2]);
    const time = Utilities.formatDate(new Date(), "JST", "HH:mm:ss");
    conv_date[i] = Utilities.formatDate(
      conv,
      "JST",
      "E MMM dd yyyy " + time + " Z"
    );
  }
  return conv_date;
}
////sheetに書き込み
function writing_sheet_event() {
  const url = get_event_url();
  const date = get_event_date();
  const title = get_event_title();
  const info = [];
  for (let i = 0; i < url.length; i = (i + 1) | 0) {
    info[i] = [title[i], url[i], date[i]];
  }
  const rows = info.length;
  const cols = info[0].length;
  const last_row = sheet_event.getLastRow();
  if (last_row === 0) {
    sheet_event.getRange(1, 1, rows, cols).setValues(info);
    CacheService.getScriptCache().put("eve_data", JSON.stringify(info), 21600);
  } else {
    const cache = CacheService.getScriptCache();
    const eve_data = cache.get("eve_data");
    if (eve_data == null) {
      const range = sheet_event.getRange(1, 1, last_row, 3).getValues();
      cache.put("eve_data", JSON.stringify(range), 21600);
    }
    const data = JSON.parse(cache.get("eve_data"));
    const info_tit = [];
    const data_tit = [];
    for (let i = 0; i < info.length; i = (i + 1) | 0) {
      info_tit[i] = info[i][0];
    }
    for (let i = 0; i < data.length; i = (i + 1) | 0) {
      data_tit[i] = data[i][0];
    }
    const tit_diff = info_tit.filter(i => data_tit.indexOf(i) == -1);
    if (tit_diff.length > 0) {
      const diff = [];
      for (let i = 0; i < tit_diff.length; i = (i + 1) | 0) {
        const num = info_tit.indexOf(tit_diff[i]);
        diff[i] = info[num];
      }
      const result = diff.concat(data);
      if (result.length < 200) {
        sheet_event.getRange(1, 1, result.length, cols).setValues(result);
        cache.remove("eve_data");
        cache.put("eve_data", JSON.stringify(result), 21600);
      } else {
        const max_result = result.slice(0, 200);
        sheet_event
          .getRange(1, 1, max_result.length, cols)
          .setValues(max_result);
        cache.remove("eve_data");
        cache.put("eve_data", JSON.stringify(max_result), 21600);
      }
    } else {
      cache.remove("eve_data");
      cache.put("eve_data", JSON.stringify(data), 21600);
    }
  }
}
////行データを取得
function get_event_data(row_num) {
  const range = sheet_event.getRange(1, 1, 20, 3);
  return range.getValues()[row_num];
}

//全ての情報について
function writing_sheet_all() {
  ////それぞれから情報を二次元配列で取得
  let life;
  let teach;
  let event;
  const cache = CacheService.getScriptCache();
  if (
    cache.get("life_data") == null &&
    cache.get("tea_data") == null &&
    cache.get("eve_data") == null
  ) {
    life = sheet_life.getRange(1, 1, 20, 3).getValues();
    teach = sheet_teach.getRange(1, 1, 20, 3).getValues();
    event = sheet_event.getRange(1, 1, 20, 3).getValues();
  } else {
    life = JSON.parse(cache.get("life_data"));
    teach = JSON.parse(cache.get("tea_data"));
    event = JSON.parse(cache.get("eve_data"));
  }
  ////取得した二次元配列を全て連結し要素の日付で昇順にソートし上から20件取得
  const all = life
    .concat(teach, event)
    .sort(sort_asc)
    .slice(0, 20);
  function sort_asc(a, b) {
    const a_date = new Date(
      Utilities.formatDate(new Date(a[2]), "JST", "yyyy/MM/dd")
    );
    const b_date = new Date(
      Utilities.formatDate(new Date(b[2]), "JST", "yyyy/MM/dd")
    );
    if (a_date > b_date) {
      return -1;
    } else if (a_date < b_date) {
      return 1;
    } else {
      return 0;
    }
  }
  ////ソートした二次元配列をsheetの内容と比較して書き込み
  const rows = all.length;
  const cols = all[0].length;
  const last_row = sheet_all.getLastRow();
  if (last_row === 0) {
    sheet_all.getRange(1, 1, rows, cols).setValues(all);
    CacheService.getScriptCache().put("all_data", JSON.stringify(all), 21600);
  } else {
    const all_data = cache.get("all_data");
    if (all_data == null) {
      const range = sheet_all.getRange(1, 1, last_row, 3).getValues();
      cache.put("all_data", JSON.stringify(range), 21600);
    }
    const data = JSON.parse(cache.get("all_data"));
    const all_tit = [];
    const data_tit = [];
    for (let i = 0; i < all.length; i = (i + 1) | 0) {
      all_tit[i] = all[i][0];
    }
    for (let i = 0; i < data.length; i = (i + 1) | 0) {
      data_tit[i] = data[i][0];
    }
    const tit_diff = all_tit.filter(i => data_tit.indexOf(i) == -1);
    if (tit_diff.length > 0) {
      const diff = [];
      for (let i = 0; i < tit_diff.length; i = (i + 1) | 0) {
        const num = all_tit.indexOf(tit_diff[i]);
        diff[i] = all[num];
      }
      const result = diff.concat(data);
      if (result.length < 200) {
        sheet_all.getRange(1, 1, result.length, cols).setValues(result);
        cache.remove("all_data");
        cache.put("all_data", JSON.stringify(result), 21600);
      } else {
        const max_result = result.slice(0, 200);
        sheet_all.getRange(1, 1, max_result.length, cols).setValues(max_result);
        cache.remove("all_data");
        cache.put("all_data", JSON.stringify(max_result), 21600);
      }
    } else {
      cache.remove("all_data");
      cache.put("all_data", JSON.stringify(data), 21600);
    }
  }
}
////行データを取得
function get_all_data(row_num) {
  const range = sheet_all.getRange(1, 1, 20, 3);
  return range.getValues()[row_num];
}

//RSS生成
function doGet(e) {
  const page = e.parameter["p"];
  if (page == "life") {
    //生活情報について
    //テンプレート呼び出し
    const output = HtmlService.createTemplateFromFile("rss_life");
    const result = output.evaluate();
    //コンテントタイプを指定
    return ContentService.createTextOutput(result.getContent()).setMimeType(
      ContentService.MimeType.XML
    );
  } else if (page == "teach") {
    //学習について
    //テンプレート呼び出し
    const output = HtmlService.createTemplateFromFile("rss_teach");
    const result = output.evaluate();
    //コンテントタイプを指定
    return ContentService.createTextOutput(result.getContent()).setMimeType(
      ContentService.MimeType.XML
    );
  } else if (page == "event") {
    //イベントについて
    //テンプレート呼び出し
    const output = HtmlService.createTemplateFromFile("rss_event");
    const result = output.evaluate();
    //コンテントタイプを指定
    return ContentService.createTextOutput(result.getContent()).setMimeType(
      ContentService.MimeType.XML
    );
  } else if (page == null) {
    //全ての情報
    //テンプレート呼び出し
    const output = HtmlService.createTemplateFromFile("rss_all");
    const result = output.evaluate();
    //コンテントタイプを指定
    return ContentService.createTextOutput(result.getContent()).setMimeType(
      ContentService.MimeType.XML
    );
  }
}
