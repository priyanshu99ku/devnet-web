import { useRef, useState } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setUser, setToken } from '../utils/userSliece';
import { API_URL } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    // Simple validation
    if (!email.current.value || !password.current.value || (!isSignInForm && !name.current.value)) {
      setErrorMessage("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: email.current.value,
        password: password.current.value,
      }, {
        withCredentials: true
      });

      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch(setUser(response.data.user));
        dispatch(setToken(response.data.token));
        navigate("/");
      } else {
        setErrorMessage("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Login API Error:", error.response);
      setErrorMessage(error.response?.data?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm((prev) => !prev);
    setErrorMessage("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center py-16">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-10 bg-blue-950 text-white rounded-lg bg-opacity-80"
        style={{ minWidth: 320 }}
      >
        <h1 className="font-bold text-3xl py-4 my-4">{isSignInForm ? "Sign In" : "Sign up"}</h1>
        {!isSignInForm && (
          <input
            ref={name}
            type="text"
            placeholder="Full Name"
            className="p-2 my-2 w-full bg-gray-700 rounded"
          />
        )}
        <input
          ref={email}
          type="text"
          placeholder="Email address"
          className="p-2 my-2 w-full bg-gray-700 rounded"
        />
        <div className="relative">
          <input
            ref={password}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="p-2 my-2 w-full bg-gray-700 rounded"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.622a8.773 8.773 0 0110.118-2.392c1.139.691 1.77 1.83 1.954 2.115l.394.593c.321.483.693.908 1.136 1.258C20.6 13.91 22.5 16.71 22.5 19.5c0 1.229-.297 2.404-.842 3.468M10.118 6.23c-1.487-.899-3.21-1.398-5.004-1.398h-.839L2.83 3.993m.17-2.181a1.272 1.272 0 00-1.848 1.547l1.012 1.519c.148.222.256.452.327.683.053.18.093.367.118.557m5.679 4.417c.56.012 1.108.068 1.638.161M12.986 4.773l1.532-2.3c.725-1.089 2.05-1.341 3.085-.688 1.036.653 1.229 1.988.455 3.076l-1.53 2.3c-.15.225-.262.457-.336.69"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-black"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        </div>
        {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-red-700 p-4 my-8 w-full rounded-lg hover:bg-red-800 transition-colors disabled:bg-red-900"
        >
          {loading ? "Loading..." : (isSignInForm ? "Sign In" : "Sign up")}
        </button>
        <p className="py-4 cursor-pointer hover:underline" onClick={toggleSignInForm}>
          {isSignInForm
            ? "New to Devnet? Sign Up Now"
            : "Already registered? Sign In Now.."}
        </p>
      </form>
    </div>
  );
}

export default Login;
