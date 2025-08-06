import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import transactionRouter from "./routes/transaction.route";

dotenv.config({
  quiet: true,
});

const app = express();
const PORT = process.env.PORT || 6969;

// Atur CORS agar menerima dari frontend (Vite)
app.use(
  cors({
    origin: "http://localhost:5173", // host frontend kamu
    credentials: true, // jika kirim cookie atau Authorization
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/transactions", transactionRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("POS Backend is Running 🚀");
});

app.listen(PORT, () => {
  console.log(`server run on PORT : ${PORT}`);
});
