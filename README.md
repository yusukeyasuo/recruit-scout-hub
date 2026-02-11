# Recruit Scout Hub

エンジニア採用管理システム

## 🚀 クイックスタート（Docker Compose）

**最も簡単な方法**: Docker Composeを使用して、1コマンドで開発環境を起動できます。

```bash
# すべてのサービス（PostgreSQL + Next.jsアプリ）を起動
docker compose up

# バックグラウンドで起動する場合
docker compose up -d

# ログを確認
docker compose logs -f app
```

アプリケーションは http://localhost:3000 で起動します。

初回起動時に自動的に以下が実行されます：
- データベースマイグレーション
- 初期ユーザー作成（admin@example.com / password123）

### 停止と再起動

```bash
# 停止
docker compose down

# 停止してデータも削除
docker compose down -v

# 再起動
docker compose restart
```

## 💻 ローカル開発（従来の方法）

Docker Composeを使わず、ローカル環境で開発する場合：

### 1. PostgreSQLを起動

```bash
# Dockerでデータベースのみ起動
docker run --name recruit-scout-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=recruit_scout_hub \
  -p 5432:5432 -d postgres:16
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env`ファイルを作成（`.env.example`を参考）：

```bash
cp .env.example .env
```

### 4. データベースマイグレーション

```bash
npx prisma migrate dev
```

### 5. 初期ユーザーを作成

```bash
npx prisma db seed
```

### 6. 開発サーバーを起動

```bash
npm run dev
```

アプリケーションは http://localhost:3000 で起動します。

## 🔐 ログイン

初期ユーザーでログインできます：

- **Email**: admin@example.com
- **Password**: password123

## 🧪 テスト

```bash
# すべてのテストを実行
npm test

# ユニットテスト
npm run test:unit

# 統合テスト
npm run test:integration

# E2Eテスト
npm run test:e2e
```

## 📦 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript 5.7
- **認証**: NextAuth.js v5
- **データベース**: PostgreSQL 16 + Prisma 5.x
- **スタイリング**: Tailwind CSS
- **フォーム**: React Hook Form + Zod
- **テスト**: Vitest + Playwright

## 📁 プロジェクト構造

```
recruit-scout-hub/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証ページ（ログイン、招待）
│   ├── (dashboard)/       # 保護されたページ
│   └── api/               # APIルート
├── components/            # Reactコンポーネント
│   ├── auth/             # 認証関連コンポーネント
│   └── ui/               # 再利用可能なUIコンポーネント
├── lib/                   # 共有ユーティリティ
│   ├── actions/          # Server Actions
│   ├── validations/      # Zodスキーマ
│   ├── auth.ts           # NextAuth.js設定
│   └── prisma.ts         # Prismaクライアント
├── prisma/               # データベース
│   ├── schema.prisma     # スキーマ定義
│   ├── migrations/       # マイグレーション
│   └── seed.ts           # 初期データ
└── tests/                # テスト
    ├── unit/             # ユニットテスト
    ├── integration/      # 統合テスト
    └── e2e/              # E2Eテスト
```

## 🔧 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# Lint
npm run lint

# Prisma Studio（データベースGUI）
npx prisma studio
```

## 📚 ドキュメント

詳細な仕様とタスクは `specs/000-authentication/` を参照してください。

- [spec.md](./specs/000-authentication/spec.md) - 機能仕様
- [plan.md](./specs/000-authentication/plan.md) - 実装計画
- [tasks.md](./specs/000-authentication/tasks.md) - タスク一覧

## 🤝 コントリビューション

このプロジェクトはspec-kitを使用して仕様駆動開発を実践しています。

## 📄 ライセンス

Private
