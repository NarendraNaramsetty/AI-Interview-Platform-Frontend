export const INTERVIEW_ROLES = [
  { id: 'frontend', name: 'Frontend Engineer', techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Vite', 'Next.js'] },
  { id: 'backend', name: 'Backend Engineer', techStack: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'Redis', 'Docker', 'AWS'] },
  { id: 'fullstack', name: 'Full Stack Engineer', techStack: ['React', 'Node.js', 'PostgreSQL', 'GraphQL', 'Tailwind', 'Docker'] },
  { id: 'product', name: 'Product Manager', techStack: ['Agile', 'Scrum', 'Product Analytics', 'User Research', 'A/B Testing'] }
];

export const EXPERIENCE_LEVELS = [
  { id: 'junior', name: 'Junior (0-2 years)', multiplier: 1.0 },
  { id: 'mid', name: 'Mid-Level (2-5 years)', multiplier: 1.2 },
  { id: 'senior', name: 'Senior (5+ years)', multiplier: 1.5 }
];

export const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy', color: 'text-green-500 bg-green-500/10 border-green-500/20' },
  { id: 'medium', name: 'Medium', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
  { id: 'hard', name: 'Hard', color: 'text-red-500 bg-red-500/10 border-red-500/20' }
];

export const MOCK_QUESTIONS = {
  frontend: {
    easy: [
      { id: 'fe-e1', text: 'Explain the difference between state and props in React.', expectedKeywords: ['immutable', 'component', 'props', 'state', 're-render'] },
      { id: 'fe-e2', text: 'What is the purpose of semantic HTML, and why is it important for SEO?', expectedKeywords: ['accessibility', 'seo', 'screen reader', 'tags', 'structure'] },
      { id: 'fe-e3', text: 'How does CSS specificity work, and how can you resolve conflicts?', expectedKeywords: ['importance', 'inline', 'id', 'class', 'tag', 'weight'] }
    ],
    medium: [
      { id: 'fe-m1', text: 'What are React Hooks, and what rules must you follow when using them?', expectedKeywords: ['functional component', 'top-level', 'conditional', 'useState', 'useEffect'] },
      { id: 'fe-m2', text: 'Explain the Virtual DOM and how React reconciles changes to the real DOM.', expectedKeywords: ['diffing', 'reconciliation', 'batching', 'virtual tree', 'performance'] },
      { id: 'fe-m3', text: 'How do you optimize a React application that suffers from slow rendering?', expectedKeywords: ['useMemo', 'useCallback', 'React.memo', 'lazy loading', 'code splitting'] }
    ],
    senior: [
      { id: 'fe-s1', text: 'Explain Micro-Frontends. How would you design a micro-frontend architecture for a large enterprise dashboard?', expectedKeywords: ['federation', 'module federation', 'iframe', 'independent deploy', 'shared state'] },
      { id: 'fe-s2', text: 'Discuss CSS-in-JS vs CSS Modules in terms of build performance, bundle size, and maintenance.', expectedKeywords: ['runtime overhead', 'critical path CSS', 'tree-shaking', 'caching', 'scoped styling'] },
      { id: 'fe-s3', text: 'How would you implement a robust global state management architecture in a highly dynamic, real-time analytics app?', expectedKeywords: ['zustand', 'redux toolkit', 'middleware', 'selector optimization', 'subscriptions'] }
    ]
  },
  backend: {
    easy: [
      { id: 'be-e1', text: 'What is the difference between SQL and NoSQL databases?', expectedKeywords: ['relational', 'schema', 'scaling', 'document', 'joins'] },
      { id: 'be-e2', text: 'What is RESTful API design, and what are the main HTTP methods?', expectedKeywords: ['get', 'post', 'put', 'delete', 'stateless', 'resource'] }
    ],
    medium: [
      { id: 'be-m1', text: 'Explain how database indexing works, and discuss its impact on write performance.', expectedKeywords: ['b-tree', 'lookup', 'overhead', 'scan', 'insert speed'] },
      { id: 'be-m2', text: 'How do JWTs (JSON Web Tokens) work, and how should they be safely stored on the frontend?', expectedKeywords: ['signature', 'payload', 'httpOnly cookie', 'csrf', 'xss'] }
    ],
    senior: [
      { id: 'be-s1', text: 'How would you design a system that handles flash sale traffic of 100,000 requests per second?', expectedKeywords: ['redis queue', 'rate limiter', 'cdn cache', 'read replica', 'load balancer'] },
      { id: 'be-s2', text: 'Explain database transaction isolation levels. What are dirty reads, non-repeatable reads, and phantom reads?', expectedKeywords: ['acid', 'read committed', 'serializable', 'optimistic locking', 'mvcc'] }
    ]
  }
};

export const MOCK_INTERVIEW_HISTORY = [
  {
    id: 'int-1',
    role: 'Frontend Engineer',
    level: 'Mid-Level',
    difficulty: 'Medium',
    date: '2026-06-28',
    duration: '15 mins',
    overallScore: 84,
    technicalScore: 88,
    communicationScore: 80,
    confidenceScore: 85,
    status: 'Completed',
    questionsCount: 5
  },
  {
    id: 'int-2',
    role: 'Backend Engineer',
    level: 'Senior',
    difficulty: 'Hard',
    date: '2026-06-15',
    duration: '25 mins',
    overallScore: 68,
    technicalScore: 72,
    communicationScore: 62,
    confidenceScore: 70,
    status: 'Completed',
    questionsCount: 10
  }
];

export const MOCK_RECOMMENDED_TOPICS = [
  { topic: 'React Performance Optimization', category: 'Frontend', difficulty: 'Hard', urgency: 'High', score: 45 },
  { topic: 'System Design: Scaling Cache Layers', category: 'System Design', difficulty: 'Medium', urgency: 'Medium', score: 62 },
  { topic: 'REST vs GraphQL Api Protocols', category: 'Backend', difficulty: 'Easy', urgency: 'Low', score: 88 },
  { topic: 'Asynchronous Event Handling', category: 'Javascript', difficulty: 'Medium', urgency: 'High', score: 55 }
];

export const MOCK_SKILL_GROWTH = [
  { name: 'Week 1', Technical: 50, Communication: 60, Confidence: 55 },
  { name: 'Week 2', Technical: 65, Communication: 72, Confidence: 68 },
  { name: 'Week 3', Technical: 74, Communication: 75, Confidence: 70 },
  { name: 'Week 4', Technical: 84, Communication: 80, Confidence: 82 }
];

export const MOCK_RESUME_ANALYSIS = {
  atsScore: 78,
  parsedSkills: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Redux', 'Git', 'REST APIs', 'Jest'],
  recommendedRoles: ['Frontend Developer', 'UI Engineer', 'React Developer'],
  strengths: [
    'Strong knowledge of React component lifecycle and state management.',
    'Good foundation in semantic HTML structure and CSS animations.',
    'Hands-on experience writing responsive design layouts.'
  ],
  weaknesses: [
    'Missing keywords related to TypeScript and modern bundlers (Webpack, Vite).',
    'No mention of CI/CD pipelines or cloud infrastructure (AWS, Docker).',
    'Limited evidence of unit and integration test coverages (Cypress, RTL).'
  ],
  actionableTips: [
    'Add projects showing your experience with TypeScript, as it is highly demanded for senior roles.',
    'Include a section for DevOps skills, highlighting simple projects using GitHub Actions or Docker.',
    'Quantify your accomplishments (e.g., "Optimized bundle size by 35% using lazy loading").'
  ]
};
