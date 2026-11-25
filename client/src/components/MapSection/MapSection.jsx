import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import styles from "./MapSection.module.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import clsx from "classnames";
import { useAuth } from '@clerk/clerk-react';

// Custom marker icons for status
const markerIcon = (status) =>
  new L.Icon({
    iconUrl:
      status === "completed"
        ? "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png"
        : status === "in-progress"
        ? "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-yellow.png"
        : "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
  });

const MapSection = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { getToken } = useAuth();

    useEffect(() => {
    const fetchAllReports = async () => {
      setLoading(true);
      setError("");
      try {
        const token = await getToken();
        // Fetch ALL reports from admin endpoint
        const res = await fetch(`${import.meta.env.VITE_API_URL}/admins/allReports`, {
          method: "GET",
          credentials: "include", // Include for authentication if needed
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok && data.data && data.data.reports) {
          setReports(data.data.reports); // Set the reports array
        } else {
          setError(data.message || "Failed to fetch reports");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, []);

  if (loading) return <div className="text-center py-10 text-blue-600 font-semibold">Loading map...</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-semibold">{error}</div>;

  return (
    <section
      className={clsx(
        styles.wrapper,
        "bg-white rounded-2xl shadow p-0 w-full h-[60vh] mb-8"
      )}
    >
      <MapContainer
        center={[28.6139, 77.2090]} // Delhi center
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%", borderRadius: "1rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {reports.map((report, idx) => (
          <Marker
            key={report._id || idx}
            position={[report.coordinates.lat, report.coordinates.lng]}
            icon={markerIcon(report.progress)} // Use progress from schema
          >
            <Popup>
              <div className="text-sm">
                <strong>Report ID:</strong> RPT-{report.complaintId}<br />
                <strong>Category:</strong> {report.category}<br />
                <strong>Description:</strong> {report.description}<br />
                <strong>Location:</strong> {report.location}<br />
                <strong>Status:</strong> {report.progress}<br />
                <strong>Severity:</strong> {report.severity}<br />
                <strong>Department:</strong> {report.department}<br />
                {report.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={report.imageUrl}
                      alt="Report"
                      className="w-20 h-20 object-cover rounded"
                    />
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
};

export default MapSection;