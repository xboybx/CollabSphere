import * as projectService from "../Services/project.service.js";
import { validationResult } from "express-validator";



export const createProjectController = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name } = req.body;
        const userId = req.user.id;

        const newProject = await projectService.createProject({ userId, name });
        return res.status(201).json(newProject);
    } catch (error) {
        console.error("Error creating project:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const getallProjectsController = async (req, res) => {//gets all projects of the Curent logged in user
    const userId = req.user.id;
    console.log("userId", userId);


    try {
        const allprojects = await projectService.getallprojects(userId);
        // console.log("Found projects:", allprojects);
        return res.status(200).json({ Current_User_All_Projects: allprojects });

    } catch (error) {
        console.error("Error fetching projects:", error);
        return res.status(500).json({ message: error.message });
    }

}


export const addUserToProjectController = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        //to find the project and add user to it,it finda project on basis of projectId and
        //  userId is to check if the user is the ower of the project or not
        //users is the array of users to be added to the project, and this users arry comes from the body of the request i.e Frontend
        const { projectId, users } = req.body;
        const userId = req.user.id;// only to check if the user is the owner of the project or not

        const updatedProject = await projectService.addUserToProject(projectId, userId, users);
        return res.status(200).json({ message: "Users added to project successfully", updatedProject });


    } catch (error) {
        console.error("Error adding user to project:");
        return res.status(500).json({ message: error.message });
    }

}


export const removeUserToProjectController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectId, users } = req.body;
        const userId = req.user.id;
        const updatedProject = await projectService.removeUserToProject(projectId, userId, users);
        return res.status(200).json({ message: "Users removed to project successfully", updatedProject });

    } catch (error) {
        console.error("Error removing user from project:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const getProjectController = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).json({ errors: errors.array() })
    }
    const { projectId } = req.params;

    try {
        const project = await projectService.getProject(projectId);
        return res.status(200).json({ message: "Project fetched successfully", project });
    } catch (error) {
        console.error("Error fetching project:", error);
        return res.status(500).json({ message: error.message });
    }


}

export const updateProjectController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectId, filetree } = req.body;
        // console.log("projectId", projectId);
        // console.log("filetree", filetree);




        const updatedProject = await projectService.updateProject({ projectId, filetree });
        return res.status(200).json({ message: "Project updated successfully", updatedProject });
    } catch (error) {
        console.error("Error updating project:", error);
        return res.status(500).json({ message: error.message });
    }
}

