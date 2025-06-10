import React from "react";

const AdminHome = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Welcome to the Admin Home page. Manage revenue, restaurants, bikers, vouchers, and customers from here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <p className="mt-2">Track and analyze platform revenue.</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold">Platform Statistics</h2>
            <p className="mt-2">View key metrics and performance data.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;