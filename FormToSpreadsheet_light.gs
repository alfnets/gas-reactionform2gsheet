/*
gas-reactionform2gsheet_light
Version 2.3.0
2024/10/08

Copyright (c) 2024 alf
Released under the MIT license
https://opensource.org/licenses/mit-license.php

**************************************************
 振り返りフォームを使用する際には必ず公開されているURLから
 「コピーを作成」ボタンをクリックして振り返りフォームを
 コピーして使用するようにしてください。
**************************************************
*/

// フォルダIDとテンプレートファイル名を定義（指定）
const FOLDER_ID = 'スプレッドシートを保存したいフォルダIDを入力してください';    // 振り返りのスプレッドシートを保存したいフォルダのID
const TEMPLATE_FILE_NAME = "template_classSelfFeedbackv2.0_light";   // テンプレートファイルは18行目のフォルダ内に格納すること

const maxRetryCount = 5;    // 最大リトライ回数
const retryInterval = 2000; // リトライ間隔（ミリ秒）

function sendSpredsheet(event) {
  // フォームからの送信データ取得
  const emailaddress = retryWithLimit(() => event.response.getRespondentEmail());
  const formResponses = retryWithLimit(() => event.response.getItemResponses());
  const timeStamp = retryWithLimit(() => event.response.getTimestamp());
  const formId = retryWithLimit(() => event.source.getId());

  // フォームの回答結果の整理
  const studentNumber = formResponses[0].getResponse();     // 学籍番号
  const classname = formResponses[1].getResponse();         // 授業名
  const content = formResponses[2].getResponse();           // 授業内容
  const selfchecks = formResponses[3].getResponse();        // 自己評価
  const actfeedback = formResponses[4].getResponse();       // 振り返り（自由記述）
  const question = formResponses[5].getResponse();          // 質問

  // MEMO: カラム数は下記で算出
  // 質問項目（レスポンス）数 + 自己評価数 + タイムスタンプ列 + メールアドレス列 - 1
  // -1 している理由は、レスポンス数に自己評価である selfchecks が含まれているため
  // files が空の場合はレスポンス数に含まれないため、その分 +1 する
  let columnCount = formResponses.length + selfchecks.length + 1

  let files = [];
  try {
    files = formResponses[6].getResponse();   // アップロードファイル
  } catch (e) {
    files = new Array("");
    columnCount += 1;
  }

  // 操作フォルダーとファイル一覧の取得等
  let folder;
  try {
    folder = DriveApp.getFolderById(FOLDER_ID);   // 操作フォルダー
  } catch (e) {
    throw new Error(`フォルダーが見つかりませんでした。本プログラムで定義されているFOLDER_IDが正しいものか確認してください。もしくは、DriveAppを使ったツールがドメイン管理者（システム管理者）によって無効化されています。\n詳細: ${e.message}`);
  }
  const filelist = folder.getFiles();   // 操作フォルダーに格納されているファイル一覧をIteratorオブジェクトとして取得
  const fileName = `【振り返りシート】${studentNumber}`   // 振り返りシートの名前
  let check = 0;    //  既にファイルが存在しているかのチェックフラグ

  // 既にファイルが存在しているかの確認
  while (filelist.hasNext()) {          // .hasNext()でファイルがまだ残っているかどうかチェック
    const file = filelist.next();     // .next()で順番にファイルを取り出す
    if (file.getName() === fileName) {  // 既にファイルがあったならばチェックフラグを立てる
      check = 1;
    }
  }

  // スプレッドシートファイルの作成
  if (check === 0) {    // ファイルがなければテンプレートファイルから複製してファイルを作成する
    const templateFiles = DriveApp.getFolderById(FOLDER_ID).getFilesByName(TEMPLATE_FILE_NAME);   // テンプレートファイルをIteratorオブジェクトとして取得
    let templateFile;
    try {
      templateFile = templateFiles.next();   // .next()でIteratorオブジェクトからtemplateファイルを取得
    } catch (e) {
      throw new Error(`テンプレートファイルが見つかりませんでした。テンプレートファイルがFOLDER_IDのフォルダに保存されていることと、本プログラムで定義されているTEMPLATE_FILE_NAMEとテンプレートファイル名が一致していること、Excelファイルではなくスプレッドシートであることを確認してください。\n詳細: ${e.message}`);
    }
    templateFile.makeCopy(fileName, folder);    // templateファイルをコピー
  }

  // スプレッドシート情報の取得
  const targetFiles = DriveApp.getFolderById(FOLDER_ID).getFilesByName(fileName);   // 操作するスプレッドシートをIteratorオブジェクトとして取得
  const targetFile = targetFiles.next();  // .next()でIteratorオブジェクトからファイルを取得
  const targetss = SpreadsheetApp.openById(targetFile.getId()); // .getIdでID名を指定してスプレッドシートとしてファイルを取得し直す
  const targetsheets = targetss.getSheets();    // すべてのシートを取得

  // 既に同じ授業名のシートが存在しているかの確認
  const sheet_names = [];
  targetsheets.forEach(sheet => {
    sheet_names.push(sheet.getName());
  });
  if (sheet_names.includes(classname)) {  // 既に同じ授業名のシートが存在している場合
    var targetsheet = targetss.getSheetByName(classname);  // 授業名のシートを取得    
  } else {
    const templatesheet = targetss.getSheetByName("template");  // テンプレートシートを取得
    var targetsheet = templatesheet.copyTo(targetss);   // テンプレートシートをコピー
    targetsheet.setName(classname);   // シート名を授業名に変更
    targetsheet.activate();   // 新しいシートをアクティブにする
    targetss.moveActiveSheet(1);   // 新しいシートを一番左に移動
  }

  // スプレッドシートへの入力
  const dataRange = targetsheet.getRange("B:B").getValues();  // B列の値を配列で取得
  const lastRow = dataRange.filter(String).length;  // 空白の要素を除いた配列の長さを取得
  const d = new Date();   // 現在時刻を取得
  targetsheet.getRange(lastRow + 1, 2).setValue(`${d.getMonth() + 1}月${d.getDate()}日`);   // 日付を入力
  targetsheet.getRange(lastRow + 1, 3).setValue(content);         // 授業内容を入力
  targetsheet.getRange(lastRow + 1, 4).setValue(selfchecks[0]);   // 主体的な態度の評価を入力
  targetsheet.getRange(lastRow + 1, 5).setValue(selfchecks[1]);   // 思考・判断・表現の評価を入力
  targetsheet.getRange(lastRow + 1, 6).setValue(selfchecks[2]);   // 知識・技能の評価を入力
  targetsheet.getRange(lastRow + 1, 7).setValue(actfeedback);     // 振り返り（自由記述）を入力  
  targetsheet.getRange(lastRow + 1, 8).setValue(question);        // 質問内容を入力

  if (files[0] != "") {
    let fileLink = '';
    let counter = 0;
    files.forEach(fileId => {
      counter++;
      fileLink = `https://drive.google.com/file/d/${fileId}`;
      targetsheet.getRange(lastRow + 1, 8 + counter).setValue(fileLink);  // アップロードファイルのリンクを入力
    });

    // アップロードファイルの閲覧権限の付与（生徒用）
    try {
      files.forEach(fileId => {
        Drive.Permissions.insert(
          {
            'role': 'reader', //権限タイプを選ぶ (owner, organizer, fileOrganizer, writer, reader)
            'type': 'user', //アカウントタイプを選ぶ (user, group, domain, anyone)
            'value': emailaddress
          },
          fileId,
          {
            'sendNotificationEmails': 'false' //true=通知ON, false=通知OFF
          }
        );
      });
    } catch (e) {
      console.error('提出されたファイルに共有設定をすることができませんでした。')
    }
  }

  // スプレッドシートの閲覧権限の付与
  let scheck = 0;   // 権限があるかのフラグ
  const sviewers = targetFile.getViewers();    // 閲覧権限のアカウントを取得
  sviewers.forEach(viewer => {   // 今回のアカウントに既にコメント権限が付与されているかチェック
    if (viewer.getEmail() === emailaddress) {
      scheck = 1;   // アカウントにコメント権限が付与されているならフラグを立てる
    }
  });
  if (scheck === 0) {    // アカウントが付与されていなければ付与
    try {
      targetFile.addCommenter(emailaddress);
    } catch (e) {
      const error_str = `${studentNumber} さんが入力したメールアドレス（${emailaddress}）は、共有を許可されていないなどの問題があります。入力に誤りがあるかなどの確認をしてください。なお、${studentNumber} さん個別の振り返りスプレッドシートに振り返り内容は転送されていますが、スプレッドシートが ${studentNumber} さんと共有されていない可能性があります。また、ファイルが提出されている場合には、提出されたファイルが${studentNumber} さんと共有設定されていません。提出されたファイルの共有設定を確認して、共有されていない場合には「閲覧者（コメント可）」で手動で共有してください。

${studentNumber} さん個別の振り返りスプレッドシート： ${targetFile.getUrl()}
`
      console.error(error_str)
      const exec_emailAddress = Session.getActiveUser().getUserLoginId();
      sendMailWithOption(exec_emailAddress, studentNumber, error_str);
    }
  }

  // 個別のスプレッドシートへのリンクを回答一覧のスプレッドシートに追記
  addIndividualSsLinkToAnswerSs(targetFile, formId, timeStamp, studentNumber, columnCount);
}

/* 個別のスプレッドシートへのリンクを回答一覧のスプレッドシートに追記 */
function addIndividualSsLinkToAnswerSs(targetFile, formId, timeStamp, studentNumber, columnCount) {
  const downloadUrl = targetFile.getUrl();  // 個別のスプレッドシートのリンクを取得
  const answerSheet = retryWithLimit(() => getSheet(formId));

  let retryCount = 0;
  let timeStamps, studentNumbers, targetRow;
  while (!targetRow && retryCount < maxRetryCount) {
    retryCount++;
    Utilities.sleep(retryInterval);
    timeStamps = answerSheet.getRange("A:A").getValues();     // A列（タイムスタンプ）の値を配列で取得
    studentNumbers = answerSheet.getRange("C:C").getValues(); // C列（学籍番号）の値を配列で取得
    targetRow = getTargetRow(timeStamps, studentNumbers, timeStamp, studentNumber) // 回答を記録した行を取得
  }
  if (!targetRow) {
    throw new Error(`回答一覧のスプレッドシートに ${studentNumber} さんの回答が見つからなかったため、個別のスプレッドシートへのリンクを回答一覧のスプレッドシートに追記できませんでした。`)
  } else {
    answerSheet.getRange(1, columnCount + 1).setValue("個別の振り返りスプレッドシート");  // ヘッダーを入力
    answerSheet.getRange(targetRow, columnCount + 1).setValue(downloadUrl);  // 個別のスプレッドシートのリンクを入力
  }
}

/* スプレッドシートのIDを取得する */
function getSheet(formId) {
  const form = FormApp.openById(formId);    // フォームを取得（スクリプトエディタでDrive APIを追加しておく必要がある）
  let answerSs;
  try {
    answerSs = SpreadsheetApp.openById(form.getDestinationId());    // フォームとリンクしている回答スプレッドシートを取得
  } catch (e) {
    throw new Error(`フォームとリンクしている回答先スプレッドシートが見つかりませんでした。フォームの回答タブから回答先スプレッドシートを作成・もしくは既存のものを選択してください。\n詳細: ${e.message}`);
  }
  const formUrl = form.getEditUrl().replace('/edit', '');   // フォームのURL兼IDを取得
  const destinationSheet = answerSs.getSheets().find(sheet =>   // 回答スプレッドシートの各シートにおいて、リンクしているフォームがformUrlと一致するシートを探す
    sheet.getFormUrl()?.replace('/viewform', '') === formUrl
  );
  return destinationSheet;
}

/* 回答した行を取得 */
function getTargetRow(timeStamps, studentNumbers, timeStamp, studentNumber) {
  for(var i = 1; i < timeStamps.length; i++){
    if(timeStamps[i] + studentNumbers[i] === timeStamp + studentNumber){
      return i + 1;
    }
  }
}

/* メールアドレスを間違えていたりして共有設定できなかった際のメール通知 */
function sendMailWithOption(address, studentNumber, message) {
  const subject = `【振り返りフォームエラー】${studentNumber}さんが入力したメールアドレスに問題がある`; // メールの件名
  // const options = { /*オプションの内容*/ };
  const body = `${message}`;
  MailApp.sendEmail(address, subject, body);
}

/* リトライ処理用関数 */
function retryWithLimit(func) {
  let retryCount = 0;
  let result;

  while (retryCount < maxRetryCount) {
    try {
      result = func();
      if (!result) {
        throw new Error("データ取得に失敗しました。");
      }
      break;
    } catch (e) {
      retryCount++;
      console.error(`リトライします: ${retryCount}回目(データ取得に失敗しました: ${e.message})`);
      Utilities.sleep(retryInterval);
    }
  }

  if (!result) {
    throw new Error("データ取得の最大リトライ回数を超えました。処理を終了します。");
  }

  return result;
}
