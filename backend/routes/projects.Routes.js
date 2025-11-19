import Router from "express";
const router = Router();
import * as ProjectControllers from "../Controllers/projects.controller.js";
import authMiddleware from "../Middleware/user.middleware.js";
import { body, param } from "express-validator";



router.post("/create",
    body("name").isLength({ min: 3 }).withMessage("Project name must be at least 3 characters long"),
    authMiddleware, ProjectControllers.createProjectController);

router.get("/allProjects",
    authMiddleware, ProjectControllers.getallProjectsController);

router.put("/add-user",
    body("projectId").isString().withMessage("Project ID must be a String"),
    body("users").isArray().withMessage("Users must be an array"),
    authMiddleware, ProjectControllers.addUserToProjectController);

router.put("/remove-user",
    body("projectId").isString().withMessage("Project ID must be a String"),
    body("users").isArray().withMessage("Users must be an array"),
    authMiddleware, ProjectControllers.removeUserToProjectController);

router.get("/get-project/:projectId",
    param("projectId").isString().withMessage("Project ID must be a String"),
    authMiddleware, ProjectControllers.getProjectController);


router.put("/update-filetree",
    body("projectId").isString().withMessage("Project ID must be a String"),
    body("filetree").isObject().withMessage("File tree must be an object"),
    authMiddleware, ProjectControllers.updateProjectController);





export default router;