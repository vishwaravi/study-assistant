import React, { useState, useEffect } from 'react';
import api from '../../api/api'; // Replace with your API instance
import { CheckCircle, TrendingUp, Clock } from 'lucide-react';

const Home = () => {
  const [sessions, setSessions] = useState([]);
  const [progress, setProgress] = useState(0); // User's overall progress
  const [loading, setLoading] = useState(true);

  const userId = sessionStorage.getItem('id'); // Assuming you store the user ID in session storage

  useEffect(() => {
    // Fetch study sessions
    const fetchData = async () => {
      try {
        const response = await api.get(`/sessions/${userId}`);
        const sessionsData = response.data || [];
        setSessions(sessionsData);

        // Calculate overall progress
        const totalSessions = sessionsData.length;
        const completedSessions = sessionsData.filter((session) => session.completed).length;

        if (totalSessions > 0) {
          setProgress(Math.round((completedSessions / totalSessions) * 100));
        } else {
          setProgress(0);
        }
      } catch (error) {
        console.error('Error fetching study sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-blue-600 text-lg font-semibold">Loading your study sessions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <h1 className="text-4xl font-extrabold text-blue-800 mb-6">Welcome Back!</h1>

      {/* Overall Progress Section */}
      <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
          <TrendingUp className="mr-2" />
          Your Progress
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-600">{progress}% of your sessions are completed!</p>
      </div>

      {/* Active Study Sessions Section */}
      <div>
        <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
          <Clock className="mr-2" />
          Active Study Sessions
        </h2>
        {sessions.length === 0 ? (
          <p className="text-gray-600 italic">You have no active study sessions. Create one today!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition ${
                  session.completed ? 'border border-green-300' : 'border border-gray-300'
                }`}
              >
                <h3 className="text-lg font-semibold text-blue-800 mb-2">{session.title}</h3>
                <p className="text-sm text-gray-600">Subject: {session.subject}</p>
                <p className="text-sm text-gray-600">Duration: {session.duration} minutes</p>
                <div className="flex items-center justify-between mt-4">
                  {session.completed ? (
                    <CheckCircle className="text-green-500 h-6 w-6" title="Completed" />
                  ) : (
                    <p className="text-sm text-blue-600">In Progress</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;