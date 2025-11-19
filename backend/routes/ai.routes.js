import { Router } from "express";
const router = Router();
import * as aicontrollers from "../Controllers/ai.controller.js";
// import authMiddleware from "../Middleware/user.middleware.js";


router.get("/get-result",
    // body("prompt").isLength({ min: 3 }).withMessage("Prompt must be at least 3 characters long"),
    aicontrollers.getairesultContoller);



export default router;