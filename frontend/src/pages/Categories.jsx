import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const featuredCategories = categories.filter(category => category.featured);

  if (loading) {
    return (
      <div className="categories-container">
        <div className="loading">
          <h3>Loading categories...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>Job Categories</h1>
        <p>Explore opportunities across different industries and roles</p>
      </div>

      <div className="featured-section">
        <h2>Popular Categories</h2>
        <div className="featured-grid">
          {featuredCategories.map(category => (
            <Link
              key={category.id}
              to={`/jobs?category=${category.name}`}
              className="featured-card"
              style={{ '--category-color': category.color }}
            >
              <div className="card-icon">{category.icon}</div>
              <div className="card-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <div className="job-count">{category.jobCount.toLocaleString()} jobs</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="all-categories-section">
        <h2>All Categories</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div key={category.id} className="category-card">
              <div className="category-header" style={{ backgroundColor: category.color }}>
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.jobCount.toLocaleString()} open positions</p>
                </div>
              </div>

              <div className="category-content">
                <p className="category-description">{category.description}</p>

                <div className="subcategory-list">
                  <h4>Popular Subcategories:</h4>
                  <div className="subcategory-tags">
                    {category.subcategories.map((sub, index) => (
                      <Link
                        key={index}
                        to={`/jobs?subcategory=${sub.replace(/\s+/g, '-').toLowerCase()}`}
                        className="subcategory-tag"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="category-actions">
                  <Link
                    to={`/jobs?category=${category.name}`}
                    className="browse-jobs-btn"
                    style={{ backgroundColor: category.color }}
                  >
                    Browse {category.name} Jobs
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="trending-section">
        <h2>Trending Categories</h2>
        <div className="trending-list">
          <div className="trending-item">
            <span className="trending-rank">🔥</span>
            <span className="trending-name">Remote Engineering</span>
            <span className="trending-growth">+45%</span>
          </div>
          <div className="trending-item">
            <span className="trending-rank">📈</span>
            <span className="trending-name">AI & Machine Learning</span>
            <span className="trending-growth">+38%</span>
          </div>
          <div className="trending-item">
            <span className="trending-rank">🚀</span>
            <span className="trending-name">Product Management</span>
            <span className="trending-growth">+32%</span>
          </div>
          <div className="trending-item">
            <span className="trending-rank">💡</span>
            <span className="trending-name">UX Design</span>
            <span className="trending-growth">+28%</span>
          </div>
          <div className="trending-item">
            <span className="trending-rank">📱</span>
            <span className="trending-name">Mobile Development</span>
            <span className="trending-growth">+25%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
