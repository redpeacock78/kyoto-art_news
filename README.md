## kyoto-art_news
[![GitHub](https://img.shields.io/github/license/redpeacock78/kyoto-art_news)](https://github.com/redpeacock78/kyoto-art_news/blob/master/LICENSE)
![GitHub language count](https://img.shields.io/github/languages/count/redpeacock78/kyoto-art_news)
![GitHub top language](https://img.shields.io/github/languages/top/redpeacock78/kyoto-art_news)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/redpeacock78/kyoto-art_news)  
[![CircleCI](https://img.shields.io/circleci/build/github/redpeacock78/kyoto-art_news)](https://circleci.com/gh/redpeacock78/kyoto-art_news)

### 概要
これは[京都造形芸術大学 在学生専用サイト](https://www.kyoto-art.ac.jp/student/)に配信されている「お知らせ情報」をRSSとして配信するためのものです。(非公式)  
~~公式で配信してくれればこのRSSを制作することは無いんですけどね。応用すればDiscordとかSlackに流せますし。一応専用メールは流してるけど正直見てる人口は少ないと思うのでこう言う汎用性の高いものを公式で用意して欲しいですね。ちなみに「在学生専用LINEbot」なんてのもあったら便利ですよね。(提案)~~  
　なお最新情報の反映にはスクレイピングを行う関係上サーバーに負荷を掛けないために、情報が公開されてから最大5〜6分の遅延が発生する可能性があります。

### 使用方法
以下のURLをRSSリーダーなどに登録することによってそれぞれに対応した情報を適宜更新・取得することが可能になります。  
ちなみにURL下のボタンでもそれぞれのRSSリーダーに登録することができます。

- 総合  
  https://kyotoartnews.page.link/all  
  <a href="https://kyotoartnews.page.link/all"><img src="https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/rss.png" alt="RSSを購読する" width="20" height="20"></a>
  <a href='https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fkyotoartnews.page.link%2Fall'  target='blank'><img id='feedlyFollow' src='https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/feedly-follow-rectangle-volume-small_2x.png' alt='follow us in feedly' width='66' height='20'></a>
  <a href="http://www.inoreader.com/feed/https://kyotoartnews.page.link/all" target="blank"><img src="https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/inoreader-follow.png" alt='follow us in inoreader' width='57' height='20'></a>
- 生活  
  https://kyotoartnews.page.link/life  
  <a href="https://kyotoartnews.page.link/life"><img src="https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/rss.png" alt="RSSを購読する" width="20" height="20"></a>
  <a href='https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fkyotoartnews.page.link%2Flife'  target='blank'><img id='feedlyFollow' src='https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/feedly-follow-rectangle-volume-small_2x.png' alt='follow us in feedly' width='66' height='20'></a>
  <a href="http://www.inoreader.com/feed/https://kyotoartnews.page.link/life" target="blank"><img src="https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/inoreader-follow.png" alt='follow us in inoreader' width='57' height='20'></a>
- 学習  
  https://kyotoartnews.page.link/teach  
  <a href="https://kyotoartnews.page.link/teach"><img src="https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/rss.png" alt="RSSを購読する" width="20" height="20"></a>
  <a href='https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fkyotoartnews.page.link%2Fteach'  target='blank'><img id='feedlyFollow' src='https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/feedly-follow-rectangle-volume-small_2x.png' alt='follow us in feedly' width='66' height='20'></a>
  <a href="http://www.inoreader.com/feed/https://kyotoartnews.page.link/teach" target="blank"><img src="https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/inoreader-follow.png" alt='follow us in inoreader' width='57' height='20'></a>
- イベント・プロジェクト  
  https://kyotoartnews.page.link/event  
  <a href="https://kyotoartnews.page.link/event"><img src="https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/rss.png" alt="RSSを購読する" width="20" height="20"></a>
  <a href='https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fkyotoartnews.page.link%2Fevent'  target='blank'><img id='feedlyFollow' src='https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/feedly-follow-rectangle-volume-small_2x.png' alt='follow us in feedly' width='66' height='20'></a>
  <a href="http://www.inoreader.com/feed/https://kyotoartnews.page.link/event" target="blank"><img src="https://raw.githubusercontent.com/redpeacock78/kyoto-art_news/images/images/inoreader-follow.png" alt='follow us in inoreader' width='57' height='20'></a>

### 使用技術
- [GAS(Google Apps Script)](https://developers.google.com/apps-script/)
- [Firebase Dynamic Links](https://firebase.google.com/docs/dynamic-links?hl=ja)

## License
This source code is licensed MIT.

## Development Environment
claspのセットアップとCircleCIのセットアップを終えてから以下の手順で環境の構築とBuild & Deployを行ってください。
### Clone & Install
```bash
$ git clone git@github.com:redpeacock78/kyoto-art_news.git
$ cd kyoto-art_news
$ yarn upgrade
$ yarn add -D typescript eslint eslint-plugin-prettier eslint-config-prettier prettier jest cpx rimraf webpack webpack-cli gas-webpack-plugin ts-jest ts-loader @types/google-apps-script @typescript-eslint/eslint-plugin @typescript-eslint/parser @types/jest
```

### Lint & Build & Deploy
```bash
$ yarn lint-fix && git push origin master
```