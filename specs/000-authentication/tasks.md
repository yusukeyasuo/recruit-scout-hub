# Tasks: 認証機能

**入力**: `/specs/000-authentication/`の設計ドキュメント
**前提条件**: plan.md（必須）、spec.md（ユーザーストーリーに必須）

**テスト**: plan.mdで指定されたTDDアプローチに従い、テストをこの計画に含めています

**構成**: タスクはユーザーストーリーごとにグループ化され、各ストーリーの独立した実装とテストを可能にします。

## フォーマット: `[ID] [P?] [Story] 説明`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: このタスクが属するユーザーストーリー（例: US1, US2, US3）
- 説明には正確なファイルパスを含める

## パス規則

このプロジェクトはNext.js 15 App Router構造を使用:
- `app/` - Next.jsページとルート
- `components/` - Reactコンポーネント
- `lib/` - 共有ユーティリティと設定
- `prisma/` - データベーススキーマとマイグレーション
- `tests/` - テストファイル（unit, integration, e2e）

## Phase 1: セットアップ（共有インフラ）

**目的**: プロジェクトの初期化と基本構造の構築

- [ ] T001 実装計画に従ってプロジェクト構造を作成 (app/, components/, lib/, prisma/, tests/)
- [ ] T002 Next.js 15、TypeScript、およびコア依存関係をインストール (next, react, react-dom, typescript)
- [ ] T003 [P] NextAuth.js v5と関連依存関係をインストール (next-auth@beta)
- [ ] T004 [P] Prisma 5.xとPostgreSQLクライアントをインストール (@prisma/client, prisma)
- [ ] T005 [P] パスワードハッシュ化用のbcryptjsをインストール (bcryptjs, @types/bcryptjs)
- [ ] T006 [P] バリデーション用のZodをインストール (zod)
- [ ] T007 [P] shadcn/uiコンポーネントをインストール (button, input, label, card, form)
- [ ] T008 [P] テスト依存関係をインストール (vitest, @testing-library/react, @playwright/test)
- [ ] T009 [P] plan.mdに従ってTypeScriptを設定 (tsconfig.json)
- [ ] T010 [P] ESLintとPrettierの設定をセットアップ
- [ ] T011 必要な環境変数を含む.env.exampleを作成 (NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL)
- [ ] T012 .env、node_modules、.nextなどを除外する.gitignoreをセットアップ

---

## Phase 2: 基盤構築（ブロッキング前提条件）

**目的**: すべてのユーザーストーリーを実装する前に完了しなければならないコアインフラ

**⚠️ 重要**: このフェーズが完了するまで、ユーザーストーリーの作業を開始できません

- [ ] T013 prisma/schema.prismaにUserモデルを含むPrismaスキーマを作成 (id, email, password, name, createdAt, updatedAt)
- [ ] T014 prisma/schema.prismaにInvitationモデルを追加 (id, email, token, invitedById, used, expiresAt, createdAt)
- [ ] T015 prisma/schema.prismaにUser-Invitationリレーション(1:N)を追加
- [ ] T016 初期Prismaマイグレーションを作成 (npx prisma migrate dev --name init)
- [ ] T017 lib/prisma.tsにPrismaクライアントシングルトンを作成
- [ ] T018 lib/auth.tsにNextAuth.js設定を作成 (Credentials Provider、JWTストラテジー、bcryptパスワード検証を含むauthOptions)
- [ ] T019 app/api/auth/[...nextauth]/route.tsにNextAuth.js APIルートを作成
- [ ] T020 lib/auth-utils.tsに認証ユーティリティを作成 (getServerSession, requireAuth)
- [ ] T021 lib/validations/auth.tsにZodを使用したバリデーションスキーマを作成 (loginSchema, registerSchema, inviteSchema)
- [ ] T022 prisma/seed.tsにPrisma seedスクリプトを作成 (初期管理ユーザー: admin@example.com / password123)
- [ ] T023 components/auth/auth-provider.tsxにSessionProviderラッパーコンポーネントを作成
- [ ] T024 app/layout.tsxのルートレイアウトを更新してSessionProviderを含める
- [ ] T025 middleware.tsにNextAuth.jsミドルウェアを含むNext.jsミドルウェアを作成 (ダッシュボードルートを保護)
- [ ] T026 Prisma seedを実行して初期管理ユーザーを作成 (npx prisma db seed)

**チェックポイント**: 基盤準備完了 - ユーザーストーリーの実装を並列で開始可能

---

## Phase 3: User Story 1 - ログイン (Priority: P1) 🎯 MVP

**Goal**: ユーザーがメールアドレスとパスワードでログインし、アプリケーションにアクセスできる

**Independent Test**: ログインフォームにメールアドレスとパスワードを入力し、ログインボタンをクリックすることで、セッションが作成され、ダッシュボードにリダイレクトされることを確認できる

### User Story 1のテスト（TDD - テストを最初に記述）

> **注意: これらのテストを最初に記述し、実装前に失敗することを確認してください**

- [ ] T027 [P] [US1] tests/unit/auth/password-hash.test.tsにパスワードハッシュ化のユニットテストを作成
- [ ] T028 [P] [US1] tests/unit/auth/validations.test.tsにログインバリデーションスキーマのユニットテストを作成
- [ ] T029 [P] [US1] tests/integration/auth/login.test.tsにログインサーバーアクションの統合テストを作成
- [ ] T030 [P] [US1] tests/e2e/auth/login.spec.tsにログインフローのE2Eテストを作成（成功ログイン、失敗ログイン、バリデーションエラー）

### User Story 1の実装

- [ ] T031 [P] [US1] components/ui/button.tsxにshadcn/ui Buttonコンポーネントを作成
- [ ] T032 [P] [US1] components/ui/input.tsxにshadcn/ui Inputコンポーネントを作成
- [ ] T033 [P] [US1] components/ui/label.tsxにshadcn/ui Labelコンポーネントを作成
- [ ] T034 [P] [US1] components/ui/card.tsxにshadcn/ui Cardコンポーネントを作成
- [ ] T035 [P] [US1] components/ui/form.tsxにshadcn/ui Formコンポーネントを作成
- [ ] T036 [US1] components/auth/login-form.tsxにログインフォームコンポーネントを作成（メール、パスワード入力、送信ボタン、エラー表示）
- [ ] T037 [US1] lib/actions/auth.tsに認証サーバーアクションを作成（bcrypt検証を含むsignInアクション）
- [ ] T038 [US1] app/(auth)/login/page.tsxにログインページを作成（LoginFormコンポーネントを統合）
- [ ] T039 [US1] app/(auth)/layout.tsxに認証レイアウトを作成（認証ページ用のシンプルなセンターレイアウト）
- [ ] T040 [US1] Zodスキーマを使用してログインフォームにクライアント側バリデーションを追加
- [ ] T041 [US1] 無効な認証情報のエラーハンドリングを追加（セキュリティのための汎用エラーメッセージ）
- [ ] T042 [US1] 送信中のログインボタンにローディング状態を追加
- [ ] T043 [US1] ログイン成功時のダッシュボードへのリダイレクトを設定

**チェックポイント**: この時点で、User Story 1は完全に機能するはずです - ユーザーはメール/パスワードでログインできます

---

## Phase 4: User Story 2 - ログアウト (Priority: P1)

**Goal**: ユーザーがログアウトして安全にセッションを終了できる

**Independent Test**: ログイン状態でログアウトボタンをクリックすることで、セッションが破棄され、ログインページにリダイレクトされることを確認できる

### User Story 2のテスト（TDD - テストを最初に記述）

- [ ] T044 [P] [US2] tests/integration/auth/logout.test.tsにログアウトサーバーアクションの統合テストを作成
- [ ] T045 [P] [US2] tests/e2e/auth/logout.spec.tsにログアウトフローのE2Eテストを作成（ログアウトでログインにリダイレクト、セッション破棄、保護されたページにアクセス不可）

### User Story 2の実装

- [ ] T046 [US2] lib/actions/auth.tsにsignOutアクションを追加（リダイレクト付きNextAuth signOut）
- [ ] T047 [US2] components/auth/logout-button.tsxにログアウトボタンコンポーネントを作成（signOutアクションを呼び出し）
- [ ] T048 [US2] app/(dashboard)/layout.tsxに基本的なダッシュボードレイアウトを作成（ヘッダーにログアウトボタンを含める）
- [ ] T049 [US2] app/(dashboard)/page.tsxにプレースホルダーダッシュボードページを作成（ログアウト機能をテストするため）
- [ ] T050 [US2] 送信中のログアウトボタンにローディング状態を追加
- [ ] T051 [US2] ログアウト成功時のログインページへのリダイレクトを設定
- [ ] T052 [US2] ログアウト後にセッションが適切に破棄されることをテスト

**チェックポイント**: この時点で、User Story 1と2の両方が動作するはずです - ユーザーはログインとログアウトができます

---

## Phase 5: User Story 3 - セッション管理 (Priority: P1)

**Goal**: ユーザーが一度ログインしたら7日間は再ログイン不要で利用でき、7日間経過したら自動的にログアウトされる

**Independent Test**: ログイン後、7日以内にアクセスすればログイン状態が維持され、7日経過後にアクセスするとログインページにリダイレクトされることを確認できる

### User Story 3のテスト（TDD - テストを最初に記述）

- [ ] T053 [P] [US3] tests/integration/auth/session.test.tsにセッション永続性の統合テストを作成（ブラウザ閉鎖後もセッション維持、7日後にセッション期限切れ）
- [ ] T054 [P] [US3] tests/e2e/auth/session.spec.tsにセッション管理のE2Eテストを作成（ページリロード間でのセッション永続性）

### User Story 3の実装

- [ ] T055 [US3] lib/auth.tsのJWTセッション設定を検証 (strategy: 'jwt', maxAge: 7日間)
- [ ] T056 [US3] lib/auth.tsのセッションクッキー設定を検証 (httpOnly, secure, sameSite: 'lax')
- [ ] T057 [US3] middleware.tsのリダイレクト時にセッション期限切れメッセージを追加
- [ ] T058 [US3] ブラウザ再起動間でのセッション永続性をテスト
- [ ] T059 [US3] 7日後のセッション期限切れをテスト（必要に応じて時間をモック）

**チェックポイント**: この時点で、User Story 1、2、3のすべてが動作するはずです - セッションが適切に管理されています

---

## Phase 6: User Story 4 - 保護されたルート (Priority: P1)

**Goal**: 未認証ユーザーが保護されたページとAPIにアクセスできないようにする

**Independent Test**: 未ログイン状態で保護されたページのURLに直接アクセスしようとすると、ログインページにリダイレクトされることを確認できる

### User Story 4のテスト（TDD - テストを最初に記述）

- [ ] T060 [P] [US4] tests/e2e/auth/protected-routes.spec.tsに保護されたルートのE2Eテストを作成（未認証アクセスはログインにリダイレクト、認証済みアクセスは成功、ログイン後に元のURLにリダイレクト）

### User Story 4の実装

- [ ] T061 [US4] middleware.tsにミドルウェアマッチャーを設定（/dashboard/*と/api/*を保護）
- [ ] T062 [US4] ログイン後のリダイレクトのためにミドルウェアにcallbackUrl保持を追加
- [ ] T063 [US4] /dashboardへの未認証アクセスが/loginにリダイレクトされることをテスト
- [ ] T064 [US4] /dashboardへの認証済みアクセスが成功することをテスト
- [ ] T065 [US4] ログイン成功後に元のURLにリダイレクトされることをテスト
- [ ] T066 [US4] APIルートが未認証リクエストに対して401を返すことをテスト

**チェックポイント**: すべてのP1ユーザーストーリー（US1-US4）が完了 - 基本的な認証が完全に機能しています

---

## Phase 7: User Story 5 - ユーザー招待 (Priority: P2)

**Goal**: 既存ユーザーが新しいユーザーをシステムに招待し、アカウントを作成させる

**Independent Test**: ログイン済みユーザーが招待フォームでメールアドレスを入力し、招待リンクが生成され、そのリンクから新規ユーザーが登録できることを確認できる

### User Story 5のテスト（TDD - テストを最初に記述）

- [ ] T067 [P] [US5] tests/unit/auth/invitation-token.test.tsに招待トークン生成のユニットテストを作成（crypto.randomBytes、32バイト、base64url）
- [ ] T068 [P] [US5] tests/unit/auth/invitation-validation.test.tsに招待バリデーションのユニットテストを作成
- [ ] T069 [P] [US5] tests/integration/auth/invitation-create.test.tsに招待作成の統合テストを作成
- [ ] T070 [P] [US5] tests/integration/auth/invitation-register.test.tsに招待からの登録の統合テストを作成
- [ ] T071 [P] [US5] tests/e2e/auth/invite-flow.spec.tsに完全な招待フローのE2Eテストを作成（招待作成、招待使用、登録、新規アカウントでログイン、期限切れ招待、使用済み招待）

### User Story 5の実装

- [ ] T072 [US5] lib/actions/invitations.tsに招待サーバーアクションを作成（createInvitation、validateInvitationToken、registerFromInvitation）
- [ ] T073 [US5] lib/actions/invitations.tsにcrypto.randomBytesトークン生成を実装
- [ ] T074 [US5] components/auth/invite-form.tsxに招待フォームコンポーネントを作成（メール入力、送信、生成されたリンク表示）
- [ ] T075 [US5] components/auth/register-form.tsxに登録フォームコンポーネントを作成（名前、パスワード入力、送信）
- [ ] T076 [US5] app/(dashboard)/invite-user/page.tsxにユーザー招待ページを作成（InviteFormを統合）
- [ ] T077 [US5] app/(auth)/invite/[token]/page.tsxに招待登録ページを作成（トークン検証、RegisterFormまたはエラーを表示）
- [ ] T078 [US5] 招待トークンバリデーションを追加（期限切れチェック、使用済みチェック）
- [ ] T079 [US5] ユーザー登録ロジックを追加（ハッシュ化されたパスワードでユーザーを作成、招待を使用済みにマーク）
- [ ] T080 [US5] 登録成功後の自動ログインを追加
- [ ] T081 [US5] 無効/期限切れ/使用済みトークンのエラーハンドリングを追加
- [ ] T082 [US5] 招待リンクのクリップボードへのコピー機能を追加
- [ ] T083 [US5] 完全な招待フローをエンドツーエンドでテスト

**チェックポイント**: すべてのユーザーストーリー（US1-US5）が完了 - 完全な認証システムが機能しています

---

## Phase 8: ポリッシュと横断的関心事

**目的**: 複数のユーザーストーリーに影響する改善

- [ ] T084 [P] lib/actions/auth.tsとlib/actions/invitations.tsに包括的なエラーロギングを追加
- [ ] T085 [P] next.config.jsにセキュリティヘッダー設定を追加
- [ ] T086 [P] docs/security.mdにレート制限の考慮事項ドキュメントを追加
- [ ] T087 [P] すべてのパスワードがbcryptでハッシュ化されていることを検証（salt rounds: 12）
- [ ] T088 [P] すべてのメールアドレスが小文字に正規化されていることを検証
- [ ] T089 [P] XSS防止のための入力サニタイゼーションを追加
- [ ] T090 [P] NextAuth.js組み込みメカニズムによるCSRF保護を検証
- [ ] T091 [P] すべてのユニットテストを実行し、100%合格率を確保
- [ ] T092 [P] すべての統合テストを実行し、100%合格率を確保
- [ ] T093 [P] すべてのE2Eテストを実行し、100%合格率を確保
- [ ] T094 [P] specs/000-authentication/quickstart.mdにquickstart.mdドキュメントを作成
- [ ] T095 [P] specs/000-authentication/contracts/api.mdにAPI契約ドキュメントを作成
- [ ] T096 コードクリーンアップ: console.logs、未使用のインポート、コメントアウトされたコードを削除
- [ ] T097 アクセシビリティ監査: すべてのフォームに適切なラベルとARIA属性があることを確認
- [ ] T098 パフォーマンスチェック: ログイン時間 < 10秒、パスワードハッシュ < 0.5秒、セッション検証 < 50msを検証
- [ ] T099 セキュリティ監査: すべての認証コードの脆弱性をレビュー
- [ ] T100 spec.mdの受け入れシナリオに従ってすべてのユーザーストーリーの最終手動テストを実施

---

## 依存関係と実行順序

### フェーズの依存関係

- **セットアップ（Phase 1）**: 依存関係なし - すぐに開始可能
- **基盤構築（Phase 2）**: セットアップ完了に依存 - すべてのユーザーストーリーをブロック
- **ユーザーストーリー（Phase 3-7）**: すべて基盤構築フェーズの完了に依存
  - US1（ログイン）はPhase 2後に開始可能 - 他のストーリーへの依存なし
  - US2（ログアウト）はPhase 2後に開始可能 - テストにはUS1が必要だが実装は独立
  - US3（セッション）はPhase 2後に開始可能 - Phase 2の設定を検証、独立してテスト可能
  - US4（保護されたルート）はPhase 2後に開始可能 - テストにはUS1が必要だが実装は独立
  - US5（招待）はPhase 2後に開始可能 - 他のストーリーから独立
- **ポリッシュ（Phase 8）**: すべてのユーザーストーリーの完了に依存

### ユーザーストーリーの依存関係

- **User Story 1（ログイン - P1）**: 基盤構築（Phase 2）後に開始可能 - 他のストーリーへの依存なし ✅ MVP
- **User Story 2（ログアウト - P1）**: 基盤構築（Phase 2）後に開始可能 - モックセッションで独立してテスト可能
- **User Story 3（セッション - P1）**: 基盤構築（Phase 2）後に開始可能 - 設定を検証、独立してテスト可能
- **User Story 4（保護されたルート - P1）**: 基盤構築（Phase 2）後に開始可能 - モック認証状態で独立してテスト可能
- **User Story 5（招待 - P2）**: 基盤構築（Phase 2）後に開始可能 - 完全に独立、個別にデプロイ可能

### 各ユーザーストーリー内（TDDアプローチ）

1. **テストを最初に記述**: ストーリーのすべてのテストを記述し、失敗することを確認
2. **モデル**: 必要に応じてデータモデルを作成/更新
3. **サービス**: ビジネスロジックを実装（サーバーアクション）
4. **UIコンポーネント**: フォームコンポーネントを構築
5. **ページ**: コンポーネントをページに統合
6. **バリデーション**: クライアント側およびサーバー側のバリデーションを追加
7. **エラーハンドリング**: 包括的なエラーハンドリングを追加
8. **テストの合格を検証**: ストーリーのすべてのテストが合格するはず

### 並列実行の機会

**Phase 1（セットアップ）内**:
- [P]マークが付いたすべてのタスク（T003-T010）を並列実行可能

**Phase 2（基盤構築）内**:
- T013-T015（Prismaスキーマ）は順次実行が必要（同じファイル）
- T017、T018、T020、T021、T022、T023は並列実行可能（異なるファイル）

**各ユーザーストーリー内**:
- [P]マークが付いたすべてのテストを並列で記述可能（異なるファイル）
- [P]マークが付いたすべてのUIコンポーネントを並列で作成可能（異なるファイル）
- サーバーアクション、ページ、統合タスクは順次実行が必要

**ユーザーストーリー間**（チームの容量が許す場合）:
- Phase 2後、すべてのユーザーストーリーを異なる開発者が並列で作業可能
- 各ストーリーは独立してテストおよびデプロイ可能

---

## 並列実行例: User Story 1（ログイン）

```bash
# フェーズ1: すべてのテストを並列で記述（TDD - テスト優先）
タスク: T027 - tests/unit/auth/password-hash.test.tsにパスワードハッシュ化のユニットテスト
タスク: T028 - tests/unit/auth/validations.test.tsにログインバリデーションスキーマのユニットテスト
タスク: T029 - tests/integration/auth/login.test.tsにログインサーバーアクションの統合テスト
タスク: T030 - tests/e2e/auth/login.spec.tsにログインフローのE2Eテスト

# すべてのテストが失敗することを検証（まだ実装なし）

# フェーズ2: すべてのUIコンポーネントを並列で作成
タスク: T031 - components/ui/button.tsxにButtonコンポーネントを作成
タスク: T032 - components/ui/input.tsxにInputコンポーネントを作成
タスク: T033 - components/ui/label.tsxにLabelコンポーネントを作成
タスク: T034 - components/ui/card.tsxにCardコンポーネントを作成
タスク: T035 - components/ui/form.tsxにFormコンポーネントを作成

# フェーズ3: コア機能を実装（順次）
タスク: T036 - ログインフォームコンポーネントを作成
タスク: T037 - 認証サーバーアクションを作成
タスク: T038 - ログインページを作成
タスク: T039 - 認証レイアウトを作成
タスク: T040-T043 - バリデーション、エラーハンドリング、ローディング状態を追加

# すべてのテストが合格することを検証 - User Story 1完了！
```

---

## 並列実行例: 複数のユーザーストーリー（チーム戦略）

```bash
# Phase 2（基盤構築）完了後:

# 開発者AがUser Story 1（ログイン）に取り組む
タスク: T027-T043

# 開発者BがUser Story 2（ログアウト）に取り組む
タスク: T044-T052

# 開発者CがUser Story 5（招待）に取り組む
タスク: T067-T083

# User Story 3と4は、開発者AがUS1の後に実施可能
# または別の開発者が並列で実施可能

# すべてのストーリーは独立してテスト可能で、個別にマージ可能
```

---

## 実装戦略

### MVP優先（User Story 1のみ） - 動作する製品への最速パス

1. ✅ Phase 1完了: セットアップ（T001-T012）
2. ✅ Phase 2完了: 基盤構築（T013-T026） - 重要: これがすべてをブロック
3. ✅ Phase 3完了: User Story 1 - ログイン（T027-T043）
4. **停止して検証**: spec.mdの受け入れシナリオに従ってログインを独立してテスト
5. 準備ができたらデプロイ/デモ - これで動作する認証システムができました！

**なぜこれが機能するか**: User Story 1（ログイン）はコア認証機能を提供します。他のストーリーなしですぐにテストできます。

### 段階的デリバリー（推奨）

1. セットアップ + 基盤構築を完了（Phase 1-2）→ 基盤準備完了
2. User Story 1（ログイン）を追加 → 独立してテスト → デプロイ/デモ（MVP!）
3. User Story 2（ログアウト）を追加 → 独立してテスト → デプロイ/デモ
4. User Story 3（セッション）を追加 → 独立してテスト → デプロイ/デモ
5. User Story 4（保護されたルート）を追加 → 独立してテスト → デプロイ/デモ
6. User Story 5（招待）を追加 → 独立してテスト → デプロイ/デモ
7. ポリッシュフェーズ → 最終クリーンアップと最適化

各ストーリーは、以前のストーリーを壊すことなく価値を追加します。

### 並列チーム戦略（複数の開発者が利用可能な場合）

2-3人の開発者の場合:

1. **一緒に**: セットアップ + 基盤構築を完了（Phase 1-2）
2. **Phase 2完了後**、作業を分割:
   - 開発者A: User Story 1（ログイン） - 最優先
   - 開発者B: User Story 2（ログアウト） + User Story 3（セッション） - US1に関連
   - 開発者C: User Story 5（招待） - 完全に独立
3. 開発者A（US1後）: User Story 4（保護されたルート）
4. **一緒に**: Phase 8（ポリッシュ）

ストーリーは独立して完了し統合されます。

---

## テスト戦略（TDDアプローチ）

### テスト駆動開発（必須）

この機能はplan.mdに従ってTDDアプローチを明示的に要求します。各ユーザーストーリーについて:

1. **テストを最初に記述** - すべてのテストは最初は失敗するはず
2. **テストを実行** - 失敗を検証（レッド）
3. **コードを実装** - テストを通過する最小限のコードを記述
4. **テストを実行** - 合格を検証（グリーン）
5. **リファクタリング** - テストをグリーンに保ちながらコードを改善

### テストカバレッジ要件

- **ユニットテスト**: パスワードハッシュ化、バリデーションスキーマ、トークン生成
- **統合テスト**: サーバーアクション（ログイン、ログアウト、招待フロー）
- **E2Eテスト**: 完全なユーザージャーニー（ログインフロー、ログアウトフロー、招待フロー、保護されたルート）
- **セキュリティテスト**: XSS防止、CSRF保護、SQLインジェクション防止（Prisma ORMを介して）

### テスト実行

```bash
# すべてのユニットテストを実行
npm run test:unit

# すべての統合テストを実行
npm run test:integration

# すべてのE2Eテストを実行
npm run test:e2e

# すべてのテストを実行
npm run test
```

---

## 注意事項

- **[P]タスク** = 異なるファイル、依存関係なし、並列実行可能
- **[Story]ラベル** = トレーサビリティのためにタスクを特定のユーザーストーリーにマッピング
- **各ユーザーストーリーは独立して完了およびテスト可能であるべき**
- **TDDアプローチ**: テストを最初に記述、失敗を確認、実装、合格を検証
- 実装前にテストが失敗することを検証（レッド → グリーン → リファクタリング）
- 各タスクまたは論理グループの後にコミット
- 任意のチェックポイントで停止してストーリーを独立して検証
- **セキュリティは重要**: すべてのパスワードをハッシュ化、すべての入力を検証、すべてのセッションを保護
- **パフォーマンス目標**: ログイン < 10秒、パスワードハッシュ < 0.5秒、セッションチェック < 50ms
- 回避すべきこと: 曖昧なタスク、同じファイルの競合、独立性を損なうストーリー間の依存関係
