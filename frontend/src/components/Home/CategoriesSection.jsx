import React from 'react';

const CategoriesSection = ({ categories, activeTab, handleCategoryFilter }) => {
    return (
        <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-5 bg-white text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 sm:mb-12 text-gray-800 relative after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-gradient-to-r after:from-red-400 after:to-amber-400 after:rounded-sm">Explore by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-[repeat(auto-fill,140px)] gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto justify-center">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className={`p-3 sm:p-4 px-2 sm:px-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border-2 border-gray-200 cursor-pointer transition-all duration-300 text-center w-full sm:w-32 h-16 sm:h-20 flex flex-col justify-center items-center hover:transform hover:-translate-y-2 hover:shadow-xl hover:border-amber-400 ${activeTab === category.name ? 'bg-gradient-to-br from-blue-500 to-blue-700 border-blue-500 text-white transform -translate-y-1 shadow-lg' : ''}`}
                        onClick={() => handleCategoryFilter(category.name)}
                    >
                        <div className={`text-xl sm:text-2xl mb-1 ${activeTab === category.name ? 'transform scale-110' : ''}`}>{category.icon}</div>
                        <h3 className="text-xs sm:text-sm font-semibold">{category.name}</h3>
                        <span className="text-xs opacity-80">{category.count} Jobs</span>
                    </div>
                ))}
                {activeTab !== "all" && (
                    <div
                        className="p-3 sm:p-4 px-2 sm:px-3 bg-gradient-to-br from-red-500 to-red-600 border-red-500 text-white cursor-pointer transition-all duration-300 text-center w-full sm:w-32 h-16 sm:h-20 flex flex-col justify-center items-center hover:transform hover:-translate-y-2 hover:shadow-xl hover:border-red-600 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-700"
                        onClick={() => handleCategoryFilter("all")}
                    >
                        <div className="text-xl sm:text-2xl mb-1">✖</div>
                        <h3 className="text-xs sm:text-sm font-semibold">Clear Filter</h3>
                        <span className="text-xs">Show All</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoriesSection;
