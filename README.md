# TRPG 名片 · 睿諳 Eric

靜態 GitHub Pages 網站：GM 自介 + 可帶系統／劇本瀏覽。

## 檔案結構

```
TRPG-card/
├── index.html         首頁（關於、風格、設定原則、可帶系統 teaser、連結）
├── scenarios.html     可帶系統／劇本子頁面（含篩選器）
├── scenarios.json     ★ 劇本資料來源（唯一事實）
├── style.css          全站樣式
├── script.js          互動邏輯（漢堡選單、篩選、捲動顯現、Discord 深連結）
├── background.png     hero 背景
├── icon.png           頭像（圓框）
├── gm_portrait.png    Q 版立繪（nav 左側）
└── README.md          本檔
```

## 新增／修改劇本

**所有劇本都由 [`scenarios.json`](scenarios.json) 載入**。新增條目時只要在該陣列尾端（或希望顯示的位置）加入一個物件，重新整理頁面即可，不用動 HTML / JS。

### JSON 欄位規範

```jsonc
{
  "title": "必填：劇本／系統名稱",
  "system": "必填：DND 5e | PbtA | BRP | COJ | 其他",
  "systemLabel": "選填：顯示文字（預設 = system）",
  "r18": false,                  // 選填：預設 false
  "active": false,               // 選填：高亮顯示（主打團）
  "link": "https://...",         // 選填：整張卡變超連結
  "meta": ["行1", "行2"],        // 選填：meta 標籤行
  "desc": "描述文字",
  "badge": "R-18 · 含敏感題材",   // 選填：紅色徽章文字
  "warn": "警語內容（自動加上 ⚠ 嚴正提醒：前綴）",
  "status": "可開團",             // 選填：預設「可開團」
  "placeholder": false           // 選填：設為 true 表示是佔位卡
}
```

### 欄位詳解

| 欄位 | 型別 | 必填 | 說明 |
|---|---|---|---|
| `title` | string | ✅ | 卡片主標題（劇本或系統名稱） |
| `system` | string | ✅ | 用於篩選器分類，必須是 `DND 5e` / `PbtA` / `BRP` / `COJ` / `其他` 其中一個 |
| `systemLabel` | string | ⬜ | 卡片左側顯示的系統文字。省略時採用 `system` 原值。用於顯示更精確的系統變體（例如 `DND AL`） |
| `r18` | boolean | ⬜ | 標為 R-18 題材；預設 `false`。為 `true` 時卡片會套用警示邊框，並受篩選器中「顯示 R-18 / 敏感題材」開關控制 |
| `active` | boolean | ⬜ | 主打／進行中團務。為 `true` 時卡片會額外高亮（目前視覺上同一般卡片，保留做後續樣式擴充） |
| `link` | string URL | ⬜ | 有值時整張卡片會變成 `<a>`，點擊新分頁開啟。無值則為純顯示卡 |
| `meta` | string[] | ⬜ | 卡片上方的灰色 meta 行，每個元素獨立一個 `<span>`，用於顯示「團型 · 人數 · 時長」或「類型」等資訊 |
| `desc` | string | ⬜ | 主描述段落 |
| `badge` | string | ⬜ | 標題旁的小徽章（紅橘色）。通常搭配 `r18: true` 使用，例如 `R-18 · 含敏感題材` / `R-18 · 成人向` |
| `warn` | string | ⬜ | 警語段落（紅橘色框）。系統會自動加上 `⚠ 嚴正提醒：` 前綴 |
| `status` | string | ⬜ | 右側狀態文字；預設 `可開團`。placeholder 預設 `預留` |
| `placeholder` | boolean | ⬜ | 設為 `true` 時輸出佔位卡樣式（虛線框、灰化），會永遠顯示，不受篩選器影響 |

### 範例

**一般劇本**
```json
{
  "title": "施特拉德的詛咒",
  "system": "DND 5e",
  "active": true,
  "meta": ["長團 · 預計語音 10–15 次", "類型：哥德恐怖 / 戲劇向"],
  "desc": "DND5E 官方劇本…"
}
```

**帶外部連結的劇本**
```json
{
  "title": "終北大陸希伯利爾",
  "system": "DND 5e",
  "link": "https://hackmd.io/@ericwang01129/ByFCtxE6Wl",
  "meta": ["長戰役 · 全 8 章"],
  "desc": "…"
}
```

**R-18 劇本**
```json
{
  "title": "膿墮",
  "system": "COJ",
  "r18": true,
  "badge": "R-18 · 含敏感題材",
  "meta": ["現代 / 封閉村莊"],
  "desc": "每十年一次的學級會…",
  "warn": "本劇本含有大量…請確認自身可接受後再決定是否入團。"
}
```

**佔位卡（陣列末尾用）**
```json
{
  "placeholder": true,
  "systemLabel": "更多系統",
  "title": "更多劇本籌備中",
  "meta": ["本區將持續擴充"],
  "desc": "未來將陸續開放更多系統／模組。",
  "status": "預留"
}
```

## 本機預覽

由於 `scenarios.json` 透過 `fetch()` 載入，用 `file://` 直接打開 HTML 多數瀏覽器會擋 CORS。請改用本地 HTTP server：

```bash
# 在 TRPG-card/ 目錄下
python -m http.server 8000
# 或 VS Code 裝 Live Server 擴充，右鍵 index.html → Open with Live Server
```

瀏覽 <http://localhost:8000/> 即可。

## 部署

Push 到 `main`，GitHub Pages 自動發佈到 <https://ericwang01129.github.io/TRPG-card/>。

## 篩選器分類原則

`run-item__system` 目前限定五種標籤，非列出者一律歸入「其他」：

- **DND 5e** — 5 版 D&D（含 AL 模組可透過 `systemLabel` 標註為 `DND AL`）
- **PbtA** — Powered by the Apocalypse 系
- **BRP** — Basic Role-Playing 系
- **COJ** — 日系 CoC 分支
- **其他** — 其他一切系統（銀劍、DX3、Lancer、夕燒小燒、人與辦公室、死靈年代記、絕對隸奴 等）

R-18 / 敏感題材卡片預設隱藏，需在篩選列打開開關才會顯示。
