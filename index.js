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

  // GET /api/accounts/:account_id/transactions
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

  // POST /api/accounts/:account_id/expense
  app.post("/api/accounts/:account_id/expense", async (req, res) => {
    const { account_id } = req.params;
    const { amount, category_id, member_id, transaction_date, message } =
      req.body;
    try {
      await connection.query(
        'INSERT INTO paymentTransactions (amount, account_id, category_id, member_id, transaction_date, message, transaction_type) VALUES (?, ?, ?, ?, ?, ?, "WITHDRAWAL")',
        [amount, account_id, category_id, member_id, transaction_date, message]
      );
      res.status(201).send("Expense recorded");
    } catch (err) {
      res.status(500).send(err.message);
    }
  });

  // POST /api/accounts/:account_id/income
  app.post("/api/accounts/:account_id/income", async (req, res) => {
    const { account_id } = req.params;
    const { amount, category_id, member_id, transaction_date, message } =
      req.body;
    try {
      await connection.query(
        'INSERT INTO paymentTransactions (amount, account_id, category_id, member_id, transaction_date, message, transaction_type) VALUES (?, ?, ?, ?, ?, ?, "DEPOSIT")',
        [amount, account_id, category_id, member_id, transaction_date, message]
      );
      res.status(201).send("Income recorded");
    } catch (err) {
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
