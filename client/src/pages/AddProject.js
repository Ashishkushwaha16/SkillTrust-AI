import React, { useState } from 'react';
import Layout from '../components/Layout';
import { projectAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';

const AddProject = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubRepo: '',
    technologies: '',
    demoUrl: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const projectData = {
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t)
      };

      await projectAPI.createProject(projectData);
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/projects');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Add New Project</h1>
        <p className="text-gray-400 mb-8">Showcase your work and increase your trust score</p>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-green-400 text-sm">Project created successfully! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-dark-800 rounded-xl p-8 border border-dark-700 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="My Awesome Project"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="Describe your project..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              GitHub Repository URL *
            </label>
            <input
              type="url"
              name="githubRepo"
              value={formData.githubRepo}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="https://github.com/username/repo"
            />
            <p className="text-xs text-gray-500 mt-1">We'll fetch project stats automatically from GitHub</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Technologies
            </label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="React, Node.js, MongoDB (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Demo URL
            </label>
            <input
              type="url"
              name="demoUrl"
              value={formData.demoUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
              placeholder="https://your-demo-url.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-gray-300 font-medium rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddProject;
