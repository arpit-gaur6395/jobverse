import React from 'react';

const CTASection = ({ realStats, user, navigate }) => {
    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-16 translate-y-16"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full -translate-x-12 -translate-y-12"></div>
            </div>

            <div className="relative max-w-4xl mx-auto text-center">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 animate-fade-in-up">
                    Ready to Take the Next Step?
                </h2>
                <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-12 opacity-90 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    Join {realStats.candidates}+ professionals who found their opportunities on JobVerse
                </p>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <button
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-base sm:text-lg"
                        onClick={() => navigate(user ? "/postjob" : "/register")}
                    >
                        {user?.role === "employer" ? "Post a Job" : "Get Started"}
                    </button>
                    <button
                        className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl text-base sm:text-lg"
                        onClick={() => navigate("/login")}
                    >
                        Sign In
                    </button>
                </div>

                {/* Additional trust indicators */}
                <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold mb-2">🚀</div>
                        <div className="text-lg sm:text-xl font-semibold mb-1">Fast Track</div>
                        <div className="text-sm sm:text-base opacity-80">Quick application process</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold mb-2">🎯</div>
                        <div className="text-lg sm:text-xl font-semibold mb-1">Targeted Jobs</div>
                        <div className="text-sm sm:text-base opacity-80">Matched to your skills</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold mb-2">💼</div>
                        <div className="text-lg sm:text-xl font-semibold mb-1">Top Companies</div>
                        <div className="text-sm sm:text-base opacity-80">Verified employers only</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
