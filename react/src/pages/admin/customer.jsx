import React, { useState, useEffect } from "react";

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Hardcoded customer data
  const mockCustomers = [
    {
      id: 1,
      username: "customer1",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      role: { role_name: "Customer" },
    },
    {
      id: 2,
      username: "customer2",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      role: { role_name: "Customer" },
    },
    {
      id: 3,
      username: "customer3",
      first_name: "Alice",
      last_name: "Johnson",
      email: "alice.johnson@example.com",
      role: { role_name: "Customer" },
    },
    {
      id: 4,
      username: "customer4",
      first_name: "Bob",
      last_name: "Brown",
      email: "bob.brown@example.com",
      role: { role_name: "Customer" },
    },
  ];

  useEffect(() => {
    // Simulate loading with a delay
    setIsLoading(true);
    const timer = setTimeout(() => {
      setCustomers(mockCustomers);
      setIsLoading(false);
    }, 1000); // 1-second delay to mimic API call

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Customer List</h1>
        <p className="text-gray-600 mb-6">
          List of registered customers in the application.
        </p>

        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent mr-3"></div>
            <span className="text-gray-600">Loading customers...</span>
          </div>
        )}

        {!isLoading && customers.length === 0 && (
          <p className="text-gray-600">No customers found.</p>
        )}

        {!isLoading && customers.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-xl">
              <thead>
                <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <th className="py-3 px-4 text-left font-semibold">Username</th>
                  <th className="py-3 px-4 text-left font-semibold">First Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Last Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Email</th>
                  <th className="py-3 px-4 text-left font-semibold">Role</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700">{customer.username}</td>
                    <td className="py-3 px-4 text-gray-700">{customer.first_name}</td>
                    <td className="py-3 px-4 text-gray-700">{customer.last_name}</td>
                    <td className="py-3 px-4 text-gray-700">{customer.email}</td>
                    <td className="py-3 px-4 text-gray-700">{customer.role?.role_name || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customer;