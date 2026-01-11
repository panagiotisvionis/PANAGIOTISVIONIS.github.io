
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Briefcase, Globe, Zap, Code, Mail, Menu, X, ExternalLink, BookOpen, Database, Cpu, Layers, Terminal, Binary, Microscope } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ProjectCard from './components/ProjectCard';
import AIChat from './components/AIChat';
import { Project } from './types';

const PROJECTS: Project[] = [
  { 
    id: '1', 
    title: 'KDHΦ ERP Portal', 
    category: 'ERP / Solution Engineering', 
    year: '2025', 
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    description: 'Developed and implemented the ERP portal for "Kipos tis Lysos". A comprehensive solution for internal management and digital workflow optimization.',
    techStack: ['ERP', 'Solution Engineering', 'Business Logic'],
    link: 'https://www.portal-lysos.gr'
  },
  { 
    id: '2', 
    title: 'REC Management Research', 
    category: 'Springer Publication', 
    year: '2025', 
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1000&auto=format&fit=crop',
    description: 'Comparative study of Solana and Ethereum blockchain implementations for Renewable Energy Certificates management. Published in Springer Nature.',
    techStack: ['Solana', 'Ethereum', 'Blockchain Architecture'],
    link: 'https://link.springer.com/article/10.1007/s00202-025-03402-2' // Updated DOI from OCR/Context
  },
  { 
    id: '3', 
    title: 'Psychotherapy Christidou', 
    category: 'Full Stack Web Dev', 
    year: '2024', 
    image: "https://psychotherapy-schristidou.gr/7.jpg",
    description: 'Official platform for psychotherapist S. Christidou, featuring a clean, responsive design and professional UI/UX.',
    techStack: ['React', 'TypeScript', 'Tailwind CSS'],
    link: 'https://psychotherapy-schristidou.gr/'
  },
  { 
    id: '4', 
    title: 'Solana DApp / Anchor', 
    category: 'Web3 Development', 
    year: '2024', 
    image: 'https://images.unsplash.com/photo-1644018335954-ab54c83e007f?q=80&w=1000&auto=format&fit=crop',
    description: 'Decentralized application built on Solana using Rust. High-performance smart contracts for asset tracking.',
    techStack: ['Rust', 'Anchor', 'Solana'],
    link: 'https://github.com/panagiotisvionis'
  },
  { 
    id: '5', 
    title: 'Blockchain in Energy', 
    category: 'Academic Review', 
    year: '2024', 
    image: 'https://images.unsplash.com/photo-1621504450181-5d356f63d3ee?q=80&w=1000&auto=format&fit=crop',
    description: 'Scientific review on the application of blockchain and smart contracts in the energy sector.',
    techStack: ['Research', 'Smart Contracts', 'Energy'],
    link: 'https://doi.org/10.3390/app14010253'
  },
  { 
    id: '6', 
    title: 'Quantitative Methods', 
    category: 'Teaching Portfolio', 
    year: '2023', 
    image: 'https://images.unsplash.com/photo-1509228468518-180dd48a579a?q=80&w=1000&auto=format&fit=crop',
    description: 'Curriculum development and statistical instruction at the University of Peloponnese.',
    techStack: ['Statistics', 'Mathematics', 'SPSS'],
    link: '#'
  },
];

const SKILLS = [
  { name: 'Solidity', icon: Binary },
  { name: 'Rust', icon: Cpu },
  { name: 'Python', icon: Code },
  { name: 'React/TS', icon: Layers },
  { name: 'SQL/NoSQL', icon: Database },
  { name: 'ERP Systems', icon: Terminal },
];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
  
  return (
    <div className="relative min-h-screen text-white selection:bg-[#4fb7b3] selection:text-black cursor-auto md:cursor-none overflow-x-hidden bg-[#1a1b3b]">
      <CustomCursor />
      <FluidBackground />
      <AIChat />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50">PANAGIOTIS VIONIS</div>
        
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase">
          {['Work', 'Skills', 'Education'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-[#a8fbd3] transition-colors text-white cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {item}
            </button>
          ))}
        </div>
        <a 
          href="mailto:panagiotisvionis@gmail.com"
          className="hidden md:inline-block border border-white px-8 py-3 text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer no-underline"
          data-hover="true"
        >
          Contact
        </a>

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
            {['Work', 'Skills', 'Education'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-4xl font-heading font-bold text-white hover:text-[#a8fbd3] transition-colors uppercase bg-transparent border-none"
              >
                {item}
              </button>
            ))}
            <a href="mailto:panagiotisvionis@gmail.com" className="text-xl font-bold text-[#a8fbd3] uppercase tracking-widest">Email Me</a>
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
            <span>Based in Kalamata</span>
            <span className="w-1.5 h-1.5 bg-[#4fb7b3] rounded-full animate-pulse"/>
            <span>PhD Candidate & Solution Engineer</span>
          </motion.div>

          <div className="relative w-full flex justify-center items-center">
          </div>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-2xl font-light max-w-4xl mx-auto text-white/90 leading-relaxed mt-6"
          >
            Architecting the future of Blockchain & Enterprise ERP. <br className="hidden md:block"/>
            R&D Specialist at Kipos tis Lysos | Ph.D. Researcher at UoP.
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
              Portfolio <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a8fbd3] to-[#4fb7b3]">Selection</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
            {PROJECTS.map((project) => (
              <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <section id="education" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
             <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-20 text-white uppercase">Experience</h2>
             <p className="text-[#a8fbd3] font-mono uppercase tracking-widest -mt-8 relative z-10 text-sm md:text-base">Career & Academia</p>
          </div>
          
          <div className="space-y-6">
            {[
              { year: '2025 - Now', title: 'R&D / Solution Engineer', institution: 'Kipos tis Lysos (KDHΦ ERP)', desc: 'Leading ERP implementation, solution architecture, and R&D initiatives for digital transformation.' },
              { year: '2023 - 2025', title: 'Instructor of Quantitative Methods', institution: 'University of Peloponnese', desc: 'Curriculum development and delivery of Quantitative Analysis and Statistical Techniques.' },
              { year: '2022 - Now', title: 'PhD Candidate in Blockchain', institution: 'University of Peloponnese', desc: 'Research focus: Blockchain & Smart Contracts in the Energy Sector (REC Management).' },
              { year: '2021 - 2023', title: 'Computer Science Tutor', institution: 'IEK Delta', desc: 'Specialized in Databases (SQL/NoSQL), Python, Algorithm Design, and Web Development.' },
              { year: '2002 - 2008', title: 'B.Sc. in Mathematics', institution: 'University of Patras', desc: 'Graduated from the Department of Mathematics.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group p-8 border border-white/10 bg-white/5 backdrop-blur-md flex flex-col md:flex-row gap-8 items-center"
              >
                <div className="text-xl font-mono font-bold text-[#4fb7b3] md:w-48">{item.year}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-[#a8fbd3] transition-colors">{item.title}</h3>
                  <div className="text-white/60 mb-2 font-bold">{item.institution}</div>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-16 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
             <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white uppercase">PANAGIOTIS VIONIS</div>
             <p className="text-gray-400 text-sm max-w-sm">Solution Engineer & PhD Researcher. <br/>Kalamata, Greece.</p>
          </div>
          <div className="flex gap-8">
            <a href="https://github.com/panagiotisvionis" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors no-underline">GitHub</a>
            <a href="https://linkedin.com/in/panagiotis-vionis-6b6321143" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors no-underline">LinkedIn</a>
            <a href="mailto:panagiotisvionis@gmail.com" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors no-underline">Email</a>
          </div>
        </div>
        <div className="mt-12 text-center text-[10px] text-white/20 uppercase tracking-[0.5em]">© 2025 Panagiotis Vionis - Digital Portfolio</div>
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
                    View Live Project <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
