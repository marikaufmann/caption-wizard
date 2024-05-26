import express from "express";
import validateResource from "../middleware/validateResource";
import {
  createUserHandler,
  getCurrentUserHandler,
  editUserHandler,
  deleteUserHandler,
} from "../controller/user.controller";
import {
  createUserValidator,
  editUserValidator,
  deleteUserValidator,
} from "../lib/validators/user";
import requireUser from "../middleware/requireUser";
const router = express.Router();

router.post("/", validateResource(createUserValidator), createUserHandler);
router.get("/me", requireUser, getCurrentUserHandler);
router.put(
  "/:userId",
  [requireUser, validateResource(editUserValidator)],
  editUserHandler
);
router.delete(
  "/:userId",
  [requireUser, validateResource(deleteUserValidator)],
  deleteUserHandler
);
export default router;
