import express from "express";
// import { createSingleWallet } from "../Index.js";
import {
  createSingleWallet,
  querryERC20Bal,
  query_native,
  Send_NativeToken,
  sendERC20,
  transHistory,
} from "../createWallet/controller/wallet.controller.js";
const router = express.Router();

router.get("/create_wallet", createSingleWallet);
router.get("/sendERC20Token", sendERC20);
router.get("/transHistory", transHistory);
router.get("/sendNativeToken", Send_NativeToken);
router.get("/nativeBalance", query_native);
router.get("/tokenbalance", querryERC20Bal)
export default router;
