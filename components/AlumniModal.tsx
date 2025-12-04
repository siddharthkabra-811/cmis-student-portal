"use client";

import { Alumni } from "@/lib/types";
import { X, Linkedin, CheckCircle } from "lucide-react";

interface AlumniModalProps {
  alumni: Alumni | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AlumniModal({ alumni, isOpen, onClose }: AlumniModalProps) {
  if (!isOpen || !alumni) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-2xl md:rounded-2xl shadow-2xl max-w-5xl w-full h-[95vh] md:h-auto md:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900">Alumni Success Story</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left 2 columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Alumni Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-3xl font-bold text-gray-900">
                    {alumni.name}
                  </h3>
                  {alumni.linkedInUrl && (
                    <a
                      href={alumni.linkedInUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-maroon-600 hover:text-maroon-700 transition-colors"
                      aria-label={`View ${alumni.name}'s LinkedIn profile`}
                    >
                      <Linkedin className="w-7 h-7" />
                    </a>
                  )}
                </div>
                <p className="text-xl text-gray-700 mb-1">{alumni.role}</p>
                <p className="text-lg text-gray-600 mb-2">{alumni.company}</p>
                {alumni.gradYear && (
                  <span className="text-sm text-maroon-600 font-semibold">
                    Class of {alumni.gradYear}
                  </span>
                )}
              </div>

              {/* Highlighted Quote */}
              <div className="bg-maroon-50 border-l-4 border-maroon-500 p-6 rounded-r-lg">
                <p className="text-lg text-gray-800 italic">
                  &ldquo;{alumni.quote}&rdquo;
                </p>
              </div>

              {/* Full Story */}
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4">
                  Career Journey
                </h4>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {alumni.fullStory}
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-6">
                  Career Timeline
                </h4>
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-maroon-200"></div>

                  {/* Timeline Items */}
                  <div className="space-y-8">
                    {alumni.timeline.map((entry, index) => (
                      <div key={index} className="relative pl-12">
                        {/* Timeline Dot */}
                        <div className="absolute left-0 top-1 w-8 h-8 bg-maroon-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>

                        {/* Timeline Content */}
                        <div className="bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg font-bold text-maroon-600">
                              {entry.year}
                            </span>
                            <h5 className="text-lg font-semibold text-gray-900">
                              {entry.title}
                            </h5>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {entry.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Right 1 column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Skills */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  Key Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {alumni.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-white text-maroon-700 rounded-full text-sm font-medium border border-maroon-200 hover:bg-maroon-50 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CMIS Involvement */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  CMIS Involvement
                </h4>
                {alumni.cmiActivities.length > 0 ? (
                  <ul className="space-y-2">
                    {alumni.cmiActivities.map((activity, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <div className="w-1.5 h-1.5 bg-maroon-500 rounded-full"></div>
                        <span className="text-sm">{activity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic">Not listed</p>
                )}
              </div>

              {/* Education */}
              {alumni.education && alumni.education.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    Education
                  </h4>
                  <div className="space-y-4">
                    {alumni.education.map((edu, index) => {
                      const hasDegree = edu.degree && edu.degree !== "Not Listed";
                      const hasField = edu.field && edu.field !== "Not Listed";
                      const hasYears = edu.startYear && edu.endYear;
                      
                      return (
                        <div key={index}>
                          <p className="text-sm font-semibold text-gray-900">
                            {edu.institution}
                          </p>
                          {(hasDegree || hasField) && (
                            <p className="text-xs text-gray-700">
                              {hasDegree && hasField 
                                ? `${edu.degree}, ${edu.field}`
                                : hasDegree 
                                ? edu.degree 
                                : edu.field}
                            </p>
                          )}
                          {hasYears && (
                            <p className="text-xs text-gray-500">
                              {edu.startYear} - {edu.endYear}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Experience */}
              {alumni.experience && alumni.experience.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    Experience
                  </h4>
                  <div className="space-y-4">
                    {alumni.experience.map((exp, index) => (
                      <div key={index} className="border-b border-gray-200 last:border-b-0 pb-4 last:pb-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {exp.title}
                        </p>
                        <p className="text-xs text-gray-700">{exp.company}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </p>
                          {exp.location && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-xs text-gray-500">{exp.location}</p>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mt-2">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentorship Status */}
              {alumni.availableForMentorship && (
                <div className="bg-maroon-50 border-2 border-maroon-200 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-6 h-6 text-maroon-600" />
                    <h4 className="text-lg font-bold text-gray-900">
                      Available for Mentorship
                    </h4>
                  </div>
                  <p className="text-sm text-gray-700">
                    {alumni.name} is available to mentor current CMIS students.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

