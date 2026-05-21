import { Router } from "express";
import { issuesController } from "./issues.controller";

const router = Router()

router.post(`/`, issuesController.createIssue)
router.get(`/`, issuesController.getIssues)

export const issuesRoute: Router = router;