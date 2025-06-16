import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import AddWord from './AddWord';
import Library from './Library';
import WordDetail from './WordDetail';
import Profile from './Profile';
import Auth from './Auth';
import ProtectedRoute from './ProtectedRoute';
import Layout from './Layout';
import UpdatePassword from './UpdatePassword';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route path="/" element={<Auth />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Layout>
                <AddWord />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <Layout>
                <Library />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/library/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <WordDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="pt-28 text-center text-red-500 text-xl font-semibold">
              🚫 404 — Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}
