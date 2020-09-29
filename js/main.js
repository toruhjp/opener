"use strict";

// 送信先,送信元のメールアドレス
var mailLocalTo = "lp_2.2020";
var mailDomainTo = "y-n-s.co.jp";
var mailLocalFrom = "gaku.sugiyama.work";
var mailDomainFrom = "gmail.com"; // smtpJSのSecureToken

var secureToken = "deac3341-d3fa-4ffd-98c1-15362ed172c3"; // form要素を参照

var contact = document.getElementById("contact"); // formの項目を参照

var userName = document.getElementById("user-name");
var companyName = document.getElementById("company-name");
var mail = document.getElementById("mail");
var accept = document.getElementById("accept"); // バリデーションパターン

var userNameValidationPattern = /^[^\s\^\$\|\?\*\+\-\.\/@!#%&=`{}~　][^\^\$\|\?\*\+\.\/@!#%&=`{}~]{0,98}[^\s\^\$\|\?\*\+\-\.\/@!#%&'=`{}~　]$/;
var companyNameValidationPattern = /[^\x01-\x7E]/;
var mailValidationPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/; // バリデーションクリア判定Flag

var userNameFlag = false;
var companyNameFlag = false;
var mailFlag = false;
var acceptFlag = false; // 送信ボタン初期状態

var submitBtn = document.getElementById("submit-btn");
submitBtn.disabled = true; // 氏名バリデーション

userName.addEventListener("change", function (e) {
  // 氏名のエラー表示用タグを参照
  var userNameError = document.getElementById("js-user-name-error");

  if (userNameValidationPattern.test(userName.value)) {
    userNameError.innerText = "";
    userNameFlag = true;
  } else {
    userNameError.innerText = "全角を含め、100字以内で入力してください";
    userNameFlag = false;
  }

  checkSuccess();
}); // 会社名バリデーション

companyName.addEventListener("change", function (e) {
  // 会社名のエラー表示用タグを参照
  var companyNameError = document.getElementById("js-company-name-error"); // 文字数(1文字以上100文字以下のバリデーションに使用)

  var companyNameValueLength = companyName.value.length;

  if (companyNameValidationPattern.test(companyName.value) && 1 <= companyNameValueLength && companyNameValueLength <= 100) {
    companyNameError.innerText = "";
    companyNameFlag = true;
  } else {
    companyNameError.innerText = "全角を含め、100字以内で入力してください";
    companyNameFlag = false;
  }

  checkSuccess();
}); // メールアドレスバリデーション

mail.addEventListener("change", function (e) {
  // メールアドレスのエラー表示用タグを参照
  var mailError = document.getElementById("js-mail-error");

  if (mailValidationPattern.test(mail.value)) {
    mailError.innerText = "";
    mailFlag = true;
  } else {
    mailError.innerText = "ほかのアドレスを入力してください";
    mailFlag = false;
  }

  checkSuccess();
}); // プライバシーチェックバリデーション

accept.addEventListener("change", function (e) {
  // プライバシーチェックのエラー表示用タグを参照
  var acceptError = document.getElementById("js-accept-error");

  if (accept.checked) {
    acceptError.innerText = "";
    acceptFlag = true;
  } else {
    acceptError.innerText = "同意をお願いします";
    acceptFlag = false;
  }

  checkSuccess();
}); //ボタンのdisabled制御

var checkSuccess = function checkSuccess() {
  if (userNameFlag && companyNameFlag && mailFlag && acceptFlag) {
    submitBtn.disabled = false;
  } else {
    submitBtn.disabled = true;
  }
}; // messageのセットとsmtpJS()実行


var sendForm = function sendForm(e) {
  e.preventDefault(); // messageに入力値をセット

  var message = {
    userName: userName.value,
    companyName: companyName.value,
    mail: mail.value
  };
  smtpJS(message);
}; // smtpJSでmessageを送信


var smtpJS = function smtpJS(message) {
  try {
    Email.send({
      SecureToken: secureToken,
      To: "".concat(mailLocalTo, "@").concat(mailDomainTo),
      From: "".concat(mailLocalFrom, "@").concat(mailDomainFrom),
      Subject: "".concat(message.mail),
      Body: "\uFF1C\u6C0F\u540D\uFF1E".concat(message.userName, "\uFF1C\uFF0F\u6C0F\u540D\uFF1E\uFF1C\u4F1A\u793E\u540D\uFF1E").concat(message.companyName, "\uFF1C\uFF0F\u4F1A\u793E\u540D\uFF1E")
    }).then(function () {
      // フォームの内容をリセット(空)にする
      document.contact.reset();
      submitBtn.disabled = true; // 全Flagをリセット

      userNameFlag = false;
      companyNameFlag = false;
      mailFlag = false;
      acceptFlag = false; // 送信ボタンをwrapするdivを参照

      var formSubmit = document.getElementById("js-top-form-submit"); // 完了後のメッセージ

      var completionTxtElement = document.createElement("p");
      completionTxtElement.classList.add("is-form-submit-completion");
      completionTxtElement.innerHTML = "\u9001\u4FE1\u5B8C\u4E86\u3057\u307E\u3057\u305F"; // 完了後のメッセージ追加

      formSubmit.appendChild(completionTxtElement); // 3秒後に完了後のメッセージ削除

      setTimeout(function () {
        formSubmit.removeChild(completionTxtElement);
      }, 3000);
    });
  } catch (e) {
    alert("エラーが発生しました。");
  }
}; // submitイベントを登録


contact.addEventListener("submit", sendForm);