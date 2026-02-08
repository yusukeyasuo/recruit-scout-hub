# Implementation Plan: 認証機能

**Branch**: `000-authentication` | **Date**: 2026-02-08 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/000-authentication/spec.md`

## Summary

Recruit Scout Hubの認証機能を実装する。NextAuth.js v5を使用してメール/パスワード認証を実現し、JWTベースのセッション管理（7日間有効）を提供する。招待制により既存ユーザーが新規ユーザーを追加できる。すべてのページとAPIを保護し、未認証ユーザーのアクセスをブロックする。

技術アプローチ：NextAuth.js v5 (Auth.js) + Prisma + PostgreSQL + bcryptによる堅牢な認証システム。Credentials Providerでメール/パスワード認証を実装し、JWTトークンでセッションを管理。招待リンクは暗号学的に安全なランダムトークンを生成し、7日間の有効期限と1回のみ使用制限を設ける。

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 20.x
**Primary Framework**: Next.js 15 (App Router)
**Authentication**: NextAuth.js v5 (Auth.js)
**Database**: PostgreSQL 16+
**ORM**: Prisma 5.x
**Password Hashing**: bcrypt (salt rounds: 12)
**Session Management**: JWT (7 days expiration)
**Token Generation**: crypto.randomBytes (32 bytes)
**Testing**: Vitest (unit tests), Playwright (E2E tests), Testing Library (React component tests)
**Target Platform**: Web (モダンブラウザ: Chrome, Firefox, Safari, Edge)
**Project Type**: Web (Next.js fullstack application)
**Performance Goals**:
- ログイン処理: 10秒以内
- パスワードハッシュ化: 0.5秒以内
- セッション検証: 50ms以内
**Constraints**:
- パスワードは必ずbcryptでハッシュ化してから保存（平文保存厳禁）
- セッションクッキーにHttpOnly、Secure、SameSite=Lax属性を設定（XSS、CSRF対策）
- 招待トークンは推測不可能な十分なランダム性を持つ（crypto.randomBytes使用）
- メールアドレスは大文字・小文字を正規化（小文字で統一）
**Scale/Scope**:
- 想定ユーザー数: 初期1名、最大10名程度
- 単一組織利用（個人またはチーム）
- 4つの主要画面（ログイン、ログアウト、招待作成、招待登録）

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. AIの透明性と説明可能性（必須）
**Status**: ✅ N/A
**Rationale**: この機能はAIを使用しない。認証はロジックベースの実装。

### II. テスト駆動開発（必須）
**Status**: ✅ PASS
**Plan**:
- Phase 2でテストを先に作成（Vitest + Testing Library + Playwright）
- テストカバレッジ: ログイン/ログアウト、セッション管理、招待フロー、保護されたルート
- セキュリティテスト: パスワードハッシュ化、XSS/CSRF対策、SQLインジェクション防御

### III. 機能のモジュール性と独立性
**Status**: ✅ PASS
**Plan**:
- 認証機能は独立したモジュールとして実装
- NextAuth.js設定を`lib/auth.ts`に集約
- Prismaスキーマで`User`と`Invitation`モデルを定義
- 他機能は認証APIを通じてのみユーザー情報にアクセス

### IV. シンプルさとユーザー体験
**Status**: ✅ PASS
**Plan**:
- シンプルなログインフォーム（メール、パスワードのみ）
- 招待リンクをコピー&ペーストで簡単に共有
- セッション7日間で頻繁な再ログイン不要
- エラーメッセージは明確で実用的

### V. データプライバシーとセキュリティ
**Status**: ✅ PASS
**Plan**:
- パスワードbcryptハッシュ化（salt rounds: 12）
- セッションJWT暗号化（NextAuth.js標準）
- HttpOnly、Secure、SameSite=Lax属性でクッキー保護
- 招待トークンはcrypto.randomBytesで生成（推測不可能）
- メールアドレス正規化（小文字統一）

## Project Structure

### Documentation (this feature)

```
specs/000-authentication/
├── spec.md              # 機能仕様書
├── plan.md              # このファイル（実装計画）
├── research.md          # Phase 0 output（技術調査）
├── data-model.md        # Phase 1 output（データモデル）
├── quickstart.md        # Phase 1 output（開発者向けクイックスタート）
├── contracts/           # Phase 1 output（API契約）
│   └── api.md          # 認証API仕様
└── tasks.md             # Phase 2 output（タスク分解）
```

### Source Code (repository root)

```
recruit-scout-hub/
├── app/
│   ├── (auth)/                   # 認証関連ページ（グループルート）
│   │   ├── login/
│   │   │   └── page.tsx         # ログインページ
│   │   ├── invite/
│   │   │   └── [token]/
│   │   │       └── page.tsx     # 招待リンクからの登録ページ
│   │   └── layout.tsx           # 認証ページ共通レイアウト
│   ├── (dashboard)/              # 保護されたメインアプリケーション
│   │   ├── invite-user/
│   │   │   └── page.tsx         # ユーザー招待ページ
│   │   └── layout.tsx           # ダッシュボードレイアウト（認証チェック）
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts     # NextAuth.js APIルート
│   └── layout.tsx               # ルートレイアウト（SessionProvider）
├── components/
│   ├── ui/                      # shadcn/uiコンポーネント
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── card.tsx
│   │   └── form.tsx
│   └── auth/                    # 認証機能別コンポーネント
│       ├── login-form.tsx       # ログインフォーム
│       ├── invite-form.tsx      # 招待フォーム
│       ├── register-form.tsx    # 招待からの登録フォーム
│       ├── logout-button.tsx    # ログアウトボタン
│       └── auth-provider.tsx    # NextAuth SessionProvider wrapper
├── lib/
│   ├── auth.ts                  # NextAuth.js設定（authOptions）
│   ├── auth-utils.ts            # 認証ヘルパー関数
│   ├── prisma.ts                # Prismaクライアント
│   ├── validations/
│   │   └── auth.ts              # 認証バリデーションスキーマ（Zod）
│   └── actions/
│       ├── auth.ts              # 認証Server Actions
│       └── invitations.ts       # 招待Server Actions
├── middleware.ts                # Next.js middleware（保護されたルートのチェック）
├── prisma/
│   ├── schema.prisma            # データベーススキーマ（User, Invitation）
│   ├── seed.ts                  # 初期ユーザー作成スクリプト
│   └── migrations/              # マイグレーションファイル
├── tests/
│   ├── unit/
│   │   └── auth/
│   │       ├── password-hash.test.ts
│   │       └── validations.test.ts
│   ├── integration/
│   │   └── auth/
│   │       ├── login.test.ts
│   │       └── invitations.test.ts
│   └── e2e/
│       └── auth/
│           ├── login.spec.ts
│           ├── logout.spec.ts
│           ├── protected-routes.spec.ts
│           └── invite-flow.spec.ts
└── .env.example                 # 環境変数テンプレート
```

**Structure Decision**: Next.js App Routerのルートグループ機能を活用し、`(auth)`グループで認証関連ページ、`(dashboard)`グループで保護されたページを整理。middlewareで全ての保護されたルートを一元管理。NextAuth.js設定を`lib/auth.ts`に集約し、他のコードから独立させる。

## Complexity Tracking

**Status**: No violations - No justification required

## Phase 0: Research & Technical Decisions

### 0.1 NextAuth.js v5 (Auth.js) の採用

**Decision**: NextAuth.js v5 (新名称: Auth.js) を使用

**Rationale**:
- Next.js 15 App Router完全対応
- Credentials Provider でメール/パスワード認証を実装可能
- JWTベースのセッション管理（データベースセッション不要で軽量）
- セキュリティベストプラクティスが組み込み済み（CSRF対策、Secure Cookie等）
- 将来的にOAuth追加が容易（Google、GitHubなど）

**Alternatives Considered**:
- Clerk: SaaS認証サービスだが外部依存が増える、有料プランが必要になる可能性
- Lucia: 軽量だが手動実装が多い、NextAuth.jsより実績が少ない
- 自前実装: 完全な制御が可能だがセキュリティリスクが高い

### 0.2 パスワードハッシュ化アルゴリズム

**Decision**: bcrypt (salt rounds: 12)

**Rationale**:
- 業界標準のパスワードハッシュ化アルゴリズム
- 計算コストを調整可能（salt rounds）でブルートフォース攻撃に強い
- Node.js用ライブラリ（bcryptjs）が安定している
- NextAuth.jsのドキュメントでも推奨

**Alternatives Considered**:
- argon2: より新しく高セキュリティだがNode.jsでの実装が複雑
- scrypt: Node.js組み込みだがbcryptより実績が少ない

**Implementation**:
```typescript
import bcrypt from 'bcryptjs';

// パスワードのハッシュ化
const hashedPassword = await bcrypt.hash(password, 12);

// パスワードの検証
const isValid = await bcrypt.compare(password, hashedPassword);
```

### 0.3 招待トークンの生成

**Decision**: crypto.randomBytes(32) → base64url エンコード

**Rationale**:
- Node.jsの組み込みcryptoモジュールで暗号学的に安全な乱数生成
- 32バイト = 256ビットの十分なエントロピー
- base64urlエンコードでURL安全な文字列に変換

**Implementation**:
```typescript
import crypto from 'crypto';

// 招待トークン生成
const token = crypto.randomBytes(32).toString('base64url');
// 例: "kF3jK9mN2pQ8rT5wXyZ1aB7cD4eF6gH"
```

### 0.4 セッション管理戦略

**Decision**: JWT（JSON Web Token）、有効期限7日間

**Rationale**:
- データベースへのセッション問い合わせ不要（パフォーマンス向上）
- ステートレス認証（スケーラビリティ）
- NextAuth.js標準サポート
- 個人利用のため複雑なセッション管理不要

**Configuration**:
```typescript
session: {
  strategy: 'jwt',
  maxAge: 7 * 24 * 60 * 60, // 7日間（秒単位）
}
```

### 0.5 保護されたルートの実装方法

**Decision**: Next.js middleware + NextAuth.js

**Rationale**:
- middleware で全てのリクエストをインターセプト（一元管理）
- 認証チェックが必要なパスを正規表現でマッチング
- 未認証ユーザーを自動的にログインページにリダイレクト
- サーバーサイドで実行されるためクライアント側での回避不可能

**Implementation**:
```typescript
// middleware.ts
export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/(dashboard)/:path*',  // dashboardグループの全ページ
    '/api/job-descriptions/:path*',  // 保護されたAPI
  ],
};
```

## Phase 1: Design & Contracts

### Data Model

詳細は`data-model.md`参照。主要エンティティ：

**User（ユーザー）**:
- `id`: UUID (Primary Key)
- `email`: String (ユニーク、小文字正規化)
- `password`: String (bcryptハッシュ)
- `name`: String (ユーザー名)
- `createdAt`: DateTime (自動)
- `updatedAt`: DateTime (自動)

**Invitation（招待）**:
- `id`: UUID (Primary Key)
- `email`: String (招待されたメールアドレス)
- `token`: String (ユニーク、ランダム生成)
- `invitedById`: UUID (外部キー → User)
- `used`: Boolean (デフォルト: false)
- `expiresAt`: DateTime (作成日時 + 7日)
- `createdAt`: DateTime (自動)

**Relation**:
- User 1 → N Invitation (invitedBy)

### API Contracts

詳細は`contracts/api.md`参照。主要なAPI:

**NextAuth.js API** (`/api/auth/*`):
- `POST /api/auth/callback/credentials`: ログイン
- `GET /api/auth/signout`: ログアウト
- `GET /api/auth/session`: セッション取得

**Server Actions** (`lib/actions/`):
- `signIn(email, password)`: ログイン処理
- `signOut()`: ログアウト処理
- `createInvitation(email)`: 招待リンク作成
- `registerFromInvitation(token, name, password)`: 招待からユーザー登録
- `validateInvitationToken(token)`: 招待トークン検証

### Development Quickstart

詳細は`quickstart.md`参照。開発者が最初に実行するステップ：

1. 環境変数設定: `.env`に`NEXTAUTH_SECRET`と`NEXTAUTH_URL`を追加
2. Prismaマイグレーション: `npx prisma migrate dev`
3. 初期ユーザー作成: `npx prisma db seed`（admin@example.com / password123）
4. 開発サーバー起動: `npm run dev`
5. ログイン画面アクセス: `http://localhost:3000/login`

## Next Steps

- **Phase 2**: `/speckit.tasks`コマンドでタスク分解
- **Phase 3**: `/speckit.implement`コマンドで実装開始（TDD）

## Notes

- 初期ユーザーはPrisma seedスクリプトで作成（メール: admin@example.com）
- パスワードリセット機能はMVP後の拡張として後回し
- 2FA（多要素認証）もMVP後の拡張として後回し
- 招待メール送信機能は実装せず、招待リンクを手動でコピー&ペースト
- OAuth（Google、GitHubログイン）は将来的な拡張として設計を考慮
