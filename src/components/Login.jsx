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
  const [showSignInPopup, setShowSignInPopup] = useState(false);
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

  const handleRightSwipeClick = () => {
    setShowSignInPopup(true);
  };

  return (
    <div className="flex h-screen w-screen" style={{ backgroundImage: 'linear-gradient(to right, #c8e6c9,#ffffff,#c8e6c9)', transition: 'background-image 0.5s ease-in-out' }}>
      {/* Left Section - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md p-10 bg-black shadow-xl rounded-lg"
        >
          <h1 className="font-bold text-3xl py-4 my-4 text-white">{isSignInForm ? "Sign In" : "Sign up"}</h1>
          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="input input-bordered w-full my-2 bg-white text-gray-900 border-gray-300"
            />
          )}
          <input
            ref={email}
            type="text"
            placeholder="Email address"
            className="input input-bordered w-full my-2 bg-white text-gray-900 border-gray-300"
          />
          <div className="relative">
            <input
              ref={password}
              type="password"
              placeholder="Password"
              className="input input-bordered w-full my-2 bg-white text-gray-900 border-gray-300"
            />
          </div>
          {errorMessage && <p className="text-sm text-red-500 mt-2">{errorMessage}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn w-full mt-8 bg-violet-600 hover:bg-violet-700 border-violet-600"
          >
            {loading ? "Loading..." : (isSignInForm ? "Sign In" : "Sign up")}
          </button>
          <p className="py-4 cursor-pointer hover:underline text-center text-white" onClick={toggleSignInForm}>
            {isSignInForm
              ? "New to Devnet? Sign Up Now"
              : "Already registered? Sign In Now.."}
          </p>
        </form>
      </div>

      {/* Vertical Separator */}
      <div className="border-l border-gray-600 h-full"></div>

      {/* Right Section - Marketing Text and Button */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 text-center pl-16">
        <h2 className="text-5xl font-bold mb-6 text-gray-900">Welcome to DevNet</h2>
        <p className="text-xl font-semibold mb-4 text-gray-950">
          Connect. Collaborate. Code.
        </p>
        <p className="text-lg leading-relaxed max-w-md text-gray-600 mb-8">
          Swipe right to find your next project
          partner, mentor, teammate, or collaborator in your domain.
          Join a network where passion meets purpose.
          Let's build the future, one connection at a time.
        </p>
        <button
          className="btn btn-lg btn-circle bg-green-500 hover:bg-green-600 text-white shadow-lg"
          onClick={handleRightSwipeClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </button>
      </div>

      {/* Popup Modal */}
      {showSignInPopup && (
        <dialog id="signIn_modal" className="modal modal-open">
          <div className="modal-box text-center">
            <h3 className="font-bold text-lg text-error">Please Sign In!</h3>
            <p className="py-4">You need to be logged in to use this feature.</p>
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-primary" onClick={() => setShowSignInPopup(false)}>Close</button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}

export default Login;
