import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'archived':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700 hover:border-primary-500/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-semibold text-gray-100 flex-1">{project.title}</h4>
        {project.verified && (
          <Shield className="w-5 h-5 text-green-400 flex-shrink-0 ml-2" />
        )}
      </div>
      
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>{project.verificationScore || 0}% verified</span>
          </span>
          {project.language && (
            <span className="px-2 py-1 bg-primary-500/10 text-primary-400 rounded">
              {project.language}
            </span>
          )}
        </div>
        
        <span className={`px-2 py-1 text-xs font-medium rounded border ${getStatusColor(project.status)}`}>
          {project.status || 'active'}
        </span>
      </div>

      {project.technologies && project.technologies.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span 
              key={index} 
              className="px-2 py-1 text-xs bg-dark-700 text-gray-300 rounded"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-500">
              +{project.technologies.length - 3} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
