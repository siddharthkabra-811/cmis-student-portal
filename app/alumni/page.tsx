"use client";

import { useState, useMemo, useEffect } from "react";
import Navigation from "@/components/Navigation";
import AlumniCard from "@/components/AlumniCard";
import AlumniModal from "@/components/AlumniModal";
import AlumniFilters from "@/components/AlumniFilters";
import { Alumni } from "@/lib/types";
import { Search, ArrowRight } from "lucide-react";

export default function AlumniPage() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch alumni data from JSON file
  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch("/alumni.json");
        if (!response.ok) {
          throw new Error("Failed to fetch alumni data");
        }
        const data = await response.json();
        setAlumni(data);
      } catch (error) {
        console.error("Error fetching alumni data:", error);
        setAlumni([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumni();
  }, []);

  // Filter and search alumni
  const filteredAlumni = useMemo(() => {
    let filtered = alumni;

    // Filter by industry
    if (selectedIndustry) {
      filtered = filtered.filter((alumni) => alumni.industry === selectedIndustry);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (alumni) =>
          alumni.name.toLowerCase().includes(query) ||
          alumni.role.toLowerCase().includes(query) ||
          alumni.company.toLowerCase().includes(query) ||
          alumni.quote.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [selectedIndustry, searchQuery]);

  const handleCardClick = (alumni: Alumni) => {
    setSelectedAlumni(alumni);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAlumni(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-maroon-600 to-maroon-800 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Alumni Success Stories
          </h1>
          <p className="text-xl md:text-2xl text-maroon-100 mb-8 max-w-3xl mx-auto">
            See how CMIS graduates are thriving across industries.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search alumni by name, role, company, or quote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border-b border-gray-200 py-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AlumniFilters
            selectedIndustry={selectedIndustry}
            onFilterChange={setSelectedIndustry}
          />
        </div>
      </section>

      {/* Alumni Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-600 mb-4"></div>
            <p className="text-gray-600">Loading alumni data...</p>
          </div>
        ) : filteredAlumni.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredAlumni.length}</span>{" "}
                {filteredAlumni.length === 1 ? "alumnus" : "alumni"}
                {selectedIndustry && (
                  <>
                    {" "}
                    in <span className="font-semibold text-maroon-600">{selectedIndustry}</span>
                  </>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map((alumni) => (
                <AlumniCard
                  key={alumni.id}
                  alumni={alumni}
                  onClick={() => handleCardClick(alumni)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No alumni found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedIndustry(null);
              }}
              className="text-maroon-600 hover:text-maroon-700 font-semibold"
            >
              Clear filters
            </button>
          </div>
        )}
      </main>

      {/* Call-to-Action Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CTA Card 1: Share Your Story */}
            <div className="bg-gradient-to-br from-maroon-500 to-maroon-700 rounded-2xl p-8 md:p-10 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-6">📝</div>
              <h3 className="text-3xl font-bold mb-4">Share Your Success Story</h3>
              <p className="text-maroon-100 mb-8 text-lg leading-relaxed">
                Inspire future CMIS students by sharing your career journey and achievements.
              </p>
              <button className="bg-white text-maroon-600 hover:bg-maroon-50 font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center gap-2 group">
                Submit Yours
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* CTA Card 2: Become a Mentor */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 md:p-10 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="text-5xl mb-6">🤝</div>
              <h3 className="text-3xl font-bold mb-4">Become a CMIS Mentor</h3>
              <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                Make a difference in a student&apos; career by sharing your expertise and experience.
              </p>
              <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-lg transition-all duration-300 flex items-center gap-2 group">
                Join Mentorship Network
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <AlumniModal
        alumni={selectedAlumni}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

