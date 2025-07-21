import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle,
  User,
  Star,
  AlertTriangle,
  Activity,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Modal from '../../components/UI/Modal';

// Mock data - in a real app, this would come from your database
const mockDoctorApplications = [
  {
    id: '1',
    full_name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@email.com',
    specialty: 'Cardiology',
    license_number: 'MD123456',
    years_of_experience: 8,
    education: 'Harvard Medical School',
    status: 'pending',
    applied_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    full_name: 'Dr. Michael Chen',
    email: 'michael.chen@email.com',
    specialty: 'Neurology',
    license_number: 'MD789012',
    years_of_experience: 12,
    education: 'Johns Hopkins University',
    status: 'pending',
    applied_at: '2024-01-14T14:20:00Z'
  }
];

const mockStats = {
  totalUsers: 1250,
  totalDoctors: 85,
  totalPatients: 1165,
  pendingApplications: 12,
  totalAppointments: 3420,
  completedAppointments: 2890,
  totalRevenue: 125000,
  averageRating: 4.7
};

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [doctorApplications, setDoctorApplications] = useState(mockDoctorApplications);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [stats, setStats] = useState(mockStats);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleApplicationAction = (applicationId: string, action: 'approve' | 'reject') => {
    setDoctorApplications(prev => 
      prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: action === 'approve' ? 'approved' : 'rejected' }
          : app
      )
    );
    setShowApplicationModal(false);
    
    // Update stats
    setStats(prev => ({
      ...prev,
      pendingApplications: prev.pendingApplications - 1,
      totalDoctors: action === 'approve' ? prev.totalDoctors + 1 : prev.totalDoctors
    }));
  };

  const openApplicationDetails = (application: any) => {
    setSelectedApplication(application);
    setShowApplicationModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage platform operations and user activities
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-success-100 p-3 rounded-full">
                <UserCheck className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDoctors}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-warning-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-error-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-error-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Doctor Applications */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Pending Doctor Applications
                </h2>
                <span className="badge-warning">
                  {doctorApplications.filter(app => app.status === 'pending').length} pending
                </span>
              </div>

              {doctorApplications.filter(app => app.status === 'pending').length > 0 ? (
                <div className="space-y-4">
                  {doctorApplications
                    .filter(app => app.status === 'pending')
                    .map((application) => (
                      <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="bg-primary-100 p-2 rounded-full">
                              <User className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {application.full_name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {application.specialty} • {application.years_of_experience} years exp.
                              </p>
                              <p className="text-sm text-gray-500">
                                Applied {new Date(application.applied_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => openApplicationDetails(application)}
                              className="btn-outline text-sm"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleApplicationAction(application.id, 'approve')}
                              className="p-2 text-success-600 hover:bg-success-100 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleApplicationAction(application.id, 'reject')}
                              className="p-2 text-error-600 hover:bg-error-100 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No pending applications</p>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Activity
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="bg-success-100 p-2 rounded-full">
                    <CheckCircle className="h-4 w-4 text-success-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Dr. Emily Rodriguez was approved
                    </p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      New patient registration: John Smith
                    </p>
                    <p className="text-xs text-gray-500">4 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-warning-100 p-2 rounded-full">
                    <AlertTriangle className="h-4 w-4 text-warning-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      System maintenance scheduled
                    </p>
                    <p className="text-xs text-gray-500">6 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-error-100 p-2 rounded-full">
                    <XCircle className="h-4 w-4 text-error-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Dr. Mark Wilson's application was rejected
                    </p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Platform Health */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Platform Health
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-success-600" />
                    <span className="text-sm text-gray-600">System Status</span>
                  </div>
                  <span className="badge-success">Healthy</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-gray-600">Uptime</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Avg. Rating</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.averageRating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary-600" />
                    <span className="text-sm text-gray-600">Active Users</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">847</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  Generate Report
                </button>
                <button className="w-full btn-outline">
                  View All Users
                </button>
                <button className="w-full btn-outline">
                  System Settings
                </button>
                <button className="w-full btn-outline">
                  Send Announcement
                </button>
              </div>
            </div>

            {/* Monthly Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                This Month
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Patients</span>
                  <span className="font-medium text-gray-900">+127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Doctors</span>
                  <span className="font-medium text-gray-900">+8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Appointments</span>
                  <span className="font-medium text-gray-900">+342</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-medium text-gray-900">+$12.5K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      <Modal
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        title="Doctor Application Details"
        size="lg"
      >
        {selectedApplication && (
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium text-gray-900">{selectedApplication.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{selectedApplication.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Specialty</p>
                  <p className="font-medium text-gray-900">{selectedApplication.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Years of Experience</p>
                  <p className="font-medium text-gray-900">{selectedApplication.years_of_experience} years</p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Professional Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Medical License Number</p>
                  <p className="font-medium text-gray-900">{selectedApplication.license_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Education</p>
                  <p className="font-medium text-gray-900">{selectedApplication.education}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Application Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedApplication.applied_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleApplicationAction(selectedApplication.id, 'approve')}
                className="btn-success flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve Application</span>
              </button>
              <button
                onClick={() => handleApplicationAction(selectedApplication.id, 'reject')}
                className="btn-error flex items-center space-x-2"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject Application</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;