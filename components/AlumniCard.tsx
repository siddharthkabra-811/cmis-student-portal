"use client";

import { Alumni } from "@/lib/types";

interface AlumniCardProps {
  alumni: Alumni;
  onClick: () => void;
}

export default function AlumniCard({ alumni, onClick }: AlumniCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
    >
      <div className="p-6">
        {/* Alumni Info */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-maroon-600 transition-colors">
            {alumni.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{alumni.role}</p>
          <p className="text-xs text-gray-500 mb-2">{alumni.company}</p>
          {alumni.gradYear && (
            <p className="text-xs text-maroon-600 font-semibold">
              Class of {alumni.gradYear}
            </p>
          )}
        </div>

        {/* Quote */}
        <p className="text-sm text-gray-700 italic mb-4 line-clamp-2">
          &ldquo;{alumni.quote}&rdquo;
        </p>

        {/* Read Full Story Button */}
        <button className="w-full text-sm font-semibold text-maroon-600 hover:text-maroon-700 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-maroon-50 transition-colors group-hover:gap-3">
          Read Full Story
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}

