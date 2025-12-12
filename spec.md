# システム仕様書

本ドキュメントは、キャラクター管理、開幕テンプレート管理、公式管理の3つの機能に関する仕様（データ構造、画面遷移、機能詳細）をまとめたものである．本仕様書は12/5の時点で制作したものであるため，いくつかの点でで変更を行う可能性がある．

## 1. キャラクター管理機能 (IdvList)

### 1-1. データ構造

| 論理名 | 物理名 | 型 | 説明 |
| :--- | :--- | :--- | :--- |
| ID | `id` | Integer | キャラクターID (主キー) |
| 名前 | `name` | String | キャラクター名 |
| 説明 | `description` | Text | キャラクターの詳細説明 |
| 画像 | `image` | String | 画像ファイルパスまたはURL |
| 作成日 | `created_at` | DateTime | 登録日時 |
| 更新日 | `updated_at` | DateTime | 最終更新日時 |

### 1-2. ページ遷移図

```mermaid
stateDiagram-v2
    direction LR
    state "/idvlist<br>キャラクター一覧" as List
    state "/idvlist/:number<br>詳細表示" as Detail
    state "/idvlist/create<br>新規登録" as Create
    state "/idvlist/edit/:number<br>編集" as Edit
    state "post /idvlist<br>新規登録処理" as CreateProc
    state "/idvlist/update/:number<br>更新処理" as UpdateProc
    state "idvlist/delete/:number<br>削除処理" as DeleteProc

    [*] --> List
    List --> Detail : 詳細リンク
    Detail --> List : 戻るボタン
    List --> Create : 新規登録ボタン
    Create --> List : 戻るボタン
    Detail --> Edit : 編集ボタン
    Edit --> Detail : 戻るボタン
    Create --> CreateProc : 登録ボタン
    CreateProc --> List : 完了後リダイレクト
    Edit --> UpdateProc : 更新ボタン
    UpdateProc --> List : 完了後リダイレクト
    List --> DeleteProc : 削除ボタン
    DeleteProc --> List : 完了後リダイレクト
```

### 1-3. HTTPメソッドと機能詳細

| 機能・画面 | メソッド | リソース名 | 遷移元・操作 | 機能詳細・処理内容 | 処理後の表示 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **一覧表示** | GET | `/idvlist` | メニュー等のリンク | 登録済みのキャラクター一覧を表示する．各行に詳細・削除リンクを配置． | - |
| **詳細表示** | GET | `/idvlist/:number` | 一覧の「詳細」リンク | 指定IDのキャラクター詳細情報を表示する． | - |
| **新規登録画面** | GET | `/idvlist/create` | 一覧の「新規登録」ボタン | 新規登録用の入力フォームを表示する． | - |
| **新規登録処理** | POST | `/idvlist` | 登録画面の「登録」ボタン | フォームの入力値をDBに保存する． | 一覧画面へ遷移 |
| **編集画面** | GET | `/idvlist/edit/:number` | 詳細画面の「編集」ボタン | 既存データをフォームに入力済みで表示する． | - |
| **更新処理** | POST | `/idvlist/update/:number` | 編集画面の「更新」ボタン | フォームの内容でDBを更新する． | 一覧画面へ遷移 |
| **削除処理** | POST | `/idvlist/delete/:number` | 一覧画面の「削除」ボタン | 指定IDのデータを削除する． | 一覧画面へ遷移 |

---

## 2. 開幕テンプレート管理機能 (FirstTmp)

### 2-1. データ構造

| 論理名 | 物理名 | 型 | 説明 |
| :--- | :--- | :--- | :--- |
| ID | `id` | Integer | テンプレートID (主キー) |
| タイトル | `title` | String | テンプレートの見出し |
| 内容 | `content` | Text | テンプレートの本文 |
| 作成日 | `created_at` | DateTime | 登録日時 |
| 更新日 | `updated_at` | DateTime | 最終更新日時 |

### 2-2. ページ遷移図

```mermaid
stateDiagram-v2
    direction LR
    state "/firsttmp<br>開幕テンプレート一覧" as List_tmp
    state "/firsttmp/:number<br>詳細表示" as Detail_tmp
    state "/firsttmp/create<br>新規登録" as Create_tmp
    state "/firsttmp/edit/:number<br>編集" as Edit_tmp
    state "post /firsttmp<br>新規登録処理" as CreateProc_tmp
    state "/firsttmp/update/:number<br>更新処理" as UpdateProc_tmp
    state "firsttmp/delete/:number<br>削除処理" as DeleteProc_tmp

    [*] --> List_tmp
    List_tmp --> Detail_tmp : 詳細リンク
    Detail_tmp --> List_tmp : 戻るボタン
    List_tmp --> Create_tmp : 新規登録ボタン
    Create_tmp --> List_tmp : 戻るボタン
    Detail_tmp --> Edit_tmp : 編集ボタン
    Edit_tmp --> Detail_tmp : 戻るボタン
    Create_tmp --> CreateProc_tmp : 登録ボタン
    CreateProc_tmp --> List_tmp : 完了後リダイレクト
    Edit_tmp --> UpdateProc_tmp : 更新ボタン
    UpdateProc_tmp --> List_tmp : 完了後リダイレクト
    List_tmp --> DeleteProc_tmp : 削除ボタン
    DeleteProc_tmp --> List_tmp : 完了後リダイレクト
```

### 2-3. HTTPメソッドと機能詳細

| 機能・画面 | メソッド | リソース名 | 遷移元・操作 | 機能詳細・処理内容 | 処理後の表示 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **一覧表示** | GET | `/firsttmp` | メニュー等のリンク | テンプレート一覧を表示する． | - |
| **詳細表示** | GET | `/firsttmp/:number` | 一覧の「詳細」リンク | 指定IDのテンプレート詳細を表示する． | - |
| **新規登録画面** | GET | `/firsttmp/create` | 一覧の「新規登録」ボタン | 新規登録フォームを表示する． | - |
| **新規登録処理** | POST | `/firsttmp` | 登録画面の「登録」ボタン | 入力データをDBに保存する． | 一覧画面へ遷移 |
| **編集画面** | GET | `/firsttmp/edit/:number` | 詳細画面の「編集」ボタン | 編集フォームを表示する． | - |
| **更新処理** | POST | `/firsttmp/update/:number` | 編集画面の「更新」ボタン | DBのデータを更新する． | 一覧画面へ遷移 |
| **削除処理** | POST | `/firsttmp/delete/:number` | 一覧画面の「削除」ボタン | 指定IDのデータを削除する． | 一覧画面へ遷移 |

---

## 3. 公式管理機能 (Formula)

### 3-1. データ構造

| 論理名 | 物理名 | 型 | 説明 |
| :--- | :--- | :--- | :--- |
| ID | `id` | Integer | 公式ID (主キー) |
| 公式名 | `name` | String | 計算式の名称 |
| 式・内容 | `expression` | Text | 計算式または定義内容 |
| 備考 | `note` | Text | 補足説明 |
| 作成日 | `created_at` | DateTime | 登録日時 |
| 更新日 | `updated_at` | DateTime | 最終更新日時 |

### 3-2. ページ遷移図

```mermaid
stateDiagram-v2
    direction LR
    state "/formula<br>公式一覧" as List_fml
    state "/formula/:number<br>詳細表示" as Detail_fml
    state "/formula/create<br>新規登録" as Create_fml
    state "/formula/edit/:number<br>編集" as Edit_fml
    state "post /formula<br>新規登録処理" as CreateProc_fml
    state "/formula/update/:number<br>更新処理" as UpdateProc_fml
    state "formula/delete/:number<br>削除処理" as DeleteProc_fml

    [*] --> List_fml
    List_fml --> Detail_fml : 詳細リンク
    Detail_fml --> List_fml : 戻るボタン
    List_fml --> Create_fml : 新規登録ボタン
    Create_fml --> List_fml : 戻るボタン
    Detail_fml --> Edit_fml : 編集ボタン
    Edit_fml --> Detail_fml : 戻るボタン
    Create_fml --> CreateProc_fml : 登録ボタン
    CreateProc_fml --> List_fml : 完了後リダイレクト
    Edit_fml --> UpdateProc_fml : 更新ボタン
    UpdateProc_fml --> List_fml : 完了後リダイレクト
    List_fml --> DeleteProc_fml : 削除ボタン
    DeleteProc_fml --> List_fml : 完了後リダイレクト
```

### 3-3. HTTPメソッドと機能詳細

| 機能・画面 | メソッド | リソース名 | 遷移元・操作 | 機能詳細・処理内容 | 処理後の表示 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **一覧表示** | GET | `/formula` | メニュー等のリンク | 公式データ一覧を表示する． | - |
| **詳細表示** | GET | `/formula/:number` | 一覧の「詳細」リンク | 指定IDの公式詳細を表示する． | - |
| **新規登録画面** | GET | `/formula/create` | 一覧の「新規登録」ボタン | 新規登録フォームを表示する． | - |
| **新規登録処理** | POST | `/formula` | 登録画面の「登録」ボタン | 入力データをDBに保存する． | 一覧画面へ遷移 |
| **編集画面** | GET | `/formula/edit/:number` | 詳細画面の「編集」ボタン | 編集フォームを表示する． | - |
| **更新処理** | POST | `/formula/update/:number` | 編集画面の「更新」ボタン | DBのデータを更新する． | 一覧画面へ遷移 |
| **削除処理** | POST | `/formula/delete/:number` | 一覧画面の「削除」ボタン | 指定IDのデータを削除する． | 一覧画面へ遷移 |