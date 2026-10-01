import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, LogOut, User, PlusCircle, LayoutDashboard, Shield, Gift, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, isAdmin, isCreator, isDonor } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20 group-hover:bg-slate-900 transition-colors">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">CrowdConnect</span>
              <span className="text-[10px] uppercase font-semibold text-secondary tracking-widest mt-0.5">Social Causes</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/campaigns"
              className={`px-3 py-2 rounded-lg transition-colors ${
                isActive('/campaigns') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore Campaigns
            </Link>

            {/* Creator Nav */}
            {isCreator && (
              <>
                <Link
                  to="/creator/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/creator/dashboard') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/creator/campaigns/create"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/creator/campaigns/create') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <PlusCircle className="w-4 h-4 text-secondary" />
                  Start Campaign
                </Link>
                <Link
                  to="/creator/campaigns"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/creator/campaigns') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  My Campaigns
                </Link>
              </>
            )}

            {/* Donor Nav */}
            {isDonor && (
              <>
                <Link
                  to="/donor/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/donor/dashboard') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/donor/donations"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/donor/donations') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Gift className="w-4 h-4 text-secondary" />
                  My Donations
                </Link>
              </>
            )}

            {/* Admin Nav */}
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin/dashboard') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Shield className="w-4 h-4 text-rose-600" />
                  Admin Portal
                </Link>
                <Link
                  to="/admin/campaigns"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin/campaigns') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Review Campaigns
                </Link>
                <Link
                  to="/admin/users"
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    isActive('/admin/users') ? 'text-primary bg-primary/10 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Users
                </Link>
              </>
            )}
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 pl-3 py-1 text-right">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      {user.role === 'ADMIN' && <span className="text-rose-600">Administrator</span>}
                      {user.role === 'CREATOR' && <span className="text-blue-600">Campaign Creator</span>}
                      {user.role === 'DONOR' && <span className="text-emerald-600">Verified Donor</span>}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
                    <User className="w-4 h-4" />
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-transparent hover:border-rose-200"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-slate-900 transition-all shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/campaigns"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Campaigns
          </Link>

          {isAuthenticated && user ? (
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="px-3 py-1">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email} ({user.role})</p>
              </div>

              {isCreator && (
                <>
                  <Link
                    to="/creator/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Creator Dashboard
                  </Link>
                  <Link
                    to="/creator/campaigns/create"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Start Campaign
                  </Link>
                  <Link
                    to="/creator/campaigns"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    My Campaigns
                  </Link>
                </>
              )}

              {isDonor && (
                <>
                  <Link
                    to="/donor/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Donor Dashboard
                  </Link>
                  <Link
                    to="/donor/donations"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    My Donations
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/campaigns"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Review Campaigns
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    Manage Users
                  </Link>
                </>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-rose-600 font-medium hover:bg-rose-50"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-slate-700 font-medium bg-slate-100 hover:bg-slate-200"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-lg text-white font-semibold bg-primary hover:bg-slate-900"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
