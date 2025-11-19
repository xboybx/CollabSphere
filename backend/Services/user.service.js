import userModel from "../models/userModel.js";


export const createUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await userModel.create({ email, password });

    return user;


}


export const getallUsers = async () => {

    try {

        const allUsers = await userModel.find({});
        if (!allUsers) {
            throw new Error("No users found");
        }
        return allUsers;

    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Error fetching users: " + error.message);
    }
}


export const getUser = async (userId) => {

    if (!userId) {
        throw new Error("Email is required")
    }

    try {
        const user = await userModel.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error("Error fetching user: " + error.message);
    }

}

