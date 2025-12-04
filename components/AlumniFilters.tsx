"use client";

interface AlumniFiltersProps {
  selectedIndustry: string | null;
  onFilterChange: (industry: string | null) => void;
}

const industries = [
  "Consulting",
  "Cloud",
  "Cybersecurity",
  "Data Analytics",
  "Product Management",
  "Energy",
  "Tech",
  "Finance",
];

export default function AlumniFilters({
  selectedIndustry,
  onFilterChange,
}: AlumniFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => onFilterChange(null)}
        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
          selectedIndustry === null
            ? "bg-maroon-600 text-white shadow-md"
            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
        }`}
      >
        All Industries
      </button>
      {industries.map((industry) => (
        <button
          key={industry}
          onClick={() => onFilterChange(industry)}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
            selectedIndustry === industry
              ? "bg-maroon-600 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
          }`}
        >
          {industry}
        </button>
      ))}
    </div>
  );
}

