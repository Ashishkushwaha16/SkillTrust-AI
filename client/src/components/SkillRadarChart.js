import React from 'react';
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const SkillRadarChart = ({ skills }) => {
  // Transform skills data for radar chart
  const data = skills.slice(0, 6).map(skill => ({
    skill: skill.name,
    level: skill.level,
  }));

  return (
    <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Skill Proficiency</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fill: '#9CA3AF' }}
          />
          <Radar 
            name="Skill Level" 
            dataKey="level" 
            stroke="#0ea5e9" 
            fill="#0ea5e9" 
            fillOpacity={0.6} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#f1f5f9'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillRadarChart;
