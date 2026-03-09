import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { matchAPI } from '../services/api';
import { Users, Github, Star } from 'lucide-react';

const Matching = () => {
  const [matches, setMatches] = useState([]);
  const [complementary, setComplementary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('similar');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const [matchesRes, complementaryRes] = await Promise.all([
        matchAPI.getMatches({ limit: 10 }),
        matchAPI.getComplementary({ limit: 10 })
      ]);

      setMatches(matchesRes.data.data);
      setComplementary(complementaryRes.data.data);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const UserCard = ({ match }) => {
    const { user, similarityScore, complementaryScore } = match;
    const score = similarityScore || complementaryScore;

    return (
      <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500/50 transition-all">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-100 mb-1">{user.name}</h3>
            <p className="text-sm text-gray-400 mb-3">{user.email}</p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {user.skills && user.skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-full">
                  {skill.name}
                </span>
              ))}
              {user.skills && user.skills.length > 3 && (
                <span className="px-3 py-1 text-gray-500 text-xs">
                  +{user.skills.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              {user.githubUsername && (
                <div className="flex items-center space-x-1">
                  <Github className="w-4 h-4" />
                  <span>@{user.githubUsername}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{user.trustScore || 0} Trust Score</span>
              </div>
            </div>
          </div>

          <div className="text-center flex-shrink-0">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              score >= 70 ? 'bg-green-500/20' : score >= 40 ? 'bg-yellow-500/20' : 'bg-gray-500/20'
            }`}>
              <span className={`text-xl font-bold ${
                score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {score}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Match</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 flex items-center space-x-3">
            <Users className="w-8 h-8 text-primary-400" />
            <span>Find Collaborators</span>
          </h1>
          <p className="text-gray-400 mt-2">Discover developers with similar or complementary skills</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-dark-700">
          <button
            onClick={() => setActiveTab('similar')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'similar'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Similar Skills
          </button>
          <button
            onClick={() => setActiveTab('complementary')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'complementary'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Complementary Skills
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Finding matches...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(activeTab === 'similar' ? matches : complementary).length > 0 ? (
              (activeTab === 'similar' ? matches : complementary).map((match) => (
                <UserCard key={match.user.id} match={match} />
              ))
            ) : (
              <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No matches found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Matching;
