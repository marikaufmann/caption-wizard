import express from "express";
import { CreateSessionValidator } from "../lib/validators/session";

import {
  createUserSessionHandler,
  deleteSessionHandler,
  getCurrentSessionHandler,
  getUserSessionsHandler,
  googleOauthHandler,
} from "../controller/session.controller";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateResource";

const router = express.Router();
router.post(
  "/",
  validateResource(CreateSessionValidator),
  createUserSessionHandler
);
router.get("/", requireUser, getUserSessionsHandler);
router.delete("/", requireUser, deleteSessionHandler);
router.get("/validate-session", requireUser, getCurrentSessionHandler);
router.get("/oauth/google/", googleOauthHandler);
export default router;
