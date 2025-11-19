import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import app from './app.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import UserModel from './models/userModel.js';
import ProjectModel from './models/projects.model.js';
import { callGeminiAPI } from './Services/gemini.ai.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
    }
}
);


io.use(async (Socket, next) => {//only auth user can connect to socket
    // console.log("socket object in md`", Socket)
    try {
        const token = Socket.handshake.auth?.token || Socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = Socket.handshake.query.projectId.toString();
        // log("projectId", projectId);

        Socket.project = await ProjectModel.findById(projectId).populate('users', 'email'); //the room details

        //get the current project id from frotned socket qurey
        //find the project from db and save it in socket object and can be acessed bt socket.project-which has currenr project details
        //make the projectid as the room id
        //after that jpin the room in socket.on function and pass the project id coz we are using it as room id
        if (!token) {
            return Socket.disconnect();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return Socket.disconnect();
        }

        const user = await UserModel.findById(decoded.id);//remove this in future

        if (!user) {
            return Socket.disconnect();
        }

        Socket.user = user;//here assign decoded instead of user if not works
        next();

    } catch (error) {
        console.log(error);
        return next(new Error('Authentication error'));
    }
})


io.on('connection', async Socket => {
    console.log('a user connected from socket.io');
    Socket.roomId = Socket.project._id.toString();//here we are using project id as room id,roomId is alreasy avaliable in socked object we are jest assignignour peojrct id to id
    // console.log("Project id from socket -project object", projectId);

    Socket.join(Socket.roomId);

    Socket.on("project-message", async data => {
        console.log("message from clientside recived to braodcat to all users in the room", data);

        const aipresent = data.message.includes("@ai");//check if the message contains "ai"
        try {
            if (aipresent) {
                console.log("AI mention detected. Processing...");
                const prompt = data.message.replace(/@ai/i, "").trim();//remove the "@ai" from the message
                console.log(`Extracted prompt: "${prompt}"`);

                const response = await callGeminiAPI(prompt);
                console.log("Received response from Gemini API.", response);

                // If response is a string, try to parse JSON
                // let parsedResponse = response;
                // if (typeof response === "string") {
                //     try {
                //         parsedResponse = JSON.parse(response);
                //     } catch (err) {
                //         console.log("Response is not JSON, sending as text");
                //         parsedResponse = { text: response };
                //     }
                // }

                io.to(Socket.roomId).emit("project-message", {
                    message: response,
                    sender: {
                        _id: "ai",
                        email: "AI"
                    }

                });
                io.to(Socket.roomId).emit("ai-response-end");
                console.log("Sent AI response to the client.");
                return;
            }
        } catch (error) {
            console.error("Gemini API error:", error);
            Socket.emit("gemini-error", { message: error.message });
            return;
        }


        Socket.broadcast.to(Socket.roomId).emit("project-message", data);//emits the clent msg to all the users in room ot project


    })

    Socket.on('event', data => { /* … */ });
    Socket.on('disconnect', () => {
        Socket.leave(Socket.roomId);
    });


});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});