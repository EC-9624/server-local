-- Create Categories
INSERT INTO categories (category_name) VALUES
('買い物'),
('衣類'),
('ショッピング'),
('旅行'),
('外食'),
('健康'),
('交通');

-- Create Accounts
INSERT INTO accounts (balance,saving, created_at, updated_at) VALUES
(1000,500, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create Members
INSERT INTO members (name, password, rankpoint, account_id, created_at, updated_at) VALUES
('John Doe', 'password123', 0, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Create Missions
INSERT INTO missions (mission_title, mission_description, exp_point, is_completed) VALUES
('水筒を持ってこよう', '水筒に水を入れる。約200円節約！', 100, false),
('冷房の設定温度を1度上げる', '約500円節約！', 200, false),
('晩ご飯はカレーを作りましょう', '3回分の食事が節約！', 300, false),
('買い物はできるだけサンディで済ませる', 'あらゆる物が安いサンディで買い出しを済ませて出費を抑える', 200, false),
('コンビニ食品禁止チャレンジ', '自炊を行える時間が無い時は納豆や豆腐といった手間がかからない料理で済ませる', 300, false),
('自炊チャレンジ', 'できるだけ安いスーパーで食材を買って自炊を行い、食費を抑える', 300, false);

INSERT INTO paymentTransactions (amount, account_id, category_id, member_id, transaction_date, message, transaction_type) VALUES
(100, 1, 1, 1, '2023-12-01 10:00:00', 'December deposit', 'DEPOSIT'),
(150, 1, 1, 1, '2023-12-05 12:30:00', 'Gift', 'DEPOSIT'),
(200, 1, 2, 1, '2023-12-10 15:45:00', 'Payment received', 'DEPOSIT'),
(75, 1, 3, 1, '2023-12-15 18:00:00', 'Utility payment', 'WITHDRAWAL'),
(50, 1, 4, 1, '2023-12-20 08:30:00', 'Groceries', 'WITHDRAWAL'),

(80, 1, 2, 1, '2024-01-05 10:00:00', 'January deposit', 'DEPOSIT'),
(120, 1, 2, 1, '2024-01-12 11:45:00', 'Freelance payment', 'DEPOSIT'),
(200, 1, 3, 1, '2024-01-20 09:15:00', 'Gift received', 'DEPOSIT'),
(60, 1, 4, 1, '2024-01-25 14:00:00', 'Restaurant', 'WITHDRAWAL'),
(150, 1, 1, 1, '2024-01-30 16:30:00', 'Bonus', 'DEPOSIT'),

(90, 1, 1, 1, '2024-02-01 10:30:00', 'February deposit', 'DEPOSIT'),
(130, 1, 2, 1, '2024-02-08 13:00:00', 'Consulting fee', 'DEPOSIT'),
(70, 1, 3, 1, '2024-02-15 17:00:00', 'Dinner', 'WITHDRAWAL'),
(50, 1, 4, 1, '2024-02-20 12:45:00', 'Groceries', 'WITHDRAWAL'),
(200, 1, 2, 1, '2024-02-28 11:15:00', 'Salary', 'DEPOSIT'),

(100, 1, 1, 1, '2024-03-03 08:00:00', 'March deposit', 'DEPOSIT'),
(75, 1, 2, 1, '2024-03-10 10:30:00', 'Freelance work', 'DEPOSIT'),
(85, 1, 3, 1, '2024-03-15 18:30:00', 'Utility bill', 'WITHDRAWAL'),
(150, 1, 1, 1, '2024-03-20 09:15:00', 'Gift', 'DEPOSIT'),
(60, 1, 2, 1, '2024-03-25 12:00:00', 'Lunch', 'WITHDRAWAL'),

(110, 1, 3, 1, '2024-04-05 14:00:00', 'April deposit', 'DEPOSIT'),
(95, 1, 4, 1, '2024-04-10 16:00:00', 'Freelance job', 'DEPOSIT'),
(70, 1, 2, 1, '2024-04-15 13:45:00', 'Groceries', 'WITHDRAWAL'),
(200, 1, 2, 1, '2024-04-20 17:30:00', 'Project payment', 'DEPOSIT'),
(55, 1, 3, 1, '2024-04-25 08:15:00', 'Utilities', 'WITHDRAWAL'),

(130, 1, 1, 1, '2024-05-03 11:00:00', 'May deposit', 'DEPOSIT'),
(75, 1, 2, 1, '2024-05-10 09:00:00', 'Side job', 'DEPOSIT'),
(60, 1, 3, 1, '2024-05-15 15:30:00', 'Groceries', 'WITHDRAWAL'),
(100, 1, 2, 1, '2024-05-20 16:45:00', 'Refund', 'DEPOSIT'),
(85, 1, 4, 1, '2024-05-25 12:15:00', 'Entertainment', 'WITHDRAWAL'),

(150, 1, 1, 1, '2024-06-01 14:30:00', 'June deposit', 'DEPOSIT'),
(90, 1, 2, 1, '2024-06-07 10:45:00', 'Freelance work', 'DEPOSIT'),
(110, 1, 3, 1, '2024-06-12 18:00:00', 'Gift received', 'DEPOSIT'),
(70, 1, 4, 1, '2024-06-18 13:30:00', 'Groceries', 'WITHDRAWAL'),
(60, 1, 2, 1, '2024-06-24 11:00:00', 'Utilities', 'WITHDRAWAL');


