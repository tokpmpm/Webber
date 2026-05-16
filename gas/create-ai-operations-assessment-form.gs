const AI_OPERATIONS_FORM_ID = '1jWimQn_JKfwnuMdS8phCTSp_vI7QzTegfLbc9E_lvvM';
const AI_OPERATIONS_NOTIFICATION_EMAIL = 'tokpmpm1@gmail.com';

/**
 * Creates a fresh Google Form for Webber Hsu's AI operations assessment.
 *
 * How to use:
 * 1. Open https://script.google.com/
 * 2. Create a new Apps Script project.
 * 3. Paste this file into Code.gs.
 * 4. Run createAiOperationsAssessmentForm().
 * 5. Check Executions/Logs for the edit URL, public URL, and embed URL.
 */
function createAiOperationsAssessmentForm() {
  const form = FormApp.create('Webber Hsu | AI 營運健檢問卷');
  buildAiOperationsAssessmentForm_(form);
  logFormUrls_(form);
}

/**
 * Installs the email notification trigger for the current assessment form.
 *
 * Run this once after creating or updating the form.
 */
function installAiOperationsFormSubmitTrigger() {
  const form = FormApp.openById(AI_OPERATIONS_FORM_ID);
  removeExistingSubmitTriggers_('handleAiOperationsFormSubmit_');

  ScriptApp.newTrigger('handleAiOperationsFormSubmit_')
    .forForm(form)
    .onFormSubmit()
    .create();

  Logger.log('Installed submit trigger for: ' + form.getEditUrl());
  Logger.log('Notification email: ' + AI_OPERATIONS_NOTIFICATION_EMAIL);
}

function handleAiOperationsFormSubmit_(event) {
  const response = event.response;
  const respondentEmail = response.getRespondentEmail();
  const answers = formatResponseAnswers_(response);
  const displayName = getAnswerByTitle_(response, '您的姓名 / 稱呼') || '您好';
  const submittedAt = Utilities.formatDate(
    response.getTimestamp(),
    Session.getScriptTimeZone(),
    'yyyy/MM/dd HH:mm'
  );

  if (respondentEmail) {
    MailApp.sendEmail({
      to: respondentEmail,
      subject: '已收到您的 AI 營運健檢問卷',
      name: 'Webber Hsu',
      htmlBody: buildRespondentEmailHtml_(displayName),
      body: [
        displayName + '，您好：',
        '',
        '已收到您的 AI 營運健檢問卷，謝謝您花時間填寫。',
        '我會先閱讀您的需求，判斷比較適合從「自動化流程」或「AI 搜尋能見度」切入。',
        '若需求合適，我會再與您聯繫安排 30 分鐘諮詢。',
        '',
        'Webber Hsu'
      ].join('\n')
    });
  }

  MailApp.sendEmail({
    to: AI_OPERATIONS_NOTIFICATION_EMAIL,
    subject: '新的 AI 營運健檢問卷填寫通知',
    name: 'AI 營運健檢問卷',
    htmlBody: buildOwnerEmailHtml_(submittedAt, respondentEmail, answers),
    body: [
      '新的 AI 營運健檢問卷已送出',
      '',
      '送出時間：' + submittedAt,
      '填表 Email：' + (respondentEmail || '未提供'),
      '',
      answers
    ].join('\n')
  });
}

/**
 * Rebuilds an existing Google Form by form ID.
 *
 * Use this only when you want to replace the current questions in an existing form.
 * The form ID is the long ID in the edit URL:
 * https://docs.google.com/forms/d/FORM_ID/edit
 */
function rebuildExistingAiOperationsAssessmentForm() {
  const formId = 'PASTE_EXISTING_FORM_ID_HERE';
  const form = FormApp.openById(formId);
  deleteAllItems_(form);
  buildAiOperationsAssessmentForm_(form);
  logFormUrls_(form);
}

function buildAiOperationsAssessmentForm_(form) {
  form.setTitle('Webber Hsu | AI 營運健檢問卷');
  form.setDescription(
    [
      '這份問卷會協助我在 30 分鐘諮詢前，先判斷您目前比較需要哪一種 AI 升級：',
      '1. 省下重複工時：客服、表單、對帳、跨系統資料流。',
      '2. 增加搜尋曝光：SEO、GEO、AEO、LLMO、AI 搜尋能見度。',
      '',
      '填寫時間約 3 分鐘。若需求適合，我會在會議中直接提供初步方向。'
    ].join('\n')
  );
  form.setCollectEmail(true);
  form.setAllowResponseEdits(true);
  form.setConfirmationMessage('已收到您的 AI 營運健檢需求。若需求合適，我會再與您聯繫安排 30 分鐘諮詢。');

  form.addTextItem()
    .setTitle('您的姓名 / 稱呼')
    .setRequired(true);

  form.addTextItem()
    .setTitle('公司 / 品牌名稱')
    .setRequired(false);

  form.addTextItem()
    .setTitle('您的網站或社群連結')
    .setHelpText('可填官方網站、Facebook、Instagram、LinkedIn、Notion、Google Maps 或其他主要曝光頁。')
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('您目前最想改善的是什麼？')
    .setHelpText('若不確定，請選「不確定，想先健檢」。')
    .setChoiceValues([
      '自動化重複工作，省下人力與時間',
      '智能客服 / LINE / 表單 / 接單流程',
      '網站 SEO / Google 搜尋曝光',
      'AI 搜尋能見度 / ChatGPT、Gemini、Perplexity 可見性',
      '不確定，想先健檢'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('目前最耗費您時間或最想優化的項目有哪些？')
    .setChoiceValues([
      '客服回覆與常見問題',
      '預約、報名、表單資料整理',
      '訂單、付款、對帳、發票或報表',
      'Google Sheets / Notion / CRM / LINE 等工具串接',
      '網站內容、服務頁、FAQ 或案例整理',
      'SEO 關鍵字、文章題目或內容規劃',
      '讓品牌更容易被 AI 搜尋正確介紹',
      '其他'
    ])
    .setRequired(true);

  form.addParagraphTextItem()
    .setTitle('請簡單描述目前卡住的狀況')
    .setHelpText('例如：每天要手動整理表單、網站有流量但沒詢問、客戶常問重複問題、文章不知道怎麼寫。')
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('如果是 AI 搜尋能見度 / SEO 需求，您目前的網站狀態是？')
    .setChoiceValues([
      '已經有網站，但內容很久沒更新',
      '已經有網站，也有寫文章或 FAQ',
      '有社群或平台頁，但還沒有正式網站',
      '正在準備新網站',
      '這題不適用，我主要想做自動化'
    ])
    .setRequired(true);

  form.addCheckboxItem()
    .setTitle('您希望 AI 搜尋能見度服務協助哪些交付項目？')
    .setChoiceValues([
      '網站 SEO / AI 可讀性健檢報告',
      '首頁或服務頁文案改寫',
      'FAQ 題庫與回答撰寫',
      '案例內容整理成「問題 / 做法 / 結果」',
      'Schema 結構化資料建議或部署',
      '30 天內容題庫與更新清單',
      '不確定，想先聽建議'
    ])
    .setRequired(false);

  form.addCheckboxItem()
    .setTitle('您目前主要使用哪些工具？')
    .setChoiceValues([
      'Google Sheets / Google Forms',
      'LINE 官方帳號',
      'Notion',
      'Wix / Squarespace / WordPress',
      'Shopify / 電商平台',
      'Make / Zapier / n8n',
      'CRM / ERP / 內部系統',
      '其他'
    ])
    .setRequired(false);

  form.addMultipleChoiceItem()
    .setTitle('您希望多久內看到第一版改善？')
    .setChoiceValues([
      '1 週內，先做最小可行版本',
      '2 到 4 週，完成一版完整優化',
      '1 到 3 個月，建立可持續流程',
      '不急，想先釐清方向'
    ])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle('您目前可投入的預算區間？')
    .setHelpText('這題是為了判斷適合一次性健檢、單頁優化，或完整導入。')
    .setChoiceValues([
      'NT$10,000 以下，想先小規模嘗試',
      'NT$10,000 - 30,000，想完成一版具體改善',
      'NT$30,000 - 80,000，想做完整導入',
      'NT$80,000 以上，想規劃長期合作',
      '還不確定，想先了解'
    ])
    .setRequired(false);

  form.addParagraphTextItem()
    .setTitle('還有什麼想補充的？')
    .setHelpText('可貼上您想改善的頁面、競品、參考網站，或描述您期待的成果。')
    .setRequired(false);
}

function deleteAllItems_(form) {
  const items = form.getItems();
  for (let i = items.length - 1; i >= 0; i--) {
    form.deleteItem(items[i]);
  }
}

function logFormUrls_(form) {
  const publishedUrl = form.getPublishedUrl();
  const embedUrl = publishedUrl + '?embedded=true';
  Logger.log('Edit URL: ' + form.getEditUrl());
  Logger.log('Public URL: ' + publishedUrl);
  Logger.log('Embed URL: ' + embedUrl);
}

function removeExistingSubmitTriggers_(handlerName) {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === handlerName) {
      ScriptApp.deleteTrigger(trigger);
    }
  });
}

function formatResponseAnswers_(response) {
  return response.getItemResponses().map(function(itemResponse) {
    const title = itemResponse.getItem().getTitle();
    const answer = itemResponse.getResponse();
    const formattedAnswer = Array.isArray(answer) ? answer.join(', ') : answer;
    return title + '\n' + (formattedAnswer || '未填寫');
  }).join('\n\n');
}

function getAnswerByTitle_(response, targetTitle) {
  const itemResponses = response.getItemResponses();
  for (let i = 0; i < itemResponses.length; i++) {
    if (itemResponses[i].getItem().getTitle() === targetTitle) {
      return itemResponses[i].getResponse();
    }
  }
  return '';
}

function buildRespondentEmailHtml_(displayName) {
  return [
    '<p>' + escapeHtml_(displayName) + '，您好：</p>',
    '<p>已收到您的 <strong>AI 營運健檢問卷</strong>，謝謝您花時間填寫。</p>',
    '<p>我會先閱讀您的需求，判斷比較適合從「自動化流程」或「AI 搜尋能見度」切入。若需求合適，我會再與您聯繫安排 30 分鐘諮詢。</p>',
    '<p>Webber Hsu</p>'
  ].join('');
}

function buildOwnerEmailHtml_(submittedAt, respondentEmail, answers) {
  return [
    '<p><strong>新的 AI 營運健檢問卷已送出</strong></p>',
    '<p>送出時間：' + escapeHtml_(submittedAt) + '<br>',
    '填表 Email：' + escapeHtml_(respondentEmail || '未提供') + '</p>',
    '<pre style="font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; white-space: pre-wrap; line-height: 1.5;">',
    escapeHtml_(answers),
    '</pre>'
  ].join('');
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
