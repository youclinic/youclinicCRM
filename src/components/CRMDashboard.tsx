import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { LeadsTab } from "./LeadsTab";
import { DashboardTab } from "./DashboardTab";

type Tab = "dashboard" | "leads" | "patients" | "appointments" | "reports";

export function CRMDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const loggedInUser = useQuery(api.auth.loggedInUser);

  const tabs = [
    { id: "dashboard" as const, name: "Dashboard", icon: "📊" },
    { id: "leads" as const, name: "Leads", icon: "👥" },
    { id: "patients" as const, name: "Patients", icon: "🧠" },
    { id: "appointments" as const, name: "Appointments", icon: "📅" },
    { id: "reports" as const, name: "Reports", icon: "📈" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
              {loggedInUser?.email?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{loggedInUser?.email}</p>
              <p className="text-sm text-gray-500">NeuroHealth Specialist</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-50 border-r-2 border-blue-600 text-blue-600"
                  : "text-gray-700"
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "leads" && <LeadsTab />}
        {activeTab === "patients" && (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Patients</h1>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Patient management coming soon...</p>
            </div>
          </div>
        )}
        {activeTab === "appointments" && (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointments</h1>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Appointment scheduling coming soon...</p>
            </div>
          </div>
        )}
        {activeTab === "reports" && (
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Analytics and reports coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
