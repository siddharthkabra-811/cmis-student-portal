"use client";

import { User } from "@/lib/types";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data.error);
        return false;
      }

      // Map database response to User type
      const studentData = data.student;
      const mappedUser: User = {
        id: String(studentData.id),
        email: studentData.email,
        password: "", // Don't store password in client
        name: studentData.name || "",
        uin: studentData.uin || "",
        avatar: "/avatars/default-avatar.jpg", // Default avatar
        bio: "", // Not in database, default empty
        degreeType: studentData.degreeType || "",
        academicLevel: studentData.academicLevel || "",
        graduationYear: studentData.graduationYear || null,
        domainsOfInterest: Array.isArray(studentData.domainsOfInterest)
          ? studentData.domainsOfInterest
          : typeof studentData.domainsOfInterest === "string"
          ? JSON.parse(studentData.domainsOfInterest || "[]")
          : [],
        targetIndustries: Array.isArray(studentData.targetIndustries)
          ? studentData.targetIndustries
          : typeof studentData.targetIndustries === "string"
          ? JSON.parse(studentData.targetIndustries || "[]")
          : [],
        resumeUrl: studentData.resumeUrl || "",
        needsMentor: studentData.needsMentor || false,
        // isCMISRegistered: studentData.isRegistered || false,
        isRegistered: studentData.isRegistered, // If they can login, they're registered
        mentor: undefined, // Not in database, can be fetched separately if needed
        activityLog: [], // Not in database, can be fetched separately if needed
      };

      localStorage.setItem("currentUser", JSON.stringify(mappedUser));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-maroon-500">
                CMIS Portal
              </h1>
              <p className="text-sm text-gray-600 mt-2">Mays Business School</p>
              <p className="text-xs text-gray-500">Texas A&M University</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent outline-none transition"
                placeholder="your.email@tamu.edu"
                autoComplete="email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent outline-none transition"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-maroon-500 focus:ring-maroon-500"
                />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-maroon-500 hover:text-maroon-600 font-medium"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-maroon-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-maroon-600 focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            © 2025 Mays Business School. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
