import React, { useState } from 'react';

const SearchBar = ({ onSearch, searchTitle, searchCompany, searchLocation, setSearchTitle, setSearchCompany, setSearchLocation }) => {
    const handleSearch = () => {
        onSearch();
    };

    return (
        <div className="w-full max-w-5xl mx-auto mb-8 sm:mb-12 mt-16 sm:mt-20 animate-fade-in-up px-4" style={{ animationDelay: '0.6s' }}>
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.5fr_1.5fr_auto] gap-3 sm:gap-4 mb-5">
                <input
                    type="text"
                    placeholder="🔍 Job title or keyword..."
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="p-3 sm:p-4 lg:p-5 border-none rounded-xl text-sm sm:text-base bg-white/95 backdrop-blur-lg transition-all duration-300 shadow-lg focus:outline-none focus:bg-white focus:shadow-xl focus:transform focus:-translate-y-0.5"
                />
                <input
                    type="text"
                    placeholder="🏢 Company..."
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="p-3 sm:p-4 lg:p-5 border-none rounded-xl text-sm sm:text-base bg-white/95 backdrop-blur-lg transition-all duration-300 shadow-lg focus:outline-none focus:bg-white focus:shadow-xl focus:transform focus:-translate-y-0.5"
                />
                <input
                    type="text"
                    placeholder="📍 Location..."
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="p-3 sm:p-4 lg:p-5 border-none rounded-xl text-sm sm:text-base bg-white/95 backdrop-blur-lg transition-all duration-300 shadow-lg focus:outline-none focus:bg-white focus:shadow-xl focus:transform focus:-translate-y-0.5"
                />
                <button onClick={handleSearch} className="p-3 sm:p-4 lg:p-5 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-red-400 to-amber-400 text-white border-none rounded-xl text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:transform hover:-translate-y-1 hover:shadow-xl hover:bg-gradient-to-r hover:from-amber-400 hover:to-red-400 whitespace-nowrap">
                    Search Jobs
                </button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <span className="opacity-80 text-xs sm:text-sm">Popular searches:</span>
                <button onClick={() => setSearchTitle("Remote")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Remote</button>
                <button onClick={() => setSearchTitle("Full-time")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Full-time</button>
                <button onClick={() => setSearchTitle("Software")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Software</button>
                <button onClick={() => setSearchTitle("Design")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Design</button>
                <button onClick={() => setSearchTitle("Marketing")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Marketing</button>
                <button onClick={() => setSearchTitle("Data Science")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Data Science</button>
                <button onClick={() => setSearchTitle("Sales")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Sales</button>
                <button onClick={() => setSearchTitle("Healthcare")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Healthcare</button>
                <button onClick={() => setSearchTitle("Finance")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Finance</button>
                <button onClick={() => setSearchTitle("Education")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Education</button>
                <button onClick={() => setSearchTitle("Engineering")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Engineering</button>
                <button onClick={() => setSearchTitle("Customer Service")} className="mt-3 sm:mt-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 border border-white/30 rounded-full text-white cursor-pointer transition-all duration-300 text-xs sm:text-sm hover:bg-white/30 hover:transform hover:-translate-y-1">Customer Service</button>
            </div>
        </div>
    );
};

export default SearchBar;
