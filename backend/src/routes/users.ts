import express from "express";
import validateResource from "../middleware/validateResource";
import {
  createUserHandler,
  getCurrentUser,
} from "../controller/user.controller";
import { createUserValidator } from "../lib/validators/user";
import requireUser from "../middleware/requireUser";
const router = express.Router();

router.post("/", validateResource(createUserValidator), createUserHandler);
router.get("/me", requireUser, getCurrentUser);
export default router;
