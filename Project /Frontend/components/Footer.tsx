import React from 'react';
import { HeartHandshake, Database, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              CrowdConnect
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              A transparent, community-driven crowdfunding platform dedicated to verified social causes, healthcare relief, emergency response, and community development.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <Database className="w-3.5 h-3.5" />
                MySQL 8.0 Live Backend
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                RBAC Security Active
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/campaigns" className="hover:text-white transition-colors">Approved Causes</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Sign In</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Register Account</Link></li>
            </ul>
          </div>

          {/* Course Metadata */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3 tracking-wide uppercase">Course Evaluation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>Project:</strong> CrowdConnect<br />
              <strong>Course:</strong> Database Systems Engineering (DBSE)<br />
              <strong>Milestone:</strong> Review-3 Demonstration<br />
              <strong>RDBMS:</strong> MySQL 8.0 Community
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CrowdConnect Platform. Built with React, Python Flask, and MySQL.</p>
          <p className="text-slate-400">Database Name: <code className="text-accent font-mono">crowdconnect</code></p>
        </div>
      </div>
    </footer>
  );
};
