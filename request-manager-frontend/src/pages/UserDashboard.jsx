import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const UserDashboard = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [requests, setRequests] = useState([]);
  const [createdDateFilter, setCreatedDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // 🚀 modal control

  const itemsPerPage = 10;
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem('authUser'));

  const fetchUserRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/user/requests', {
        withCredentials: true,
        auth: {
          username: authUser?.username,
          password: authUser?.password
        }
      });
      setRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load your requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authUser) {
      toast.error("You are not logged in");
      navigate('/');
    } else {
      fetchUserRequests();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !description) {
      toast.warning("All fields are required");
      return;
    }

    try {
      await axios.post(
        'http://localhost:8080/api/requests',
        { category, description },
        {
          withCredentials: true,
          auth: {
            username: authUser?.username,
            password: authUser?.password
          },
          headers: { 'Content-Type': 'application/json' }
        }
      );
      toast.success("Request submitted successfully");
      setCategory('');
      setDescription('');
      setCreatedDateFilter('');
      setStatusFilter('');
      setSortOrder('newest');
      setShowModal(false); // ✅ close modal
      fetchUserRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit request");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this request?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8080/api/requests/${id}`, {
        withCredentials: true,
        auth: {
          username: authUser?.username,
          password: authUser?.password
        }
      });
      toast.success("Request deleted successfully");
      fetchUserRequests();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete request");
    }
  };

  const clearFilters = () => {
    setCategory('');
    setDescription('');
    setCreatedDateFilter('');
    setStatusFilter('');
    setSortOrder('newest');
    setCurrentPage(1);
  };

  const handleLogout = () => {
    localStorage.removeItem("authUser");
    toast.success("You have been logged out successfully!");
    setTimeout(() => navigate('/'), 1000);
  };

  const formatStatus = (status) => {
    if (!status) return "N/A";
    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = !statusFilter || req.status === statusFilter;
    const matchesDate = !createdDateFilter || (
      req.createdAt && dayjs(req.createdAt).format('YYYY-MM-DD') === createdDateFilter
    );
    return matchesStatus && matchesDate;
  });

  const sortedRequests = filteredRequests.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const statuses = ['PENDING', 'IN_PROGRESS', 'ON_HOLD', 'RESOLVED', 'REJECTED'];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{authUser?.username}'s Dashboard</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Create Request
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <h3 className="text-xl font-semibold mb-4">Submit a New Request</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter service category"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border px-3 py-2 rounded"
                  rows="4"
                  placeholder="Enter a detailed description"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Status</option>
          {statuses.map(status => (
            <option key={status} value={status}>{formatStatus(status)}</option>
          ))}
        </select>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Created On:</label>
          <input
            type="date"
            value={createdDateFilter}
            onChange={(e) => setCreatedDateFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setSortOrder('newest')}
            className={`px-3 py-1 rounded ${sortOrder === 'newest' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Newest
          </button>
          <button
            onClick={() => setSortOrder('oldest')}
            className={`px-3 py-1 rounded ${sortOrder === 'oldest' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Oldest
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-6 text-blue-600 font-semibold">Loading...</div>
      ) : paginatedRequests.length === 0 ? (
        <p className="text-red-600 font-medium">No matching requests found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Updated On</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map((req) => (
              <tr key={req.id} className="text-center">
                <td className="border p-2">{req.id}</td>
                <td className="border p-2">{req.category}</td>
                <td className="border p-2">{req.description}</td>
                <td className="border p-2">
                  {req.createdAt ? dayjs(req.createdAt).format('DD-MM-YYYY') : 'N/A'}
                </td>
                <td className="border p-2">
                  {req.updatedAt ? dayjs(req.updatedAt).format('DD-MM-YYYY') : 'N/A'}
                </td>
                <td className="border p-2">{formatStatus(req.status)}</td>
                <td className="border p-2">
                  {['PENDING', 'IN_PROGRESS', 'ON_HOLD'].includes(req.status) && (
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 border rounded ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
