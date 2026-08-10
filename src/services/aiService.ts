import type { CareerPath, Profile } from '../types';

interface CareerTemplate {
  title: string;
  domains: string[];
  skillKeywords: string[];
  interestKeywords: string[];
  degreeKeywords: string[];
  coreSkillsToLearn: string[];
  nextSteps: string[];
  baseMatchScore: number;
}

const CAREERS: CareerTemplate[] = [
  {
    title: 'Full Stack Software Engineer',
    domains: ['web development', 'software engineering', 'programming', 'tech', 'frontend', 'backend'],
    skillKeywords: ['javascript', 'react', 'node', 'python', 'html', 'css', 'typescript', 'git', 'sql'],
    interestKeywords: ['coding', 'web', 'apps', 'software', 'programming', 'development', 'building'],
    degreeKeywords: ['computer science', 'software', 'information technology', 'it', 'engineering', 'cs'],
    coreSkillsToLearn: ['TypeScript', 'React / Next.js', 'Node.js & REST APIs', 'PostgreSQL / MongoDB', 'Docker basics', 'System design fundamentals'],
    nextSteps: [
      'Build 2–3 full-stack projects with a React frontend and Node/Python backend',
      'Contribute to an open-source project on GitHub',
      'Prepare for technical interviews with LeetCode (medium-level problems)',
      'Earn AWS Cloud Practitioner or Google Associate Cloud Engineer certification',
      'Apply for internships at product companies or startups',
    ],
    baseMatchScore: 78,
  },
  {
    title: 'Machine Learning Engineer',
    domains: ['ai', 'ml', 'machine learning', 'data science', 'artificial intelligence', 'deep learning'],
    skillKeywords: ['python', 'tensorflow', 'pytorch', 'numpy', 'pandas', 'statistics', 'math', 'data', 'sklearn'],
    interestKeywords: ['ai', 'machine learning', 'data', 'research', 'algorithms', 'neural networks', 'nlp', 'computer vision'],
    degreeKeywords: ['computer science', 'mathematics', 'statistics', 'data science', 'engineering', 'physics'],
    coreSkillsToLearn: ['Linear algebra & calculus for ML', 'Python (NumPy, pandas, scikit-learn)', 'PyTorch or TensorFlow', 'Feature engineering', 'Model evaluation & deployment', 'MLOps fundamentals'],
    nextSteps: [
      'Complete the fast.ai or deeplearning.ai Specialization on Coursera',
      'Participate in Kaggle competitions to build practical ML skills',
      'Implement and publish 2 ML projects on GitHub (e.g., NLP or CV)',
      'Read foundational papers: Attention Is All You Need, ResNet, BERT',
      'Apply to research labs or ML-focused internships',
    ],
    baseMatchScore: 72,
  },
  {
    title: 'Data Scientist / Data Analyst',
    domains: ['data science', 'analytics', 'business intelligence', 'data', 'statistics'],
    skillKeywords: ['python', 'sql', 'excel', 'statistics', 'r', 'tableau', 'powerbi', 'data', 'pandas'],
    interestKeywords: ['data', 'analytics', 'insights', 'business', 'statistics', 'visualization', 'patterns'],
    degreeKeywords: ['statistics', 'mathematics', 'economics', 'business', 'computer science', 'data science'],
    coreSkillsToLearn: ['Advanced SQL (window functions, CTEs)', 'Python (pandas, matplotlib, seaborn)', 'Statistical analysis & A/B testing', 'Tableau or Power BI', 'Storytelling with data', 'Basics of ML (regression, clustering)'],
    nextSteps: [
      'Build a portfolio of data analysis projects on Kaggle or GitHub',
      'Learn SQL deeply — it remains the most in-demand data skill',
      'Take Google Data Analytics or IBM Data Science Professional Certificate',
      'Practice dashboarding with public datasets (e.g., NYC TLC, WorldBank)',
      'Apply to analyst roles at tech, finance, or healthcare companies',
    ],
    baseMatchScore: 70,
  },
  {
    title: 'Cloud / DevOps Engineer',
    domains: ['cloud', 'devops', 'infrastructure', 'aws', 'azure', 'gcp', 'sre'],
    skillKeywords: ['linux', 'docker', 'kubernetes', 'aws', 'terraform', 'ci/cd', 'bash', 'python', 'networking'],
    interestKeywords: ['infrastructure', 'cloud', 'automation', 'devops', 'scalability', 'systems', 'deployment'],
    degreeKeywords: ['computer science', 'information technology', 'systems', 'network', 'engineering'],
    coreSkillsToLearn: ['Linux administration', 'Docker & Kubernetes', 'AWS / GCP / Azure fundamentals', 'Terraform (Infrastructure as Code)', 'CI/CD pipelines (GitHub Actions, Jenkins)', 'Monitoring (Prometheus, Grafana)'],
    nextSteps: [
      'Earn AWS Solutions Architect Associate or Google Cloud Professional certification',
      'Set up a personal homelab or AWS free-tier environment',
      'Deploy a containerized app end-to-end using Kubernetes',
      'Contribute to infrastructure projects on GitHub',
      'Target DevOps Engineer or Cloud Practitioner entry-level roles',
    ],
    baseMatchScore: 68,
  },
  {
    title: 'Cybersecurity Analyst',
    domains: ['cybersecurity', 'security', 'ethical hacking', 'infosec', 'networking'],
    skillKeywords: ['networking', 'linux', 'python', 'security', 'firewalls', 'cryptography', 'oscp', 'kali'],
    interestKeywords: ['security', 'hacking', 'privacy', 'networks', 'cryptography', 'defense', 'threats'],
    degreeKeywords: ['computer science', 'information security', 'cybersecurity', 'network', 'it'],
    coreSkillsToLearn: ['TCP/IP networking fundamentals', 'Linux & scripting (Bash, Python)', 'SIEM tools (Splunk, QRadar)', 'Vulnerability assessment (Nmap, Burp Suite)', 'CompTIA Security+ & CEH exam topics', 'Incident response procedures'],
    nextSteps: [
      'Earn CompTIA Security+ as your first security credential',
      'Practice on TryHackMe or HackTheBox platforms',
      'Set up a home lab with VMs for penetration testing practice',
      'Study the NIST Cybersecurity Framework and OWASP Top 10',
      'Apply for SOC analyst or junior pentester roles',
    ],
    baseMatchScore: 66,
  },
  {
    title: 'UX / Product Designer',
    domains: ['design', 'ux', 'ui', 'product', 'user experience', 'frontend'],
    skillKeywords: ['figma', 'sketch', 'design', 'prototyping', 'css', 'html', 'user research'],
    interestKeywords: ['design', 'user experience', 'ui', 'aesthetics', 'product', 'creativity', 'visual'],
    degreeKeywords: ['design', 'human-computer interaction', 'arts', 'psychology', 'computer science', 'communication'],
    coreSkillsToLearn: ['Figma (components, auto layout, prototyping)', 'User research & usability testing', 'Information architecture', 'Design systems', 'Basic front-end (HTML/CSS) for collaboration', 'Product thinking & metrics'],
    nextSteps: [
      'Build a portfolio of 3–4 end-to-end UX case studies',
      'Take Google UX Design Certificate on Coursera',
      'Conduct at least 5 user interviews and document findings',
      'Redesign an existing app and document your process on Medium',
      'Apply to UX intern or junior product designer roles',
    ],
    baseMatchScore: 64,
  },
  {
    title: 'Mobile App Developer (iOS / Android)',
    domains: ['mobile', 'ios', 'android', 'react native', 'flutter', 'app development'],
    skillKeywords: ['swift', 'kotlin', 'react native', 'flutter', 'dart', 'java', 'xcode', 'android studio'],
    interestKeywords: ['mobile', 'apps', 'ios', 'android', 'app development', 'cross-platform'],
    degreeKeywords: ['computer science', 'software engineering', 'mobile computing', 'it'],
    coreSkillsToLearn: ['Swift (iOS) or Kotlin (Android)', 'React Native or Flutter for cross-platform', 'RESTful API integration', 'App state management', 'App Store / Play Store deployment', 'Mobile UX patterns'],
    nextSteps: [
      'Publish at least one app to the App Store or Google Play',
      'Complete "100 Days of SwiftUI" or Android Basics with Compose course',
      'Integrate a public API into a mobile app project',
      'Join local iOS / Android developer meetups',
      'Apply to mobile developer internships at consumer tech companies',
    ],
    baseMatchScore: 67,
  },
  {
    title: 'Blockchain / Web3 Developer',
    domains: ['blockchain', 'web3', 'defi', 'smart contracts', 'cryptocurrency', 'ethereum'],
    skillKeywords: ['solidity', 'ethereum', 'web3', 'javascript', 'python', 'blockchain', 'smart contracts'],
    interestKeywords: ['blockchain', 'web3', 'cryptocurrency', 'defi', 'nft', 'decentralized', 'fintech'],
    degreeKeywords: ['computer science', 'mathematics', 'finance', 'economics', 'software engineering'],
    coreSkillsToLearn: ['Solidity smart contract development', 'Hardhat or Foundry development framework', 'Ethers.js / Web3.js', 'IPFS & decentralized storage', 'DeFi protocol mechanics', 'Smart contract security auditing'],
    nextSteps: [
      'Complete CryptoZombies and Buildspace Solidity course',
      'Deploy a simple ERC-20 or NFT contract to a testnet',
      'Read key whitepapers: Bitcoin, Ethereum, Uniswap',
      'Join a hackathon (ETHGlobal, Chainlink) to build with a team',
      'Contribute to open-source DeFi or DAO projects',
    ],
    baseMatchScore: 60,
  },
  {
    title: 'Product Manager (Technical)',
    domains: ['product management', 'product', 'strategy', 'agile', 'business'],
    skillKeywords: ['agile', 'scrum', 'analytics', 'sql', 'jira', 'roadmap', 'user stories'],
    interestKeywords: ['product', 'strategy', 'business', 'leadership', 'management', 'users', 'growth'],
    degreeKeywords: ['business', 'management', 'computer science', 'engineering', 'economics', 'mba'],
    coreSkillsToLearn: ['Product roadmapping & prioritization frameworks (RICE, MoSCoW)', 'SQL for product analytics', 'User story writing & sprint planning', 'A/B testing & experimentation', 'Stakeholder communication', 'Competitive analysis'],
    nextSteps: [
      'Take Product School or Reforge PM fundamentals course',
      'Shadow or assist a PM at a startup through APM programs',
      'Build a case study: pick an app, identify a problem, propose a solution',
      'Practice product sense with mock PM interviews (Exponent)',
      'Target APM (Associate Product Manager) programs at tech companies',
    ],
    baseMatchScore: 62,
  },
  {
    title: 'AI / NLP Research Engineer',
    domains: ['ai', 'nlp', 'research', 'machine learning', 'language models', 'deep learning'],
    skillKeywords: ['python', 'pytorch', 'transformers', 'nlp', 'hugging face', 'research', 'mathematics'],
    interestKeywords: ['ai', 'research', 'nlp', 'language models', 'llm', 'deep learning', 'academia'],
    degreeKeywords: ['computer science', 'computational linguistics', 'mathematics', 'statistics', 'ai'],
    coreSkillsToLearn: ['Transformer architecture & attention mechanisms', 'Hugging Face ecosystem (transformers, datasets)', 'Fine-tuning LLMs on domain data', 'Evaluation metrics for NLP', 'Research paper writing & LaTeX', 'Experiment tracking (MLflow, Weights & Biases)'],
    nextSteps: [
      'Reproduce 1–2 key NLP papers from scratch as projects',
      'Publish a blog post or paper on arXiv in your area of interest',
      'Apply to research internships at AI labs (Google DeepMind, Cohere, Hugging Face)',
      'Build and deploy a small LLM-powered application',
      'Attend NeurIPS, ICML, or ACL workshops',
    ],
    baseMatchScore: 65,
  },
];

function scoreCareer(career: CareerTemplate, profile: Profile): number {
  let score = career.baseMatchScore;

  const profileText = [
    ...profile.skills,
    ...profile.interests,
    ...profile.preferredAreas,
    profile.careerGoals,
    profile.degree,
    profile.academicBackground,
  ]
    .join(' ')
    .toLowerCase();

  for (const kw of career.skillKeywords) {
    if (profileText.includes(kw.toLowerCase())) score += 4;
  }
  for (const kw of career.interestKeywords) {
    if (profileText.includes(kw.toLowerCase())) score += 3;
  }
  for (const kw of career.degreeKeywords) {
    if (profileText.includes(kw.toLowerCase())) score += 2;
  }
  for (const domain of career.domains) {
    if (profileText.includes(domain.toLowerCase())) score += 5;
  }

  return Math.min(score, 98);
}

function buildExplanation(career: CareerTemplate, profile: Profile, score: number): string {
  const matchStrength = score >= 88 ? 'an excellent' : score >= 78 ? 'a strong' : score >= 68 ? 'a solid' : 'a promising';
  const overlappingSkills = career.skillKeywords.filter((kw) =>
    profile.skills.some((s) => s.toLowerCase().includes(kw.toLowerCase()))
  );
  const skillMention =
    overlappingSkills.length > 0
      ? ` Your experience with ${overlappingSkills.slice(0, 2).join(' and ')} directly applies here.`
      : '';
  return `${score}% match — ${matchStrength} fit based on your profile.${skillMention}`;
}

function buildWhySuitable(career: CareerTemplate, profile: Profile): string {
  const parts: string[] = [];

  const matchingInterests = career.interestKeywords.filter((kw) =>
    [...profile.interests, ...profile.preferredAreas].some((i) =>
      i.toLowerCase().includes(kw.toLowerCase())
    )
  );

  if (matchingInterests.length > 0) {
    parts.push(
      `Your interests in ${matchingInterests.slice(0, 2).join(' and ')} align naturally with the day-to-day work of a ${career.title}.`
    );
  }

  if (profile.careerGoals) {
    parts.push(
      `Your goal to "${profile.careerGoals.slice(0, 80)}${profile.careerGoals.length > 80 ? '...' : ''}" maps well onto the ${career.title} growth trajectory.`
    );
  }

  if (profile.degree) {
    parts.push(
      `A background in ${profile.degree} provides the analytical and problem-solving foundation this role demands.`
    );
  }

  if (parts.length === 0) {
    parts.push(
      `The ${career.title} role offers strong growth prospects and aligns with current industry demand in your preferred technology areas.`
    );
  }

  return parts.join(' ');
}

export async function generateCareerRecommendations(profile: Profile): Promise<CareerPath[]> {
  await new Promise((r) => setTimeout(r, 2200 + Math.random() * 800));

  const scored = CAREERS.map((career) => ({
    career,
    score: scoreCareer(career, profile),
  })).sort((a, b) => b.score - a.score);

  const top3 = scored.slice(0, 3);

  return top3.map(({ career, score }) => ({
    title: career.title,
    matchExplanation: buildExplanation(career, profile, score),
    whySuitable: buildWhySuitable(career, profile),
    skillsToLearn: career.coreSkillsToLearn,
    nextSteps: career.nextSteps,
    matchScore: score,
  }));
}
