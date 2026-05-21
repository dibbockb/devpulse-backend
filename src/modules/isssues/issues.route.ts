import { Router } from "express";
import { issuesController } from "./issues.controller";

const router = Router()

router.post(`/`, issuesController.createIssue)
router.get(`/`, issuesController.getIssues)
router.get(`/:id`, issuesController.getSingleIssue)
router.patch(`/:id`, issuesController.updateIssue)

export const issuesRoute: Router = router;