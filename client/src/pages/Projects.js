import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { projectAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { Plus, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'verified') params.verified = 'true';
      if (filter === 'active') params.status = 'active';
      
      const response = await projectAPI.getProjects(params);
      setProjects(response.data.data);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Projects</h1>
            <p className="text-gray-400 mt-1">Manage and showcase your work</p>
          </div>
          <button
            onClick={() => navigate('/projects/add')}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:border-primary-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10 pr-8 py-3 bg-dark-800 border border-dark-700 rounded-lg text-gray-100 focus:outline-none focus:border-primary-500 appearance-none cursor-pointer"
            >
              <option value="all">All Projects</option>
              <option value="verified">Verified Only</option>
              <option value="active">Active Only</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700">
            <p className="text-gray-400">No projects found</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Projects;
