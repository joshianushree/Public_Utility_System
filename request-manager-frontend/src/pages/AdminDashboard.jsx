import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [createdByFilter, setCreatedByFilter] = useState('');
  const [createdDateFilter, setCreatedDateFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const itemsPerPage = 20;
  const statuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'ON_HOLD', 'REJECTED'];

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/requests", {
        withCredentials: true,
      });
      setRequests(response.data);
    } catch (error) {
      toast.error("Failed to fetch requests");
      console.error("Error fetching requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const formatStatus = (status) => {
    if (!status) return "N/A";
    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const clearFilters = () => {
    setStatusFilter('');
    setCategoryFilter('');
    setCreatedByFilter('');
    setCreatedDateFilter('');
    setSortOrder('newest');
    setCurrentPage(1);
  };

  const filteredRequests = requests.filter((req) => {
    const matchesStatus = !statusFilter || req.status === statusFilter;
    const matchesCategory = !categoryFilter || req.category === categoryFilter;
    const matchesCreatedBy = !createdByFilter || req.createdBy === createdByFilter;
    const matchesDate = !createdDateFilter || (
      req.createdAt && dayjs(req.createdAt).format('YYYY-MM-DD') === createdDateFilter
    );
    return matchesStatus && matchesCategory && matchesCreatedBy && matchesDate;
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

  const uniqueCategories = [...new Set(requests.map(req => req.category))];
  const uniqueCreatedBy = [...new Set(requests.map(req => req.createdBy))];
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

  const handleLogout = () => {
    toast.success("Logout successful!");
    setTimeout(() => navigate('/'), 1000);
  };

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (!window.confirm(`Are you sure you want to change status from "${formatStatus(currentStatus)}" to "${formatStatus(newStatus)}"?`)) {
      return;
    }
    try {
      await axios.put(
        `http://localhost:8080/api/requests/${id}/status`,
        null,
        {
          params: { status: newStatus },
          withCredentials: true,
        }
      );
      toast.success("Status updated!");
      fetchRequests();
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
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

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={createdByFilter}
          onChange={(e) => setCreatedByFilter(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">All Created By</option>
          {uniqueCreatedBy.map(user => (
            <option key={user} value={user}>{user}</option>
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

        <button
          onClick={clearFilters}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
        >
          Clear Filters
        </button>

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

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center py-6 text-blue-600 font-semibold">Loading...</div>
      ) : paginatedRequests.length === 0 ? (
        <p className="text-red-600 font-medium">No matching service requests found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Created On</th>
              <th className="border p-2">Updated On</th>
              <th className="border p-2">Created By</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Update</th>
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
                <td className="border p-2">{req.createdBy}</td>
                <td className="border p-2">{formatStatus(req.status)}</td>
                <td className="border p-2">
                  <select
                    value={req.status}
                    disabled={req.status === 'RESOLVED' || req.status === 'REJECTED'}
                    onChange={(e) => handleStatusChange(req.id, req.status, e.target.value)}
                    className={`border px-2 py-1 rounded ${
                      req.status === 'RESOLVED' || req.status === 'REJECTED'
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    {statuses.map(s => (
                      <option key={s} value={s}>{formatStatus(s)}</option>
                    ))}
                  </select>
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

export default AdminDashboard;
