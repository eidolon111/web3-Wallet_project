import express from "express";
import dotenv from "dotenv";
import { ethers, formatEther } from "ethers";

const app = express();

const port = process.env.port || 5000;

app.use(express.json());

app.use(express.json());

// get poast
try {
  app.get("/ethbalance/:adress", async (req, res) => {
    const { adress } = req.params;
    let EtheriumProvider = new ethers.EtherscanProvider("https://eth.drpc.org");

    const ethbalance = await EtheriumProvider.getBalance(adress);
    let BalanceConverted = Number(formatEther(ethbalance));
    let userbalance = BalanceConverted.toFixed(2);
    console.log(`EtheriumBalance:${userbalance}`);
    res.status(200).json({
      adress,
      ethruim: {
        balance: userbalance,
      },
    });
  });
} catch (error) {
  console.log("Error getting balance ");
  res.status(500).json({ message: error.message });
}

// app.get for polyGon
try {
  app.get("/polygonbalance/:adress", async (req, res) => {
    const { adress } = req.params;
    let polyGonprovider = new ethers.JsonRpcProvider(
      "https://polygon.rpc.subquery.network/public"
    );

    const polygonbalance = await polyGonprovider.getBalance(adress);
    let BalanceConverted = Number(formatEther(polygonbalance));
    let usersBalance = BalanceConverted.toFixed(3);
    console.log(`PolyGon balance : ${usersBalance}`);
    res.status(200).json({
      adress,
      polygon: {
        balance: usersBalance,
      },
    });
  });
} catch (error) {
  console.log("error getting the balance of the polygon account");
  res.status(500).json({ message: error.message });
}

app.listen(port, () => console.log(`server is running on ${port}`));
