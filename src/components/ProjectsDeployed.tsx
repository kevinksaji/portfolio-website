"use client"

import { motion } from 'framer-motion'

export default function ProjectsDeployed() {
  const projectsCount = 2

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-4">Live Projects</h3>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">
            {projectsCount}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
