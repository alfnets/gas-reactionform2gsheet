# ReactionForm-to-Spreadsheet-by-GAS
Google フォーム と Google スプレッドシート を Google Apps Script（GAS）で連携して、授業の振り返りフォームを作成しました！これを使えば学習を可視化することができます！！

## Usage
1. 先生用の Google アカウントでログイン
2. 次のURLにアクセスして Google フォーム を Google ドライブ に コピー
  - https://docs.google.com/forms/d/19PUwOy-o-u1d6ueOWOT5pdmqIxfAcb23Q1XpdTr8z5c/copy
3. 2でコピーした Google フォーム を開き、「ファイルのアップロード先のフォルダが見つかりません」で「復元」をクリック
4. 次のURLにアクセスして Google スプレッドシート のテンプレートを Google ドライブ に コピー
  - https://docs.google.com/spreadsheets/d/1qxupawwnWmIOznyZNOo6vIEyGw9t8Febh7I-pyAb5xg/copy
5. 4 でコピーしたファイルを右クリックして、「名前の変更」を選択し、冒頭の文字列である「コピー 〜 」を削除してファイル名を「template_classSelfFeedback」にする
6. スプレッドシートの保存フォルダを Google ドライブ 上に作成
7. テンプレートを 6 で作成した保存フォルダに移動
8. 2 でコピーした Google フォーム からスクリプトエディタを開いて、6 のフォルダIDをスクリプトに貼り付け
9. スクリプトにトリガーを追加
  - 環境によっては下記の手順が必要となります
10. 「アカウントの選択」のウィンドウにて自分のアカウントを選択
11. 「このアプリは Google で確認されていません」という警告ウィンドウの左下の「詳細」をクリック
12. 「FormToSpreadsheet（安全ではないページ）に移動」をクリック
13. 「FormToSpreadsheet が Google アカウントへのアクセスをリクエストしています」というウィンドウにて一番下の「許可」ボタンをクリック

### Instraction movie（説明動画）
https://youtu.be/zJYqqVkh8vc

## License
This software is released under the MIT License, see LICENSE.
