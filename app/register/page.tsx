"use client";

import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { toast } from "sonner";
import { Mail, Link2, IdCard } from "lucide-react";

const degreeTypes = ["Bachelors", "Masters"];
const academicLevels = [
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
];
const availableDomains = [
  "Data Analytics",
  "Business Intelligence",
  "Cloud Computing",
  "Cybersecurity",
  "Software Development",
  "AI/Machine Learning",
  "Enterprise Systems",
  "Product Management",
];
const availableIndustries = [
  "Technology",
  "Consulting",
  "Finance",
  "Healthcare",
  "Retail",
  "Energy",
  "Manufacturing",
  "Education",
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    uin: "",
    email: "",
    linkedinUrl: "",
    degreeType: "" as any,
    academicLevel: "" as any,
    graduationYear: null as number | null,
    gpa: "" as string,
    domainsOfInterest: [] as string[],
    targetIndustries: [] as string[],
    needsMentor: true,
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userDetails = localStorage.getItem("currentUser");
      if (userDetails) {
        const user = JSON.parse(userDetails);
        setFormData(prev => ({
          ...prev,
          name: user.name || "",
          uin: user.uin || "",
          email: user.email || "",
        }));
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("uin", formData.uin);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("linkedinUrl", formData.linkedinUrl);
      formDataToSend.append("degreeType", formData.degreeType);
      formDataToSend.append("academicLevel", formData.academicLevel);
      formDataToSend.append("graduationYear", String(formData.graduationYear));
      formDataToSend.append("gpa", formData.gpa);
      formDataToSend.append(
        "domainsOfInterest",
        JSON.stringify(formData.domainsOfInterest)
      );
      formDataToSend.append(
        "targetIndustries",
        JSON.stringify(formData.targetIndustries)
      );
      formDataToSend.append("needsMentor", String(formData.needsMentor));

      // Add resume file if selected
      if (resumeFile) {
        formDataToSend.append("resume", resumeFile);
      }

      // Call registration API
      const response = await fetch("/api/students/register", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem("currentUser", JSON.stringify(data?.student));
      }
      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }
      try {
        await fetch("/api/webhook/n8n", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ student_id: data?.student?.id }),
        });
      } catch (err) {
        console.error("Error triggering n8n webhook:", err);
      }
      toast.success("Registration successful!");

      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err: any) {
      toast.error(
        err.message ||
          "An error occurred during registration. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleDomainToggle = (domain: string) => {
    setFormData((prev) => ({
      ...prev,
      domainsOfInterest: prev.domainsOfInterest.includes(domain)
        ? prev.domainsOfInterest.filter((d) => d !== domain)
        : [...prev.domainsOfInterest, domain],
    }));
  };

  const handleIndustryToggle = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      targetIndustries: prev.targetIndustries.includes(industry)
        ? prev.targetIndustries.filter((i) => i !== industry)
        : [...prev.targetIndustries, industry],
    }));
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  // Simple derived completion metric for the progress bar (UI only)
  const calculateProgress = () => {
    const checks = [
      !!formData.name.trim(),
      !!formData.uin.trim(),
      !!formData.degreeType,
      !!formData.academicLevel,
      !!formData.graduationYear,
      !!formData.gpa.trim(),
      formData.domainsOfInterest.length > 0,
      formData.targetIndustries.length > 0,
    ];

    const completed = checks.filter(Boolean).length;
    const total = checks.length;
    const ratio = total === 0 ? 0 : completed / total;

    // Clamp between 8% (visible) and 100%
    return Math.max(8, Math.min(100, Math.round(ratio * 100)));
  };

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-[#F8F7F2]">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="relative overflow-hidden rounded-2xl bg-white/95 border border-[#D6D3C4] shadow-lg p-8 md:p-10">
          {/* Maroon accent bar */}
          <div className="absolute inset-x-0 top-0 h-1 bg-[#500000]" />

          <div className="relative mb-8">
            <span className="inline-flex items-center rounded-full bg-[#500000] text-white px-3 py-1 text-xs font-semibold mb-3 shadow-sm">
              CMIS Student Registration
            </span>
            {/* Simple progress bar */}
            <div className="w-full mt-1 mb-4 h-1.5 rounded-full bg-[#D6D3C4] overflow-hidden">
              <div
                className="h-full bg-[#500000] transition-all duration-300"
                style={{ width: `${progress}%` }}
                aria-hidden="true"
              />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#500000] mb-2">
              CMIS Registration
            </h1>
            <p className="text-sm text-[#8c8574] max-w-xl">
              Tell us a bit about yourself so we can tailor events, mentors, and
              opportunities to your goals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Student Information */}
            <section className="space-y-4">
              <h2 className="text-xs font-semibold tracking-wide text-[#500000] uppercase">
                Student Information
              </h2>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Enter your full legal name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] bg-white"
                />
              </div>

              {/* UIN */}
              <div>
                <label
                  htmlFor="uin"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  UIN (University Identification Number) *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <IdCard className="w-4 h-4" />
                  </span>
                  <input
                    id="uin"
                    type="text"
                    required
                    value={formData.uin}
                    onChange={(e) =>
                      setFormData({ ...formData, uin: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] bg-white"
                    placeholder="9-digit UIN (e.g., 123456789)"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your UIN is your official Texas A&M student identification number.
                </p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="space-y-4 pt-2">
              <h2 className="text-xs font-semibold tracking-wide text-[#500000] uppercase">
                Contact Information
              </h2>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Email *
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] bg-[#F8F7F2]"
                    readOnly
                  />
                </div>
              </div>

              {/* LinkedIn URL */}
              <div>
                <label
                  htmlFor="linkedinUrl"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
                    <Link2 className="w-4 h-4" />
                  </span>
                  <input
                    id="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, linkedinUrl: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] bg-white"
                    placeholder="https://www.linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
            </section>

            {/* Academic Details */}
            <section className="space-y-4 pt-2">
              <h2 className="text-xs font-semibold tracking-wide text-[#500000] uppercase">
                Academic Details
              </h2>

              {/* Degree Type */}
              <div>
                <label
                  htmlFor="degreeType"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Degree Type *
                </label>
                <select
                  id="degreeType"
                  required
                  value={formData.degreeType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      degreeType: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] bg-white"
                >
                  <option value="">Select degree type</option>
                  {degreeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Academic Level */}
              <div>
                <label
                  htmlFor="academicLevel"
                  className="block text-sm font-semibold text-gray-800 mb-2"
                >
                  Academic Level *
                </label>
                <select
                  id="academicLevel"
                  required
                  value={formData.academicLevel}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      academicLevel: e.target.value as any,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] bg-white"
                >
                  <option value="">Select academic level</option>
                  {academicLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Graduation Year and GPA Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Graduation Year */}
                <div>
                  <label
                    htmlFor="graduationYear"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    Expected Graduation Year *
                  </label>
                  <select
                    id="graduationYear"
                    required
                    value={formData.graduationYear || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        graduationYear: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] bg-white"
                  >
                    <option value="">Select year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                {/* GPA */}
                <div>
                  <label
                    htmlFor="gpa"
                    className="block text-sm font-semibold text-gray-800 mb-2"
                  >
                    GPA *
                  </label>
                  <input
                    id="gpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    required
                    value={formData.gpa}
                    onChange={(e) =>
                      setFormData({ ...formData, gpa: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] bg-white"
                    placeholder="3.75"
                  />
                </div>
              </div>
            </section>

            {/* Preferences & Interests */}
            <section className="space-y-4 pt-2">
              <h2 className="text-xs font-semibold tracking-wide text-[#500000] uppercase">
                Interests & Preferences
              </h2>

              {/* Domains of Interest */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Domains of Interest * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableDomains.map((domain) => (
                    <label
                      key={domain}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.domainsOfInterest.includes(domain)
                          ? "border-[#500000] bg-[#F8F7F2]"
                          : "border-gray-300 hover:border-gray-400 bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.domainsOfInterest.includes(domain)}
                        onChange={() => handleDomainToggle(domain)}
                        className="mr-2 rounded border-gray-300 text-[#500000] focus:ring-[#500000]"
                      />
                      <span className="text-sm">{domain}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Target Industries */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  Target Industries * (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availableIndustries.map((industry) => (
                    <label
                      key={industry}
                      className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                        formData.targetIndustries.includes(industry)
                          ? "border-[#500000] bg-[#F8F7F2]"
                          : "border-gray-300 hover:border-gray-400 bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.targetIndustries.includes(industry)}
                        onChange={() => handleIndustryToggle(industry)}
                        className="mr-2 rounded border-gray-300 text-[#500000] focus:ring-[#500000]"
                      />
                      <span className="text-sm">{industry}</span>
                    </label>
                  ))}
                </div>
              </div>
            </section>

            {/* Resume Upload */}
            <div>
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Resume (PDF or DOCX)
              </label>
              <input
                id="resume"
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // Validate file type
                    const allowedTypes = [
                      "application/pdf",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    ];
                    if (!allowedTypes.includes(file.type)) {
                      setError(
                        "Invalid file type. Only PDF and DOCX files are allowed."
                      );
                      e.target.value = "";
                      return;
                    }
                    // Validate file size (10MB)
                    if (file.size > 10 * 1024 * 1024) {
                      setError("File size exceeds 10MB limit.");
                      e.target.value = "";
                      return;
                    }
                    setResumeFile(file);
                    setError("");
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#500000] focus:border-[#500000] bg-white"
              />
              {resumeFile && (
                <p className="text-xs text-green-600 mt-1">
                  Selected: {resumeFile.name} (
                  {(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Need Mentor */}
            <section className="border-t border-[#E4E1D6] pt-6 mt-2">
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Do you need a mentor? *
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="needsMentor"
                    checked={formData.needsMentor === true}
                    onChange={() =>
                      setFormData({ ...formData, needsMentor: true })
                    }
                    className="mr-2 border-gray-300 text-[#500000] focus:ring-[#500000]"
                  />
                  <span>Yes — I’d like help with networking and career planning</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="needsMentor"
                    checked={formData.needsMentor === false}
                    onChange={() =>
                      setFormData({ ...formData, needsMentor: false })
                    }
                    className="mr-2 border-gray-300 text-[#500000] focus:ring-[#500000]"
                  />
                  <span>Not right now</span>
                </label>
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-[#500000] text-white rounded-lg font-semibold hover:bg-[#440000] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                {isLoading ? "Submitting..." : "Complete Registration"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
