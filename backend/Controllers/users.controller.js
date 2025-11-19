import * as userService from '../Services/user.service.js';
import userModel from "../models/userModel.js";
import { validationResult } from 'express-validator';
import BlacklistToken from "../models/blacklistTokens.js";

export const userCreateController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const hashpass = await userModel.hashpassword(password);

        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "Email alredy Exists" })
        }

        const user = await userService.createUser({ email, password: hashpass });
        const token = user.generateToken();

        //here in Responde password is not included
        delete user._doc.password;

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const userLoginController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Explicitly include the password field in the query
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await user.ComparePassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = user.generateToken();

        //here in Responde password is not included
        delete user._doc.password;


        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const userProfileController = async (req, res) => {
    res.status(200).json({ user: req.user });
}

export const userLogoutController = async (req, res) => {

    res.clearCookie("token")
    const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1]);

    const blacktoken = await BlacklistToken.findOne({ token });
    if (blacktoken) {
        return res.status(400).json({ error: "Already logged out" });
    }

    if (!blacktoken) {
        await BlacklistToken.create({ token });
    }



    res.status(200).json({ message: "Logout successful" });
}




// Controller to get all users
export const getallUsersController = async (req, res) => {

    try {
        let allUsers = await userService.getallUsers();
        res.status(200).json({ allUsers });

    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ message: error.message });
    }

}


// Controller to get a specific user by email
export const getUserController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {


        const userId = req.user.id; // Get the userId from the request object

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }


        const user = await userService.getUser(userId); // Call the getUser function with userId and email
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });

    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ message: error.message });
    }
}
