# Job Portal Full Stack Application

A modern, fully-functional job portal application built with React, Node.js, Express, and MongoDB. Features mobile-responsive design, user authentication, job posting, application management, and more.

## 🚀 Features

### Core Features
- **User Authentication**: Register and login system for job seekers and employers
- **Role-Based Access**: Separate functionalities for job seekers and employers
- **Job Management**: Post, edit, delete, and browse job listings
- **Application System**: Apply for jobs and manage applications
- **Search & Filter**: Advanced search with filters for title, company, location
- **Category Browsing**: Browse jobs by categories
- **Mobile Responsive**: Fully responsive design for all screen sizes

### Technical Features
- **Modern UI**: Beautiful, gradient-based design with Tailwind CSS
- **Real-time Updates**: Dynamic content loading and state management
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **RESTful API**: Well-structured backend API endpoints
- **Database Integration**: MongoDB for data persistence
- **File Uploads**: Support for file uploads (resumes, company logos)

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls
- **Vite**: Fast build tool and dev server

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

## 📱 Mobile Responsiveness

The application is fully responsive with:
- **Mobile-first design approach**
- **Responsive navigation with hamburger menu**
- **Adaptive layouts for all screen sizes**
- **Touch-friendly interface elements**
- **Optimized form layouts for mobile devices**

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (running locally)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd JobPortalFullStack
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../Backend
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `Backend` directory:
   ```
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/JP
   JWT_SECRET=your_jwt_secret_key_here
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For Windows
   net start MongoDB
   
   # For macOS/Linux
   sudo systemctl start mongod
   # or
   mongod
   ```

5. **Run the application**
   
   **Option 1: Run both frontend and backend together**
   ```bash
   # From root directory
   npm run dev
   ```
   
   **Option 2: Run separately**
   ```bash
   # Backend (from Backend directory)
   npm run dev
   
   # Frontend (from frontend directory)
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📁 Project Structure

```
JobPortalFullStack/
├── Backend/                 # Backend application
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── uploads/           # File upload directory
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── frontend/              # Frontend application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context
│   │   ├── config/        # Configuration files
│   │   └── App.jsx        # Main App component
│   └── package.json       # Frontend dependencies
├── api/                  # Vercel serverless functions
├── package.json           # Root package.json
├── vercel.json          # Vercel configuration
└── README.md            # This file
```

## 🔧 Available Scripts

### Root Scripts
- `npm run dev` - Run both frontend and backend in development mode
- `npm run build` - Build the frontend for production
- `npm start` - Preview the production build

### Backend Scripts
- `npm run dev` - Start backend in development mode with nodemon
- `npm start` - Start backend in production mode
- `npm run seed-jobs` - Seed database with sample jobs
- `npm run clear-jobs` - Clear all jobs from database

### Frontend Scripts
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs/postjob` - Post new job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)
- `POST /api/jobs/apply/:id` - Apply for job (job seeker only)

### Categories
- `GET /api/categories` - Get all categories

### Companies
- `GET /api/companies` - Get all companies

### Stats
- `GET /api/stats` - Get application statistics

## 🎯 Usage Guide

### For Job Seekers
1. **Register**: Create an account as a job seeker
2. **Browse Jobs**: Search and filter through available jobs
3. **Apply**: Click "Apply Now" on any job to submit your application
4. **Track Applications**: View your application history

### For Employers
1. **Register**: Create an account as an employer
2. **Post Jobs**: Create and publish job listings
3. **Manage Jobs**: Edit or delete your job postings
4. **View Applicants**: See who has applied to your jobs

## 🎨 Design Features

- **Modern UI**: Clean, professional interface with gradients
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, transitions, and animations
- **Accessibility**: Semantic HTML and keyboard navigation support
- **Dark Mode Ready**: Components designed with dark mode in mind

## 🔒 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Proper CORS configuration
- **File Upload Security**: Secure file upload handling

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `frontend/dist` folder
3. Configure environment variables if needed

### Backend Deployment (Heroku/Railway)
1. Set up MongoDB Atlas for production database
2. Configure environment variables
3. Deploy the Backend folder
4. Ensure proper CORS configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env file
   - Verify MongoDB is accessible on the specified port

2. **Port Already in Use**
   - Change the PORT in .env file
   - Kill the process using the port

3. **CORS Issues**
   - Ensure frontend URL is allowed in CORS configuration
   - Check that API URLs are correct in frontend

4. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check for any missing dependencies

## 📞 Support

For support or questions, please open an issue in the repository or contact the development team.

---

**Happy Job Hunting! 🎯**
# jobverse
