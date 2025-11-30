'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Navigation from '@/components/Navigation';
import Carousel from '@/components/Carousel';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const quickLinks = [
    {
      title: 'Upcoming Events',
      description: 'View and register for upcoming CMIS events',
      icon: '📅',
      href: '/events',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'Apply for Mentor',
      description: 'Get matched with an industry professional',
      icon: '🎓',
      href: '/profile',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'Upload Resume',
      description: 'Keep your resume up to date',
      icon: '📄',
      href: '/profile',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Career Fair',
      description: 'Connect with top recruiters',
      icon: '💼',
      href: '/events',
      color: 'bg-gold-50 border-gold-200 hover:bg-gold-100'
    },
    {
      title: 'Networking Events',
      description: 'Build your professional network',
      icon: '🤝',
      href: '/events',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    },
    {
      title: 'Your Profile',
      description: 'Update your information',
      icon: '👤',
      href: '/profile',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Registration Banner */}
        {!user.isRegistered && (
          <div className="mb-6 bg-gradient-to-r from-maroon-500 to-maroon-600 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
              <div className="text-white mb-4 sm:mb-0">
                <h2 className="text-xl font-bold mb-1">Complete Your CMIS Registration</h2>
                <p className="text-sm text-maroon-100">
                  You&apos;re not registered for CMIS — sign up now to access all features and events!
                </p>
              </div>
              <Link
                href="/register"
                className="bg-white text-maroon-600 px-6 py-3 rounded-lg font-semibold hover:bg-maroon-50 transition shadow-md whitespace-nowrap"
              >
                Register Now →
              </Link>
            </div>
          </div>
        )}

        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.fullName.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening in CMIS today
          </p>
        </div>

        {/* Carousel */}
        <div className="mb-8">
          <Carousel />
        </div>

        {/* Quick Links Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className={`${link.color} border-2 rounded-xl p-6 transition transform hover:scale-105 hover:shadow-md`}
              >
                <div className="text-4xl mb-3">{link.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{link.title}</h3>
                <p className="text-sm text-gray-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Latest Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="text-3xl mr-4">📰</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    November Newsletter
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Check out this month&apos;s highlights including student spotlights, upcoming events, and career opportunities.
                  </p>
                  <button className="text-maroon-600 font-semibold text-sm hover:text-maroon-700">
                    Read More →
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-start">
                <div className="text-3xl mr-4">🎯</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Career Services
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Schedule a one-on-one session with our career advisors for resume reviews, interview prep, and more.
                  </p>
                  <button className="text-maroon-600 font-semibold text-sm hover:text-maroon-700">
                    Schedule Now →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
