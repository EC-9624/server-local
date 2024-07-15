import dotenv from "dotenv";
import express from "express";
import { createConnection } from "mysql2/promise";

dotenv.config();

async function main() {
  const connection = await createConnection(process.env.DATABASE_URL);
  console.log("Connected to Database");

  const app = express();
  app.use(express.json());

  // GET /api/accounts/{account_id}/
  app.get("/api/accounts/:account_id", async (req, res) => {
    const { account_id } = req.params;
    try {
      const [rows] = await connection.query(
        "SELECT * FROM accounts WHERE account_id = ?",
        [account_id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // GET /api/accounts/{account_id}/balance
  app.get("/api/accounts/:account_id/balance", async (req, res) => {
    const { account_id } = req.params;
    try {
      const [rows] = await connection.query(
        "SELECT balance FROM accounts WHERE account_id = ?",
        [account_id]
      );
      res.json(rows[0]);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // GET /api/accounts/{account_id}/saving-balance
  app.get("/api/accounts/:account_id/saving-balance", async (req, res) => {
    const { account_id } = req.params;
    try {
      const [rows] = await connection.query(
        "SELECT saving FROM accounts WHERE account_id = ?",
        [account_id]
      );
      res.json(rows[0]);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // GET /api/accounts/{account_id}/transactions
  app.get("/api/accounts/:account_id/transactions", async (req, res) => {
    const { account_id } = req.params;
    const { type } = req.query;
    try {
      let query = "SELECT * FROM paymentTransactions WHERE account_id = ?";
      if (type) {
        query += " AND transaction_type = ?";
      }
      const [rows] = await connection.query(
        query,
        [account_id, type].filter(Boolean)
      );
      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // GET /api/accounts/{account_id}/expense
  app.get("/api/accounts/:account_id/expense", async (req, res) => {
    const { account_id } = req.params;
    try {
      const query = `
        SELECT
          DATE_FORMAT(transaction_date, '%Y-%m') AS month_year,
          SUM(amount) AS spendings
        FROM
          paymentTransactions
        WHERE
          transaction_type = 'WITHDRAWAL'
          AND account_id = ?
        GROUP BY
          DATE_FORMAT(transaction_date, '%Y-%m')
        ORDER BY
          DATE_FORMAT(transaction_date, '%Y-%m') ASC
      `;
      const [rows] = await connection.query(query, [account_id]);
      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // POST /api/accounts/:account_id/expense
  app.post("/api/accounts/:account_id/expense", async (req, res) => {
    const { account_id } = req.params;
    const { amount, memo, categoryId, memberId } = req.body;
    if (!amount || !memo || !categoryId || !memberId) {
      return res.status(400).send("Missing required fields");
    }

    try {
      // Start transaction
      await connection.beginTransaction();

      // Insert the expense transaction
      await connection.query(
        'INSERT INTO paymentTransactions (amount, account_id, category_id, member_id, message, transaction_type) VALUES (?, ?, ?, ?, ?, "WITHDRAWAL")',
        [amount, account_id, categoryId, memberId, memo]
      );

      // Update the account balance
      await connection.query(
        "UPDATE accounts SET balance = balance - ? WHERE account_id = ?",
        [amount, account_id]
      );

      // Fetch the updated balance
      const [balanceRows] = await connection.query(
        "SELECT balance FROM accounts WHERE account_id = ?",
        [account_id]
      );
      const updatedBalance = balanceRows[0].balance;

      // Commit transaction
      await connection.commit();

      // Send response with updated balance
      res
        .status(201)
        .json({ message: "Expense recorded", balance: updatedBalance });
    } catch (err) {
      // Rollback transaction in case of error
      await connection.rollback();
      res.status(500).send(err.message);
    }
  });

  // GET /api/accounts/:account_id/income
  app.get("/api/accounts/:account_id/income", async (req, res) => {
    const { account_id } = req.params;
    try {
      const query = `
        SELECT
          DATE_FORMAT(transaction_date, '%Y-%m') AS month_year,
          SUM(amount) AS income
        FROM
          paymentTransactions
        WHERE
          transaction_type = 'DEPOSIT'
          AND account_id = ?
        GROUP BY
          DATE_FORMAT(transaction_date, '%Y-%m')
        ORDER BY
          DATE_FORMAT(transaction_date, '%Y-%m') ASC
      `;
      const [rows] = await connection.query(query, [account_id]);
      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // POST /api/accounts/:account_id/income
  app.post("/api/accounts/:account_id/income", async (req, res) => {
    const { account_id } = req.params;
    const { amount, memo, memberId } = req.body;
    if (!amount || !memo || !memberId) {
      return res.status(400).send("Missing required fields");
    }

    try {
      // Start transaction
      await connection.beginTransaction();

      // Insert the income transaction
      await connection.query(
        'INSERT INTO paymentTransactions (amount, account_id, member_id, message, transaction_type) VALUES (?, ?, ?, ?, "DEPOSIT")',
        [amount, account_id, memberId, memo]
      );

      // Update the account balance
      await connection.query(
        "UPDATE accounts SET balance = balance + ? WHERE account_id = ?",
        [amount, account_id]
      );

      // Fetch the updated balance
      const [balanceRows] = await connection.query(
        "SELECT balance FROM accounts WHERE account_id = ?",
        [account_id]
      );
      const updatedBalance = balanceRows[0].balance;

      // Commit transaction
      await connection.commit();

      res
        .status(201)
        .json({ message: "Expense recorded", balance: updatedBalance });
    } catch (err) {
      // Rollback transaction in case of error
      await connection.rollback();
      res.status(500).send(err.message);
    }
  });

  // GET /api/categories
  app.get("/api/categories", async (req, res) => {
    try {
      const [rows] = await connection.query("SELECT * FROM categories");
      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // GET /api/member/:member_id/missions
  app.get("/api/member/:member_id/missions", async (req, res) => {
    const { member_id } = req.params;
    try {
      const [rows] = await connection.query(
        "SELECT * FROM memberMissions WHERE member_id = ?",
        [member_id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // PATCH /api/member/:member_id/mission/:mission_id
  app.patch("/api/member/:member_id/mission/:mission_id", async (req, res) => {
    const { member_id, mission_id } = req.params;
    const { is_completed } = req.body;
    try {
      await connection.query(
        "UPDATE memberMissions SET is_completed = ? WHERE member_id = ? AND mission_id = ?",
        [is_completed, member_id, mission_id]
      );
      res.send("Mission updated");
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // GET /api/member/:member_id/exp
  app.get("/api/member/:member_id/exp", async (req, res) => {
    const { member_id } = req.params;
    try {
      const [rows] = await connection.query(
        "SELECT rankpoint FROM members WHERE member_id = ?",
        [member_id]
      );
      res.json(rows[0]);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

main().catch((err) => {
  console.error("Failed to connect to the database:", err);
});
