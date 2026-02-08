# 技術スタック

**決定日**: 2026-02-08

## 概要

Recruit Scout Hubは、Next.jsベースのフルスタックWebアプリケーションとして開発します。個人利用を主目的としつつ、将来的なチーム利用も視野に入れた拡張性のある構成です。

## フロントエンド

### コアフレームワーク
- **Next.js 15** (App Router)
  - React Server Components使用
  - Server Actions活用
  - ファイルベースルーティング
- **TypeScript**
  - 型安全性の確保
  - 開発体験の向上

### UIライブラリ
- **shadcn/ui**
  - カスタマイズ可能なコンポーネント
  - コピー&ペーストで使用（依存関係最小化）
  - アクセシビリティ対応
- **Tailwind CSS**
  - ユーティリティファーストCSS
  - レスポンシブデザイン
  - カスタムデザインシステム構築可能

### 状態管理
- React Server Components + Server Actionsを優先
- クライアント側の複雑な状態管理が必要な場合はZustandまたはReact Context検討

## バックエンド

### APIレイヤー
- **Next.js App Router**
  - API Routes (app/api/*)
  - Server Actions (直接サーバー関数呼び出し)
  - Route Handlers

### データベース
- **PostgreSQL**
  - リレーショナルデータベース
  - ACID準拠
  - 拡張性と信頼性

### ORM
- **Prisma**
  - TypeScriptファーストORM
  - 型安全なデータベースアクセス
  - マイグレーション管理
  - Prisma Studio（データベースGUI）

## 認証

- **NextAuth.js (Auth.js) v5**
  - Next.js App Router対応
  - メール/パスワード認証
  - 将来的にGoogle/GitHubなどのOAuth対応可能
  - JWTベースのセッション管理

## AI/LLM統合

- **Claude API (Anthropic)**
  - 候補者-ポジションマッチング分析
  - マッチング理由の生成（透明性重視）
  - @anthropic-ai/sdk使用
  - APIキーは環境変数で管理

## 開発ツール

### パッケージ管理
- **npm** または **pnpm**（高速・効率的）

### コード品質
- **ESLint** - コード品質チェック
- **Prettier** - コードフォーマッター
- **TypeScript** - 型チェック

### テスティング
- **Vitest** - ユニットテスト（高速、Viteベース）
- **Playwright** - E2Eテスト
- **Testing Library** - Reactコンポーネントテスト

### バージョン管理
- **Git**
- **GitHub** (リポジトリホスティング)

## デプロイメント

### ホスティング（推奨）
- **Vercel**
  - Next.js開発元による最適化
  - 自動デプロイ（GitHubプッシュ時）
  - エッジネットワーク
  - 無料枠で個人利用可能

### データベースホスティング
- **Vercel Postgres** - Vercel統合
- **Supabase** - PostgreSQL + 追加機能
- **Neon** - サーバーレスPostgreSQL

### 環境変数管理
- `.env.local` - ローカル開発
- Vercel Environment Variables - 本番環境

## ディレクトリ構造（想定）

```
recruit-scout-hub/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   ├── (dashboard)/       # メインアプリケーション
│   ├── api/               # API Routes
│   └── layout.tsx         # ルートレイアウト
├── components/            # Reactコンポーネント
│   ├── ui/               # shadcn/uiコンポーネント
│   └── features/         # 機能別コンポーネント
├── lib/                   # ユーティリティ・ヘルパー
│   ├── prisma.ts         # Prismaクライアント
│   ├── auth.ts           # NextAuth設定
│   └── claude.ts         # Claude API統合
├── prisma/                # Prismaスキーマ・マイグレーション
│   ├── schema.prisma
│   └── migrations/
├── public/                # 静的ファイル
├── tests/                 # テストファイル
└── .specify/             # spec-kit仕様・計画
```

## セキュリティ考慮事項

- 環境変数で機密情報管理（API キー、DB接続文字列）
- `.env*.local`を`.gitignore`に追加
- NextAuth.jsでCSRF保護
- PrismaでSQLインジェクション防止
- 入力バリデーション（Zod使用検討）

## パフォーマンス最適化

- React Server Componentsで初期ロード高速化
- 画像最適化（next/image）
- コード分割（動的インポート）
- データベースインデックス最適化（Prisma）
- Claude API呼び出しのキャッシング検討

## 拡張性

本スタックは以下の将来的な拡張に対応可能：
- マルチユーザー対応（既に認証あり）
- リアルタイム通知（Pusher, Ably等追加）
- ファイルアップロード（履歴書PDF等、S3/Vercel Blob）
- メール送信（Resend, SendGrid等）
- 分析・ダッシュボード（Chart.js, Recharts等）
