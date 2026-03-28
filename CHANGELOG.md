# 更新紀錄 (CHANGELOG)

## [2026-03-27] - 品牌定位與 SEO 升級

- **問題現狀 (Current Status)**:
  網站原本定位僅針對「一人公司」，限制了客群擴展至「中小企業 (SME)」的潛力，且文案過於強調個人勞動力，而非企業系統增長。

- **根本原因 (Root Cause)**:
  Hero Section 與 SEO Meta Tags 缺乏針對「企業決策者」的關鍵字，且 FAQ 內容未涵蓋團隊規模的自動化需求。

- **修正方案 (Solution)**:
  1. **全站文案更新**: 將「一人公司」擴展至「中小企業與一人公司」。
  2. **SEO 優化**: 更新 `<title>`、`<meta description>` 與 `keywords`。
  3. **Schema 升級**: 在 JSON-LD 中加入針對中小企業的 FAQ 與服務描述。
  4. **Hero Section 重建**: 將痛點從「個人勞累」轉向「企業雜事妨礙增長」。

- **驗證結果 (Verification)**:
  - 已完成本地 `grep` 檢查，確保所有關鍵字正確包含。
  - 已通過 GitHub 推送驗證。
