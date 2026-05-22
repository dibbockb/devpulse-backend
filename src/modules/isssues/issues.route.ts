import { Router } from "express";
import { issuesController } from "./issues.controller";
import { auth } from "../../middleware/auth";

const router = Router()

router.post(`/`, auth.checkToken(), auth.verifyUser(), auth.checkRole("contributor", "maintainer"), issuesController.createIssue)
router.get(`/`, issuesController.getIssues)
router.get(`/:id`, issuesController.getSingleIssue)
router.patch(`/:id`, issuesController.updateIssue)
router.delete(`/:id`, issuesController.deleteIssue)

export const issuesRoute: Router = router;