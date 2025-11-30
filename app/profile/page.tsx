'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    domainsOfInterest: [] as string[],
    targetIndustries: [] as string[],
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    if (user) {
      setFormData({
        bio: user.bio || '',
        domainsOfInterest: user.domainsOfInterest || [],
        targetIndustries: user.targetIndustries || [],
      });
    }
  }, [isAuthenticated, user, router]);

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  if (!isAuthenticated || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your CMIS profile information</p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition"
            >
              Edit Profile
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-maroon-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <p className="text-sm text-gray-600">UIN: {user.uin}</p>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Degree</p>
                  <p className="text-gray-900">{user.degreeType || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Academic Level</p>
                  <p className="text-gray-900">{user.academicLevel || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Expected Graduation</p>
                  <p className="text-gray-900">{user.graduationYear || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Registration Status</p>
                  <p className={user.isRegistered ? 'text-green-600 font-semibold' : 'text-orange-600'}>
                    {user.isRegistered ? '✓ Registered' : 'Not Registered'}
                  </p>
                </div>
              </div>

              {!user.isRegistered && (
                <Link
                  href="/register"
                  className="block mt-6 w-full py-2 bg-maroon-500 text-white text-center rounded-lg hover:bg-maroon-600 transition"
                >
                  Complete Registration
                </Link>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Bio</h3>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">
                  {user.bio || 'No bio added yet.'}
                </p>
              )}
            </div>

            {/* Domains of Interest */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Domains of Interest</h3>
              <div className="flex flex-wrap gap-2">
                {user.domainsOfInterest.length > 0 ? (
                  user.domainsOfInterest.map((domain) => (
                    <span
                      key={domain}
                      className="px-3 py-1 bg-maroon-50 text-maroon-700 rounded-full text-sm font-medium"
                    >
                      {domain}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No domains specified</p>
                )}
              </div>
            </div>

            {/* Target Industries */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Target Industries</h3>
              <div className="flex flex-wrap gap-2">
                {user.targetIndustries.length > 0 ? (
                  user.targetIndustries.map((industry) => (
                    <span
                      key={industry}
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {industry}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No industries specified</p>
                )}
              </div>
            </div>

            {/* Resume */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Resume</h3>
              {user.resumeUrl ? (
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Resume.pdf</p>
                      <p className="text-sm text-gray-500">Uploaded</p>
                    </div>
                  </div>
                  <a
                    href={user.resumeUrl}
                    download
                    className="px-4 py-2 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition"
                  >
                    Download
                  </a>
                </div>
              ) : (
                <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-600 mb-2">No resume uploaded</p>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                    Upload Resume
                  </button>
                </div>
              )}
            </div>

            {/* Mentor */}
            {user.mentor && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Your Mentor</h3>
                <div className="flex items-start p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-maroon-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {user.mentor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{user.mentor.name}</h4>
                    <p className="text-sm text-maroon-600">{user.mentor.company}</p>
                    <p className="text-sm text-gray-600">{user.mentor.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Log */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {user.activityLog.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start pb-4 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 bg-maroon-500 rounded-full mt-2 mr-3" />
                    <div className="flex-1">
                      <p className="text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Mode Actions */}
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
