import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../utils/userSliece';
import { API_URL, DEFAULT_PROFILE_PIC } from '../utils/constants';
import axiosInstance from '../utils/axiosConfig';

function EditProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.user);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [about, setAbout] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState(""); // Will be comma-separated string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFirstName(currentUser.firstName || "");
      setLastName(currentUser.lastName || "");
      setPhotoUrl(currentUser.photoUrl || "");
      setAbout(currentUser.about || "");
      setAge(currentUser.age || "");
      setGender(currentUser.gender || "");
      setSkills(currentUser.skills ? currentUser.skills.join(', ') : "");
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const updatedSkills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);

    const updatedProfile = {
      firstName,
      lastName,
      photoUrl,
      about,
      age: age ? Number(age) : undefined,
      gender: gender || undefined,
      skills: updatedSkills,
    };

    try {
      const response = await axiosInstance.put(`${API_URL}/user/profile`, updatedProfile);
      dispatch(setUser(response.data)); // Update Redux state with new user data
      setSuccess("Profile updated successfully!");
      // Optionally navigate back to profile page after a delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-focus py-10">
        <p className="text-red-500">Please login to edit your profile.</p>
        <button onClick={() => navigate('/login')} className="btn btn-primary mt-4">Go to Login</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-focus py-10">
      <div className="card w-full max-w-lg bg-neutral shadow-xl p-8 text-neutral-content">
        <h2 className="card-title text-3xl justify-center mb-6 text-neutral-content">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="form-control w-full">
          <label className="label">
            <span className="label-text text-neutral-content">First Name</span>
          </label>
          <input 
            type="text" 
            placeholder="First Name" 
            className="input input-bordered w-full mb-4 bg-neutral-content/20 text-neutral-content border-neutral-content/30"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />

          <label className="label">
            <span className="label-text text-neutral-content">Last Name</span>
          </label>
          <input 
            type="text" 
            placeholder="Last Name" 
            className="input input-bordered w-full mb-4 bg-neutral-content/20 text-neutral-content border-neutral-content/30"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />

          <label className="label">
            <span className="label-text text-neutral-content">Photo URL</span>
          </label>
          <input 
            type="text" 
            placeholder="Photo URL" 
            className="input input-bordered w-full mb-4 bg-neutral-content/20 text-neutral-content border-neutral-content/30"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
          />

          <label className="label mt-4">
            <span className="label-text text-neutral-content">About You</span>
          </label>
          <textarea 
            className="textarea textarea-bordered h-24 w-full mb-4 bg-neutral-content/20 text-neutral-content border-neutral-content/30"
            placeholder="Tell us about yourself..."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          ></textarea>

          <label className="label">
            <span className="label-text text-neutral-content">Age</span>
          </label>
          <input 
            type="number" 
            placeholder="Age" 
            className="input input-bordered w-full mb-4 bg-neutral-content/20 text-neutral-content border-neutral-content/30"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="0"
          />

          <label className="label">
            <span className="label-text text-neutral-content">Gender</span>
          </label>
          <select 
            className="select select-bordered w-full mb-4 bg-neutral-content/20 text-neutral-content border-neutral-content/30"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label className="label">
            <span className="label-text text-neutral-content">Skills (comma-separated)</span>
          </label>
          <input 
            type="text" 
            placeholder="e.g., React, Node.js, JavaScript"
            className="input input-bordered w-full mb-6 bg-neutral-content/20 text-neutral-content border-neutral-content/30"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          <button 
            type="submit" 
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile; 