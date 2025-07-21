import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Plus, 
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointments, getDoctors } from '../../lib/supabase';
import { Appointment, Doctor } from '../../types';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import Modal from '../../components/UI/Modal';

const PatientDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      const [appointmentsResult, doctorsResult] = await Promise.all([
        getAppointments(user.id, 'patient'),
        getDoctors()
      ]);

      if (appointmentsResult.data) {
        setAppointments(appointmentsResult.data);
      }

      if (doctorsResult.data) {
        setDoctors(doctorsResult.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const upcomingAppointments = appointments.filter(
    apt => apt.status === 'confirmed' && new Date(apt.appointment_date) >= new Date()
  );

  const recentAppointments = appointments.filter(
    apt => apt.status === 'completed'
  ).slice(0, 3);

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.user?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !specialtyFilter || doctor.specialty === specialtyFilter;
    return matchesSearch && matchesSpecialty;
  });

  const specialties = [...new Set(doctors.map(doctor => doctor.specialty))];

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      completed: 'badge-primary',
      cancelled: 'badge-error'
    };
    return badges[status as keyof typeof badges] || 'badge-primary';
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
            Welcome back, {userProfile?.full_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your appointments and health records
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
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
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
                <User className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doctors Visited</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(appointments.map(apt => apt.doctor_id)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="bg-error-100 p-3 rounded-full">
                <FileText className="h-6 w-6 text-error-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Medical Records</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Appointments */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Upcoming Appointments
                </h2>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Book Appointment</span>
                </button>
              </div>

              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-primary-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Dr. {appointment.doctor?.user?.full_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.doctor?.specialty}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                              {appointment.appointment_time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${getStatusBadge(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">
                            {appointment.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming appointments</p>
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="btn-primary mt-4"
                  >
                    Book Your First Appointment
                  </button>
                </div>
              )}
            </div>

            {/* Recent Appointments */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Recent Appointments
              </h2>

              {recentAppointments.length > 0 ? (
                <div className="space-y-4">
                  {recentAppointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <User className="h-5 w-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              Dr. {appointment.doctor?.user?.full_name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {appointment.doctor?.specialty}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${getStatusBadge(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <Link
                            to={`/appointments/${appointment.id}`}
                            className="text-sm text-primary-600 hover:text-primary-700 mt-1 block"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent appointments</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="w-full btn-primary flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Book Appointment</span>
                </button>
                <Link
                  to="/medical-records"
                  className="w-full btn-outline flex items-center justify-center space-x-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>View Records</span>
                </Link>
                <Link
                  to="/profile"
                  className="w-full btn-outline flex items-center justify-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Update Profile</span>
                </Link>
              </div>
            </div>

            {/* Health Tips */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Health Tips
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-1">
                    Stay Hydrated
                  </h4>
                  <p className="text-sm text-blue-700">
                    Drink at least 8 glasses of water daily for optimal health.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-1">
                    Regular Exercise
                  </h4>
                  <p className="text-sm text-green-700">
                    Aim for 30 minutes of moderate exercise most days of the week.
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-1">
                    Quality Sleep
                  </h4>
                  <p className="text-sm text-purple-700">
                    Get 7-9 hours of quality sleep each night for better health.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book an Appointment"
        size="lg"
      >
        <div className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search doctors or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="input pl-10 pr-8"
              >
                <option value="">All Specialties</option>
                {specialties.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctors List */}
          <div className="max-h-96 overflow-y-auto space-y-4">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Dr. {doctor.user?.full_name}
                      </h3>
                      <p className="text-sm text-gray-600">{doctor.specialty}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {doctor.rating || 4.5}
                          </span>
                        </div>
                        <span className="text-sm text-gray-600">
                          {doctor.years_of_experience} years exp.
                        </span>
                        <span className="text-sm font-medium text-primary-600">
                          ${doctor.consultation_fee}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDoctor(doctor)}
                    className="btn-primary"
                  >
                    Book Now
                  </button>
                </div>
                {doctor.bio && (
                  <p className="text-sm text-gray-600 mt-3 pl-16">
                    {doctor.bio}
                  </p>
                )}
              </div>
            ))}
          </div>

          {filteredDoctors.length === 0 && (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No doctors found matching your criteria</p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PatientDashboard;