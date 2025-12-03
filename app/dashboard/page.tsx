"use client";

import Carousel from "@/components/Carousel";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import React from "react";

export default function DashboardPage() {
  // const { user, isAuthenticated } = useAuth();
  const [user, setUser] = React.useState<any>({});

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem("currentUser");
      if (currentUser) {
        setUser(JSON.parse(currentUser));
      }
    }
  }, []);

  const featuredContent = [
    {
      title: "Latest Newsletter",
      description: "Read the latest updates from CMIS community",
      icon: "📰",
      tag: "Monthly",
      tagColor: "bg-blue-100 text-blue-700",
      href: "https://cmis.ai/",
      gradient: "from-blue-50 to-blue-100",
    },
    {
      title: "Success Stories",
      description: "Inspiring journeys of CMIS alumni",
      icon: "⭐",
      tag: "Featured",
      tagColor: "bg-purple-100 text-purple-700",
      href: "https://cmis.ai/",
      gradient: "from-purple-50 to-purple-100",
    },
    {
      title: "Career Resources",
      description: "Tools and guides for your career growth",
      icon: "💼",
      tag: "Resources",
      tagColor: "bg-green-100 text-green-700",
      href: "https://cmis.ai/",
      gradient: "from-green-50 to-green-100",
    },
  ];

  const blogPosts = [
    {
      title: "Navigating Your Tech Career in 2024",
      excerpt: "Expert insights on building a successful career in technology and information systems...",
      author: "CMIS Team",
      readTime: "5 min read",
      category: "Career",
      categoryColor: "bg-maroon-100 text-maroon-700",
      href: "https://cmis.ai/",
    },
    {
      title: "Interview Preparation Guide",
      excerpt: "Master the art of technical interviews with our comprehensive preparation strategies...",
      author: "Career Services",
      readTime: "8 min read",
      category: "Tips",
      categoryColor: "bg-blue-100 text-blue-700",
      href: "https://cmis.ai/",
    },
    {
      title: "Networking Like a Pro",
      excerpt: "Learn how to build meaningful professional connections and expand your network...",
      author: "Alumni Relations",
      readTime: "6 min read",
      category: "Networking",
      categoryColor: "bg-purple-100 text-purple-700",
      href: "https://cmis.ai/",
    },
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
              <h2 className="text-xl font-bold mb-1">
                Complete Your CMIS Registration
              </h2>
              <p className="text-sm text-maroon-100">
                You&apos;re not registered for CMIS — sign up now to access all
                features and events!
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
            Welcome back, {user.name || "Guest"}! 👋
          </h1>
          <p className="text-gray-600">
            Here&apos;s what&apos;s happening in CMIS today
          </p>
        </div>

        {/* Carousel */}
        <div className="mb-12">
          <Carousel />
        </div>

        {/* Featured Content Cards */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Featured Content</h2>
            <a
              href="https://cmis.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-maroon-600 hover:text-maroon-700 font-semibold text-sm flex items-center gap-1"
            >
              View All
              <span>→</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredContent.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-gradient-to-br ${item.gradient} border-2 border-gray-200 rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-xl group cursor-pointer`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-5xl">{item.icon}</div>
                  <span className={`${item.tagColor} px-3 py-1 rounded-full text-xs font-semibold`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-maroon-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 text-maroon-600 font-semibold text-sm flex items-center gap-1">
                  Explore <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Blog Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Latest from CMIS Blog</h2>
              <p className="text-gray-600 text-sm">Insights, tips, and stories from our community</p>
            </div>
            <a
              href="https://cmis.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-maroon-600 hover:text-maroon-700 font-semibold text-sm flex items-center gap-1"
            >
              All Articles
              <span>→</span>
            </a>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <a
                key={post.title}
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 overflow-hidden transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${post.categoryColor} px-3 py-1 rounded-full text-xs font-semibold`}>
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-xs">• {post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-maroon-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">{post.author}</span>
                    <span className="text-maroon-600 text-sm font-semibold group-hover:gap-2 flex items-center gap-1 transition-all">
                      Read More <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Newsletter Signup & Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Newsletter Subscription */}
          <a
            href="https://cmis.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-maroon-500 to-maroon-700 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
          >
            <div className="text-5xl mb-4">📬</div>
            <h3 className="text-2xl font-bold mb-3">Subscribe to Our Newsletter</h3>
            <p className="text-maroon-100 mb-6 leading-relaxed">
              Get weekly updates on events, opportunities, and exclusive content delivered to your inbox.
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-maroon-600 px-6 py-3 rounded-lg font-semibold hover:bg-maroon-50 transition-colors">
              Subscribe Now
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>

          {/* Resource Library */}
          <a
            href="https://cmis.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-8 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group"
          >
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-2xl font-bold mb-3">Resource Library</h3>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Access templates, guides, and tools to accelerate your professional development journey.
            </p>
            <div className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Browse Resources
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </a>
        </div>
      </main>
    </div>
  );
}
