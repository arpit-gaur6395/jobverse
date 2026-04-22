import OpenAI from 'openai';
import Groq from 'groq-sdk';
import Job from '../models/Job.js';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Initialize AI clients lazily
const getOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
};

const getGroqClient = () => {
  return new Groq({
    apiKey: process.env.GROQ_API_KEY
  });
};

// Extract text from resume file
const extractResumeText = async (filePath) => {
  try {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === '.txt') {
      // Read text file
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return fileContent;
    } else if (ext === '.pdf') {
      // Parse PDF file using pdfjs-dist legacy build
      const dataBuffer = fs.readFileSync(filePath);
      const uint8Array = new Uint8Array(dataBuffer);
      const loadingTask = pdfjsLib.getDocument(uint8Array);
      const pdfDocument = await loadingTask.promise;

      let fullText = '';
      const numPages = pdfDocument.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + '\n';
      }

      return fullText;
    } else if (ext === '.docx') {
      // Parse DOCX file
      const dataBuffer = fs.readFileSync(filePath);
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value;
    } else {
      throw new Error('Unsupported file format. Please use TXT, PDF, or DOCX files.');
    }
  } catch (error) {
    console.error('Error reading resume file:', error);
    throw new Error('Failed to read resume file: ' + error.message);
  }
};

// Extract skills using OpenAI
const extractSkillsWithOpenAI = async (resumeText) => {
  try {
    const openai = getOpenAIClient();
    const prompt = `
    Analyze the following resume and extract the key technical skills, soft skills, and areas of expertise.
    Return the result as a JSON array of skill strings only, no additional text.
    
    Resume:
    ${resumeText}
    
    Example output format:
    ["JavaScript", "React", "Node.js", "Python", "Machine Learning", "Communication", "Team Leadership"]
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a skilled HR professional and technical recruiter. Extract skills from resumes and return them as a JSON array."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    const responseText = completion.choices[0].message.content.trim();
    const skills = JSON.parse(responseText);
    return skills;
  } catch (error) {
    console.error('Error extracting skills with OpenAI:', error);
    throw new Error('OpenAI extraction failed');
  }
};

// Extract skills using Groq (Free)
const extractSkillsWithGroq = async (resumeText) => {
  try {
    const groq = getGroqClient();
    const prompt = `
    CRITICAL INSTRUCTIONS: You must ONLY extract skills that are EXPLICITLY mentioned in the resume text below.
    
    - Do NOT add any skills that are not clearly stated in the resume
    - Do NOT infer or assume skills based on job titles or context
    - Only include technical skills, programming languages, frameworks, tools, and methodologies that are written in the resume
    - If a skill is not explicitly written, do NOT include it
    - Return ONLY a JSON array of skill strings found in the text
    - Be conservative - if unsure, do not include the skill
    
    Resume text:
    ${resumeText}
    
    Example output format (only include skills actually found):
    ["JavaScript", "React", "Node.js", "Python"]
    `;

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: "You are a precise skill extractor. Your job is to ONLY extract skills that are EXPLICITLY written in the resume text. Never add skills that are not mentioned. Be conservative and accurate."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1, // Lower temperature for more precise extraction
      max_tokens: 500
    });

    const responseText = completion.choices[0].message.content.trim();
    const skills = JSON.parse(responseText);
    return skills;
  } catch (error) {
    console.error('Error extracting skills with Groq:', error);
    throw new Error('Groq extraction failed');
  }
};


// Extract skills using local keyword matching (No AI, fallback)
const extractSkillsLocally = async (resumeText) => {
  try {
    // Comprehensive tech skills keyword list
    const techSkills = [
      // Programming Languages
      'javascript', 'js', 'typescript', 'ts', 'python', 'java', 'c++', 'c#', 'c sharp', 'php', 'ruby', 'go', 'golang', 'rust', 'swift', 'kotlin', 'scala', 'dart', 'r', 'matlab', 'perl', 'lua', 'haskell',

      // Frontend Frameworks & Libraries
      'react', 'reactjs', 'vue', 'vuejs', 'angular', 'angularjs', 'svelte', 'nextjs', 'next.js', 'nuxt', 'nuxtjs', 'gatsby', 'ember', 'backbone', 'jquery',

      // Backend Frameworks
      'express', 'expressjs', 'nodejs', 'node.js', 'nest', 'nestjs', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'rails', 'ruby on rails', 'laravel', 'asp.net', 'aspnet core', 'fiber', 'gin',

      // Mobile Development
      'react native', 'reactnative', 'flutter', 'ios', 'iphone', 'android', 'swift', 'kotlin', 'xamarin', 'ionic', 'cordova', 'electron',

      // Databases
      'sql', 'mysql', 'postgresql', 'postgres', 'mongodb', 'mongoose', 'redis', 'elasticsearch', 'sqlite', 'oracle', 'mssql', 'microsoft sql server', 'cassandra', 'dynamodb', 'firebase', 'supabase',

      // Cloud & DevOps
      'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud platform', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'cicd', 'git', 'github', 'gitlab', 'bitbucket', 'linux', 'ubuntu', 'debian', 'centos', 'red hat', 'windows server', 'nginx', 'apache', 'microservices', 'serverless',

      // Data Science & AI
      'machine learning', 'ml', 'deep learning', 'ai', 'artificial intelligence', 'data science', 'data analysis', 'data engineering', 'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'jupyter', 'nlp', 'natural language processing', 'computer vision', 'opencv', 'spark', 'hadoop', 'big data',

      // Web Technologies
      'html', 'html5', 'css', 'css3', 'sass', 'scss', 'less', 'tailwind', 'tailwindcss', 'bootstrap', 'material ui', 'mui', 'ant design', 'chakra ui', 'graphql', 'rest', 'rest api', 'api', 'soap', 'websocket', 'http', 'https', 'json', 'xml', 'ajax', 'fetch', 'axios',

      // Testing
      'jest', 'mocha', 'jasmine', 'karma', 'cypress', 'selenium', 'playwright', 'testing', 'unit testing', 'integration testing', 'e2e', 'end to end',

      // Tools & IDEs
      'vscode', 'visual studio code', 'intellij', 'eclipse', 'vim', 'emacs', 'postman', 'swagger', 'git',

      // Methodologies
      'agile', 'scrum', 'kanban', 'waterfall', 'tdd', 'test driven development', 'bdd', 'behavior driven development', 'devops', 'saas', 'paas', 'iaas',

      // Soft Skills
      'communication', 'leadership', 'teamwork', 'collaboration', 'problem solving', 'analytical', 'critical thinking', 'time management', 'project management', 'mentoring', 'coaching', 'public speaking', 'presentation', 'negotiation', 'adaptability', 'creativity', 'innovation',

      // Design
      'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux', 'user experience', 'user interface', 'ux design', 'ui design', 'wireframing', 'prototyping', 'design thinking',

      // Security
      'cybersecurity', 'security', 'authentication', 'authorization', 'oauth', 'jwt', 'encryption', 'ssl', 'tls', 'owasp',

      // Other
      'git', 'version control', 'agile', 'scrum', 'jira', 'confluence', 'slack', 'trello', 'asana'
    ];

    const resumeLower = resumeText.toLowerCase();
    const foundSkills = [];

    techSkills.forEach(skill => {
      // Use word boundary regex to match exact words only
      // Escape special regex characters in skill name
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');

      if (regex.test(resumeLower)) {
        // Capitalize first letter of each word
        const formattedSkill = skill.split(' ').map(word =>
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        foundSkills.push(formattedSkill);
      }
    });

    return [...new Set(foundSkills)]; // Remove duplicates
  } catch (error) {
    console.error('Error extracting skills locally:', error);
    throw new Error('Local extraction failed');
  }
};

// Main extract skills function with provider selection
const extractSkillsFromResume = async (resumeText, provider = 'local') => {
  const providers = {
    'openai': extractSkillsWithOpenAI,
    'groq': extractSkillsWithGroq,
    'local': extractSkillsLocally
  };

  const extractFunction = providers[provider] || providers['local'];

  try {
    return await extractFunction(resumeText);
  } catch (error) {
    console.error(`Error with ${provider} provider, falling back to local:`, error);
    // Fallback to local extraction if AI provider fails
    return await extractSkillsLocally(resumeText);
  }
};

// Match skills with available jobs and calculate match scores
const matchJobsWithSkills = async (skills) => {
  try {
    const allJobs = await Job.find({});

    const jobMatches = allJobs.map(job => {
      const jobSkills = job.skills || [];
      const jobTitle = (job.job || job.title || '').toLowerCase();
      const jobDescription = (job.jobDescription || '').toLowerCase();

      let matchScore = 0;
      const matchedSkills = [];

      // Check for skill matches
      skills.forEach(skill => {
        const skillLower = skill.toLowerCase();

        // Check if skill is in job's skills array
        if (jobSkills.some(js => js.toLowerCase() === skillLower)) {
          matchScore += 10;
          matchedSkills.push(skill);
        }

        // Check if skill is mentioned in job title
        if (jobTitle.includes(skillLower)) {
          matchScore += 5;
          if (!matchedSkills.includes(skill)) {
            matchedSkills.push(skill);
          }
        }

        // Check if skill is mentioned in job description
        if (jobDescription.includes(skillLower)) {
          matchScore += 3;
          if (!matchedSkills.includes(skill)) {
            matchedSkills.push(skill);
          }
        }
      });

      // Normalize score to percentage
      const maxPossibleScore = skills.length * 10;
      const matchPercentage = maxPossibleScore > 0 ? Math.round((matchScore / maxPossibleScore) * 100) : 0;

      return {
        ...job.toObject(),
        matchScore: matchPercentage,
        matchedSkills: matchedSkills
      };
    });

    // Sort by match score (highest first)
    jobMatches.sort((a, b) => b.matchScore - a.matchScore);

    // Return only jobs with at least some match
    return jobMatches.filter(job => job.matchScore > 0);
  } catch (error) {
    console.error('Error matching jobs with skills:', error);
    throw new Error('Failed to match jobs with skills');
  }
};

// Main controller function to analyze resume
export const analyzeResume = async (req, res) => {
  try {
    console.log('Resume analysis started');

    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded'
      });
    }

    const resumePath = req.file.path;
    const provider = req.body.provider || 'local';
    console.log('Provider:', provider);
    console.log('File path:', resumePath);

    // Step 1: Extract text from resume
    console.log('Step 1: Extracting text from resume');
    const resumeText = await extractResumeText(resumePath);
    console.log('Text extracted, length:', resumeText.length);

    // Step 2: Extract skills using selected AI provider
    console.log('Step 2: Extracting skills with provider:', provider);
    const skills = await extractSkillsFromResume(resumeText, provider);
    console.log('Skills extracted:', skills);

    // Step 3: Match skills with jobs
    console.log('Step 3: Matching skills with jobs');
    const recommendedJobs = await matchJobsWithSkills(skills);
    console.log('Jobs matched:', recommendedJobs.length);

    // Step 4: Clean up uploaded file
    fs.unlinkSync(resumePath);

    res.status(200).json({
      success: true,
      data: {
        skills: skills,
        recommendedJobs: recommendedJobs.slice(0, 10),
        totalMatches: recommendedJobs.length,
        provider: provider
      }
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    console.error('Error stack:', error.stack);

    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to analyze resume',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get resume analysis status (for future use)
export const getAnalysisStatus = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Resume analysis service is ready'
  });
};

// Test AI providers
export const testAIProviders = async (req, res) => {
  const results = {};

  // Test Local (always works)
  try {
    const skills = await extractSkillsLocally("Test resume with JavaScript, React, and Python skills");
    results.local = { success: true, message: 'Local extraction working', sampleSkills: skills };
  } catch (error) {
    results.local = { success: false, error: error.message };
  }

  // Test Groq
  try {
    const skills = await extractSkillsWithGroq("Test resume with JavaScript, React, and Python skills");
    results.groq = { success: true, message: 'Groq connection successful', sampleSkills: skills };
  } catch (error) {
    results.groq = { success: false, error: error.message };
  }

  // Test OpenAI
  try {
    const skills = await extractSkillsWithOpenAI("Test resume with JavaScript, React, and Python skills");
    results.openai = { success: true, message: 'OpenAI connection successful', sampleSkills: skills };
  } catch (error) {
    results.openai = { success: false, error: error.message };
  }

  res.status(200).json({
    success: true,
    results: results
  });
};
