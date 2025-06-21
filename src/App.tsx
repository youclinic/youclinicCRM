import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { CRMDashboard } from "./components/CRMDashboard";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-4">
        <div className="flex items-center space-x-3">
          {/* Logo placeholder - you can replace this with your actual logo */}
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
            🧠
          </div>
          <h2 className="text-xl font-semibold text-blue-600">NeuroHealth CRM</h2>
        </div>
        <Authenticated>
          <SignOutButton />
        </Authenticated>
      </header>
      <main className="flex-1">
        <Content />
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-section">
      <Authenticated>
        <CRMDashboard />
      </Authenticated>
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md mx-auto p-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                  🧠
                </div>
              </div>
              <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to NeuroHealth CRM</h1>
              <p className="text-xl text-gray-600">Specialized care management for neurological conditions</p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
