// TicketSearch.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import TicketMap from "../components/TicketMap";

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const RiskBadge = ({ risk }) => {
  const colors = {
    HIGH: "bg-red-600 text-white",
    MEDIUM: "bg-yellow-500 text-white",
    LOW: "bg-green-600 text-white",
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[risk] || "bg-gray-300"}`}>
      {risk || "-"}
    </span>
  );
};

export default function TicketSearch() {
  const [filters, setFilters] = useState({
    status: "",
    stationCode: "",
    utilityType: "",
    bbox: "-90,-180,90,180",
    radiusMeters: 250,
  });

  const [tickets, setTickets] = useState([]);
  const [summary, setSummary] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const updateBboxDebounced = debounce((bounds) => {
    setFilters((prev) => ({
      ...prev,
      bbox: `${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}`,
    }));
    setPage(1);
  }, 800);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const search = async (currentPage = page) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        "http://localhost:3000/api/tickets/conflicts",
        {
          params: {
            ...filters,
            page: currentPage,
            limit,
          },
        }
      );

      setTickets(res.data.tickets || []);
      setSummary(res.data.summary || null);
      setPage(res.data.summary?.page || currentPage);
      setTotalPages(res.data.summary?.totalPages || 1);
    } catch (e) {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    search(page);
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Ticket Conflict Dashboard
      </h1>

      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white shadow rounded p-4">
            <p>Total</p>
            <h2 className="text-2xl font-bold">{summary.total}</h2>
          </div>

          <div className="bg-red-100 rounded p-4">
            <p>High</p>
            <h2 className="text-2xl font-bold">{summary.highRisk}</h2>
          </div>

          <div className="bg-yellow-100 rounded p-4">
            <p>Medium</p>
            <h2 className="text-2xl font-bold">{summary.mediumRisk}</h2>
          </div>

          <div className="bg-green-100 rounded p-4">
            <p>Low</p>
            <h2 className="text-2xl font-bold">{summary.lowRisk}</h2>
          </div>

          <div className="bg-blue-100 rounded p-4">
            <p>Outside Area</p>
            <h2 className="text-2xl font-bold">{summary.outsideServiceArea}</h2>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 bg-white p-4 rounded shadow mb-6">

        <input className="border p-2 rounded"
          name="bbox"
          value={filters.bbox}
          onChange={handleChange}
          placeholder="minLng,minLat,maxLng,maxLat"
        />

        <input className="border p-2 rounded"
          name="stationCode"
          value={filters.stationCode}
          onChange={handleChange}
          placeholder="Station Code"
        />

        <input className="border p-2 rounded"
          name="utilityType"
          value={filters.utilityType}
          onChange={handleChange}
          placeholder="Utility Type"
        />

        <input className="border p-2 rounded"
          name="status"
          value={filters.status}
          onChange={handleChange}
          placeholder="Status"
        />

        <input className="border p-2 rounded"
          name="radiusMeters"
          type="number"
          value={filters.radiusMeters}
          onChange={handleChange}
          placeholder="Radius"
        />

        <button
          onClick={() => {
            setPage(1);
            search(1);
          }}
          disabled={loading}
          className="bg-blue-600 text-white rounded p-2"
        >
          {loading ? "Searching..." : "Search"}
        </button>

      </div>

      {loading && <p className="mb-4 text-blue-600">Loading...</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <TicketMap
        tickets={tickets}
        onBoundsChange={updateBboxDebounced}
      />

      {summary?.byUtilityType && (
        <div className="grid md:grid-cols-4 gap-3 my-6">
          {Object.entries(summary.byUtilityType).map(([key, value]) => (
            <div key={key} className="bg-white rounded shadow p-3">
              <strong>{key}</strong>
              <p>{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-auto bg-white rounded shadow">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Ticket</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Station</th>
              <th>Utility</th>
              <th>Risk</th>
              <th>Inside Area</th>
              <th>Nearest Emergency</th>
              <th>Distance</th>
              <th>Lat</th>
              <th>Lng</th>
            </tr>
          </thead>

          <tbody>

            {tickets.length === 0 && !loading && (
              <tr>
                <td colSpan="11" className="text-center p-6">
                  No tickets found.
                </td>
              </tr>
            )}

            {tickets.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.ticketNo}</td>
                <td>{t.status}</td>
                <td>{t.priority}</td>
                <td>{t.stationCode}</td>
                <td>{t.utilityType}</td>
                <td><RiskBadge risk={t.riskLevel} /></td>
                <td>{t.insideServiceArea ? "Yes" : "No"}</td>
                <td>{t.nearestEmergencyTicketNo ?? "-"}</td>
                <td>{t.distanceToNearestEmergencyMeters ?? "-"}</td>
                <td>{t.latitude}</td>
                <td>{t.longitude}</td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="flex justify-between mt-6">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Previous
        </button>

        <div>
          Page {page} of {totalPages}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

    </div>
  );
}
