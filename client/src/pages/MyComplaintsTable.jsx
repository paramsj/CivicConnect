import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EyeIcon, XMarkIcon, MapPinIcon, ArrowPathIcon, ChatBubbleLeftEllipsisIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from '@clerk/clerk-react';

const statusColors = {
  submitted: "bg-blue-100 text-blue-700",
  pending: "bg-amber-100 text-amber-700",
  accepted: "bg-cyan-100 text-cyan-700",
  assigned: "bg-orange-100 text-orange-700",
  "in-progress": "bg-purple-100 text-purple-700",
  in_progress: "bg-purple-100 text-purple-700",
  resolved: "bg-emerald-100 text-emerald-700",
  completed: "bg-green-100 text-green-700",
};

const severityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
  critical: "bg-purple-100 text-purple-700",
};

const mapReport = (r) => {
  // Only a report created in the last 2 minutes can be pending analysis
  const isRecent = r.createdAt ? (Date.now() - new Date(r.createdAt).getTime() < 120000) : false;
  const isPending = isRecent && r.mlStatus === 'analysing' && (!r.category || r.category === 'analysing');
  return {
    id: `RPT-${r.complaintId}`,
    _mongoId: r._id,
    category: isPending ? 'analysing' : (r.category && r.category !== 'analysing' ? r.category : 'others'),
    mlStatus: isPending ? 'analysing' : 'done',
    description: r.description,
    location: r.location,
    department: isPending ? 'Pending' : (r.department && r.department !== 'Pending' ? r.department : 'General Services'),
    coordinates: r.coordinates,
    severity: r.severity || 'low',
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "",
    rawDate: r.createdAt,
    status: r.progress || "submitted",
    image: r.imageUrl,
    adminNotes: r.adminNotes || '',
  };
};

const MyComplaintsTable = ({ setMap }) => {
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const { getToken } = useAuth();
  const routerLocation = useLocation();
  const pollRef = useRef(null);

  // Show a brief toast on first arrival from submission
  useEffect(() => {
    if (routerLocation.state?.newReportSubmitted) {
      setToast("Your report has been submitted! It will appear below while AI analysis runs.");
      const t = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(t);
    }
  }, [routerLocation.state]);

  const fetchComplaints = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError("");

    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/getAllIssues`, {
        method: "GET",
        credentials: "include",
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setComplaints(data.data.map(mapReport));
      } else {
        setError(data.message || "Failed to fetch reports");
      }
    } catch (err) {
      setError("Network error fetching reports");
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, [getToken]);

  // Initial fetch on mount
  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // Real-time Server-Sent Events (SSE) listener: Instant push for newly classified reports (Zero polling!)
  useEffect(() => {
    let eventSource = null;
    let isMounted = true;

    const setupSSE = async () => {
      try {
        const token = await getToken();
        if (!token || !isMounted) return;

        const sseUrl = `${import.meta.env.VITE_API_URL}/users/reports/stream?token=${encodeURIComponent(token)}`;
        eventSource = new EventSource(sseUrl, { withCredentials: true });

        eventSource.addEventListener('report_classified', (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('[SSE] Live classified report received:', data.complaintId || data.reportId);

            // Update only this specific report in state immediately (no full re-fetch!)
            setComplaints(prev => prev.map(c => {
              const matchesMongoId = data.reportId && c._mongoId === data.reportId.toString();
              const matchesComplaintId = data.complaintId && c.id === `RPT-${data.complaintId}`;

              if (matchesMongoId || matchesComplaintId) {
                return {
                  ...c,
                  category: data.category && data.category !== 'analysing' ? data.category : c.category,
                  department: data.department && data.department !== 'Pending' ? data.department : c.department,
                  severity: data.severity || c.severity,
                  mlStatus: data.mlStatus || 'done',
                  status: data.progress || c.status,
                  adminNotes: data.adminNotes !== undefined ? data.adminNotes : c.adminNotes,
                };
              }
              return c;
            }));
          } catch (e) {
            console.error('[SSE] Failed to parse event data:', e);
          }
        });

        // Listen for live admin status & notes updates via SSE
        eventSource.addEventListener('report_status_updated', (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('[SSE] Live status & notes update received for report:', data.complaintId || data.reportId);

            setComplaints(prev => prev.map(c => {
              const matchesMongoId = data.reportId && c._mongoId === data.reportId.toString();
              const matchesComplaintId = data.complaintId && c.id === `RPT-${data.complaintId}`;

              if (matchesMongoId || matchesComplaintId) {
                return {
                  ...c,
                  status: data.progress || data.status || c.status,
                  adminNotes: data.adminNotes !== undefined ? data.adminNotes : c.adminNotes,
                  category: data.category || c.category,
                  department: data.department || c.department,
                };
              }
              return c;
            }));

            // If citizen currently has the modal open for this report, update modal in real-time
            setSelected(prev => {
              if (prev && ((data.reportId && prev._mongoId === data.reportId.toString()) || (data.complaintId && prev.id === `RPT-${data.complaintId}`))) {
                return {
                  ...prev,
                  status: data.progress || data.status || prev.status,
                  adminNotes: data.adminNotes !== undefined ? data.adminNotes : prev.adminNotes,
                };
              }
              return prev;
            });
          } catch (e) {
            console.error('[SSE] Failed to parse status update event:', e);
          }
        });

        eventSource.onerror = (err) => {
          console.warn('[SSE] EventSource stream notice:', err);
        };
      } catch (err) {
        console.warn('[SSE] Connection initialization failed:', err);
      }
    };

    setupSSE();

    return () => {
      isMounted = false;
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [getToken]);

  return (
    <div className="w-full h-full p-4 flex flex-col">

      {/* Toast notification */}
      {toast && (
        <div className="mb-3 flex items-center justify-between p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm animate-pulse-once">
          <span>✅ {toast}</span>
          <button onClick={() => setToast("")} className="ml-3 text-blue-500 hover:text-blue-700 font-bold">✕</button>
        </div>
      )}

      {/* Header: count + refresh */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm font-medium text-gray-500">
          {loading ? "Fetching latest reports..." : `Showing ${complaints.length} reports`}
        </span>
        <button
          onClick={() => fetchComplaints(false)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 disabled:opacity-50 cursor-pointer"
          title="Refresh reports"
        >
          <ArrowPathIcon className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="overflow-x-auto flex-1">
        {loading ? (
          <div className="text-center py-10 text-blue-600 font-semibold">Loading your reports...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-600 font-semibold">{error}</div>
        ) : complaints.length === 0 ? (
          <div className="text-center py-10 text-gray-500">No reports found.</div>
        ) : (
          <table className="w-full border border-gray-200 shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 font-bold text-left text-gray-700">Report ID</th>
                <th className="px-4 py-3 font-bold text-left text-gray-700">Category</th>
                <th className="px-4 py-3 font-bold text-left text-gray-700">Description</th>
                <th className="px-4 py-3 font-bold text-left text-gray-700">Location</th>
                <th className="px-4 py-3 font-bold text-left text-gray-700">Date Submitted</th>
                <th className="px-4 py-3 font-bold text-left text-gray-700">Status</th>
                <th className="px-4 py-3 font-bold text-center text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, idx) => {
                const isPending = c.mlStatus === 'analysing';
                return (
                  <tr key={c._mongoId || c.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} ${isPending ? "opacity-70" : ""}`}>
                    <td className="px-4 py-3 text-sm">{c.id}</td>
                    <td className="px-4 py-3">
                      {isPending ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse inline-block"></span>
                          AI Analysing…
                        </span>
                      ) : (
                        <span className="text-sm capitalize">{c.category}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 truncate max-w-xs text-sm">{c.description}</td>
                    <td className="px-4 py-3 flex items-center gap-1 text-sm">
                      <MapPinIcon className="w-4 h-4 text-blue-500 inline-block flex-shrink-0" />
                      <span>{c.location}</span>
                    </td>
                    <td className="px-4 py-3 text-sm">{c.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col items-start gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[c.status] || "bg-gray-100 text-gray-700"}`}>
                          {c.status.replace('_', ' ').replace('-', ' ')}
                        </span>
                        {c.adminNotes && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-medium bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200" title={c.adminNotes}>
                            <ChatBubbleLeftEllipsisIcon className="w-3.5 h-3.5 text-blue-500 inline flex-shrink-0" />
                            Note added
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelected(c)}
                        className="p-2 rounded hover:bg-blue-100 transition cursor-pointer"
                        aria-label="View details"
                        title="View details"
                      >
                        <EyeIcon className="w-5 h-5 text-blue-600" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 relative"
              initial={{ scale: 0.95, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close button */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                onClick={() => {
                  setSelected(null);
                  setMap && setMap(true);
                }}
                aria-label="Close"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold mb-2">Complaint Details</h2>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-gray-600">Report ID:</span>
                    <span>{selected.id}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-gray-600">Category:</span>
                    <span>{selected.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-gray-600">Department:</span>
                    <span>{selected.department}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-gray-600">Severity:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${severityColors[selected.severity] || "bg-gray-100 text-gray-700"}`}>
                      {selected.severity}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[selected.status] || "bg-gray-100 text-gray-700"}`}>
                      {selected.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-gray-600">Description:</span>
                    <span>{selected.description}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-semibold text-gray-600">Location:</span>
                    <MapPinIcon className="w-5 h-5 text-blue-500 inline-block" />
                    <span>{selected.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-gray-600">Coordinates:</span>
                    <span>{selected.coordinates ? `${selected.coordinates.lat}, ${selected.coordinates.lng}` : "N/A"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="font-semibold text-gray-600">Date Submitted:</span>
                    <span>{selected.date}</span>
                  </div>
                  {selected.adminNotes && (
                    <div className="flex flex-col gap-1.5 mt-2 p-3 bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50 border-2 border-blue-200 rounded-lg shadow-sm">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5 text-sm">
                        <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-blue-600 inline" />
                        Admin Update & Notes:
                      </span>
                      <p className="text-sm text-slate-800 whitespace-pre-wrap pl-6 bg-white/70 p-2 rounded border border-blue-100 font-medium">{selected.adminNotes}</p>
                    </div>
                  )}
                  {selected.image && (
                    <div className="flex flex-col gap-1 mt-2">
                      <span className="font-semibold text-gray-600">Image:</span>
                      <img
                        src={selected.image}
                        alt="Complaint"
                        className="w-full h-40 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyComplaintsTable;