// src/components/admin/ReportDetailModal.jsx
import React, { useState } from 'react';
import {
  XMarkIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  PhotoIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const ReportDetailModal = ({ report, onClose, onStatusUpdate }) => {
  const normalizedInitialStatus = (report.status || report.progress || 'submitted').toLowerCase().replace(/[- ]+/g, '_');
  const [newStatus, setNewStatus] = useState(normalizedInitialStatus);
  const [notes, setNotes] = useState(report.adminNotes || '');

  const statusOptions = [
    { value: 'submitted', label: 'Submitted (New)', color: 'bg-blue-100 text-blue-800' },
    { value: 'pending', label: 'Pending Confirmation', color: 'bg-amber-100 text-amber-800' },
    { value: 'accepted', label: 'Accepted', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'assigned', label: 'Assigned to Dept', color: 'bg-orange-100 text-orange-800' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-cyan-100 text-cyan-800' },
    { value: 'resolved', label: 'Resolved', color: 'bg-emerald-100 text-emerald-800' },
    { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-green-600 bg-green-100 border-green-200';
    }
  };

  const handleStatusUpdate = () => {
    onStatusUpdate(report.id, newStatus, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600/50 via-teal-500/50 to-emerald-600/50 overflow-y-auto h-full w-full z-[1000] backdrop-blur-sm">
      <div className="relative top-2 sm:top-10 mx-auto p-2 sm:p-4 border w-11/12 max-w-6xl shadow-2xl rounded-lg sm:rounded-2xl bg-white border-blue-100">
        {/* Header - Mobile Optimized with Blue/Teal Theme */}
        <div className="flex items-center justify-between mb-4 sm:mb-8 pb-4 sm:pb-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-teal-50 -m-2 sm:-m-4 p-4 sm:p-6 rounded-t-lg sm:rounded-t-2xl">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent truncate">
              Report Details
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 hidden sm:block">Comprehensive report information and management</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 sm:p-3 hover:bg-blue-100 rounded-lg sm:rounded-xl transition-all duration-200 border-2 border-blue-200 hover:border-blue-300 ml-2"
          >
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Report Information */}
          <div className="space-y-4 sm:space-y-6">
            {/* Basic Info */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-6 border border-blue-100">
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center">
                <TagIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Report Information
              </h4>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-600">Report ID</label>
                  <p className="text-sm sm:text-lg font-mono text-slate-900 bg-white px-2 sm:px-3 py-1 sm:py-2 rounded-lg border border-blue-200">{report.id}</p>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-600">Category</label>
                  <div className="flex items-center mt-1">
                    <BuildingOfficeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 mr-2" />
                    <span className="text-sm sm:text-base text-slate-900 font-medium">{report.category}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-600">Priority</label>
                  <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold mt-1 border-2 ${getPriorityColor(report.priority)}`}>
                    {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 flex items-center">
                <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
                Description
              </h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-gradient-to-r from-slate-50 to-blue-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-100">
                {report.description}
              </p>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 flex items-center">
                <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
                Location
              </h4>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-red-100">
                <div className="flex items-center mb-2">
                  <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" />
                  <span className="text-sm sm:text-base text-slate-900 font-medium">{report.location}</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-600">
                  Coordinates: {report.coordinates[0]}, {report.coordinates[1]}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 flex items-center">
                <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
                Timeline
              </h4>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center p-2 sm:p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                  <CalendarDaysIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 mr-2 sm:mr-3" />
                  <div>
                    <p className="text-sm sm:text-base text-slate-900 font-medium">Submitted</p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {new Date(report.dateSubmitted).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-100">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 mr-2 sm:mr-3" />
                  <div>
                    <p className="text-sm sm:text-base text-slate-900 font-medium">Reported by</p>
                    <p className="text-xs sm:text-sm text-slate-600">{report.reportedBy}</p>
                  </div>
                </div>
                {report.assignedTo && (
                  <div className="flex items-center p-2 sm:p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100">
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 mr-2 sm:mr-3" />
                    <div>
                      <p className="text-sm sm:text-base text-slate-900 font-medium">Assigned to</p>
                      <p className="text-xs sm:text-sm text-slate-600">{report.assignedTo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            {report.images && report.images.length > 0 && (
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 flex items-center">
                  <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                  Attached Images
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {report.images.map((image, index) => (
                    <div key={index} className="aspect-square bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg sm:rounded-xl flex items-center justify-center border border-blue-200">
                      <PhotoIcon className="w-8 h-8 sm:w-12 sm:h-12 text-blue-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Actions and Map */}
          <div className="space-y-4 sm:space-y-6">
            {/* Status Update */}
            <div className="bg-gradient-to-br from-blue-50 to-emerald-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-6">
              <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 sm:mb-4 flex items-center">
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Update Status
              </h4>
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                    Current Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                    Resolution Notes
                  </label>
                  {report.adminNotes && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-slate-700">
                      <span className="font-semibold text-blue-800">Current Notes: </span>
                      {report.adminNotes}
                    </div>
                  )}
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                    placeholder="Add or update resolution notes..."
                  />
                </div>

                <button
                  onClick={handleStatusUpdate}
                  className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:from-blue-700 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg shadow-blue-200 text-sm sm:text-base"
                >
                  Update Status
                </button>
              </div>
            </div>

            {/* Images */}
            {report.imageUrl && (
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3 flex items-center">
                  <PhotoIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
                  Attached Images
                </h4>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {(Array.isArray(report.imageUrl) ? report.imageUrl : [report.imageUrl]).map((url, index) => (
                    <div key={index} className="aspect-square bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg overflow-hidden border border-blue-200 transition-all duration-200 hover:scale-105">
                      <img
                        src={url}
                        alt={`Report Image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                        <div className="text-center">
                          <PhotoIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-xs text-blue-600">Image {index + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Footer - Mobile Optimized with Blue/Teal Theme */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 sm:pt-6 border-t border-blue-100 bg-gradient-to-r from-blue-50 to-teal-50 -mx-2 sm:-mx-4 -mb-2 sm:-mb-4 px-4 sm:px-6 py-4 sm:py-6 rounded-b-lg sm:rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 font-medium text-sm sm:text-base"
          >
            Close
          </button>
          <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg text-sm sm:text-base">
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
