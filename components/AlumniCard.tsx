"use client";

import { Alumni } from "@/lib/types";
import Image from "next/image";

interface AlumniCardProps {
  alumni: Alumni;
  onClick: () => void;
}

export default function AlumniCard({ alumni, onClick }: AlumniCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group h-full"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex gap-4 mb-4">
          {/* Left side - Alumni Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-maroon-600 transition-colors truncate">
              {alumni.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1 line-clamp-1">{alumni.role}</p>
            <p className="text-xs text-gray-500 mb-2 line-clamp-1">{alumni.company}</p>
            {alumni.gradYear && (
              <p className="text-xs text-maroon-600 font-semibold">
                Class of {alumni.gradYear}
              </p>
            )}
          </div>

          {/* Right side - Circular Photo */}
          {alumni.headshot && (
            <div className="flex-shrink-0">
              <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-200 group-hover:ring-maroon-600 transition-all duration-300">
                <Image
                  src={alumni.headshot}
                  alt={alumni.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quote - grows to fill available space */}
        <p className="text-sm text-gray-700 italic mb-4 line-clamp-3 flex-grow">
          &ldquo;{alumni.quote}&rdquo;
        </p>

        {/* Read Full Story Button - always at bottom */}
        <button className="w-full text-sm font-semibold text-maroon-600 hover:text-maroon-700 flex items-center justify-center gap-2 py-2 rounded-lg hover:bg-maroon-50 transition-colors group-hover:gap-3 mt-auto">
          Read Full Story
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
}

