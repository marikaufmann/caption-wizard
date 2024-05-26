import express from "express";
import {
  addCreditsHandler,
  createPaymentIntentHandler,
} from "../controller/credits.controller";
import validateResource from "../middleware/validateResource";
import { createPaymentValidator } from "../lib/validators/payment";
const router = express.Router();

router.post("/payment-intent", validateResource(createPaymentValidator), createPaymentIntentHandler);
router.post("/add-credits", addCreditsHandler);

export default router;
