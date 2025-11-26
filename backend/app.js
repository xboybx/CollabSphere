import express from 'express';
const app = express();
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './DBConfig/dbConfig.js';
import UserRoutes from './routes/user.Routes.js';
import ProjectRoutes from './routes/projects.Routes.js';
import aiRoutes from "./routes/ai.routes.js"
import cors from 'cors';




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());






connectDB();

app.use("/users", UserRoutes);
app.use("/projects", ProjectRoutes);
app.use("/ai", aiRoutes);


export default app;