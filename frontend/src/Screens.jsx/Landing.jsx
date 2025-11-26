import React from "react";
import { Link } from "react-router-dom";
import { Globe } from "lucide-react";

const Landing = () => {
  return (
    <div className="relative min-h-screen font-sans text-white overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/Landing.webp')" }}
      ></div>
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-16">
        <div className="flex items-center">
          <Globe />
          <span className="ml-2 text-xl font-bold">CollabSphere</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-white no-underline">
            Log in
          </Link>
          <Link
            to="/register"
            className="text-white py-2 px-6 rounded-md font-semibold no-underline shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:shadow-lg"
          >
            Get started
          </Link>
        </div>
      </nav>
      -16
      <main className="relative z-10 flex flex-col items-center justify-start text-center px-8 py-20 lg:py-44">
        <h1 className="text-5xl lg:text-7xl font-bold mb-4">CollabSphere</h1>

        <p className="text-lg max-w-2xl leading-relaxed text-gray-500">
          CollabSphere helps developers connect, create projects, and work
          together seamlessly.
        </p>
        <div className="flex items-center gap-2 text-sm text-gray-00 mt-8">
          <span>Only supported on </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0L22 20H2l-2-4m16 0H4"></path>
          </svg>
        </div>
      </main>
    </div>
  );
};

export default Landing;
