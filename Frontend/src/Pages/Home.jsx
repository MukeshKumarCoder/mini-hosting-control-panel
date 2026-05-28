import { useState } from "react";

import OnboardingForm from "../Components/OnboardingForm";

import StatusDashboard from "../Components/StatusDashboard";

const Home = () => {
  const [deploymentId, setDeploymentId] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-2xl mx-auto">
        <OnboardingForm setDeploymentId={setDeploymentId} />

        <StatusDashboard deploymentId={deploymentId} />
      </div>
    </div>
  );
};

export default Home;
