import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const About = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    { number: '5,000+', label: 'Active Job Seekers' },
    { number: '50+', label: 'Partner Companies' },
    { number: '250+', label: 'Successful Placements' },
    { number: '4.7/5', label: 'Satisfaction Rate' }
  ];

  const values = [
    {
      icon: '🎯',
      title: 'Mission-Driven',
      description: 'We are committed to helping people find meaningful work that aligns with their passions and skills.'
    },
    {
      icon: '🤝',
      title: 'Trust & Transparency',
      description: 'We believe in creating honest, transparent connections between candidates and employers.'
    },
    {
      icon: '💡',
      title: 'Innovation',
      description: 'We continuously innovate our platform using cutting-edge technology and user feedback.'
    },
    {
      icon: '🌍',
      title: 'Diversity & Inclusion',
      description: 'We champion diversity in the workplace and help companies build inclusive teams.'
    },
    {
      icon: '🚀',
      title: 'Growth',
      description: 'We support career growth and help companies find talent that drives their success.'
    },
    {
      icon: '❤️',
      title: 'User-Centric',
      description: 'Every decision we make is centered around providing the best experience for our users.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-700">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-white shadow-xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">About JobVerse</h1>
              <p className="text-xl sm:text-2xl mb-6 opacity-90">Reimagining job connections, launched in 2024</p>
              <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed opacity-90 mb-8">
                We're a fresh startup building a modern job platform that actually works
                for both job seekers and companies. No more endless applications, no more
                ghosting - just real connections.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link to="/login" className="btn-primary">Get Started</Link>
              </div>
            </div>
          </div>

          {/* Our Story Section */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-gray-700">
              <p className="text-lg leading-relaxed">
                JobVerse is the brainchild of Arpit Gaur, a passionate B.Tech Computer Science final year student
                who is currently experiencing the frustrations of job hunting firsthand. During his final year placement season,
                Arpit noticed how traditional job platforms failed to connect talented students with the right opportunities.
              </p>
              <p className="text-lg leading-relaxed">
                Armed with strong programming skills and a deep understanding of technology gained throughout his CSE course,
                Arpit decided to build a solution that would bridge this gap. He leveraged his academic knowledge to create smart
                matching algorithms and an intuitive platform that actually understands what both candidates and companies need.
              </p>
              <p className="text-lg leading-relaxed">
                What started as a final year project quickly evolved into a full-fledged platform. Today, JobVerse
                helps thousands of tech students and professionals find meaningful roles while helping companies
                discover hidden talent. Arpit's vision is to make job searching less about luck and more about perfect matches.
              </p>
            </div>
          </div>


          {/* Our Values Section */}
          <div className="bg-white rounded-2xl p-8 lg:p-12 shadow-xl mb-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Our Values</h2>
              <p className="text-xl text-gray-600">The principles that guide everything we do</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-8 text-center border border-gray-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center p-8 sm:p-12 lg:p-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Be Part of Our Journey</h2>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              We're just getting started! Join us early and help shape the future of job searching.
              Early adopters get special access to new features and direct support from our team.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/login" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:bg-gray-50 hover:-translate-y-0.5 inline-block shadow-lg">Start Your Journey</Link>
              <Link to="/login" className="bg-transparent text-white px-8 py-4 border-2 border-white rounded-xl font-bold transition-all duration-300 hover:bg-white hover:text-blue-600 inline-block">Explore Opportunities</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div >
  );
};

export default About;
