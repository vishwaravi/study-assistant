import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { ArrowLeft, Plus, X } from 'lucide-react';

const ProfileEdit = ({ onBack }) => {
  const userId = Number(sessionStorage.getItem('id'));

  const [profileData, setProfileData] = useState({
    dob: '',
    qualification: '',
    role: '',
    bio: '',
    subjects: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setError('User ID not found in session.');
      setLoading(false);
      return;
    }

    api.get(`/profile/${userId}`)
      .then(({ data }) => {
        const { dob, qualification, role, bio, subjects } = data;
        setProfileData({
          dob: dob || '',
          qualification: qualification || '',
          role: role || '',
          bio: bio || '',
          subjects: subjects || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubjectChange = (e, index) => {
    const updatedSubjects = [...profileData.subjects];
    updatedSubjects[index] = e.target.value;
    setProfileData((prevData) => ({ ...prevData, subjects: updatedSubjects }));
  };

  const addSubjectField = () => {
    setProfileData((prevData) => ({
      ...prevData,
      subjects: [...prevData.subjects, ''],
    }));
  };

  const removeSubjectField = (index) => {
    setProfileData((prevData) => ({
      ...prevData,
      subjects: prevData.subjects.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      setError('User ID not found. Unable to update profile.');
      return;
    }

    api.put(`/profile/update/${userId}`, profileData)
      .then(() => {
        onBack(); // Go back to profile after update
      })
      .catch((err) => {
        console.error('Error updating profile:', err);
        setError('Failed to update profile. Please try again later.');
      });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-10">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Profile
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
        Edit Profile
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Date of Birth
          </label>
          <input
            type="date"
            name="dob"
            value={profileData.dob}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Qualification
          </label>
          <input
            type="text"
            name="qualification"
            value={profileData.qualification}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter your qualification"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={profileData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Enter your role"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows="4"
            placeholder="Write a short bio"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Interested Subjects
          </label>
          {profileData.subjects.map((subject, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 mb-2"
            >
              <input
                type="text"
                value={subject}
                onChange={(e) => handleSubjectChange(e, index)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                placeholder="Subject name"
              />
              <button
                type="button"
                onClick={() => removeSubjectField(index)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                title="Remove Subject"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubjectField}
            className="mt-2 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={16} className="mr-2" />
            Add Subject
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;