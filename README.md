# 岡山大学剣道部　鍵管理システム

岡山大学剣道部の道場および部室の鍵の状態をリアルタイムで管理するためのウェブアプリケーションです。
部員がスマートフォンから簡単に「貸出」と「返却」を行え、現在の鍵の所在を一目で確認できます。

## 公開URL
[https://tsushimakendo-key-management.web.app/](https://tsushimakendo-key-management.web.app/)

## 主な機能
- **リアルタイムダッシュボード**: 貸出中・保管中の本数をリアルタイムで表示。
- **鍵の貸出・返却機能**: 誰がどの鍵を操作したかをFirestoreに記録。
- **レスポンシブデザイン**: スマートフォンでの操作を最適化したUI。

## 🛠 使用技術
- **Frontend**: React (Create React App)
- **Backend/Database**: Firebase (Cloud Firestore)
- **Hosting**: Firebase Hosting

## ディレクトリ構造
- `src/components`: Reactコンポーネント（TopPage.jsx, BorrowKeyPage.jsx等）
- `src/firebase`: Firebaseの初期化設定
- `src/styles`: CSS
- `build/`: デプロイ用の最適化済みファイル（npm run build で生成）

## 🛠 開発とデプロイの手順

### ローカル開発環境の起動
```bash
npm install
npm start