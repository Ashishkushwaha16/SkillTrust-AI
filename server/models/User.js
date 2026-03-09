const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  githubUsername: {
    type: String,
    trim: true,
    lowercase: true
  },
  skills: [{
    name: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  trustScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  peerRating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  githubData: {
    totalCommits: {
      type: Number,
      default: 0
    },
    totalRepos: {
      type: Number,
      default: 0
    },
    followers: {
      type: Number,
      default: 0
    },
    publicGists: {
      type: Number,
      default: 0
    },
    lastSynced: {
      type: Date
    }
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    type: String
  },
  website: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to calculate trust score
userSchema.methods.calculateTrustScore = function() {
  let score = 0;
  
  // GitHub activity (40% weight)
  const githubScore = Math.min((this.githubData.totalCommits / 100) * 40, 40);
  
  // Project count (30% weight)
  const projectScore = Math.min((this.projects.length / 10) * 30, 30);
  
  // Peer rating (30% weight)
  const peerScore = (this.peerRating.average / 5) * 30;
  
  score = githubScore + projectScore + peerScore;
  
  this.trustScore = Math.round(score);
  return this.trustScore;
};

module.exports = mongoose.model('User', userSchema);
