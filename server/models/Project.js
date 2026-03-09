const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  githubRepo: {
    type: String,
    required: [true, 'Please provide a GitHub repository URL'],
    match: [
      /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+/,
      'Please provide a valid GitHub repository URL'
    ]
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contributors: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: {
      type: String,
      required: true
    },
    contributions: {
      type: Number,
      default: 0
    },
    role: {
      type: String,
      enum: ['owner', 'contributor', 'collaborator'],
      default: 'contributor'
    }
  }],
  technologies: [{
    type: String
  }],
  verificationScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  verified: {
    type: Boolean,
    default: false
  },
  stars: {
    type: Number,
    default: 0
  },
  forks: {
    type: Number,
    default: 0
  },
  commits: {
    type: Number,
    default: 0
  },
  primaryLanguage: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  demoUrl: {
    type: String
  },
  screenshots: [{
    type: String
  }],
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

// Index for search optimization (no language override to avoid conflict with primaryLanguage field)
projectSchema.index({ 
  title: 'text', 
  description: 'text', 
  technologies: 'text' 
}, { 
  default_language: 'none',
  language_override: 'textSearchLanguage'
});

// Method to calculate verification score
projectSchema.methods.calculateVerificationScore = function() {
  let score = 0;
  
  // Commit count (40% weight)
  const commitScore = Math.min((this.commits / 50) * 40, 40);
  
  // Stars (30% weight)
  const starScore = Math.min((this.stars / 20) * 30, 30);
  
  // Contributors (20% weight)
  const contributorScore = Math.min((this.contributors.length / 5) * 20, 20);
  
  // Documentation (10% weight) - assuming project has description
  const docScore = this.description.length > 100 ? 10 : 5;
  
  score = commitScore + starScore + contributorScore + docScore;
  
  this.verificationScore = Math.round(score);
  
  // Auto-verify if score is above 70
  if (this.verificationScore >= 70) {
    this.verified = true;
  }
  
  return this.verificationScore;
};

module.exports = mongoose.model('Project', projectSchema);
