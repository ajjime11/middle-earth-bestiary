import express from "express";
import {
  getCreatures,
  getCreatureById,
  createCreature,
  updateCreature,
  deleteCreature,
} from "../controllers/creatureController.js";

const router = express.Router();

router.route("/").get(getCreatures).post(createCreature);

router
  .route("/:id")
  .get(getCreatureById)
  .put(updateCreature)
  .delete(deleteCreature);

export default router;
