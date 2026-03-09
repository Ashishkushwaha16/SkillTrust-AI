import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SkillRadarChart from '../components/SkillRadarChart';
import ContributionChart from '../components/ContributionChart';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../services/api';
import { Award, TrendingUp, Activity, Users, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const { user } = useAuth();
  const [scoreBreakdown, setScoreBreakdown] = useState(null);
  const [activityTimeline, setActivityTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [scoreRes, activityRes] = await Promise.all([
        analyticsAPI.getTrustScore(),
        analyticsAPI.getActivityTimeline()
      ]);
      
      setScoreBreakdown(scoreRes.data.data);
      setActivityTimeline(activityRes.data.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getActivityIcon = (type) => {
    switch(type) {
      case 'project': return Activity;
      case 'review_received': return Users;
      case 'review_given': return TrendingUp;
      default: return Activity;
    }
  };

  const getActivityStyles = (type) => {
    const styles = {
      project: {
        bgClass: 'bg-green-500/20',
        iconClass: 'text-green-400',
        textClass: 'text-green-400'
      },
      review_received: {
        bgClass: 'bg-yellow-500/20',
        iconClass: 'text-yellow-400',
        textClass: 'text-yellow-400'
      },
      review_given: {
        bgClass: 'bg-primary-500/20',
        iconClass: 'text-primary-400',
        textClass: 'text-primary-400'
      }
    };
    return styles[type] || styles.project;
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Analytics & Insights</h1>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Trust Score Breakdown */}
        {scoreBreakdown && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">GitHub Score</h3>
                <Award className="w-6 h-6 text-primary-400" />
              </div>
              <div className="text-3xl font-bold text-gray-100 mb-2">{scoreBreakdown.github}%</div>
              <p className="text-sm text-gray-400">
                {scoreBreakdown.details.commits} commits across {scoreBreakdown.details.repositories} repos
              </p>
              <div className="mt-4 bg-dark-900 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all" 
                  style={{ width: `${scoreBreakdown.github}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Project Score</h3>
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div className="text-3xl font-bold text-gray-100 mb-2">{scoreBreakdown.projects}%</div>
              <p className="text-sm text-gray-400">
                {scoreBreakdown.details.projectCount} verified projects
              </p>
              <div className="mt-4 bg-dark-900 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all" 
                  style={{ width: `${scoreBreakdown.projects}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-100">Peer Score</h3>
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="text-3xl font-bold text-gray-100 mb-2">{scoreBreakdown.peer}%</div>
              <p className="text-sm text-gray-400">
                {scoreBreakdown.details.peerRating.toFixed(1)}★ from {scoreBreakdown.details.reviewCount} reviews
              </p>
              <div className="mt-4 bg-dark-900 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all" 
                  style={{ width: `${scoreBreakdown.peer}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SkillRadarChart skills={user?.skills || []} />
          <ContributionChart data={[]} />
        </div>

        {/* Activity Timeline */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-lg font-semibold text-gray-100 mb-6">Recent Activity</h3>
          {activityTimeline.length > 0 ? (
            <div className="space-y-4">
              {activityTimeline.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const styles = getActivityStyles(activity.type);
                const isLast = index === activityTimeline.length - 1;
                
                return (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between py-3 ${!isLast ? 'border-b border-dark-700' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${styles.bgClass} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${styles.iconClass}`} />
                      </div>
                      <div>
                        {activity.type === 'project' && (
                          <>
                            <p className="text-gray-200 font-medium">Project Added: {activity.title}</p>
                            <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                          </>
                        )}
                        {activity.type === 'review_received' && (
                          <>
                            <p className="text-gray-200 font-medium">Review from {activity.reviewer}</p>
                            <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                          </>
                        )}
                        {activity.type === 'review_given' && (
                          <>
                            <p className="text-gray-200 font-medium">Reviewed {activity.reviewedUser}</p>
                            <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`${styles.textClass} font-medium`}>
                      {activity.type === 'project' && `Score: ${activity.score || 0}`}
                      {activity.type === 'review_received' && `★ ${activity.rating.toFixed(1)}`}
                      {activity.type === 'review_given' && '✓'}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No recent activity</p>
              <p className="text-sm text-gray-500 mt-1">Start adding projects or reviewing peers</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
