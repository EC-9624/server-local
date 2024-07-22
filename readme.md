# Server Local 💻

貯金 Quests の ローカルバッグエンドサーバーです。

## get started

1. Package を install

   ```bash
   npm install
   ```

2. Mysql に DB 構築

   ```
   source ./sql/create.sql
   ```

3. サーバーを起動する
   ```bash
   npm run dev
   ```

# API ドキュメント

## ベース URL

```
http://localhost:3000/api
```

## エンドポイント

### アカウント

#### アカウント詳細の取得

**GET** `/accounts/{account_id}`

特定のアカウント（`account_id`）の詳細を取得します。

**レスポンス:**

```JSON
[
    {
        "account_id": 1,
        "balance": 107000,
        "saving": 500,
        "created_at": "2024-07-17T11:58:07.000Z",
        "updated_at": "2024-07-17T14:18:17.000Z"
    }
]
```

#### アカウント残高の取得

**GET** `/accounts/{account_id}/balance`

特定のアカウント（`account_id`）の残高を取得します。

**レスポンス:**

```JSON
{
    "balance": 107000
}

```

#### アカウント貯金残高の取得

**GET** `/accounts/{account_id}/saving-balance`

特定のアカウント（`account_id`）の貯金残高を取得します。

**レスポンス:**

```JSON
{
    "saving": 500
}
```

#### アカウント取引履歴の取得

**GET** `/accounts/{account_id}/transactions`

特定のアカウント（`account_id`）の取引履歴を取得します。オプションで`type`によるフィルタリングが可能です。

**クエリパラメータ:**

- `type`（オプション）: -DEPOSIT
  -WITHDRAWAL

**レスポンス:**

```JSON
[
    {
        "transaction_id": 1,
        "amount": 1100,
        "account_id": 1,
        "category_id": 1,
        "member_id": 1,
        "transaction_date": "2023-12-01T01:00:00.000Z",
        "message": "December deposit",
        "transaction_type": "DEPOSIT"
    },
]
```

#### アカウント月次支出の取得

**GET** `/accounts/{account_id}/expense`

特定のアカウント（`account_id`）の月次支出を取得します。

**レスポンス:**

```JSON
[
    {
        "month_year": "2023-12",
        "spendings": "2125"
    },
    {
        "month_year": "2024-01",
        "spendings": "1060"
    },
    {
        "month_year": "2024-02",
        "spendings": "2120"
    },
    {
        "month_year": "2024-03",
        "spendings": "2145"
    },
    {
        "month_year": "2024-04",
        "spendings": "2125"
    },
    {
        "month_year": "2024-05",
        "spendings": "2145"
    },
    {
        "month_year": "2024-06",
        "spendings": "2130"
    }
]
```

#### アカウントに支出を追加

**POST** `/accounts/{account_id}/expense`

特定のアカウント（`account_id`）に新しい支出を追加します。

**リクエストボディ:**

- `amount`: 支出金額（必須）
- `memo`: 支出メモ（必須）
- `categoryId`: 支出カテゴリー ID（必須）
- `memberId`: 支出に関連するメンバー ID（必須）

```JSON
{
    "amount" : 1000,
    "memo" : "test income",
    "memberId" : 1,
    "categoryId" : 1
}
```

**レスポンス:**

```JSON
{
    "message": "Expense recorded",
    "balance": 106000
}
```

#### アカウント月次収入の取得

**GET** `/accounts/{account_id}/income`

特定のアカウント（`account_id`）の月次収入を取得します。

**レスポンス:**

```JSON
[
    {
        "month_year": "2023-12",
        "income": "3450"
    },
    {
        "month_year": "2024-01",
        "income": "4550"
    },
    {
        "month_year": "2024-02",
        "income": "3420"
    },
    {
        "month_year": "2024-03",
        "income": "3325"
    },
    {
        "month_year": "2024-04",
        "income": "3405"
    },
    {
        "month_year": "2024-05",
        "income": "3305"
    },
    {
        "month_year": "2024-06",
        "income": "3350"
    }
]
```

#### アカウントに収入を追加

**POST** `/accounts/{account_id}/income`

特定のアカウント（`account_id`）に新しい収入を追加します。

**リクエストボディ:**

- `amount`: 収入金額（必須）
- `memo`: 収入メモ（必須）
- `memberId`: 収入に関連するメンバー ID（必須）

```JSON
{
    "amount" : 1000,
    "memo" : "test income",
    "memberId" : 1
}
```

**レスポンス:**

```JSON
{
    "message": "Income recorded",
    "balance": 108000
}
```

### カテゴリー

#### 全てのカテゴリーの取得

**GET** `/categories`

全てのカテゴリーを取得します。

**レスポンス:**

```JSON
[
    {
        "category_id": 1,
        "category_name": "買い物"
    },
    {
        "category_id": 2,
        "category_name": "衣類"
    },
    {
        "category_id": 3,
        "category_name": "ショッピング"
    },
    {
        "category_id": 4,
        "category_name": "旅行"
    },
    {
        "category_id": 5,
        "category_name": "外食"
    },
    {
        "category_id": 6,
        "category_name": "健康"
    },
    {
        "category_id": 7,
        "category_name": "交通"
    }
]
```

### メンバー

#### メンバーのミッションの取得

**GET** `/members/{member_id}/missions`

特定のメンバー（`member_id`）のミッションを取得します。

**レスポンス:**

- 200: メンバーミッションを含む JSON 配列
- 500: エラーメッセージ

#### ミッションステータスの更新

**PATCH** `/members/{member_id}/missions/{mission_id}`

特定のメンバー（`member_id`）およびミッション（`mission_id`）のステータスを更新します。

**リクエストボディ:**

- `is_completed`: 完了ステータス（必須）

```JSON
{
    "is_completed": true
}
```

**レスポンス:**

```JSON
{
    "updatedMission": {
        "member_mission_id": 5,
        "is_completed": 1,
        "mission_id": 5,
        "mission_title": "コンビニ食品禁止チャレンジ",
        "mission_description": "自炊を行える時間が無い時は納豆や豆腐といった手間がかからない料理で済ませる",
        "exp_point": 300
    },
    "currentRankpoint": 700
}
```

既に完了した場合

```JSON
{
    "message": "Mission is already completed."
}
```

#### メンバーの経験値の取得

**GET** `/members/{member_id}/exp`

特定のメンバー（`member_id`）の経験値を取得します。

**レスポンス:**

```JSON
{
    "rankpoint": 700
}

```

## 環境変数

- `DB_HOST`: データベースホスト
- `DB_USER`: データベースユーザー
- `DB_PASSWORD`: データベースパスワード
- `DB_DATABASE`: データベース名

## サーバーの起動

```
npm start
```

サーバーはポート`3000`で稼働します。

## エラーレスポンス

全てのエンドポイントは、サーバーサイドのエラーが発生した場合、`500`ステータスコードとエラーメッセージを返すことがあります。
