# 岡山大学剣道部 鍵管理システム

岡山大学剣道部における**道場および部室の鍵管理を効率化するためのWebアプリケーション**です。  
従来の紙台帳による管理を廃止し、部員がスマートフォンから簡単に  
**鍵の貸出・返却を行い、現在の鍵の状態をリアルタイムで確認**できます。

---

## 公開URL

https://tsushimakendo-key-management.web.app/

---

## 関連ドキュメント

本プロジェクトは、要求定義から設計までを行った上で実装しています。

- [要求定義書](RequirementSpecification/Documents/requirements.md)
- [ユースケース図](RequirementSpecification/Documents/images/KendoClub_KeyManagementWebApp_UML.jpg)
- [設計書](RequirementSpecification/Documents/design.md)
- [DFD（データフロー図）](RequirementSpecification/Documents/DFD.md)
- [ER図](RequirementSpecification/Documents/ER.md)

---

## 主な機能

- **リアルタイムダッシュボード**  
  現在の「貸出中」「保管中」の鍵の本数を即座に確認可能。

- **鍵の貸出・返却機能**  
  利用者と鍵を紐付けて操作履歴を記録し、誤操作を防止。

- **利用履歴の管理・出力**  
  鍵の貸出履歴を一覧表示し、CSV / Excel形式での出力が可能。

- **管理者認証**  
  Firebase Authentication を用いた管理者ログインにより、  
  履歴画面などの管理機能を保護。

- **レスポンシブデザイン**  
  スマートフォンでの利用を前提としたUI設計。

---

## 使用技術

- **Frontend**: React (Create React App)
- **Backend / Database**: Firebase  
  - Cloud Firestore  
  - Firebase Authentication
- **Hosting**: Firebase Hosting
- **Others**:
  - xlsx（Excel出力）
  - React Router

---

## ディレクトリ構造

```

.
├─ RequirementSpecification/   # 要求定義書・設計書等
├─ src/
│  ├─ components/              # Reactコンポーネント
│  ├─ firebase/                # Firebase初期化設定
│  └─ styles/                  # 共通CSS
├─ build/                      # 本番ビルド成果物
└─ README.md

```

---

## 開発環境のセットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/YourName/kendoclub-key-management-webapp.git
cd kendoclub-key-management-webapp
````

### 2. 依存関係のインストール

初回のみ実行してください。

```bash
npm install
```

### 3. 開発サーバの起動

```bash
npm start
```

起動後、ブラウザで以下にアクセスします。

```
http://localhost:3000
```

---

## ビルドとデプロイ

```bash
npm run build
firebase deploy
```

---

## 開発フロー（Pull Request）

### 1. 最新の main ブランチを取得

```bash
git checkout main
git pull origin main
```

### 2. 作業用ブランチを作成

```bash
git checkout -b yourname/feature-name
```

### 3. 変更をコミット

```bash
git add .
git commit -m "変更内容の要約"
```

### 4. プッシュ & プルリクエスト作成

```bash
git push origin yourname/feature-name
```

GitHub上で Pull Request を作成してください。
