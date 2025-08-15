# Syllahub

INIAD生のための非公式シラバス検索サイト

<https://syllahub.imoken27.workers.dev/>

## 概要

SyllahubはINIAD（東洋大学情報連携学部）の学生向けに作られた、非公式のシラバス検索・閲覧サイトです。東洋大学公式シラバスサイトからデータを自動収集し、使いやすいインターフェースで授業情報を検索・フィルタリングできます。

## 主な機能

- **高度な検索機能**: 学期や科目群や時間割形式での直感的な検索
- **リアルタイムフィルタリング**: 複数の条件を組み合わせた即座の検索結果表示
- **マイ時間割機能**: 自分で講義を選択し、時間割形式で管理
- **自動データ更新**: 毎日自動でシラバス情報を最新の状態に更新

## データ更新システム

本サイトでは、Cloudflare WorkersのCron Triggers機能を使用して、**毎日15:00 (UTC)** に自動でシラバス情報を更新しています。

- 東洋大学の公式シラバスサイトからHTMLを取得
- Cheerioを使ってデータをスクレイピング・パース
- Tursoデータベースに最新情報を保存
- フロントエンドでリアルタイムに反映

## 技術スタック

### フロントエンド

- **Next.js 14** - React フレームワーク
- **TypeScript** - 型安全性とコード品質の向上
- **Tailwind CSS** - ユーティリティファーストのCSSフレームワーク
- **Radix UI** - アクセシブルなコンポーネントライブラリ
- **Lucide React** - アイコンライブラリ

### バックエンド・API

- **Hono** - 軽量Webフレームワーク
- **Drizzle ORM** - TypeScript-first ORM
- **Turso (LibSQL)** - SQLiteベースの分散データベース

### インフラ・デプロイメント

- **Cloudflare Workers** - サーバーレスコンピューティング
- **OpenNext.js** - Next.jsのCloudflare Workers対応

### 開発ツール

- **ESLint** - コード品質の維持
- **Prettier** - コードフォーマッター
- **Lefthook** - pre-commit検査

## プロジェクト構成

```
syllahub/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # Reactコンポーネント
│   │   ├── layout/         # レイアウト関連
│   │   ├── model/          # ドメインモデル関連
│   │   │   ├── course/     # 講義関連コンポーネント
│   │   │   └── timetable/  # マイ時間割関連コンポーネント
│   │   └── ui/             # 汎用UIコンポーネント
│   ├── constants/          # 定数定義
│   ├── contexts/           # React Context（時間割管理など）
│   ├── drizzle/           # データベーススキーマ・マイグレーション
│   ├── hooks/             # カスタムフック
│   ├── lib/               # ユーティリティライブラリ
│   ├── services/          # ビジネスロジック
│   ├── types/             # TypeScript型定義
│   ├── utils/             # ヘルパー関数
│   └── workers/           # Cloudflare Workers cronジョブ
├── public/                # 静的ファイル
└── 設定ファイル類
```

## 開発環境のセットアップ

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/imoken777/syllahub.git
cd syllahub

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .dev.vars
```

### 環境変数

```bash
# .dev.vars
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token
NEXTJS_ENV=development
APP_ORIGIN_URL=http://localhost:3000
```

### 開発サーバーの起動

```bash
npm run dev
```

## デプロイ

```bash
# Cloudflare Workersにデプロイ
npm run deploy

# プレビュー環境での確認
npm run preview
```
