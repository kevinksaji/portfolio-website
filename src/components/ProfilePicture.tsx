"use client"

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ProfilePicture() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-card border border-border rounded-xl p-3 sm:p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 min-w-[180px] sm:min-w-[220px] md:min-w-[260px]"
    >
      <div className="text-center">
        <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-3 sm:mb-4 md:mb-6">Profile</h3>
        
        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 md:space-y-6">
          <div className="w-40 sm:w-44 md:w-48 h-40 sm:h-44 md:h-48 rounded-full overflow-hidden border-2 border-border">
            <Image
              src="/kevin-headshot.jpg"
              alt="Kevin Saji"
              width={192}
              height={192}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
              Kevin Saji
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground">
              Software Engineer
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
