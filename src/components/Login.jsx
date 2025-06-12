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
      const response = await axios.post( API_URL+"/auth/login", {
        email: email.current.value,
        password: password.current.value,
      });

      console.log("API Response:", response);
      console.log("API Response Data:", response.data);

      if (response.data && response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        dispatch(setUser(response.data.user));
        dispatch(setToken(response.data.token));
        navigate("/");
      } else {
        setErrorMessage("Unexpected response from server. Please try again.");
      }
    } catch (error) {
      console.error("Login API Error:", error.response);
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm((prev) => !prev);
    setErrorMessage("");
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
        <input
          ref={password}
          type="password"
          placeholder="Password"
          className="p-2 my-2 w-full bg-gray-700 rounded"
        />
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
