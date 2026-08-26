import { Router } from "express";
import { AttributeController } from "../controllers/attribute.controller.js";

const router = Router();

router.get("/", AttributeController.getAllAttributes);
router.get("/:id", AttributeController.getAttributeById);
router.post("/", AttributeController.createAttribute);
router.put("/:id", AttributeController.updateAttribute);
router.patch("/:id/status", AttributeController.updateAttributeStatus);
router.delete("/:id", AttributeController.deleteAttribute);

// Attribute Values routes
router.get("/:id/values", AttributeController.getAttributeValues);
router.post("/:id/values", AttributeController.addAttributeValue);
router.put("/:id/values/:valueId", AttributeController.updateAttributeValue);
router.delete("/:id/values/:valueId", AttributeController.deleteAttributeValue);

export default router;
