import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { Edit2, LogOut } from 'lucide-react';

const Profile = ({ onEditProfile }) => {
  const userId = Number(sessionStorage.getItem('id'));
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    dob: '',
    qualification: '',
    role: '',
    bio: '',
    subjects: [],
    name: '',
    email: '',
    joined: '',
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
      .then((response) => {
        const data = response.data;
        setProfileData({
          dob: new Date(data.dob).toLocaleDateString('en-CA') || '',
          qualification: data.qualification || '',
          role: data.role || '',
          bio: data.bio || '',
          subjects: data.subjects || [],
          name: data.user?.name || '',
          email: data.user?.email || '',
          joined: new Date(data.user?.createdAt).toLocaleDateString() || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again later.');
        setLoading(false);
      });
  }, [userId]);

  const handleLogout = () => {
    sessionStorage.clear(); // Clear session storage
    navigate('/login'); // Redirect to the login page
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-600">Loading profile...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">My Profile</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={onEditProfile}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Edit2 size={20} className="mr-2" />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <LogOut size={20} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="rounded-xl shadow-lg bg-white p-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
        <ProfileItem label="Name" value={profileData.name} />
        <ProfileItem label="Email" value={profileData.email} />
        <ProfileItem label="Date of Birth" value={profileData.dob} />
        <ProfileItem label="Qualification" value={profileData.qualification} />
        <ProfileItem label="Interested Subjects" value={profileData.subjects.join(', ') || 'N/A'} />
        <ProfileItem label="Role" value={profileData.role} />
        <ProfileItem label="Joined" value={profileData.joined} />
      </div>

      <div className="mt-10 p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">About Me</h2>
        <p className="text-gray-700 leading-relaxed">
          {profileData.bio || 'No bio available.'}
        </p>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-lg font-semibold text-gray-800">{value}</p>
  </div>
);

export default Profile;