import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createUserProfile } from '../../lib/supabase';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') || 'patient';
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    role: initialRole as 'patient' | 'doctor' | 'admin',
    // Doctor-specific fields
    specialty: '',
    licenseNumber: '',
    yearsOfExperience: '',
    education: '',
    consultationFee: '',
    bio: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const specialties = [
    'Cardiology', 'Dermatology', 'Endocrinology', 'Gastroenterology',
    'Neurology', 'Oncology', 'Ophthalmology', 'Orthopedics',
    'Pediatrics', 'Psychiatry', 'Radiology', 'Surgery'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.role === 'doctor') {
      if (!formData.specialty || !formData.licenseNumber || !formData.yearsOfExperience) {
        setError('Please fill in all required doctor information');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const userData = {
        full_name: formData.fullName,
        phone: formData.phone,
        role: formData.role
      };

      const { data, error } = await signUp(formData.email, formData.password, userData);
      
      if (error) {
        setError(error.message);
      } else if (data.user) {
        // Create user profile
        const profileData = {
          email: formData.email,
          full_name: formData.fullName,
          phone: formData.phone,
          role: formData.role
        };

        await createUserProfile(data.user.id, profileData);

        // If doctor, create doctor profile
        if (formData.role === 'doctor') {
          // This would be handled by a database trigger or separate API call
          // For now, we'll show a success message
          setSuccess('Registration successful! Your doctor application is pending approval.');
        } else {
          setSuccess('Registration successful! Please check your email to verify your account.');
        }

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-primary-600 p-3 rounded-xl">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Join DocSpot
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in here
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-error-50 border border-error-200 rounded-lg p-4 flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-error-600" />
                <span className="text-sm text-error-700">{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-success-50 border border-success-200 rounded-lg p-4 flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success-600" />
                <span className="text-sm text-success-700">{success}</span>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'patient' })}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    formData.role === 'patient'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Patient
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'doctor' })}
                  className={`p-3 border rounded-lg text-sm font-medium transition-colors ${
                    formData.role === 'doctor'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Doctor
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="input mt-1"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="input pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Doctor-specific fields */}
            {formData.role === 'doctor' && (
              <>
                <div>
                  <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
                    Specialty *
                  </label>
                  <select
                    id="specialty"
                    name="specialty"
                    required
                    value={formData.specialty}
                    onChange={handleChange}
                    className="input mt-1"
                  >
                    <option value="">Select your specialty</option>
                    {specialties.map((specialty) => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
                    Medical License Number *
                  </label>
                  <input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="Enter your license number"
                  />
                </div>

                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700">
                    Years of Experience *
                  </label>
                  <input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    required
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="Years of practice"
                  />
                </div>

                <div>
                  <label htmlFor="education" className="block text-sm font-medium text-gray-700">
                    Education
                  </label>
                  <input
                    id="education"
                    name="education"
                    type="text"
                    value={formData.education}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="Medical school and qualifications"
                  />
                </div>

                <div>
                  <label htmlFor="consultationFee" className="block text-sm font-medium text-gray-700">
                    Consultation Fee ($)
                  </label>
                  <input
                    id="consultationFee"
                    name="consultationFee"
                    type="number"
                    min="0"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="Consultation fee in USD"
                  />
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className="input mt-1"
                    placeholder="Brief description about yourself and your practice"
                  />
                </div>
              </>
            )}

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex justify-center py-3"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  `Create ${formData.role === 'doctor' ? 'Doctor' : 'Patient'} Account`
                )}
              </button>
            </div>
          </form>

          {formData.role === 'doctor' && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Note:</strong> Doctor accounts require admin approval. 
                You'll receive an email notification once your application is reviewed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;