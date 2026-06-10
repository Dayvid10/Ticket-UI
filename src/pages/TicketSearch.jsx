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

export default function TicketSearch() {
  const [filters, setFilters] = useState({
    status: "",
    stationCode: "",
    utilityType: "",
    bbox: "-90,-180,90,180",
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [bbox, setBbox] = useState("-90,-180,90,180");

   const updateBboxDebounced = debounce((bounds) => {
    const bboxString = `${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}`;

    setFilters((prev) => ({
      ...prev,
      bbox: bboxString,
    }));

    setPage(1);
  }, 800);
  
  // handle input changes
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });

    // reset page when filters change
    setPage(1);
  };

  // main API call
  const search = async (currentPage = page) => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        "http://localhost:3000/api/tickets/search",
        {
          params: {
            ...filters,
            page: currentPage,
            limit,
          },
        }
      );

      setData(res.data.data);
      setTotal(res.data.summary?.total || 0);
      setTotalPages(res.data.summary?.totalPages || 0);
      setPage(res.data.summary?.page || currentPage);
    } catch (err) {
      setError("Failed to fetch tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // auto-fetch when page changes
  useEffect(() => {
    search(page);
  }, [page]);

  return (
    <div className="p-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-2 text-gray-800">
        Ticket Search Dashboard
      </h1>

      {/* SUMMARY */}
      <div className="mb-4 text-gray-600">
        Total Tickets:{" "}
        <span className="font-bold text-blue-600">{total}</span>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-blue-600 mb-3">
          Loading tickets...
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-red-600 mb-3">
          {error}
        </div>
      )}

      {/* FILTERS */}
      <div className="bg-white shadow-md rounded-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <input
          name="status"
          placeholder="Status"
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="stationCode"
          placeholder="Station Code"
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          name="utilityType"
          placeholder="Utility Type"
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={() => search(1)}
          disabled={loading}
          className={`px-6 py-3 rounded-xl text-white font-medium transition duration-200
          ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Searching..." : "Search"}
        </button>

      </div>

      {/* Ticket Map */}
      <TicketMap
        tickets={data}
        onBoundsChange={updateBboxDebounced}
       />
      {/* TABLE */}
      <div className="bg-white shadow-md rounded-2xl overflow-hidden">

        <table className="w-full text-sm">

          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Ticket No</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Station</th>
              <th className="p-3 text-left">Utility</th>
              <th className="p-3 text-left">Lat</th>
              <th className="p-3 text-left">Lng</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && !loading ? (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  No tickets found
                </td>
              </tr>
            ) : (
              data.map((t, i) => (
                <tr key={i} className="border-t hover:bg-gray-50 transition">
                  <td className="p-3">{t.ticketNo}</td>
                  <td className="p-3">{t.status}</td>
                  <td className="p-3">{t.priority}</td>
                  <td className="p-3">{t.stationCode}</td>
                  <td className="p-3">{t.utilityType}</td>
                  <td className="p-3">{t.latitude}</td>
                  <td className="p-3">{t.longitude}</td>
                </tr>
              ))
            )}
          </tbody>

        </table>

      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-6">

        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50"
        >
          Previous
        </button>

        <div className="text-gray-700">
          Page {page} of {totalPages}
        </div>

        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-200 rounded-xl disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}