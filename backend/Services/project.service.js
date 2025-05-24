import projectModel from "../models/projects.model.js";
import mongoose from "mongoose";



export const createProject = async ({ name, userId }) => {

    if (!name || !userId) {
        throw new Error("Project name and User ID are required");
    }

    try {
        const newProject = await projectModel.create({ name, users: userId }); //create a new project with the name and userId

        if (!newProject) {
            throw new Error("Error creating project");
        }

        return newProject;
    } catch (error) {
        throw new Error("Error creating project: " + error.message);
    }
}



export const getallprojects = async (userId) => {
    if (!userId) {
        throw new Error("User ID is required");
    }

    try {
        // Find all projects where the userId exists in the users array
        const allprojects = await projectModel.find({
            users: { $in: [userId] }  // Check if userId exists in users array
        }).populate("users", "email"); // Populate the users field with email

        console.log("Projects found for user:", userId, allprojects);
        return allprojects;
    } catch (error) {
        console.error("Error in getallprojects:", error);
        throw new Error("Error fetching projects: " + error.message);
    }
}

export const addUserToProject = async (projectId, userId, users) => {
    if (!projectId || !userId || !users) {
        throw new Error("Project ID, User ID, and Users are required");
    }

    // Validate projectId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID format");
    }

    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID format");
    }

    if (!Array.isArray(users)) {
        throw new Error("Users must be an array");
    }

    const invalidUsers = users.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidUsers.length > 0) {
        throw new Error(`Invalid User IDs format: ${invalidUsers.join(', ')}`);
    } // Check if all user IDs are valid ObjectId format


    try {


        const currentproject = await projectModel.findById({
            _id: projectId,//first finds the project by id
            userId: userId //then checks if the user is the owner of the current project or not
        })
        if (!currentproject) {
            throw new Error("Project not found or you are not the owner of this project");
        }


        //updates the current project by adding the users to the project
        // $addToSet is used to add the users to the project, and $each is used to add multiple users at once
        const updatedProject = await projectModel.findOneAndUpdate({ _id: projectId }, //finds the project by id

            { $addToSet: { users: { $each: users } } }, //adds the users to the project
            { new: true, runValidators: true }
        ).populate("users", "email") //populates the users with their email



        if (!updatedProject) {
            throw new Error("Error adding users to project");
        }

        return updatedProject;

    } catch (error) {
        console.log("Error adding user to project:", error);
        throw new Error("Error adding user to project: " + error.message);
    }

}

export const removeUserToProject = async (projectId, userId, users) => {
    if (!projectId || !userId || !users) {
        throw new Error("Project ID, User ID, and Users are required");
    }

    // Validate projectId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID format");
    }

    // Validate userId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid User ID format");
    }

    if (!Array.isArray(users)) {
        throw new Error("Users must be an array");
    }

    const invalidUsers = users.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidUsers.length > 0) {
        throw new Error(`Invalid User IDs format: ${invalidUsers.join(', ')}`);
    } // Check if all user IDs are valid ObjectId format


    try {

        const currentproject = await projectModel.findById({
            _id: projectId,//first finds the project by id
            userId: userId //then checks if the user is the owner of the current project or not
        })
        if (!currentproject) {
            throw new Error("Project not found or you are not the owner of this project");
        }

        //updates the current project by removing the users from the project
        // $pull is used to remove the users from the project
        const updatedProject = await projectModel.findByIdAndUpdate(projectId, {
            $pull: {
                users: { $in: users } //removes the users from the project

            }
        }, {
            new: true //returns the updated document
        }
        ).populate("users.email") //populates the users with their email
        return updatedProject;


    } catch (error) {
        console.log("Error removing user from project:", error);
        throw new Error("Error removing user from project: " + error.message);
    }
}

export const getProject = async (projectId) => {
    if (!projectId) {
        throw new Error("Project ID is required");
    }

    // Validate projectId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID format");
    }

    try {
        const project = await projectModel.findById(projectId).populate('users', "email"); //populates the users 

        if (!project) {
            throw new Error("Project not found");
        }

        return project;
    } catch (error) {
        console.log("Error fetching project:", error);
        throw new Error("Error fetching project: " + error.message);
    }
}



export const updateProject = async ({ projectId, filetree }) => {
    if (!projectId || !filetree) {
        throw new Error("Project ID and filetree are required");
    }

    // Validate projectId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project ID format");
    }

    try {
        const updatedProject = await projectModel.findByIdAndUpdate(
            { _id: projectId },
            {
                filetree
            }, {
            new: true, // Return the updated document
        }

        );

        if (!updatedProject) {
            throw new Error("Error updating project");
        }

        return updatedProject;
    } catch (error) {
        console.log("Error updating project:", error);
        throw new Error("Error updating project: " + error.message);
    }
}



