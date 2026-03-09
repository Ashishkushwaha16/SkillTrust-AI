import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Github, Mail, MapPin, Globe, Star, Shield } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">Profile</h1>

        {/* Profile Header */}
        <div className="bg-dark-800 rounded-xl p-8 border border-dark-700 mb-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">{user?.name}</h2>
              {user?.bio && <p className="text-gray-400 mb-4">{user.bio}</p>}
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {user?.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user?.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user?.website && (
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400">
                      {user.website}
                    </a>
                  </div>
                )}
                {user?.githubUsername && (
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4" />
                    <a href={`https://github.com/${user.githubUsername}`} target="_blank" rel="noopener noreferrer" className="hover:text-primary-400">
                      @{user.githubUsername}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-primary-500/20 flex items-center justify-center mb-2">
                <Shield className="w-10 h-10 text-primary-400" />
              </div>
              <p className="text-3xl font-bold text-gray-100">{user?.trustScore || 0}</p>
              <p className="text-sm text-gray-400">Trust Score</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <p className="text-gray-400 text-sm mb-1">Total Projects</p>
            <p className="text-2xl font-bold text-gray-100">{user?.projects?.length || 0}</p>
          </div>
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <p className="text-gray-400 text-sm mb-1">Total Skills</p>
            <p className="text-2xl font-bold text-gray-100">{user?.skills?.length || 0}</p>
          </div>
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <p className="text-gray-400 text-sm mb-1">Peer Rating</p>
            <div className="flex items-center space-x-2">
              <p className="text-2xl font-bold text-gray-100">{user?.peerRating?.average?.toFixed(1) || '0.0'}</p>
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
          </div>
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <p className="text-gray-400 text-sm mb-1">GitHub Commits</p>
            <p className="text-2xl font-bold text-gray-100">{user?.githubData?.totalCommits || 0}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">Skills</h3>
          {user?.skills && user.skills.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-dark-700 border border-dark-600 rounded-lg flex items-center space-x-2"
                >
                  <span className="text-gray-200">{skill.name}</span>
                  <span className="text-primary-400 text-sm font-medium">{skill.level}%</span>
                  {skill.verified && (
                    <Shield className="w-4 h-4 text-green-400" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No skills added yet</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
