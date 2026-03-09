import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import StatsCard from '../components/StatsCard';
import SkillRadarChart from '../components/SkillRadarChart';
import ContributionChart from '../components/ContributionChart';
import ProjectCard from '../components/ProjectCard';
import { 
  Award, 
  FolderGit2, 
  Star, 
  TrendingUp,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, projectAPI, userAPI } from '../services/api';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, projectsRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        projectAPI.getUserProjects(user._id)
      ]);

      setAnalytics(analyticsRes.data.data);
      setProjects(projectsRes.data.data.slice(0, 3)); // Show only 3 recent
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncGithub = async () => {
    try {
      setSyncing(true);
      setError(null);
      const response = await userAPI.syncGithub();
      updateUser(response.data.data);
      await fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sync GitHub data');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-400 mt-1">Here's your skill intelligence overview</p>
          </div>
          <button
            onClick={handleSyncGithub}
            disabled={syncing || !user?.githubUsername}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync GitHub'}</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Trust Score"
            value={analytics?.stats?.trustScore || user?.trustScore || 0}
            subtitle="Skill verification rating"
            icon={Award}
          />
          <StatsCard
            title="Total Projects"
            value={analytics?.stats?.totalProjects || 0}
            subtitle={`${analytics?.stats?.verifiedProjects || 0} verified`}
            icon={FolderGit2}
          />
          <StatsCard
            title="Skills Verified"
            value={analytics?.stats?.verifiedSkills || 0}
            subtitle={`of ${analytics?.stats?.totalSkills || 0} total`}
            icon={Star}
          />
          <StatsCard
            title="Peer Rating"
            value={user?.peerRating?.average?.toFixed(1) || '0.0'}
            subtitle={`${user?.peerRating?.count || 0} reviews`}
            icon={TrendingUp}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SkillRadarChart skills={analytics?.topSkills || user?.skills || []} />
          <ContributionChart />
        </div>

        {/* Recent Projects */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Recent Projects</h2>
            <a href="/projects" className="text-sm text-primary-400 hover:text-primary-300">
              View all →
            </a>
          </div>
          
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <div className="bg-dark-800 rounded-xl p-12 text-center border border-dark-700">
              <FolderGit2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No projects yet</p>
              <a
                href="/projects/add"
                className="inline-block mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all"
              >
                Add Your First Project
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
