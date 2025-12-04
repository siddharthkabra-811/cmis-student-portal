"use client";

import Navigation from "@/components/Navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const details = localStorage.getItem("currentUser");
      if (details) {
        setUserDetails(JSON.parse(details));
      }
    }
  }, [userDetails]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["userProfile", userDetails?.id],
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
    enabled: !!userDetails,
  });

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
                    <div
                      key={i}
                      className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>

              {/* Industries Skeleton */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-8 bg-gray-200 rounded-full w-32 animate-pulse"
                    ></div>
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
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center flex-1">
                        <div className="w-8 h-8 bg-gray-200 rounded mr-3 animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 rounded w-48 mb-1 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3].map((j) => (
                          <div
                            key={j}
                            className="w-9 h-9 bg-gray-200 rounded animate-pulse"
                          ></div>
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
                <span className="mx-1 font-bold">UIN:</span>
                <span className="text-sm text-gray-600">{data?.uin}</span>
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
              {data?.resumeUrl && data?.resumeUrl?.length > 0 ? (
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Resume</h3>
                </div>
              ) : (
                <></>
              )}

              {data?.resumeUrl && data.resumeUrl.length > 0 ? (
                <div className="space-y-3">
                  {data?.resumeUrl?.map((resume: string) => (
                    <div
                      key={resume}
                      className={`flex items-center justify-between p-4 border rounded-lg transition ${"border-maroon-500 bg-maroon-50"}`}
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
                              {"Resume"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <a
                        href={resume}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 px-4 py-2 cursor-pointer bg-maroon-500 hover:bg-maroon-600 text-white rounded-lg transition flex items-center gap-2 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <svg
                          className="w-4 h-4"
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
                        Download
                      </a>
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
      {/* <ResumeUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        userId={userDetails?.id || ""}
      /> */}
    </div>
  );
}
