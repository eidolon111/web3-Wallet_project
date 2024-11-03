import { ethers } from "ethers";
import express from "express";
import router from "./routes/wallet.js";
const app = express();

const port = process.env.port || 5500;
app.use(express.json());
app.use("/", router);


console.log("=== cooking up something =======");
// console.log(createSinglewalletEncrypted())

app.listen(port, () => console.log(`server is running on ${port}`));
