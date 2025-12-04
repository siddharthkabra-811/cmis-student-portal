"use client";

import { GraduationCap, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#500000] via-[#3d0000] to-[#500000] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-[#500000] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute w-96 h-96 -top-48 -right-48 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute w-96 h-96 -bottom-48 left-1/2 bg-[#500000] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="pt-12 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-center space-x-8 mb-6">
              {/* Texas A&M Logo */}
              <Image 
                src="/primaryTAM.png" 
                alt="Texas A&M University"
                width={80}
                height={80}
                className="h-16 md:h-20 w-auto"
                unoptimized
              />
              {/* Mays Business School Logo */}
              <div className="text-left border-l-2 border-white/30 pl-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  Council for the Management of Information Systems
                </h1>
                <p className="text-white/90 font-medium text-sm md:text-base mt-1">
                  Mays Business School
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-6xl w-full">
            {/* Welcome Section */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                Select Your Portal
              </h2>
            </div>

            {/* Portal Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Student Portal Card */}
              <Link href="/login">
                <div className="group relative cursor-pointer">
                  <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-10 border-2 border-white/30 hover:border-white/50 transition-all duration-300 transform group-hover:scale-105 shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-6">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-xl">
                        <GraduationCap className="w-12 h-12 text-[#500000]" strokeWidth={2.5} />
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          Student
                        </h3>
                      </div>

                      {/* CTA Button */}
                      <button className="w-full bg-white hover:bg-gray-100 text-[#500000] font-bold py-4 px-8 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg">
                        <span>Enter Portal</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Admin Portal Card */}
              <Link href="https://cmis-admin-portal.vercel.app">
                <div className="group relative cursor-pointer">
                  <div className="absolute inset-0 bg-white rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-10 border-2 border-white/30 hover:border-white/50 transition-all duration-300 transform group-hover:scale-105 shadow-2xl">
                    <div className="flex flex-col items-center text-center space-y-6">
                      {/* Icon */}
                      <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-xl">
                        <Shield className="w-12 h-12 text-[#500000]" strokeWidth={2.5} />
                      </div>

                      {/* Title */}
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          Admin
                        </h3>
                      </div>

                      {/* CTA Button */}
                      <button className="w-full bg-white hover:bg-gray-100 text-[#500000] font-bold py-4 px-8 rounded-xl flex items-center justify-center space-x-2 transition-all duration-300 shadow-lg">
                        <span>Enter Portal</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-8 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-white/70 text-sm">
              © 2025 Texas A&M University
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
