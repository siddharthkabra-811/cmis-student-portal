"use client";

import Navigation from "@/components/Navigation";
import ResumeUploadDialog from "@/components/ResumeUploadDialog";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import type { Resume } from "@/lib/types";

export default function ProfilePage() {
  const details = localStorage?.getItem("currentUser");
  const userDetails = details ? JSON.parse(details) : null;
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/students?id=${userDetails?.id} `);
        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const user = await res.json();
        return user?.student;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        toast.error("Error fetching user profile");
      }
    },
  });

  const handleSetPrimary = async (resumeId: string) => {
    try {
      const response = await fetch("/api/students/resume/set-primary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userDetails?.id,
          resumeId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to set primary resume");
      }

      toast.success("Primary resume updated");
      refetch();
    } catch (error) {
      console.error("Error setting primary resume:", error);
      toast.error("Failed to set primary resume");
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      const response = await fetch("/api/students/resume/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userDetails?.id,
          resumeId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete resume");
      }

      toast.success("Resume deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting resume:", error);
      toast.error("Failed to delete resume");
    }
  };

  const handleUploadSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-48 mx-auto mb-1 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
                </div>
                <div className="border-t pt-4 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i}>
                      <div className="h-3 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              {/* Domains Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Industries Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Resumes Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                  <div className="h-10 bg-gray-200 rounded w-36 animate-pulse"></div>
                </div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center flex-1">
                        <div className="w-8 h-8 bg-gray-200 rounded mr-3 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-48 mb-1 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="w-9 h-9 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600">
              Manage your CMIS profile information
            </p>
          </div>
          {/* {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition"
            >
              Edit Profile
            </button>
          )} */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-maroon-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4">
                  {data?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {data?.name}
                </h2>
                <p className="text-sm text-gray-600">{data?.email}</p>
                <p className="text-sm text-gray-600">UIN: {data?.uin}</p>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Degree
                  </p>
                  <p className="text-gray-900">
                    {data?.degreeType || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Academic Level
                  </p>
                  <p className="text-gray-900">
                    {data?.academicLevel || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Expected Graduation
                  </p>
                  <p className="text-gray-900">
                    {data?.graduationYear || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Registration Status
                  </p>
                  <p
                    className={
                      data?.isRegistered
                        ? "text-green-600 font-semibold"
                        : "text-orange-600"
                    }
                  >
                    {data?.isRegistered ? "✓ Registered" : "Not Registered"}
                  </p>
                </div>
              </div>

              {!data?.isRegistered && (
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
            {/* Domains of Interest */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Domains of Interest
              </h3>
              <div className="flex flex-wrap gap-2">
                {data?.domainsOfInterest?.length > 0 ? (
                  data?.domainsOfInterest?.map((domain: any) => (
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
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Target Industries
              </h3>
              <div className="flex flex-wrap gap-2">
                {data?.targetIndustries?.length > 0 ? (
                  data?.targetIndustries?.map((industry: any) => (
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

            {/* Resumes */}
            <div className="bg-white rounded-xl shadow-md p-6">
              {data?.resumes && data.resumes.length > 0 ? (
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Resumes</h3>
                  <button
                    onClick={() => setIsUploadDialogOpen(true)}
                    className="px-4 py-2 bg-maroon-500 text-white rounded-lg hover:bg-maroon-600 transition flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Upload Resume
                  </button>
                </div>
              ) : (
                <></>
              )}

              {data?.resumeUrl && data.resumeUrl.length > 0 ? (
                <div className="space-y-3">
                  {data?.resumeUrl?.map((resume: Resume) => (
                    <div
                      key={resume.id}
                      className={`flex items-center justify-between p-4 border rounded-lg transition ${
                        resume.isPrimary
                          ? "border-maroon-500 bg-maroon-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center flex-1 min-w-0">
                        <svg
                          className="w-8 h-8 text-red-500 mr-3 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 truncate">
                              {resume.fileName}
                            </p>
                            {resume.isPrimary && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-maroon-500 text-white">
                                Primary
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(resume.uploadDate).toLocaleDateString()} •{" "}
                            {(resume.fileSize / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <a
                          href={resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:text-maroon-600 transition"
                          title="View"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </a>
                        <a
                          href={resume.url}
                          download={resume.fileName}
                          className="p-2 text-gray-600 hover:text-maroon-600 transition"
                          title="Download"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </a>
                        {!resume.isPrimary && (
                          <button
                            onClick={() => handleSetPrimary(resume.id)}
                            className="p-2 text-gray-600 hover:text-yellow-600 transition"
                            title="Set as Primary"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteResume(resume.id)}
                          className="p-2 text-gray-600 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-600 mb-2">No resumes uploaded</p>
                </div>
              )}
            </div>

            {/* Mentor */}
            {data?.mentor && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Your Mentor
                </h3>
                <div className="flex items-start p-4 border border-gray-200 rounded-lg">
                  <div className="w-12 h-12 bg-maroon-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {data.mentor.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {data.mentor.name}
                    </h4>
                    <p className="text-sm text-maroon-600">
                      {data.mentor.company}
                    </p>
                    <p className="text-sm text-gray-600">{data.mentor.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Resume Upload Dialog */}
      <ResumeUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        userId={userDetails?.id || ""}
      />
    </div>
  );
}
