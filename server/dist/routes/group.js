"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const group_1 = require("../controllers/group");
const router = express_1.default.Router();
// Create a new group
router.post("/", group_1.createGroup);
// Get group details by ID
router.get("/:id", group_1.getGroup);
// Add a member to the group
router.post("/add-member", group_1.addMemberToGroup);
// Remove a member from the group
router.post("/remove-member", group_1.removeMemberFromGroup);
// Update group details
router.put("/:id", group_1.updateGroup);
// Delete a group
router.delete("/:id", group_1.deleteGroup);
exports.default = router;
