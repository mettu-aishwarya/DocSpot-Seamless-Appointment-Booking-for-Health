import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  Shield, 
  Clock, 
  Star, 
  Users, 
  Award,
  CheckCircle,
  ArrowRight,
  Heart,
  Brain,
  Eye,
  Bone
} from 'lucide-react';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: Calendar,
      title: 'Easy Booking',
      description: 'Schedule appointments with just a few clicks. No more waiting on hold or playing phone tag.'
    },
    {
      icon: Clock,
      title: 'Real-time Availability',
      description: 'See available time slots instantly and book appointments that fit your schedule.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health information is protected with enterprise-grade security and privacy measures.'
    },
    {
      icon: Users,
      title: 'Verified Doctors',
      description: 'All healthcare providers are thoroughly vetted and verified for your peace of mind.'
    }
  ];

  const specialties = [
    { icon: Heart, name: 'Cardiology', doctors: 45 },
    { icon: Brain, name: 'Neurology', doctors: 32 },
    { icon: Eye, name: 'Ophthalmology', doctors: 28 },
    { icon: Bone, name: 'Orthopedics', doctors: 38 }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'DocSpot made it so easy to find and book an appointment with a specialist. The whole process was seamless!',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Cardiologist',
      content: 'As a healthcare provider, DocSpot has streamlined my appointment management and improved patient satisfaction.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Patient',
      content: 'I love how I can manage all my appointments in one place. The reminders are really helpful too!',
      rating: 5
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Patients' },
    { number: '500+', label: 'Verified Doctors' },
    { number: '50+', label: 'Specialties' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-primary-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Health,{' '}
              <span className="text-primary-600">Simplified</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Book appointments with trusted healthcare providers instantly. 
              No more waiting on hold or playing phone tag with busy receptionists.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for doctors, specialties, or conditions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary">
                  Search
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-3">
                Get Started Free
              </Link>
              <Link to="/doctors" className="btn-outline text-lg px-8 py-3">
                Browse Doctors
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DocSpot?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing healthcare by making it more accessible, 
              convenient, and patient-centered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="bg-primary-100 p-3 rounded-full w-fit mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Specialties
            </h2>
            <p className="text-xl text-gray-600">
              Find specialists across various medical fields
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialties.map((specialty, index) => (
              <Link
                key={index}
                to={`/doctors?specialty=${specialty.name.toLowerCase()}`}
                className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 p-3 rounded-full group-hover:bg-primary-200 transition-colors">
                    <specialty.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {specialty.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {specialty.doctors} doctors available
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors ml-auto" />
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/specialties" className="btn-outline">
              View All Specialties
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Getting the care you need is simple with DocSpot
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Search & Browse
              </h3>
              <p className="text-gray-600">
                Find doctors by specialty, location, or availability. 
                Read reviews and compare profiles.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Book Appointment
              </h3>
              <p className="text-gray-600">
                Choose your preferred time slot and book instantly. 
                Upload any necessary documents or medical records.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Get Care
              </h3>
              <p className="text-gray-600">
                Attend your appointment and receive quality healthcare. 
                Manage follow-ups and records through your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Trusted by thousands of patients and healthcare providers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who have simplified their healthcare journey with DocSpot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
              Sign Up as Patient
            </Link>
            <Link to="/register?role=doctor" className="border-2 border-white text-white hover:bg-white hover:text-primary-600 px-8 py-3 rounded-lg font-semibold transition-colors">
              Join as Doctor
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;