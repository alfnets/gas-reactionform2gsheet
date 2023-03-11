# ReactionForm-to-Spreadsheet-by-GAS
Google フォーム と Google スプレッドシート を Google Apps Script（GAS）で連携して、授業の振り返りフォームを作成しました！これを使えば学習を可視化することができます！！なお、バージョン2より、複数授業対応、回答先のスプレッドシートと児童・生徒個別のスプレッドシートが連携されるようになりました（児童・生徒からの質問に回答・コメントしやすくなりました）。

## Usage
下記のページで動画の内容も含めた詳細な手順・コードを公開しています。  
https://alfnet.info/google02/

なお、使い方の手順の概要は下記となります。
1. 先生用のGoogleアカウントでログイン
2. 次のURLにアクセスして「コピーを作成」ボタンから Google フォーム を Google ドライブ に コピー（**※ ここで「Apps Script ファイルを表示」ボタンをクリックしないでください！**）
- 通常
  - 小学校版： https://docs.google.com/forms/d/1AdfkUYcNC75J4iWoajin3Z9W8TF9pfhnPon9ejO-qZ4/copy
  - 中学校版： https://docs.google.com/forms/d/17JOF5X7OxEizd7xkuG67P_jyVhltzuXclnFMrtBo_C8/copy
  - 高校版： https://docs.google.com/forms/d/1T_PynKl6pYbrsJKp3GmV8ZGAME1nlnRxmeYpDEj3ffg/copy
- light（自由記述を統合したバージョン）
  - 小学校版： https://docs.google.com/forms/d/17Voyuz4pXGabohwGCy3f8ZSR9l3_onFfi4X9UfdpYQo/copy
  - 中学校版： https://docs.google.com/forms/d/1kakMlVNswAj_xdunjs7ORBlf8yM4yL99nNbk7hoetEE/copy
  - 高校版： https://docs.google.com/forms/d/1M8_bX2dATApV8jMEPct9Y__RyGEn0pn3BviPhyrMw8o/copy
3. 2でコピーした Google フォーム が開くので、「ファイルのアップロード先のフォルダが見つかりません」で「復元」をクリック
4. 次のURLにアクセスして Google スプレッドシート のテンプレートを Google ドライブ に コピー  
- 通常
  - https://docs.google.com/spreadsheets/d/13Wz0R-yiEA679nzoJFtEQVnPVOWgFHWoEctQ9CdAmIU/copy
- light（自由記述を統合したバージョン）
  - https://docs.google.com/spreadsheets/d/16sOeQLDRzIEqMphYXKvMHIemHAYoUkA2zu5ciRJxw_4/copy
5. 4でコピーしたファイルを右クリックして、「名前の変更」を選択し、冒頭の文字列である「コピー 〜 」を削除してファイル名を「template_classSelfFeedbackv2.0」にする
6. スプレッドシートの保存フォルダを Google ドライブ 上に作成
7. テンプレートを 6 で作成した保存フォルダに移動
8. 2でコピーした Google フォーム からスクリプトエディタを開いて、6 のフォルダIDをスクリプトに貼り付け
9. スクリプトにトリガーを追加
10. 「アカウントの選択」のウィンドウにて自分のアカウントを選択
11. 「このアプリは Google で確認されていません」という警告ウィンドウの左下の「詳細」をクリック（ドメイン（環境）によっては不要）
12. 「FormToSpreadsheet（安全ではないページ）に移動」をクリック（ドメイン（環境）によっては不要）
13. 「FormToSpreadsheet が Google アカウントへのアクセスをリクエストしています」というウィンドウにて一番下の「許可」ボタンをクリック（ドメイン（環境）によっては不要）
14. フォーム編集画面の「回答」タブから、緑色のスプレッドシートのアイコンをクリックし、回答先のスプレッドシートを選択・作成

### Instraction movie（説明動画）
バージョン1　https://youtu.be/zJYqqVkh8vc  
バージョン2　https://youtu.be/KNCF0ltFr2Q

## Limitation
Google Wordspace の管理コンソールにおいて、「Drive SDK API 経由での Google ドライブへのアクセスをユーザーに許可する」の設定が OFF になっている場合には、本ツールを使用することはできません（デフォルトでは ON）。手順通り実施してもうまくいかない場合には、校内や職場のシステム管理者に確認してください。

## Author
あるふ(alf)

## License
This software is released under the MIT License, see LICENSE.  
https://opensource.org/licenses/mit-license.php
