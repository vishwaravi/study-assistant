import React, { useState, useEffect } from 'react';
import api from '../../api/api'; // Import the custom API instance
import { Plus, Trash, CheckCircle, X } from 'lucide-react';

const StudySessionManager = () => {
  const [sessions, setSessions] = useState([]);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({
    title: '',
    subject: '',
    duration: '',
  });
  const [error, setError] = useState(null);

  const userId = Number(sessionStorage.getItem("id")); // Replace with dynamic user ID as required

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get(`/sessions/${userId}`);
      if (Array.isArray(response.data)) {
        setSessions(response.data);
      } else {
        console.error('Invalid data format: sessions should be an array.');
        setSessions([]); // Default to empty array if data format is invalid
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setSessions([]); // Default to empty array on error
    }
  };

  const createSession = async (e) => {
    e.preventDefault();
    const { title, subject, duration } = sessionDetails;

    if (!title.trim() || !subject.trim() || !duration.trim()) {
      setError('All fields are required!');
      return;
    }

    try {
      const response = await api.post(`/sessions/${userId}`, {
        title,
        subject,
        duration: parseInt(duration),
        completed: false,
      });
      setSessions((prev) => [...prev, response.data]);
      setSessionDetails({ title: '', subject: '', duration: '' });
      setError(null);
      setShowForm(false);
    } catch (err) {
      console.error('Error creating session:', err);
    }
  };

  const deleteSession = async (id) => {
    try {
      await api.delete(`/session/${id}`);
      setSessions((prev) => prev.filter((session) => session.id !== id));
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const markAsCompleted = async (id) => {
    try {
      const response = await api.put(`/sessions/${id}`);
      setSessions((prev) =>
        prev.map((session) =>
          session.id === id ? { ...session, completed: response.data.completed } : session
        )
      );
    } catch (err) {
      console.error('Error updating session:', err);
    }
  };

  const toggleFab = () => setIsFabOpen((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSessionDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white px-6 py-10 relative pb-20"> {/* Added padding at the bottom */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">
        Study Session Manager
      </h1>

      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Active Sessions
        </h2>
        {sessions.length === 0 ? (
          <p className="text-gray-600 italic">No active sessions. Create one using the FAB menu!</p>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`flex items-center justify-between p-4 rounded-lg shadow-md ${
                  session.completed
                    ? 'bg-green-100 border border-green-300'
                    : 'bg-white border border-gray-300'
                }`}
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {session.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Subject: {session.subject}
                  </p>
                  <p className="text-sm text-gray-600">
                    Duration: {session.duration} minutes
                  </p>
                  {session.completed && (
                    <p className="text-green-600 font-semibold">Completed</p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {!session.completed && (
                    <button
                      onClick={() => markAsCompleted(session.id)}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => deleteSession(session.id)}
                    className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    <Trash size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={toggleFab}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition relative z-10"
        >
          <Plus size={24} />
        </button>
        {isFabOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col items-end space-y-2">
            <button
              onClick={() => {
                setShowForm(true);
                setIsFabOpen(false);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              <Plus size={16} className="mr-2" />
              Add Study Session
            </button>
          </div>
        )}
      </div>

      {/* Study Session Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Create a New Session
            </h2>
            <form onSubmit={createSession} className="space-y-4">
              {error && <p className="text-red-500">{error}</p>}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={sessionDetails.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter session title"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={sessionDetails.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter subject name"
                />
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-600 mb-1"
                >
                  Duration (in minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={sessionDetails.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder="Enter duration"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create Session
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudySessionManager;