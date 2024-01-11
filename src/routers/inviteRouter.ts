import { Router } from "express";
import invitePost from "../controllers/invite/invitePost";
import inviteGet from "../controllers/invite/inviteGet";
import invitePut from "../controllers/invite/invitePut";
import inviteDelete from "../controllers/invite/inviteDelete";

const router = Router();

router.post("/", invitePost);
router.get("/", inviteGet);
router.put("/", invitePut);
router.delete("/", inviteDelete);

export default router;
