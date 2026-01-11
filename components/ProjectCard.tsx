
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { motion } from 'framer-motion';
import { Project } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <motion.div
      className="group relative h-[400px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-white/10 bg-black cursor-pointer"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          src={project.image} 
          alt={project.title} 
          className="h-full w-full object-cover grayscale will-change-transform"
          variants={{
            rest: { scale: 1, opacity: 0.5, filter: 'grayscale(100%)' },
            hover: { scale: 1.05, opacity: 0.8, filter: 'grayscale(0%)' }
          }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-[#4fb7b3]/10 transition-colors duration-500" />
      </div>

      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <span className="text-xs font-mono border border-white/30 px-3 py-1 rounded-full backdrop-blur-md">
             {project.year}
           </span>
           <motion.div
             variants={{ rest: { opacity: 0, x: 20 }, hover: { opacity: 1, x: 0 } }}
             className="bg-white text-black rounded-full p-2"
           >
             <ArrowUpRight className="w-6 h-6" />
           </motion.div>
        </div>

        <div>
          <motion.h3 
            className="font-heading text-3xl md:text-4xl font-bold uppercase text-white"
            variants={{ rest: { y: 0 }, hover: { y: -5 } }}
          >
            {project.title}
          </motion.h3>
          <motion.p 
            className="text-sm font-medium uppercase tracking-widest text-[#4fb7b3] mt-2"
            variants={{ rest: { opacity: 0, y: 10 }, hover: { opacity: 1, y: 0 } }}
          >
            {project.category}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
