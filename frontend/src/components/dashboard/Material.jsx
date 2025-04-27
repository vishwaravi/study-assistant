import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { storage, ref, uploadBytes, getDownloadURL } from '../../firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [form, setForm] = useState({ title: '', category: '', description: '' });
  const [filter, setFilter] = useState('');
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = sessionStorage.getItem('id');

  useEffect(() => {
    if (userId) fetchMaterials(userId);
  }, [userId]);

  const fetchMaterials = async (userId) => {
    try {
      const response = await api.get(`/user/${userId}/materials`);
      setMaterials(response.data);
      setFilteredMaterials(response.data);
    } catch (error) {
      console.error('Failed to fetch materials:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!fileData) {
      toast.error('Please upload a file first.');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        fileUrl: fileData.fileUrl,
        fileName: fileData.fileName,
        userId,
      };

      await api.post(`/materials/${userId}/upload`, payload);
      fetchMaterials(userId);

      setForm({ title: '', category: '', description: '' });
      setFileData(null);
      setIsModalOpen(false);

      toast.success('Material uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Material upload failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this material?');
    if (isConfirmed) {
      try {
        await api.delete(`/materials/${id}`);
        fetchMaterials(userId);
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleFilter = (e) => {
    const selectedCategory = e.target.value;
    setFilter(selectedCategory);
    setFilteredMaterials(
      selectedCategory === '' ? materials : materials.filter((item) => item.category === selectedCategory)
    );
  };

  const handleFileUpload = async (file) => {
    const storageRef = ref(storage, `study_materials/${Date.now()}_${file.name}`);
    setIsLoading(true);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(snapshot.ref);

      setFileData({ fileUrl, fileName: file.name });
      toast.success('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('File upload failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative p-8 bg-gray-50 min-h-screen pb-24">
      <ToastContainer />

      {/* HEADER */}
      <h1 className="text-3xl font-bold text-blue-800 mb-8">Study Material Dashboard</h1>

      {/* FILTER */}
      <div className="mb-6">
        <label className="mr-2 text-blue-700 font-medium">Filter by Category:</label>
        <select
          value={filter}
          onChange={handleFilter}
          className="border px-4 py-2 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="">All</option>
          {[...new Set(materials.map((item) => item.category))].map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* MATERIAL GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => (
          <div key={material.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-blue-700">{material.title}</h2>
            <p className="text-sm text-gray-500 mb-3">{material.category}</p>
            <p className="text-gray-700 mb-3">{material.description}</p>
            {material.fileUrl.includes('image') ? (
              <img src={material.fileUrl} alt={material.title} className="w-full h-40 object-cover rounded-xl" />
            ) : (
              <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                View Document
              </a>
            )}
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleDelete(material.id)}
                className="text-red-500 hover:text-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* FLOATING BUTTON */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-4xl z-10"
      >
        +
      </button>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-blue-700 mb-6">Add New Material</h2>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <input
                name="title"
                value={form.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <input
                name="category"
                value={form.category}
                onChange={handleInputChange}
                placeholder="Category"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <input
                type="file"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />

              {fileData && (
                <div className="text-sm text-gray-600 mt-2">
                  <strong>Selected:</strong> {fileData.fileName}
                </div>
              )}

              <button
                type="button"
                onClick={handleUpload}
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl mt-4 transition"
              >
                {isLoading ? 'Uploading...' : 'Upload Material'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Material;