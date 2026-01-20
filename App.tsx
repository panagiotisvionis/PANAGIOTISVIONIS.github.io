
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Briefcase, Globe, Zap, Code, Mail, Menu, X, ExternalLink, BookOpen, Database, Cpu, Layers, Terminal, Binary, Microscope } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ProjectCard from './components/ProjectCard';
import AIChat from './components/AIChat';
import { Project } from './types';

type Language = 'en' | 'el';
type LocalizedText = { en: string; el: string };

const PROJECT_DATA: Array<{
  id: string;
  title: LocalizedText;
  category: LocalizedText;
  image: string;
  year: string;
  description: LocalizedText;
  techStack: string[];
  link?: string;
}> = [
  {
    id: 'kdhf-erp',
    title: { en: 'KDHF ERP Platform', el: 'Πλατφόρμα KDHF ERP' },
    category: { en: 'Private ERP', el: 'Ιδιωτικό ERP' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Private ERP suite for internal operations, reporting, and workflow automation.',
      el: 'Ιδιωτική σουίτα ERP για εσωτερικές λειτουργίες, αναφορές και αυτοματοποίηση ροών εργασίας.'
    },
    techStack: ['HTML', 'CSS', 'ERP']
    ,
    link: 'https://www.portal-lysos.gr'
  },
  {
    id: 'portfolio-site',
    title: { en: 'Personal Portfolio Site', el: 'Προσωπικό Portfolio' },
    category: { en: 'Web Experience', el: 'Web Experience' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Interactive personal website built with TypeScript and motion-driven UI.',
      el: 'Διαδραστικό προσωπικό site με TypeScript και δυναμικό UI.'
    },
    techStack: ['TypeScript', 'React', 'Vite'],
    link: 'https://panagiotisvionis.github.io'
  },
  {
    id: 'psychotherapy-christidou',
    title: { en: 'Psychotherapy Christidou', el: 'Psychotherapy Christidou' },
    category: { en: 'Full Stack Web Dev', el: 'Full Stack Web Dev' },
    year: '2024',
    image: 'https://psychotherapy-schristidou.gr/7.jpg',
    description: {
      en: 'Official website for psychotherapist S. Christidou with a clean, responsive UI.',
      el: 'Επίσημος ιστότοπος για την ψυχοθεραπεύτρια Σ. Χριστίδου με καθαρό, responsive UI.'
    },
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    link: 'https://psychotherapy-schristidou.gr/'
  },
  {
    id: 'gmail-follow-up',
    title: { en: 'Gmail Auto Follow-Up', el: 'Gmail Auto Follow-Up' },
    category: { en: 'Automation', el: 'Αυτοματοποίηση' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Tracks sent emails and sends polite follow-ups via the Gmail API.',
      el: 'Παρακολούθηση απεσταλμένων emails και αυτόματα follow-ups μέσω Gmail API.'
    },
    techStack: ['Python', 'Gmail API'],
    link: 'https://github.com/panagiotisvionis/Gmail-Auto-Follow-Up-with-Python'
  },
  {
    id: 'arduino-tinkercad',
    title: { en: 'Arduino Tinkercad Circuits', el: 'Arduino Tinkercad Circuits' },
    category: { en: 'IoT & Electronics', el: 'IoT & Ηλεκτρονικά' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Educational circuit designs with Arduino and Tinkercad simulations.',
      el: 'Εκπαιδευτικά κυκλώματα με Arduino και προσομοιώσεις Tinkercad.'
    },
    techStack: ['Arduino', 'Tinkercad'],
    link: 'https://github.com/panagiotisvionis/Arduino---Tinkercad-Circuit-Projects'
  },
  {
    id: 'mycenae-app',
    title: { en: 'Mycenae Educational App', el: 'Εκπαιδευτική Εφαρμογή για τις Μυκήνες' },
    category: { en: 'Mobile App', el: 'Εφαρμογή για Κινητά' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Android app with visuals, audio, and web content on ancient Mycenae.',
      el: 'Android εφαρμογή με οπτικό υλικό, ήχο και web περιεχόμενο για τις Μυκήνες.'
    },
    techStack: ['MIT App Inventor', 'Android'],
    link: 'https://github.com/panagiotisvionis/Mycenae_Project_App_Invertor'
  },
  {
    id: 'climate-change-app',
    title: { en: 'Climate Change App', el: 'Εφαρμογή για την Κλιματική Αλλαγή' },
    category: { en: 'Mobile App', el: 'Εφαρμογή Κινητού' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Android app promoting climate change awareness and education.',
      el: 'Android εφαρμογή ενημέρωσης και εκπαίδευσης για την κλιματική αλλαγή.'
    },
    techStack: ['MIT App Inventor', 'Android'],
    link: 'https://github.com/panagiotisvionis/Climate_Change_App_Invertor'
  },
  {
    id: 'nft-smart-contracts',
    title: { en: 'NFT Smart Contracts', el: 'NFT Smart Contracts' },
    category: { en: 'Web3 Development', el: 'Web3 Ανάπτυξη' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Development, testing, and deployment of Ethereum NFT contracts.',
      el: 'Ανάπτυξη, δοκιμή και ανάπτυξη NFT συμβολαίων στο Ethereum.'
    },
    techStack: ['Solidity', 'Hardhat', 'JavaScript'],
    link: 'https://github.com/panagiotisvionis/NFT-Smart-Contract-Project'
  },
  {
    id: 'open-api',
    title: { en: 'Prime Factorization API', el: 'API Παραγοντοποίησης' },
    category: { en: 'Backend API', el: 'Backend API' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Flask API with OpenAPI 3.0 documentation for prime factorization.',
      el: 'API σε Flask με τεκμηρίωση OpenAPI 3.0 για παραγοντοποίηση.'
    },
    techStack: ['Python', 'Flask', 'OpenAPI'],
    link: 'https://github.com/panagiotisvionis/Open-Api'
  },
  {
    id: 'robot-room-navigation',
    title: { en: 'Robot Room Navigation', el: 'Robot Room Navigation' },
    category: { en: 'Robotics', el: 'Ρομποτική' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Arduino-based robot with corridor-following and room-exit modes.',
      el: 'Ρομπότ με Arduino και λειτουργίες ακολουθίας διαδρόμου/εξόδου δωματίου.'
    },
    techStack: ['C++', 'Arduino'],
    link: 'https://github.com/panagiotisvionis/RobotRoomNavigation'
  },
  {
    id: 'rec-dapp-ethereum',
    title: { en: 'REC DApp (Ethereum)', el: 'REC DApp (Ethereum)' },
    category: { en: 'Web3 Development', el: 'Web3 Ανάπτυξη' },
    year: '2025',
    image: 'https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Decentralized app prototype for Renewable Energy Certificates on Ethereum.',
      el: 'Πρωτότυπο DApp για Ανανεώσιμα Πιστοποιητικά Ενέργειας στο Ethereum.'
    },
    techStack: ['Solidity', 'Truffle', 'JavaScript'],
    link: 'https://github.com/panagiotisvionis/REC_Dapp_Ethereum'
  },
  {
    id: 'rec-dapp-solana',
    title: { en: 'REC DApp (Solana)', el: 'REC DApp (Solana)' },
    category: { en: 'Web3 Development', el: 'Web3 Ανάπτυξη' },
    year: '2024',
    image: 'https://images.unsplash.com/photo-1644018335954-ab54c83e007f?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Solana DApp prototype using Rust and Anchor for REC workflows.',
      el: 'DApp σε Solana με Rust και Anchor για διαδικασίες REC.'
    },
    techStack: ['Rust', 'Anchor', 'Solana'],
    link: 'https://github.com/panagiotisvionis/REC_Dapp_Solana'
  },
  {
    id: 'wallet-integration',
    title: { en: 'Wallet Integration', el: 'Wallet Integration' },
    category: { en: 'Web3 Integration', el: 'Web3 Ενσωμάτωση' },
    year: '2024',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Wallet connection experiments for Ethereum-based apps.',
      el: 'Δοκιμές σύνδεσης wallet για εφαρμογές Ethereum.'
    },
    techStack: ['JavaScript', 'Web3'],
    link: 'https://github.com/panagiotisvionis/Wallet-Integration'
  },
  {
    id: 'blockchain-review',
    title: {
      en: 'Blockchain in Energy Review',
      el: 'Ανασκόπηση Blockchain στην Ενέργεια'
    },
    category: { en: 'Scientific Publication', el: 'Επιστημονική Δημοσίευση' },
    year: '2024',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    description: {
      en: 'Review paper on blockchain technology and smart contracts in energy.',
      el: 'Μελέτη ανασκόπησης για blockchain και smart contracts στην ενέργεια.'
    },
    techStack: ['Research', 'Blockchain'],
    link: 'https://doi.org/10.3390/app14010253'
  }
];

const SKILLS = [
  { name: 'Solidity', icon: Binary },
  { name: 'Rust', icon: Cpu },
  { name: 'Python', icon: Code },
  { name: 'Web3', icon: Globe },
  { name: 'SQL/NoSQL', icon: Database },
  { name: 'ERP', icon: Terminal },
];

const COPY = {
  en: {
    nav: { work: 'Work', skills: 'Skills', education: 'Profile' },
    buttons: {
      contact: 'Contact',
      email: 'Email Me',
      viewProject: 'View Project',
      language: 'EN / GR'
    },
    hero: {
      location: 'Based in Kalamata',
      role: 'R&D & Solution Engineer',
      headline: 'Architecting the future of Blockchain, AI & Enterprise ERP.',
      subline: 'R&D Specialist at Lysos Garden | Researcher at University of Peloponnese.'
    },
    work: { title: 'Portfolio', accent: 'Selection' },
    education: {
      title: 'Experience',
      subtitle: 'Career & Academia',
      educationTitle: 'Education',
      experienceTitle: 'Professional Experience',
      talksTitle: 'Selected Talks / Presentations',
      inProgressTitle: 'In Progress',
      skillsTitle: 'Technical Skills',
      researchTitle: 'Research Interests',
      publicationsTitle: 'Scientific Publications',
      additionalProjectsTitle: 'Additional Projects',
      developmentTitle: 'Professional Development'
    },
    footer: {
      title: 'Dr Panagiotis Vionis', 
      subtitle: 'Solution Engineer & Researcher.',
      location: 'Kalamata, Greece.',
      copyright: '2025 Panagiotis Vionis - Digital Portfolio'
    }
  },
  el: {
    nav: { work: 'Εργα', skills: 'Δεξιότητες', education: 'Προφίλ' },
    buttons: {
      contact: 'Επικοινωνία',
      email: 'Στείλε Email',
      viewProject: 'Προβολή Project',
      language: 'GR / EN'
    },
    hero: {
      location: 'ΒΑΣΗ: ΚΑΛΑΜΑΤΑ',
      role: 'R&D & SOLUTION ENGINEER',
      headline: 'Σχεδιάζοντας το μέλλον του Blockchain, της ΑΙ και των συστημάτων ERP.',
      subline: 'Solution Engineer στον Κήπο της Λυσούς | Διδάκτορας Πανεπιστημίου Πελοποννήσου.'
    },
    work: { title: 'Portfolio', accent: 'Επιλεγμένα' },
    education: {
      title: 'Εμπειρία',
      subtitle: 'Ακαδημαική Καριέρα',
      educationTitle: 'Σπουδές',
      experienceTitle: 'Επαγγελματική Εμπειρία',
      talksTitle: 'Ομιλίες / Παρουσιάσεις',
      inProgressTitle: 'Σε Εξέλιξη',
      skillsTitle: 'Τεχνικές Δεξιότητες',
      researchTitle: 'Ερευνητικά Ενδιαφέροντα',
      publicationsTitle: 'Επιστημονικές Δημοσιεύσεις',
      additionalProjectsTitle: 'Επιπλέον Projects',
      developmentTitle: 'Επαγγελματική Ανάπτυξη'
    },
    footer: {
      title: 'Dr Παναγιώτης Βιώνης',
      subtitle: 'Solution Engineer',
      location: 'Καλαμάτα, Ελλάδα.',
      copyright: '2025 Panagiotis Vionis - Digital Portfolio'
    }
  }
};

const CV = {
  education: [
    {
      year: '2022 - 2026',
      title: {
        en: 'Ph.D. in Blockchain Technology',
        el: 'Διδάκτορας στην Τεχνολογία Blockchain'
      },
      org: {
        en: 'University of Peloponnese, Department of Business Administration',
        el: 'Πανεπιστήμιο Πελοποννήσου, Τμήμα Διοίκησης Επιχειρήσεων'
      },
      detail: {
        en: 'Focus: "The Application of Blockchain Technology and Smart Contracts in the Energy Sector". Supervising committee: Ass. Prof. Theodore Kotsilieris (UoP), Prof. Ioannis Dimopoulos (UoP), Prof. Eustratios Georgopoulos (UoP).',
        el: 'Εστίαση: "Η Εφαρμογή της Τεχνολογίας Blockchain και των Smart Contracts στον Ενεργειακό Τομέα". Επιβλέπουσα επιτροπή: Αν. Καθ. Θεόδωρος Κοτσιλιέρης (ΠΠ), Καθ. Ιωάννης Δημόπουλος (ΠΠ), Καθ. Ευστράτιος Γεωργόπουλος (ΠΠ).'
      }
    },
    {
      year: '2020 - 2022',
      title: {
        en: 'M.Sc. in Technoeconomic Management Systems',
        el: 'M.Sc. στη Διοίκηση Τεχνοοικονομικών Συστημάτων'
      },
      org: {
        en: 'University of Peloponnese, Department of Business Administration',
        el: 'Πανεπιστήμιο Πελοποννήσου, Τμήμα Διοίκησης Επιχειρήσεων'
      },
      detail: {
        en: 'Thesis: "Blockchain Technology in Public Administration - An Approach for the Ministry of Transport".',
        el: 'Διπλωματική: "Τεχνολογία Blockchain στη Δημόσια Διοίκηση - Προσέγγιση για το Υπουργείο Μεταφορών".'
      }
    },
    {
      year: '2002 - 2008',
      title: {
        en: 'B.Sc. in Mathematics',
        el: 'Πτυχίο στα Μαθηματικά'
      },
      org: {
        en: 'University of Patras, Department of Mathematics',
        el: 'Πανεπιστήμιο Πατρών, Τμήμα Μαθηματικών'
      },
      detail: {
        en: 'Undergraduate studies in Mathematics.',
        el: 'Προπτυχιακές σπουδές στα Μαθηματικά.'
      }
    }
  ],
  experience: [
    {
      year: '2023 - Now',
      title: {
        en: 'Instructor of Quantitative Methods',
        el: 'Διδάσκων Ποσοτικών Μεθόδων'
      },
      org: {
        en: 'University of Peloponnese, Department of Business Administration',
        el: 'Πανεπιστήμιο Πελοποννήσου, Τμήμα Διοίκησης Επιχειρήσεων'
      },
      bullets: [
        { en: 'Quantitative Analysis and Statistical Techniques', el: 'Ποσοτική Ανάλυση και Στατιστικές Τεχνικές' },
        { en: 'Data-Driven Decision Making', el: 'Λήψη Αποφάσεων βάσει Δεδομένων' },
        { en: 'Curriculum Development and Innovation', el: 'Ανάπτυξη και Καινοτομία Προγράμματος Σπουδών' }
      ]
    },
    {
      year: '2023',
      title: {
        en: 'Research and Development Team Member',
        el: 'Μέλος Ομάδας Έρευνας και Ανάπτυξης'
      },
      org: {
        en: 'University of Peloponnese, Department of Business Administration',
        el: 'Πανεπιστήμιο Πελοποννήσου, Τμήμα Διοίκησης Επιχειρήσεων'
      },
      bullets: [
        { en: 'Innovative Blockchain Solutions', el: 'Καινοτόμες Λύσεις Blockchain' },
        { en: 'Smart Contract Development and Optimization', el: 'Ανάπτυξη και Βελτιστοποίηση Smart Contracts' },
        { en: 'Decentralized Application (DApp) Development', el: 'Ανάπτυξη Αποκεντρωμένων Εφαρμογών (DApps)' },
        { en: 'Web Development with HTML and CSS', el: 'Web Development με HTML και CSS' },
        { en: 'Algorithm Design and Analysis', el: 'Σχεδίαση και Ανάλυση Αλγορίθμων' },
        { en: 'Statistical Analysis and Discrete Mathematics', el: 'Στατιστική Ανάλυση και Διακριτά Μαθηματικά' },
        { en: 'Cross-Disciplinary Collaboration and Thought Leadership', el: 'Διεπιστημονική Συνεργασία και Ερευνητική Καθοδήγηση' }
      ]
    },
    {
      year: '2021 - 2023',
      title: {
        en: 'Computer Science Tutor',
        el: 'Καθηγητής Πληροφορικής'
      },
      org: { en: 'IEK Delta, Kalamata', el: 'ΙΕΚ Δέλτα, Καλαμάτα' },
      bullets: [
        { en: 'Databases (SQL/NoSQL)', el: 'Βάσεις Δεδομένων (SQL/NoSQL)' },
        { en: 'Python Programming', el: 'Προγραμματισμός σε Python' },
        { en: 'Data Analysis and Automation', el: 'Ανάλυση Δεδομένων και Αυτοματισμοί' }
      ]
    },
    {
      year: '2008 -',
      title: { en: 'Mathematics Tutor', el: 'Καθηγητής Μαθηματικών' },
      org: { en: 'Private Practice', el: 'Ιδιαίτερα Μαθήματα' },
      bullets: [
        { en: 'Statistics, Calculus, Algebra, Geometry', el: 'Στατιστική, Ανάλυση, Άλγεβρα, Γεωμετρία' },
        { en: 'Discrete Mathematics', el: 'Διακριτά Μαθηματικά' }
      ]
    }
  ],
  talks: [
    {
      year: '2023',
      title: {
        en: '2nd Student Conference, Department of Accounting and Finance, University of Peloponnese',
        el: '2ο Φοιτητικό Συνέδριο, Τμήμα Λογιστικής και Χρηματοοικονομικής, Πανεπιστήμιο Πελοποννήσου'
      },
      detail: {
        en: '"The Potential of Blockchain Application in Enhancing Efficiency and Transparency in Public Administration with Emphasis on the Energy Sector."',
        el: '"Το δυναμικό της εφαρμογής του Blockchain στην ενίσχυση της αποδοτικότητας και της διαφάνειας στη Δημόσια Διοίκηση με έμφαση στον Ενεργειακό Τομέα."'
      }
    }
  ],
  inProgress: [
    { en: 'Ethereum and Solidity: The Complete Developers Guide — Stephen Grider (Udemy)', el: 'Ethereum and Solidity: The Complete Developers Guide — Stephen Grider (Udemy)' },
    { en: 'Learn Blockchain, Solidity and Full Stack Web3 Development with JavaScript — Patrick Collins (YouTube)', el: 'Learn Blockchain, Solidity and Full Stack Web3 Development with JavaScript — Patrick Collins (YouTube)' },
    { en: 'Code Your Own Cryptocurrency on Ethereum — Gregory McCubbin (Udemy)', el: 'Code Your Own Cryptocurrency on Ethereum — Gregory McCubbin (Udemy)' },
    { en: 'Python for Data Science and Machine Learning Bootcamp — Jose Portilla (Udemy)', el: 'Python for Data Science and Machine Learning Bootcamp — Jose Portilla (Udemy)' },
    { en: 'Jira Agile Project Management — Paul Ashun (Udemy)', el: 'Jira Agile Project Management — Paul Ashun (Udemy)' }
  ],
  skills: [
    { en: 'Operating Systems: Windows, Ubuntu', el: 'Λειτουργικά Συστήματα: Windows, Ubuntu' },
    { en: 'Programming: Python, Solidity, Rust, HTML5, CSS, JavaScript', el: 'Προγραμματισμός: Python, Solidity, Rust, HTML5, CSS, JavaScript' },
    { en: 'RDBMS: MySQL', el: 'RDBMS: MySQL' },
    { en: 'NRDBMS: MongoDB', el: 'NRDBMS: MongoDB' },
    { en: 'IDEs/Frameworks: Remix, Truffle, EVM, Anchor, PyCharm, VSCode', el: 'IDEs/Frameworks: Remix, Truffle, EVM, Anchor, PyCharm, VSCode' },
    { en: 'Agile tools: Jira, Confluence', el: 'Agile εργαλεία: Jira, Confluence' }
  ],
  research: [
    { en: 'Blockchain', el: 'Blockchain' },
    { en: 'Smart Contracts', el: 'Smart Contracts' },
    { en: 'DApps', el: 'DApps' },
    { en: 'Web3', el: 'Web3' },
    { en: 'AI', el: 'AI' },
    { en: 'Deep Learning', el: 'Deep Learning' },
    { en: 'Machine Learning', el: 'Machine Learning' },
    { en: 'IoT', el: 'IoT' }
  ],
  publications: [
    {
      year: '2024',
      title: {
        en: 'The Potential of Blockchain Technology and Smart Contracts in the Energy Sector: A Review',
        el: 'The Potential of Blockchain Technology and Smart Contracts in the Energy Sector: A Review'
      },
      detail: {
        en: 'Vionis, P.; Kotsilieris, T. Appl. Sci. 2024, 14, 253.',
        el: 'Vionis, P.; Kotsilieris, T. Appl. Sci. 2024, 14, 253.'
      },
      link: 'https://doi.org/10.3390/app14010253'
    },
    {
      year: '2025',
      title: {
        en: 'Revolutionizing REC management: comparative study of Solana and Ethereum blockchain implementations',
        el: 'Revolutionizing REC management: comparative study of Solana and Ethereum blockchain implementations'
      },
      detail: {
        en: 'Vionis, P.; Livieris, I. E.; Kotsilieris, T. Electrical Engineering (2026) 108:69. Published 20 Dec 2025.',
        el: 'Vionis, P.; Livieris, I. E.; Kotsilieris, T. Electrical Engineering (2026) 108:69. Δημοσίευση 20 Δεκ 2025.'
      },
      link: 'https://link.springer.com/article/10.1007/s00202-025-03402-2'
    }
  ],
  additionalProjects: [
    {
      year: '2024',
      detail: {
        en: 'Developed a decentralized application (DApp) using Rust and the Anchor framework on the Solana network (Ubuntu).',
        el: 'Ανάπτυξη αποκεντρωμένης εφαρμογής (DApp) με Rust και Anchor στο Solana (Ubuntu).'
      },
      link: 'https://github.com/panagiotisvionis/REC_Dapp_Solana'
    },
    {
      year: '2023',
      detail: {
        en: 'Developed a decentralized application (DApp) using Solidity and the Truffle framework on Ethereum Sepolia testnet.',
        el: 'Ανάπτυξη αποκεντρωμένης εφαρμογής (DApp) με Solidity και Truffle στο Ethereum Sepolia testnet.'
      },
      link: 'https://github.com/panagiotisvionis/REC_Dapp_Ethereum'
    }
  ],
  development: [
    {
      date: '04/2024',
      title: {
        en: 'Blockchain Developer Bootcamp with Rust + JavaScript',
        el: 'Blockchain Developer Bootcamp με Rust + JavaScript'
      },
      provider: { en: 'Learn With Arjun, Udemy', el: 'Learn With Arjun, Udemy' },
      bullets: ['Web3', 'DApps', 'NFTs', 'DeFi', 'React', 'Anchor', 'Mocha']
    },
    {
      date: '09/2023',
      title: { en: 'Building an Ethereum Blockchain App', el: 'Building an Ethereum Blockchain App' },
      provider: { en: 'Michael Solomon, LinkedIn', el: 'Michael Solomon, LinkedIn' },
      bullets: ['Ethereum Virtual Machine (EVM)', 'Ethereum Wallets', 'Ganache', 'Truffle', 'Solidity']
    },
    {
      date: '09/2023',
      title: { en: 'Blockchain and Smart Contract Security', el: 'Blockchain and Smart Contract Security' },
      provider: { en: 'Sam Sehgal, LinkedIn', el: 'Sam Sehgal, LinkedIn' },
      bullets: [
        'Proof of Work protocol attacks',
        'Proof of Stake protocol attacks',
        'Smart Contract Threats',
        'Secure Design',
        'Blockchain Ecosystem Threats'
      ]
    },
    {
      date: '09/2023',
      title: { en: 'Smart Contract Developer Full Course', el: 'Smart Contract Developer Full Course' },
      provider: { en: 'Freshman, LearnWeb3.io', el: 'Freshman, LearnWeb3.io' },
      bullets: ['Solidity', 'ERC 20', 'ERC 721', 'Hardhat']
    }
  ]
};


const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const t = COPY[language];
  const projects: Project[] = PROJECT_DATA.map((project) => ({
    ...project,
    title: project.title[language],
    category: project.category[language],
    description: project.description[language]
  }));

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'work', label: t.work.title },
    { id: 'skills', label: t.nav.skills },
    { id: 'education', label: t.education.educationTitle },
    { id: 'education-experience', label: t.education.experienceTitle }
  ];
  
  return (
    <div className="relative min-h-screen text-white selection:bg-[#4fb7b3] selection:text-black cursor-auto md:cursor-none overflow-x-hidden bg-[#1a1b3b]">
      <CustomCursor />
      <FluidBackground />
      <AIChat />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50">PANAGIOTIS VIONIS</div>
        
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="hover:text-[#a8fbd3] transition-colors text-white cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
            className="border border-white/60 px-4 py-2 text-[11px] font-bold tracking-widest uppercase text-white hover:bg-white hover:text-black transition-all duration-300"
            data-hover="true"
          >
            {t.buttons.language}
          </button>
          <a
            href="mailto:panagiotisvionis@gmail.com"
            className="border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer no-underline"
            data-hover="true"
          >
            {t.buttons.contact}
          </a>
        </div>

        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#1a1b3b]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-4xl font-heading font-bold text-white hover:text-[#a8fbd3] transition-colors uppercase bg-transparent border-none"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setLanguage(language === 'en' ? 'el' : 'en')}
              className="text-xl font-bold text-[#a8fbd3] uppercase tracking-widest"
            >
              {t.buttons.language}
            </button>
            <a href="mailto:panagiotisvionis@gmail.com" className="text-xl font-bold text-[#a8fbd3] uppercase tracking-widest">{t.buttons.email}</a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div style={{ y, opacity }} className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 text-xs md:text-base font-mono text-[#a8fbd3] tracking-[0.3em] uppercase mb-4 bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm"
          >
            <span>{t.hero.location}</span>
            <span className="w-1.5 h-1.5 bg-[#4fb7b3] rounded-full animate-pulse"/>
            <span>{t.hero.role}</span>
          </motion.div>

          <div className="relative w-full flex justify-center items-center">
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-2xl font-light max-w-4xl mx-auto text-white/90 leading-relaxed mt-6"
          >
            {t.hero.headline} <br className="hidden md:block"/>
            {t.hero.subline}
          </motion.p>
        </motion.div>
      </header>

      {/* SKILLS SECTION */}
      <section id="skills" className="relative z-10 py-16 bg-black/40 backdrop-blur-md border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {SKILLS.map((skill, i) => (
              <div key={i} className="flex flex-col items-center group cursor-default" data-hover="true">
                <skill.icon className="w-10 h-10 mb-4 text-white/30 group-hover:text-[#a8fbd3] transition-colors duration-500" />
                <span className="text-xs font-bold tracking-widest uppercase opacity-50 group-hover:opacity-100 transition-opacity">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK SECTION */}
      <section id="work" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16">
             <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9]">
              {t.work.title} <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">{t.work.accent}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <section id="education" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-20 text-white uppercase">{t.education.title}</h2>
            <p className="text-[#a8fbd3] font-mono uppercase tracking-widest -mt-8 relative z-10 text-sm md:text-base">{t.education.subtitle}</p>
          </div>

          <div className="space-y-14">
            <div>
              <h3 id="education-studies" className="text-2xl md:text-3xl font-heading font-bold mb-6 uppercase">{t.education.educationTitle}</h3>
              <div className="space-y-4">
                {CV.education.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group p-6 border border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row gap-6"
                  >
                    <div className="text-sm font-mono font-bold text-[#4fb7b3] md:w-40">{item.year}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-heading font-bold mb-2 group-hover:text-[#a8fbd3] transition-colors">{item.title[language]}</h4>
                      <div className="text-white/60 mb-2 font-bold">{item.org[language]}</div>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.detail[language]}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 id="education-experience" className="text-2xl md:text-3xl font-heading font-bold mb-6 uppercase">{t.education.experienceTitle}</h3>
              <div className="space-y-4">
                {CV.experience.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="group p-6 border border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row gap-6"
                  >
                    <div className="text-sm font-mono font-bold text-[#4fb7b3] md:w-40">{item.year}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-heading font-bold mb-2 group-hover:text-[#a8fbd3] transition-colors">{item.title[language]}</h4>
                      <div className="text-white/60 mb-2 font-bold">{item.org[language]}</div>
                      <ul className="text-gray-300 text-sm leading-relaxed space-y-2">
                        {item.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="mt-2 h-1.5 w-1.5 bg-[#4fb7b3] rounded-full" />
                            <span>{bullet[language]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 id="education-talks" className="text-xl font-heading font-bold mb-4 uppercase">{t.education.talksTitle}</h3>
                <div className="space-y-4">
                  {CV.talks.map((item, i) => (
                    <div key={i} className="p-5 border border-white/10 bg-white/5 backdrop-blur-md">
                      <div className="text-sm font-mono text-[#4fb7b3] mb-2">{item.year}</div>
                      <div className="text-white font-bold mb-2">{item.title[language]}</div>
                      <p className="text-gray-400 text-sm">{item.detail[language]}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 id="education-in-progress" className="text-xl font-heading font-bold mb-4 uppercase">{t.education.inProgressTitle}</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  {CV.inProgress.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-[#4fb7b3] rounded-full" />
                      <span>{item[language]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 id="education-skills" className="text-xl font-heading font-bold mb-4 uppercase">{t.education.skillsTitle}</h3>
                <ul className="space-y-3 text-gray-300 text-sm">
                  {CV.skills.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 bg-[#4fb7b3] rounded-full" />
                      <span>{item[language]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 id="education-research" className="text-xl font-heading font-bold mb-4 uppercase">{t.education.researchTitle}</h3>
                <div className="flex flex-wrap gap-2">
                  {CV.research.map((item, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-[#a8fbd3]">
                      {item[language]}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 id="education-publications" className="text-xl font-heading font-bold mb-4 uppercase">{t.education.publicationsTitle}</h3>
                <div className="space-y-4">
                  {CV.publications.map((item, i) => (
                    <div key={i} className="p-5 border border-white/10 bg-white/5 backdrop-blur-md">
                      <div className="text-sm font-mono text-[#4fb7b3] mb-2">{item.year}</div>
                      <div className="text-white font-bold mb-1">{item.title[language]}</div>
                      <div className="text-gray-400 text-sm mb-2">{item.detail[language]}</div>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#a8fbd3] text-sm font-mono no-underline hover:text-white">
                        {item.link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 id="education-projects" className="text-xl font-heading font-bold mb-4 uppercase">{t.education.additionalProjectsTitle}</h3>
                <div className="space-y-4">
                  {CV.additionalProjects.map((item, i) => (
                    <div key={i} className="p-5 border border-white/10 bg-white/5 backdrop-blur-md">
                      <div className="text-sm font-mono text-[#4fb7b3] mb-2">{item.year}</div>
                      <div className="text-gray-300 text-sm mb-2">{item.detail[language]}</div>
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#a8fbd3] text-sm font-mono no-underline hover:text-white">
                        {item.link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 id="education-development" className="text-2xl md:text-3xl font-heading font-bold mb-6 uppercase">{t.education.developmentTitle}</h3>
              <div className="space-y-4">
                {CV.development.map((item, i) => (
                  <div key={i} className="p-6 border border-white/10 bg-white/5 backdrop-blur-md">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <div className="text-sm font-mono text-[#4fb7b3]">{item.date}</div>
                      <div className="text-white/70 text-sm font-mono">{item.provider[language]}</div>
                    </div>
                    <div className="text-white font-bold mb-3">{item.title[language]}</div>
                    <div className="flex flex-wrap gap-2">
                      {item.bullets.map((bullet) => (
                        <span key={bullet} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-[#a8fbd3]">
                          {bullet}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="relative z-10 border-t border-white/10 py-16 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
             <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white uppercase">{t.footer.title}</div>
             <p className="text-gray-400 text-sm max-w-sm">{t.footer.subtitle} <br/>{t.footer.location}</p>
          </div>
          <div className="flex gap-8">
            <a href="https://github.com/panagiotisvionis" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors no-underline">GitHub</a>
            <a href="https://linkedin.com/in/panagiotis-vionis-6b6321143" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors no-underline">LinkedIn</a>
            <a href="mailto:panagiotisvionis@gmail.com" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors no-underline">Email</a>
          </div>
        </div>
        <div className="mt-12 text-center text-[10px] text-white/20 uppercase tracking-[0.5em]">© {t.footer.copyright}</div>
      </footer>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-[#1a1b3b] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl"
            >
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors">
                <X className="w-6 h-6" />
              </button>

              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <img src={selectedProject.image} alt={selectedProject.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[#4fb7b3] mb-4">
                   <span className="font-mono text-sm tracking-widest uppercase">{selectedProject.year}</span>
                   <span className="text-white/20">|</span>
                   <span className="font-mono text-sm tracking-widest uppercase">{selectedProject.category}</span>
                </div>
                <h3 className="text-3xl md:text-5xl font-heading font-bold uppercase leading-none mb-6 text-white">{selectedProject.title}</h3>
                <p className="text-gray-300 leading-relaxed text-lg font-light mb-8">{selectedProject.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-mono text-[#a8fbd3]">{tech}</span>
                  ))}
                </div>

                {selectedProject.link && selectedProject.link !== '#' && (
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white font-bold uppercase tracking-widest hover:text-[#4fb7b3] transition-colors no-underline group"
                  >
                    {t.buttons.viewProject} <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
