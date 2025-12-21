"use client"

import Image from 'next/image'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  className?: string
}

export default function ProfilePicture({ className }: Props) {
  const profiles = useMemo(() => [
    {
      image: "/kevin-headshot.jpg",
      alt: "Kevin Saji",
      title: "Software Engineer"
    },
    {
      image: "/kevin-floorball-homepage.jpg",
      alt: "Kevin Saji - Sportsman",
      title: "Sportsman"
    },
    {
      image: "/kevin-family.jpg",
      alt: "Kevin Saji - Family",
      title: "Family Guy"
    }
  ], []);
  const profile = profiles[0]

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-3 sm:p-4 md:p-5 lg:p-5 shadow-lg hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <div className="h-full flex flex-col justify-center text-center">
        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-foreground mb-3 sm:mb-4">Profile</h3>

        <div className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 lg:space-y-5">
          <div className="w-full max-w-[14rem] sm:max-w-[15rem] md:max-w-[16rem] lg:max-w-[18rem] xl:max-w-[20rem] aspect-[7/6] rounded-2xl overflow-hidden relative">
            <Image
              src={profile.image}
              alt={profile.alt}
              width={224}
              height={192}
              className="w-full h-full object-cover"
              priority
              loading="eager"
              sizes="(max-width: 640px) 192px, (max-width: 768px) 208px, 224px"
              quality={85}
            />
          </div>

          <div className="text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
              Kevin Saji
            </div>
            <div className="text-sm sm:text-base text-muted-foreground min-h-[1.5rem] flex items-center justify-center">
              <span className="inline-block">{profile.title}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
