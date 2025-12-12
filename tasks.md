# レポート作成タスクリスト

このプロジェクトは「公式管理」「キャラクター管理」「開幕テンプレート管理」の3つの主機能を持つシステムのドキュメント作成を目的とする．

## 開発者向けドキュメント
システム全体の構造と仕様を定義する．

- [ ] 対象とするシステムの決定 :thinking:
  - [x] 機能要件の洗い出し（公式、キャラクター、テンプレートの3機能）
- [ ] データ構造の決定 :thinking:
  - [ ] 公式（formula）テーブルの設計
  - [ ] キャラクター（idvlist）テーブルの設計
  - [ ] 開幕テンプレート（firsttmp）テーブルの設計
- [ ] ページ遷移図の作成 (Mermaid) :writing_hand:
  - [ ] 公式管理機能の遷移図作成
  - [ ] キャラクター管理機能の遷移図作成
  - [ ] 開幕テンプレート管理機能の遷移図作成
- [ ] HTTPメソッドとリソース名一覧の作成 :writing_hand:
  - [ ] `/formula` 関連のルーティング定義
  - [ ] `/idvlist` 関連のルーティング定義
  - [ ] `/firsttmp` 関連のルーティング定義
- [ ] リソース名ごとの機能の詳細記述 :writing_hand:

## 管理者向けドキュメント
システムの導入と保守に関する手順をまとめる．

- [ ] インストールから起動までの手順確認 :computer:
  - [ ] 必要な環境（Node.js, DB等）の記述
- [ ] インストール方法 :writing_hand:
- [ ] 起動方法 :writing_hand:
- [ ] 起動できない場合の対処法 :writing_hand:
- [ ] 終了方法 :writing_hand:
- [ ] 分かっている不具合・制限事項 :writing_hand:

## 利用者向けドキュメント
各機能の使用方法をスクリーンショット付きで解説する．

- [ ] 構成の検討 :thinking:
- [ ] スクリーンショットの保存と整理 :computer:
- [ ] 概要・トップページの説明 :writing_hand:
- [ ] **公式管理機能 (Formula)** の説明
  - [ ] 公式一覧表示画面 :writing_hand:
  - [ ] 公式詳細表示画面 :writing_hand:
  - [ ] 公式新規登録（Create） :writing_hand:
  - [ ] 公式編集（Edit） :writing_hand:
  - [ ] 公式削除（Delete） :writing_hand:
- [ ] **キャラクター管理機能 (IdvList)** の説明
  - [ ] キャラクター一覧表示画面 :writing_hand:
  - [ ] キャラクター詳細表示画面 :writing_hand:
  - [ ] キャラクター新規登録（Create） :writing_hand:
  - [ ] キャラクター編集（Edit） :writing_hand:
  - [ ] キャラクター削除（Delete） :writing_hand:
- [ ] **開幕テンプレート管理機能 (FirstTmp)** の説明
  - [ ] テンプレート一覧表示画面 :writing_hand:
  - [ ] テンプレート詳細表示画面 :writing_hand:
  - [ ] テンプレート新規登録（Create） :writing_hand:
  - [ ] テンプレート編集（Edit） :writing_hand:
  - [ ] テンプレート削除（Delete） :writing_hand:

## 提出前確認

- [ ] 誤字脱字のチェック :eyes:
- [ ] PDF変換によるレイアウト確認
- [ ] 提出