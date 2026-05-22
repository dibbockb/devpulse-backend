import { Router } from "express";
import { issuesController } from "./issues.controller";
import { auth } from "../../middleware/auth";

const router = Router()

router.get(`/`, issuesController.getIssues)
router.get(`/:id`, issuesController.getSingleIssue)
router.patch(`/:id`, issuesController.updateIssue)
router.post(`/`, auth.verifyToken(), auth.checkRole("contributor", "maintainer"), issuesController.createIssue)
router.delete(`/:id`, auth.verifyToken(), auth.checkRole("maintainer"), issuesController.deleteIssue)

export const issuesRoute: Router = router;