import React from 'react';

const HeroSection = ({ realStats }) => {
    return (
        <section className="w-full min-h-screen bg-cover bg-center bg-fixed text-white flex flex-col justify-center items-center text-center px-3 sm:px-5 py-16 sm:py-20 relative overflow-hidden"
            style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1950&q=80")' }}>
            <div className="absolute inset-0"
                style={{ backgroundImage: 'url("data:image/svg+xml,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 1440 320\\"><path fill=\\"%23ffffff\\" fill-opacity=\\"0.1\\" d=\\"M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z\\"></path></svg>")', backgroundSize: 'cover', backgroundPosition: 'bottom' }}></div>
            <div className="max-w-6xl mx-auto relative z-10 w-full">
                <div className="HeroText">
                    <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold mb-4 sm:mb-5 bg-gradient-to-r from-white to-gray-100 bg-clip-text text-transparent animate-fade-in-up px-2">Find Your Dream Job</h1>
                    <p className="text-[clamp(1rem,1.5vw,1.25rem)] mb-8 sm:mb-10 opacity-95 font-light animate-fade-in-up px-4" style={{ animationDelay: '0.2s' }}>Connect with top companies and accelerate your career journey</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mt-6 sm:mt-8 animate-fade-in-up px-4" style={{ animationDelay: '0.4s' }}>
                        <div className="text-center p-6 sm:p-8 lg:p-12 bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl">
                            <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-0.5 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">{realStats.totalJobs}+</span>
                            <span className="text-xs sm:text-sm uppercase tracking-wide opacity-90">Active Jobs</span>
                        </div>
                        <div className="text-center p-6 sm:p-8 lg:p-12 bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl">
                            <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-0.5 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">{realStats.companies}+</span>
                            <span className="text-xs sm:text-sm uppercase tracking-wide opacity-90">Companies</span>
                        </div>
                        <div className="text-center p-6 sm:p-8 lg:p-12 bg-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1 hover:bg-white/15 hover:shadow-xl">
                            <span className="block text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-0.5 bg-gradient-to-r from-amber-400 to-red-400 bg-clip-text text-transparent">{realStats.candidates}+</span>
                            <span className="text-xs sm:text-sm uppercase tracking-wide opacity-90">Candidates</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
