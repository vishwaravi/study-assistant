import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { ToastContainer, toast } from 'react-toastify';
import { Plus } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const FlashcardGenerator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [organizedFlashcards, setOrganizedFlashcards] = useState({});
  const [filteredSubject, setFilteredSubject] = useState('All'); // Dropdown filter state
  const [tempFlashcards, setTempFlashcards] = useState([]);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(5);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const MODEL_NAME = 'models/gemini-2.0-flash';
  const userId = sessionStorage.getItem('id');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTempFlashcards([]); // Clear temporary flashcards when the modal is closed
  };

  const fetchFlashcards = async () => {
    try {
      const response = await api.get(`/flashcards/${userId}`);
      const flashcards = response.data || [];

      // Organize flashcards by subject
      const groupedFlashcards = flashcards.reduce((acc, card) => {
        acc[card.subject] = acc[card.subject] || [];
        acc[card.subject].push(card);
        return acc;
      }, {});

      setOrganizedFlashcards(groupedFlashcards);
    } catch (error) {
      console.error('Failed to fetch flashcards:', error);
      toast.error('Failed to load flashcards.');
    }
  };

  const deleteFlashcard = async (cardId) => {
    try {
      await api.delete(`/flashcards/${cardId}`);
      toast.success('Flashcard deleted successfully!');
      fetchFlashcards(); // Refresh the flashcards after deletion
    } catch (error) {
      console.error('Failed to delete flashcard:', error);
      toast.error('Failed to delete flashcard.');
    }
  };

  useEffect(() => {
    fetchFlashcards();
  }, []);

  const validateAcademicTopic = async (userTopic) => {
    // Validation logic for academic topics
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${API_KEY}`,
        {
          contents: [{
            parts: [{
              text: `You are an academic assistant AI. A user has entered a topic: "${userTopic}". Reply ONLY "yes" if the topic is academic, educational, technical, or programming-related. Reply "no" if it's entertainment, gossip, sports, food, travel, movies, or pop culture.`
            }]
          }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const reply = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || '';
      return reply.includes('yes');
    } catch {
      toast.error('Error validating topic.');
      return false;
    }
  };

  const generateFlashcards = async () => {
    if (!topic.trim() || !subject.trim()) {
      return toast.warn('Please enter a topic and subject.');
    }
    setLoading(true);

    const isAcademic = await validateAcademicTopic(topic);
    if (!isAcademic) {
      toast.error('❗ Only academic or study-related topics are allowed.');
      setLoading(false);
      return;
    }

    try {
      const prompt = `Generate exactly ${count} educational flashcards about "${topic}". 
Front: [question or keyword]
Back: [answer or explanation]
Use Markdown.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/${MODEL_NAME}:generateContent?key=${API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const text = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      const generated = text.split(/Front:/i).slice(1).map((block) => {
        const parts = block.split(/Back:/i);
        const clean = (str) =>
          str.replace(/^\*+|\*+$/g, '').replace(/^#+/g, '').replace(/Flashcard \d+/i, '').trim();

        return {
          front: clean(parts[0] || ''),
          back: clean(parts[1] || ''),
          subject,
        };
      });

      setTempFlashcards((prev) => [...prev, ...generated.slice(0, count)]);
      toast.success('Flashcards generated! 🎉');
    } catch (error) {
      console.error('Flashcard generation error:', error);
      toast.error('Failed to generate flashcards.');
    } finally {
      setLoading(false);
    }
  };

  const addCustomFlashcard = () => {
    if (front.trim() && back.trim() && subject.trim()) {
      setTempFlashcards((prev) => [...prev, { front, back, subject }]);
      setFront('');
      setBack('');
      toast.success('Custom flashcard added!');
    } else {
      toast.warn('All fields (Front, Back, and Subject) are required!');
    }
  };

  const removeTempFlashcard = (index) => {
    setTempFlashcards((prev) => prev.filter((_, idx) => idx !== index));
    toast.info('Flashcard removed.');
  };

  const saveFlashcards = async () => {
    if (tempFlashcards.length === 0) {
      toast.warn('No flashcards to save.');
      return;
    }

    try {
      await api.post(`/flashcards/${userId}`, tempFlashcards);
      fetchFlashcards(); // Reload flashcards after saving
      setTempFlashcards([]);
      toast.success('Flashcards saved successfully! ✅');
    } catch (error) {
      console.error('Failed to save flashcards:', error);
      toast.error('Failed to save flashcards.');
    } finally {
      closeModal();
    }
  };

  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      return !inline ? (
        <div className="bg-gray-100 p-3 rounded-lg overflow-x-auto my-2">
          <pre className="text-sm leading-relaxed">
            <code {...props} className={`${className} text-gray-800`}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">{children}</code>
      );
    },
    p({ children }) {
      return <p className="text-gray-700 text-sm leading-relaxed">{children}</p>;
    },
    li({ children }) {
      return <li className="ml-4 list-disc text-gray-700 text-sm">{children}</li>;
    },
  };

  // Filter flashcards based on the selected subject
  const filteredFlashcards = filteredSubject === 'All'
    ? organizedFlashcards
    : { [filteredSubject]: organizedFlashcards[filteredSubject] || [] };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">

      <ToastContainer position="top-right" autoClose={3000} />

      {/* Floating Plus Button */}
      <button
        onClick={openModal}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300"
      >
        <Plus size={28} />
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800">Flashcards</h1>
        <select
          value={filteredSubject}
          onChange={(e) => setFilteredSubject(e.target.value)}
          className="p-2 border border-blue-300 rounded-lg"
        >
          <option value="All">All</option>
          {Object.keys(organizedFlashcards).map((subject) => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>

      {/* Display Flashcards by Subject */}
      <div>
        {Object.keys(filteredFlashcards).length > 0 ? (
          Object.entries(filteredFlashcards).map(([subject, cards]) => (
            <div key={subject} className="mb-6">
              <h2 className="text-xl font-bold text-blue-800 mb-4">{subject}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    className="relative bg-white border border-blue-200 rounded-xl shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-transform duration-200 ease-in-out"
                  >
                    <button
                      onClick={() => deleteFlashcard(card.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold"
                      title="Delete"
                    >
                      ✕
                    </button>
                    <div className="text-blue-700 font-semibold mb-2 text-lg">Front</div>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown components={markdownComponents}>{card.front}</ReactMarkdown>
                    </div>
                    <hr className="my-4 border-blue-100" />
                    <div className="text-blue-700 font-semibold mb-2 text-lg">Back</div>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown components={markdownComponents}>{card.back}</ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 italic text-center w-full">No flashcards yet. Click + to create!</div>
        )}
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 shadow-xl w-full max-w-3xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
            >
              ✕
            </button>

            <h1 className="text-3xl font-bold text-blue-800 text-center mb-6">🎯 Create Flashcards</h1>

            {/* Inputs */}
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter Subject"
                className="flex-1 border border-blue-300 rounded-lg p-3 focus:outline-none"
              />
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a Study Topic"
                className="flex-1 border border-blue-300 rounded-lg p-3 focus:outline-none"
              />
              <input
                type="number"
                min="1"
                max="50"
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-24 border border-blue-300 rounded-lg p-3"
              />
              <button
                onClick={generateFlashcards}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg transition-all ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate'}
              </button>
            </div>

            {/* Manual Add */}
            <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
              <input
                type="text"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder="Custom Front"
                className="flex-1 border border-blue-300 rounded-lg p-3 text-sm"
              />
              <input
                type="text"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder="Custom Back"
                className="flex-1 border border-blue-300 rounded-lg p-3 text-sm"
              />
              <button
                onClick={addCustomFlashcard}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-3 rounded-lg text-sm"
              >
                Add Card
              </button>
            </div>

            {/* Temporary Flashcard Preview */}
            <div className="mt-6 h-96 overflow-y-auto">
              {tempFlashcards.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-blue-700 mb-4">Preview Flashcards</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {tempFlashcards.map((card, idx) => (
                      <div
                        key={idx}
                        className="relative bg-white border border-blue-200 rounded-lg shadow-md p-4"
                      >
                        <button
                          onClick={() => removeTempFlashcard(idx)}
                          className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm font-bold"
                          title="Delete"
                        >
                          ✕
                        </button>
                        <div className="text-blue-700 font-semibold mb-2">Front</div>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown components={markdownComponents}>{card.front}</ReactMarkdown>
                        </div>
                        <hr className="my-2 border-blue-100" />
                        <div className="text-blue-700 font-semibold mb-2">Back</div>
                        <div className="prose prose-sm max-w-none">
                          <ReactMarkdown components={markdownComponents}>{card.back}</ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={saveFlashcards}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg w-full"
            >
              Save Flashcards
            </button>

          </div>
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator;