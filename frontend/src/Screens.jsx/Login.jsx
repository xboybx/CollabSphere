import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { userContext } from "../Context/UsercontextProvider";

import axios from "../../../frontend/config/axios.config";
import { Moon, Sun, Mail, Lock } from "lucide-react";

const Login = () => {
  const { setUser, theme, setTheme } = useContext(userContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const { data } = await axios.post("/user/login", { email, password });
      setUser(data);
      navigate("/");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 404) {
          setError("User not found. Please register first.");
        } else if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else if (
          err.response.data &&
          Array.isArray(err.response.data.errors)
        ) {
          setError(
            err.response.data.errors.map((error) => error.msg).join(", ")
          );
        } else {
          setError("An unexpected error occurred. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen font-sans transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 to-gray-100"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className="p-3 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>

      <div className="w-full max-w-md px-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-sans">
                Welcome back
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Sign in to your CollabSphere account
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-primary hover:bg-accent-light text-white font-medium rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-accent-light transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
