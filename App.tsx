
import React, { useState, useEffect } from 'react';
import { getPaperSummary } from './services/geminiService';
import { AppStatus, SummaryData } from './types';
import Skeleton from './components/Skeleton';
import SourceBadge from './components/SourceBadge';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setStatus(AppStatus.LOADING);
    setError(null);
    try {
      const result = await getPaperSummary();
      setData(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStatus(AppStatus.ERROR);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Research <span className="text-blue-600">Summarizer</span>
            </h1>
          </div>
          <button 
            onClick={fetchSummary}
            disabled={status === AppStatus.LOADING}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${status === AppStatus.LOADING ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-12">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Paper Title Section */}
          <div className="px-8 pt-10 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">Research Summary</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-xs">February 2025</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-4">
              Harvard x Perplexity: The Future of Knowledge Work
            </h2>
            <p className="text-slate-600 leading-relaxed max-w-2xl">
              Exploring how AI-native tools are reshaping productivity, information synthesis, and decision-making within global enterprises.
            </p>
          </div>

          {/* AI Content Section */}
          <div className="p-8">
            {status === AppStatus.LOADING && <Skeleton />}
            
            {status === AppStatus.ERROR && (
              <div className="p-6 bg-red-50 border border-red-100 rounded-xl text-center">
                <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-red-900 font-bold mb-1">Failed to generate summary</h3>
                <p className="text-red-700 text-sm mb-4">{error}</p>
                <button 
                  onClick={fetchSummary}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Retry Request
                </button>
              </div>
            )}

            {status === AppStatus.SUCCESS && data && (
              <div className="prose prose-slate max-w-none">
                <div className="space-y-6">
                  {data.text.split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
                      return (
                        <div key={idx} className="flex gap-4 group">
                          <div className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform"></div>
                          <p className="text-slate-700 leading-relaxed flex-1">
                            {trimmed.replace(/^[*-\s]+/, '')}
                          </p>
                        </div>
                      );
                    }
                    if (trimmed.length === 0) return null;
                    return <p key={idx} className="text-slate-700 leading-relaxed font-medium">{trimmed}</p>;
                  })}
                </div>

                {/* Grounding Sources */}
                {data.sources.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      Verified Sources
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {data.sources.map((source, idx) => (
                        <SourceBadge key={idx} source={source} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-400 text-xs">
          Powered by Gemini 3 Flash & Google Search Grounding • Experimental Research Tool
        </p>
      </main>
    </div>
  );
};

export default App;
