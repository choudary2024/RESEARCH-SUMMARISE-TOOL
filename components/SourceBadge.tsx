
import React from 'react';
import { SearchSource } from '../types';

interface SourceBadgeProps {
  source: SearchSource;
}

const SourceBadge: React.FC<SourceBadgeProps> = ({ source }) => {
  return (
    <a
      href={source.uri}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm gap-2"
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      {source.title.length > 30 ? `${source.title.substring(0, 30)}...` : source.title}
    </a>
  );
};

export default SourceBadge;
