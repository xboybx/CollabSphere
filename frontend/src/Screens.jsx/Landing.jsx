import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import plusIcon from "../../public/plus.svg";
import "./Landing.css";

const Landing = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center font-sans animated-background p-4"
      style={{
        backgroundImage: `url(${plusIcon})`,
        backgroundRepeat: "repeat",
        backgroundSize: "40px 40px",
      }}
    >
      <div className="max-w-4xl p-8">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold mb-4 leading-tight"
        >
          Welcome to CollabSphere
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-2xl mb-8 text-green-400"
        >
          Your Collaborative Development Platform, Supercharged with AI.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-lg mb-10 text-gray-300 max-w-3xl mx-auto"
        >
          CollabSphere helps developers connect, create projects, and work
          together seamlessly. With an integrated AI assistant in a group chat
          environment, you can streamline your workflow and bring your ideas to
          life faster than ever. It's like having a mini IDE in the cloud.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex justify-center gap-4 mb-16"
        >
          <Link
            to="/login"
            className="px-8 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-lg hover:bg-green-600 transition-transform transform hover:scale-105"
          >
            Get Started
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-transparent text-white font-semibold border-2 border-white rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
          >
            Sign Up
          </Link>
        </motion.div>
      </div>

      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 text-left">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-2 text-green-400">
              1. Create & Manage Projects
            </h3>
            <p className="text-gray-300">
              Start by creating a new project. Manage your projects and
              collaborators all in one place.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-2 text-green-400">
              2. Real-time Collaboration
            </h3>
            <p className="text-gray-300">
              Work with your team in a real-time group chat. Share ideas,
              discuss code, and stay in sync.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.6 }}
            className="bg-gray-800 p-6 rounded-lg"
          >
            <h3 className="text-2xl font-bold mb-2 text-green-400">
              3. AI-Powered Assistance
            </h3>
            <p className="text-gray-300">
              Leverage the power of AI directly in your chat. Get help with
              code, debug issues, and generate new ideas.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
