# ER図

本節では、要求定義・DFDをもとに鍵管理システムのER図を定義する。

---

## エンティティ一覧

### 1. 利用者（User）

| 属性名      | 型     | 説明    | 制約     |
| -------    | ------ | --------| -------- |
| student_id | String | 学籍番号 | 主キー   |
| name       | String | 氏名    | NOT NULL |

---

### 2. 鍵（Key）

| 属性名 | 型      | 説明    | 制約     |
| ------ | ------ | ------- | -------- |
| key_id | String | 鍵ID    | 主キー    |
| name   | String | 鍵の名称 | NOT NULL |
| status | String | 状態    | NOT NULL |

---

### 3. 貸出履歴（Log）

| 属性名      | 型        | 説明      | 制約                    |
| ----------- | --------- | -----    | ----------              |
| log_id      | String    | 履歴ID   | 主キー                   |
| student_id  | String    | 利用者ID | 外部キー(User.student_id) |
| key_id      | String    | 鍵ID     | 外部キー(Key.key_id)     |
| borrowed_at | Timestamp | 貸出日時  | NOT NULL                |
| returned_at | Timestamp | 返却日時  | NULL可                  |

---

## リレーションシップ

### 利用者 ― 貸出履歴

* 利用者 1 : N 貸出履歴
* 1人の利用者は複数回鍵を借りることができる
* 各貸出履歴は必ず1人の利用者に属する

### 鍵 ― 貸出履歴

* 鍵 1 : N 貸出履歴
* 1本の鍵は複数回貸し出される
* 各貸出履歴は必ず1本の鍵に対応する

---

## ER図（概念表現）

```
User (student_id, name)
   |1
   |
   |N
LoanHistory (log_id, student_id, key_id, borrowed_at, returned_at)
   |N
   |
   |1
Key (key_id, name, status)
```
