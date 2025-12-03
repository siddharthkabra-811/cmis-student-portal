"use client";

import Navigation from "@/components/Navigation";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

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
  const userDetails = localStorage.getItem("currentUser");
  const [formData, setFormData] = useState({
    name: userDetails ? JSON.parse(userDetails).name : "",
    uin: userDetails ? JSON.parse(userDetails).uin : "",
    email: userDetails ? JSON.parse(userDetails).email : "",
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
      localStorage.setItem("currentUser", JSON.stringify(data?.student));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              CMIS Registration
            </h1>
            <p className="text-gray-600">
              Complete your registration to access all CMIS features and events
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                required
                placeholder="Enter name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
              />
            </div>

            {/* UIN */}
            <div>
              <label
                htmlFor="uin"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                UIN (University Identification Number) *
              </label>
              <input
                id="uin"
                type="text"
                required
                value={formData.uin}
                onChange={(e) =>
                  setFormData({ ...formData, uin: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                placeholder="123456789"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent bg-gray-50"
                readOnly
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label
                htmlFor="linkedinUrl"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                LinkedIn Profile URL
              </label>
              <input
                id="linkedinUrl"
                // type="url"
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                placeholder="https://www.linkedin.com/in/yourprofile"
              />
            </div>

            {/* Degree Type */}
            <div>
              <label
                htmlFor="degreeType"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
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
                className="block text-sm font-medium text-gray-700 mb-2"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
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
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
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
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
                  placeholder="3.75"
                />
              </div>
            </div>

            {/* Domains of Interest */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Domains of Interest * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableDomains.map((domain) => (
                  <label
                    key={domain}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.domainsOfInterest.includes(domain)
                        ? "border-maroon-500 bg-maroon-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.domainsOfInterest.includes(domain)}
                      onChange={() => handleDomainToggle(domain)}
                      className="mr-2 rounded border-gray-300 text-maroon-500 focus:ring-maroon-500"
                    />
                    <span className="text-sm">{domain}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Target Industries */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Industries * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {availableIndustries.map((industry) => (
                  <label
                    key={industry}
                    className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                      formData.targetIndustries.includes(industry)
                        ? "border-maroon-500 bg-maroon-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.targetIndustries.includes(industry)}
                      onChange={() => handleIndustryToggle(industry)}
                      className="mr-2 rounded border-gray-300 text-maroon-500 focus:ring-maroon-500"
                    />
                    <span className="text-sm">{industry}</span>
                  </label>
                ))}
              </div>
            </div>

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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-transparent"
              />
              {resumeFile && (
                <p className="text-xs text-green-600 mt-1">
                  Selected: {resumeFile.name} (
                  {(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>

            {/* Need Mentor */}
            <div className="border-t pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you need a mentor? *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="needsMentor"
                    checked={formData.needsMentor === true}
                    onChange={() =>
                      setFormData({ ...formData, needsMentor: true })
                    }
                    className="mr-2 border-gray-300 text-maroon-500 focus:ring-maroon-500"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="needsMentor"
                    checked={formData.needsMentor === false}
                    onChange={() =>
                      setFormData({ ...formData, needsMentor: false })
                    }
                    className="mr-2 border-gray-300 text-maroon-500 focus:ring-maroon-500"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>

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
                className="px-6 py-2 bg-maroon-500 text-white rounded-lg font-semibold hover:bg-maroon-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
