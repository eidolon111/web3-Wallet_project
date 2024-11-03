import axios from "axios";
import { Transaction } from "ethers";
import dotenv from "dotenv";
import { ethers } from "ethers";
dotenv.config();
const polyGonZKEVN = "https://rpc.cardona.zkevm-rpc.com";
const tokenABI = [
  // Standard ERC-20 functions
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
  "function _decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function _symbol() view returns (string)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function name() view returns (string)",
];
const convertToTokenUnits = (amount, decimals) => {
  return ethers.parseUnits(amount, decimals);
};
const convertFromTokenUnits = (amount, decimals) => {
  return ethers.formatUnits(amount, decimals);
};

export const createSingleWallet = async (req, res) => {
  try {
    const wallet1 = ethers.Wallet.createRandom();
    const seedphrase = wallet1.mnemonic.phrase;
    const privateKey1 = wallet1.privateKey;
    // console.log(wallet1, seedphrase, privateKey1)

    const address1 = wallet1.address;

    const wallet = {
      address: address1,
      privatekey: privateKey1,
      nmemonic: seedphrase,
    };
    res.status(200).json(wallet);
  } catch (error) {
    res.status(400).json({ message: "error nothing was found" });
  }
};

export const sendERC20 = async (req, res) => {
  try {
    const { address } = req.body;
    const { erc20contractAddress } = req.body;
    const { amount } = req.body;
    const { privatekey } = req.body;
    const Provider = new ethers.JsonRpcProvider(polyGonZKEVN);
    const walletInstance = new ethers.Wallet(privatekey, Provider);
    const tokenContract = new ethers.Contract(
      erc20contractAddress,
      tokenABI,
      walletInstance
    );

    const tokenDecimal = await tokenContract.decimals();
    const BalanceConverted = convertToTokenUnits(amount, tokenDecimal);
    const Transfer = await tokenContract.transfer(address, BalanceConverted);
    res.status(200).json({
      message: `Transaction successful, total amount of ${amount} has been sent successfully to ${address}`,
      res: Transfer.hash,
    });
  } catch (error) {
    res.status(400).json({ message: "somethig went wrong" });
  }
};

//  to get transaction history
export const transHistory = async (req, res) => {
  try {
    const { address } = req.body;
    const Url = `https://api-zkevm.polygonscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${process.env.Api_key}`;
    const Response = await axios.get(Url);
    res.status(200).json({ message: "Fetch Trasanction history successful" });
    console.log(Response.data.result);
  } catch (error) {
    res.status(400).json({ messge: "ERROR!!! Something went wrong" });
  }
};

//  send native token
export const Send_NativeToken = async (req, res) => {
  try {
    const { address, amount, privatekey } = req.body;
    const Provider = new ethers.JsonRpcProvider(polyGonZKEVN);
    const walletInstance = new ethers.Wallet(privatekey, Provider);
    const tx = await walletInstance.sendTransaction({
      to: address,
      value: ethers.parseEther(amount.toString()),
    });
    console.log(tx);
    res
      .status(200)
      .json({ message: `The trasanction successful `, response: tx });
    return tx.hash;
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
};
//  query native balance
export const query_native = async (req, res) => {
  try {
    const { address } = req.body;
    const Provider = new ethers.JsonRpcProvider(polyGonZKEVN);

    const balance = await Provider.getBalance(address);
    const ConvertedBalance = ethers.formatEther(balance);

    res.status(200).json({
      message: "Balance fetched successfully",
      response: ConvertedBalance,
    });
    // return ConvertedBalance
  } catch (error) {
    res.status(404).json({ message: "Something went wrong, Try again" });
  }
};
//  querry Erc20 Balance
export const querryERC20Bal = async (req, res) => {
  try {
    const { address, erc20contractAddress } = req.body;
    const provider = new ethers.JsonRpcProvider(polyGonZKEVN);
    const tokenContract = new ethers.Contract(
      erc20contractAddress,
      tokenABI,
      provider
    );
    const tokenDecimals = await tokenContract.decimals();
    const batchRequest = await Promise.all([
      tokenContract.balanceOf(address),
      tokenContract.name(),
    ]);
    const amount = batchRequest[0];
    const tokenName = batchRequest[1];
    const convertedAmount = convertFromTokenUnits(amount, tokenDecimals);

    res.status(200).json({
      message: "successfully fettched ERC20Token balance",
      response: convertedAmount,
      tokenName,
    });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong try again" });
    console.log(error);
  }
};
