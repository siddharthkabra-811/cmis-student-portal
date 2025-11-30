'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/Navigation';

const degreeTypes = ['MS', 'PhD', 'MBA', 'BS'];
const academicLevels = ['Graduate', 'Undergraduate'];
const availableDomains = [
  'Data Analytics',
  'Business Intelligence',
  'Cloud Computing',
  'Cybersecurity',
  'Software Development',
  'AI/Machine Learning',
  'Enterprise Systems',
  'Digital Marketing'
];
const availableIndustries = [
  'Technology',
  'Consulting',
  'Finance',
  'Healthcare',
  'Retail',
  'Energy',
  'Manufacturing',
  'Education'
];

export default function RegisterPage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    uin: '',
    email: '',
    degreeType: '' as any,
    academicLevel: '' as any,
    graduationYear: null as number | null,
    domainsOfInterest: [] as string[],
    targetIndustries: [] as string[],
    needsMentor: false,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        uin: user.uin || '',
        email: user.email || '',
        degreeType: user.degreeType || '',
        academicLevel: user.academicLevel || '',
        graduationYear: user.graduationYear,
        domainsOfInterest: user.domainsOfInterest || [],
        targetIndustries: user.targetIndustries || [],
        needsMentor: user.needsMentor || false,
      });
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    updateUser({
      ...formData,
      isRegistered: true,
    });

    setShowToast(true);
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
  };

  const handleDomainToggle = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      domainsOfInterest: prev.domainsOfInterest.includes(domain)
        ? prev.domainsOfInterest.filter(d => d !== domain)
        : [...prev.domainsOfInterest, domain]
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setFormData(prev => ({
      ...prev,
      targetIndustries: prev.targetIndustries.includes(industry)
        ? prev.targetIndustries.filter(i => i !== industry)
        : [...prev.targetIndustries, industry]
    }));
  };

  if (!isAuthenticated) return null;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ✅ Registration successful! Redirecting...
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">CMIS Registration</h1>
            <p className="text-gray-600">Complete your registration to access all CMIS features and events</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
              />
            </div>

            {/* UIN */}
            <div>
              <label htmlFor="uin" className="block text-sm font-medium text-gray-700 mb-2">
                UIN (University Identification Number) *
              </label>
              <input
                id="uin"
                type="text"
                required
                value={formData.uin}
                onChange={(e) => setFormData({ ...formData, uin: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                placeholder="123456789"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent bg-gray-50"
                readOnly
              />
            </div>

            {/* Degree Type */}
            <div>
              <label htmlFor="degreeType" className="block text-sm font-medium text-gray-700 mb-2">
                Degree Type *
              </label>
              <select
                id="degreeType"
                required
                value={formData.degreeType}
                onChange={(e) => setFormData({ ...formData, degreeType: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
              >
                <option value="">Select degree type</option>
                {degreeTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Academic Level */}
            <div>
              <label htmlFor="academicLevel" className="block text-sm font-medium text-gray-700 mb-2">
                Academic Level *
              </label>
              <select
                id="academicLevel"
                required
                value={formData.academicLevel}
                onChange={(e) => setFormData({ ...formData, academicLevel: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
              >
                <option value="">Select academic level</option>
                {academicLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Graduation Year */}
            <div>
              <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Graduation Year *
              </label>
              <select
                id="graduationYear"
                required
                value={formData.graduationYear || ''}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
              >
                <option value="">Select year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Domains of Interest */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Domains of Interest * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableDomains.map(domain => (
                  <label
                    key={domain}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.domainsOfInterest.includes(domain)
                        ? 'border-maroon-500 bg-maroon-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.domainsOfInterest.includes(domain)}
                      onChange={() => handleDomainToggle(domain)}
                      className="mr-2 rounded border-gray-300 text-maroon-500 focus:ring-maroon-500"
                    />
                    <span className="text-sm">{domain}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Industries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Industries * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableIndustries.map(industry => (
                  <label
                    key={industry}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.targetIndustries.includes(industry)
                        ? 'border-maroon-500 bg-maroon-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.targetIndustries.includes(industry)}
                      onChange={() => handleIndustryToggle(industry)}
                      className="mr-2 rounded border-gray-300 text-maroon-500 focus:ring-maroon-500"
                    />
                    <span className="text-sm">{industry}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Resume Upload */}
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-2">
                Resume (PDF or DOCX)
              </label>
              <input
                id="resume"
                type="file"
                accept=".pdf,.docx"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">You can upload your resume later from your profile page</p>
            </div>

            {/* Need Mentor */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you need a mentor? *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="needsMentor"
                    checked={formData.needsMentor === true}
                    onChange={() => setFormData({ ...formData, needsMentor: true })}
                    className="mr-2 border-gray-300 text-maroon-500 focus:ring-maroon-500"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="needsMentor"
                    checked={formData.needsMentor === false}
                    onChange={() => setFormData({ ...formData, needsMentor: false })}
                    className="mr-2 border-gray-300 text-maroon-500 focus:ring-maroon-500"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-maroon-500 text-white rounded-lg font-semibold hover:bg-maroon-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Submitting...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
