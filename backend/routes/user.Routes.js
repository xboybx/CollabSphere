import { Router } from 'express';
const router = Router();
import { body } from 'express-validator';
import * as UserControllers from '../Controllers/users.controller.js';
import authMiddleware from '../Middleware/user.middleware.js';


router.post('/register',
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    UserControllers.userCreateController
);
router.post("/login",
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    UserControllers.userLoginController
)

router.get("/profile", authMiddleware, UserControllers.userProfileController)

router.get("/logout", authMiddleware, UserControllers.userLogoutController)



router.get("/allUsers",
    authMiddleware, UserControllers.getallUsersController);


router.get("/getUser",
    // body("userId").isString().withMessage("User ID must be a String"),

    authMiddleware, UserControllers.getUserController);



export default router;

