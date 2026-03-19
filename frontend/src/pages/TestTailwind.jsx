import React from 'react';

const TestTailwind = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gradient mb-4">
            Tailwind CSS Test Page
          </h1>
          <p className="text-xl text-gray-600">
            Verify all styles are working correctly
          </p>
        </header>

        {/* Button Tests */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Button Styles</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-accent">Accent Button</button>
            <button className="btn-outline">Outline Button</button>
          </div>
        </section>

        {/* Card Tests */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Card Styles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Standard Card</h3>
              <p className="text-gray-600">This is a standard card with hover effects.</p>
            </div>
            <div className="job-card">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Job Card</h3>
              <p className="text-gray-600">This is a job card with specific styling.</p>
            </div>
            <div className="job-card-horizontal">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Horizontal Card</h3>
                <p className="text-gray-600">This is a horizontal job card.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tag Tests */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Tag & Badge Styles</h2>
          <div className="flex flex-wrap gap-3">
            <span className="tag tag-blue">Blue Tag</span>
            <span className="tag tag-green">Green Tag</span>
            <span className="tag tag-yellow">Yellow Tag</span>
            <span className="tag tag-red">Red Tag</span>
            <span className="tag tag-gray">Gray Tag</span>
          </div>
        </section>

        {/* Form Tests */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Form Styles</h2>
          <div className="max-w-md">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Input
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter text here..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Error Input
              </label>
              <input
                type="text"
                className="input-field input-field-error"
                placeholder="Error state..."
              />
            </div>
          </div>
        </section>

        {/* Gradient Tests */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Gradient Backgrounds</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-hero-gradient p-6 rounded-xl text-white text-center">
              <h3 className="text-xl font-bold mb-2">Hero Gradient</h3>
              <p>Blue to gray gradient</p>
            </div>
            <div className="bg-card-gradient p-6 rounded-xl text-center">
              <h3 className="text-xl font-bold mb-2">Card Gradient</h3>
              <p>White to gray gradient</p>
            </div>
            <div className="bg-gradient-to-r from-red-400 to-amber-400 p-6 rounded-xl text-white text-center">
              <h3 className="text-xl font-bold mb-2">Accent Gradient</h3>
              <p>Red to amber gradient</p>
            </div>
          </div>
        </section>

        {/* Animation Tests */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Animation Effects</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card hover-lift">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Hover Lift</h3>
              <p className="text-gray-600">Hover to lift up</p>
            </div>
            <div className="card hover-scale">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Hover Scale</h3>
              <p className="text-gray-600">Hover to scale up</p>
            </div>
            <div className="card animate-fade-in-delay-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fade In</h3>
              <p className="text-gray-600">Animated fade in</p>
            </div>
          </div>
        </section>

        {/* Navigation Tests */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Navigation Styles</h2>
          <nav className="bg-hero-gradient p-6 rounded-xl">
            <div className="flex gap-6 justify-center">
              <a href="#" className="nav-link">Home</a>
              <a href="#" className="nav-link-active">Active</a>
              <a href="#" className="nav-link">About</a>
              <a href="#" className="nav-link">Contact</a>
            </div>
          </nav>
        </section>

        {/* Loading Tests */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Loading States</h2>
          <div className="flex gap-4 items-center">
            <button className="btn-primary" disabled>
              <div className="loading-spinner mr-2"></div>
              Loading...
            </button>
            <div className="loading-spinner"></div>
          </div>
        </section>

        {/* Utility Tests */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Utility Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="shadow-glow p-6 rounded-xl text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Shadow Glow</h3>
              <p className="text-gray-600">Blue glow effect</p>
            </div>
            <div className="shadow-glow-accent p-6 rounded-xl text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Shadow Glow Accent</h3>
              <p className="text-gray-600">Red glow effect</p>
            </div>
            <div className="glass p-6 rounded-xl text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Glass Effect</h3>
              <p className="text-gray-600">Backdrop blur</p>
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Color Palette</h2>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-4">
            <div className="text-center">
              <div className="w-full h-16 bg-primary-500 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Primary 500</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-secondary-500 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Secondary 500</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-accent-500 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Accent 500</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-primary-300 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Primary 300</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-secondary-300 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Secondary 300</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-accent-300 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Accent 300</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-primary-700 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Primary 700</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-secondary-700 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Secondary 700</p>
            </div>
            <div className="text-center">
              <div className="w-full h-16 bg-accent-700 rounded-lg mb-2"></div>
              <p className="text-xs text-gray-600">Accent 700</p>
            </div>
          </div>
        </section>

        {/* Success Message */}
        <section className="text-center">
          <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-xl mb-4">
            <h3 className="text-xl font-bold mb-2">🎉 Tailwind CSS is Working!</h3>
            <p>All styles are loading correctly. Your Job Portal is ready to use!</p>
          </div>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Go to Home
            </button>
            <button 
              onClick={() => window.location.href = '/jobs'}
              className="btn-secondary"
            >
              View Jobs
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TestTailwind;
