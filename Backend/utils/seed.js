import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Company from '../models/Company.js';

const seedData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Company.deleteMany({});

    // Seed Categories
    const categories = [
      {
        name: 'Engineering',
        icon: '💻',
        description: 'Software development, DevOps, and technical roles',
        jobCount: 1250,
        color: '#3498db',
        subcategories: ['Frontend Development', 'Backend Development', 'DevOps', 'Mobile Development', 'QA Engineering'],
        featured: true,
        trending: true,
        growth: '+45%'
      },
      {
        name: 'Design',
        icon: '🎨',
        description: 'UI/UX design, graphic design, and creative roles',
        jobCount: 850,
        color: '#e74c3c',
        subcategories: ['UI Design', 'UX Design', 'Graphic Design', 'Product Design', 'Visual Design'],
        featured: true,
        trending: false,
        growth: '+28%'
      },
      {
        name: 'Marketing',
        icon: '📈',
        description: 'Digital marketing, content, and growth roles',
        jobCount: 920,
        color: '#f39c12',
        subcategories: ['Digital Marketing', 'Content Marketing', 'SEO/SEM', 'Social Media', 'Brand Management'],
        featured: true,
        trending: false,
        growth: '+25%'
      },
      {
        name: 'Data Science',
        icon: '📊',
        description: 'Data analysis, machine learning, and analytics roles',
        jobCount: 780,
        color: '#1abc9c',
        subcategories: ['Data Analysis', 'Machine Learning', 'Data Engineering', 'Business Intelligence', 'Research Science'],
        featured: true,
        trending: true,
        growth: '+38%'
      },
      {
        name: 'Product',
        icon: '🚀',
        description: 'Product management, product marketing, and strategy roles',
        jobCount: 650,
        color: '#9b59b6',
        subcategories: ['Product Management', 'Product Marketing', 'Product Operations', 'Technical Product Management', 'Growth Product'],
        featured: false,
        trending: true,
        growth: '+32%'
      }
    ];

    await Category.insertMany(categories);
    console.log('Categories seeded successfully');

    // Seed Companies
    const companies = [
      {
        name: 'TechCorp Solutions',
        logo: '🏢',
        industry: 'Technology',
        size: '1000-5000',
        location: 'San Francisco, CA',
        description: 'Leading technology company specializing in cloud solutions and enterprise software.',
        openPositions: 45,
        rating: 4.5,
        benefits: ['Health Insurance', '401(k)', 'Remote Work', 'Stock Options'],
        featured: true,
        website: 'https://techcorp.com',
        founded: '2010',
        email: 'careers@techcorp.com',
        phone: '+1 (555) 123-4567'
      },
      {
        name: 'Innovation Labs',
        logo: '🔬',
        industry: 'Research & Development',
        size: '500-1000',
        location: 'Boston, MA',
        description: 'Cutting-edge research company focused on AI and machine learning innovations.',
        openPositions: 28,
        rating: 4.7,
        benefits: ['Health Insurance', 'Flexible Hours', 'Research Budget', 'Conference Allowance'],
        featured: true,
        website: 'https://innovationlabs.com',
        founded: '2015',
        email: 'hiring@innovationlabs.com',
        phone: '+1 (555) 987-6543'
      },
      {
        name: 'Creative Studio',
        logo: '🎨',
        industry: 'Design & Media',
        size: '50-100',
        location: 'New York, NY',
        description: 'Award-winning design studio creating digital experiences for global brands.',
        openPositions: 12,
        rating: 4.3,
        benefits: ['Health Insurance', 'Creative Freedom', 'Flexible Schedule', 'Profit Sharing'],
        featured: false,
        website: 'https://creativestudio.com',
        founded: '2012',
        email: 'jobs@creativestudio.com',
        phone: '+1 (555) 456-7890'
      }
    ];

    await Company.insertMany(companies);
    console.log('Companies seeded successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Connect to database and seed
mongoose.connect('mongodb://127.0.0.1:27017/JP')
  .then(() => {
    console.log('Connected to database');
    seedData();
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });
