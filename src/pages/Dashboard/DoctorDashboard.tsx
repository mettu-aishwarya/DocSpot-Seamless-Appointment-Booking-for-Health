import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  User,
  Phone,
  Mail,
  FileText,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointments, updateAppointmentStatus } from '../../lib/supabase';
import { Appointment } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Modal from '../../components/UI/Modal';

const DoctorDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    loadAppointments();
  }, [user]);

  const loadAppointments = async () => {
    if (!user) return;

    try {
      const { data } = await getAppointments(user.id, 'doctor');
      if (data) {
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId: string, status: string) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      await loadAppointments(); // Reload appointments
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const todayAppointments = appointments.filter(
    apt => new Date(apt.appointment_date).toDateString() === new Date().toDateString()
  );

  const upcomingAppointments = appointments.filter(
    apt => apt.status === 'confirmed' && new Date(apt.appointment_date) >= new Date()
  );

  const completedAppointments = appointments.filter(
    apt => apt.status === 'completed'
  );

  const totalEarnings = completedAppointments.reduce((sum, apt) => {
    // This would come from the doctor's consultation fee
    return sum + 150; // Placeholder amount
  }, 0);

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-primary',
      cancelled: 'badge-error'
    };
    return badges[status as keyof typeof badges] || 'badge-primary';
  };

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
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
            Welcome, Dr. {userProfile?.full_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your appointments and patient care
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="bg-primary-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-success-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-warning-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(appointments.map(apt => apt.patient_id)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-error-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-error-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Appointments */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Appointments
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'all'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('pending')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'pending'
                        ? 'bg-warning-100 text-warning-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilter('confirmed')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'confirmed'
                        ? 'bg-success-100 text-success-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filter === 'completed'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              {filteredAppointments.length > 0 ? (
                <div className="space-y-4">
                  {filteredAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {appointment.patient?.full_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.reason}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                              {appointment.appointment_time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`badge ${getStatusBadge(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <div className="flex space-x-2">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                  className="p-2 text-success-600 hover:bg-success-100 rounded-lg transition-colors"
                                  title="Confirm"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                  className="p-2 text-error-600 hover:bg-error-100 rounded-lg transition-colors"
                                  title="Cancel"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            {appointment.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                                title="Mark as Completed"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                            )}
                            <button
                              onClick={() => openAppointmentDetails(appointment)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No appointments found</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Today's Schedule
              </h3>
              {todayAppointments.length > 0 ? (
                <div className="space-y-3">
                  {todayAppointments.slice(0, 5).map((appointment) => (
                    <div key={appointment.id} className="flex items-center space-x-3">
                      <div className="bg-primary-100 p-2 rounded-full">
                        <Clock className="h-4 w-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {appointment.appointment_time}
                        </p>
                        <p className="text-xs text-gray-600">
                          {appointment.patient?.full_name}
                        </p>
                      </div>
                      <span className={`badge text-xs ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No appointments today</p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                This Month
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Appointments</span>
                  <span className="font-medium text-gray-900">{appointments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-medium text-gray-900">{completedAppointments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <span className="font-medium text-gray-900">${totalEarnings.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-medium text-gray-900">4.8</span>
                  </div>
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
                  Update Availability
                </button>
                <button className="w-full btn-outline">
                  View Patient Records
                </button>
                <button className="w-full btn-outline">
                  Generate Reports
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Appointment Details"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            {/* Patient Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">
                      {selectedAppointment.patient?.full_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">
                      {selectedAppointment.patient?.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-900">
                      {selectedAppointment.patient?.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {selectedAppointment.patient?.date_of_birth || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointment Details
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedAppointment.appointment_date).toLocaleDateString()} at{' '}
                    {selectedAppointment.appointment_time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reason for Visit</p>
                  <p className="font-medium text-gray-900">
                    {selectedAppointment.reason}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`badge ${getStatusBadge(selectedAppointment.status)}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                {selectedAppointment.notes && (
                  <div>
                    <p className="text-sm text-gray-600">Notes</p>
                    <p className="font-medium text-gray-900">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {selectedAppointment.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedAppointment.id, 'confirmed');
                      setShowDetailsModal(false);
                    }}
                    className="btn-success flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Confirm</span>
                  </button>
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedAppointment.id, 'cancelled');
                      setShowDetailsModal(false);
                    }}
                    className="btn-error flex items-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              )}
              {selectedAppointment.status === 'confirmed' && (
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedAppointment.id, 'completed');
                    setShowDetailsModal(false);
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark as Completed</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorDashboard;