import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const AgentProgressBadge = ({ status }) => {
  if (status === "complete") {
    return (
      <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full animate-fadeIn">
        <CheckCircle className="h-3 w-3" />
        <span>Complete</span>
      </div>
    );
  }
  
  if (status === "in_progress") {
    return (
      <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full animate-pulse">
        <Clock className="h-3 w-3 animate-spin" />
        <span>Working</span>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
      <AlertCircle className="h-3 w-3" />
      <span>Pending</span>
    </div>
  );
};

export default AgentProgressBadge;