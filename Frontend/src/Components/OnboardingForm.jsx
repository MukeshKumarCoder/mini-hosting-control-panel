import { useState } from "react";
import api from "../Services/api";

const OnboardingForm = ({ setDeploymentId }) => {
  const [form, setForm] = useState({
    clientName: "",
    domain: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const res = await api.post("/deploy", form);

      const id = res.data?.deploymentId;
      if (!id) {
        throw new Error("Server did not return a deployment ID");
      }

      setDeploymentId(String(id));

      setForm({
        clientName: "",
        domain: "",
        image: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Deployment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h1 className="text-2xl font-bold mb-5">Client Deployment</h1>

      {error && (
        <p className="mb-4 text-red-500 text-sm" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="clientName"
          placeholder="Client Name"
          value={form.clientName}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="domain"
          placeholder="test.ourplatform.com"
          value={form.domain}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          name="image"
          placeholder="nginx:latest"
          value={form.image}
          onChange={handleChange}
          required
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded disabled:opacity-60"
        >
          {loading ? "Deploying..." : "Deploy"}
        </button>
      </form>
    </div>
  );
};

export default OnboardingForm;
