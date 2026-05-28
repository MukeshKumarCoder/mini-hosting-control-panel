import { useEffect, useState } from "react";
import api from "../Services/api";

const StatusDashboard = ({ deploymentId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!deploymentId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    let intervalId;

    const fetchStatus = async () => {
      try {
        const res = await api.get(`/status/${deploymentId}`);
        if (cancelled) return;

        const deployment = res.data?.deployment;
        if (!deployment) {
          setError("Invalid response from server");
          setLoading(false);
          return;
        }

        setData(deployment);
        setLoading(false);
        setError(null);

        if (
          deployment.status === "Completed" ||
          deployment.status === "Failed"
        ) {
          clearInterval(intervalId);
        }
      } catch (err) {
        if (cancelled) return;
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch status",
        );
        setLoading(false);
      }
    };

    setLoading(true);
    setError(null);
    fetchStatus();
    intervalId = setInterval(fetchStatus, 3000);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [deploymentId]);

  const getColor = () => {
    if (data?.status === "Completed") return "bg-green-500";
    if (data?.status === "Failed") return "bg-red-500";
    return "bg-yellow-500";
  };

  if (!deploymentId) {
    return (
      <div className="bg-white shadow rounded-xl p-6 mt-5">
        <h2 className="text-xl font-bold mb-2">Deployment Status</h2>
        <p className="text-gray-500">Deploy a client to see status here.</p>
      </div>
    );
  }

  if (loading && !data) {
    return (
      <div className="bg-white shadow rounded-xl p-6 mt-5">
        <h2 className="text-xl font-bold mb-2">Deployment Status</h2>
        <p className="text-center py-4">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-xl p-6 mt-5">
        <h2 className="text-xl font-bold mb-2">Deployment Status</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-xl p-6 mt-5">
      <h2 className="text-xl font-bold mb-5">Deployment Status</h2>

      {data && (
        <div className="space-y-3">
          <p>
            <span className="font-medium">Client:</span> {data.clientName}
          </p>

          <p>
            <span className="font-medium">Domain:</span> {data.domain}
          </p>

          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <span className={`text-white px-3 py-1 rounded ${getColor()}`}>
              {data.status}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusDashboard;
