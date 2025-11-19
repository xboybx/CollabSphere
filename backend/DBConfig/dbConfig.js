import mongoose from 'mongoose';


function connectDB() {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log("Successfully connected to the database");
        // console.log(process.env);



    }).catch((error) => {
        console.log("Error connecting to the database", error);
    });
}

export default connectDB;