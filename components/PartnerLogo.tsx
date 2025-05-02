import Image from "next/image"

interface PartnerLogoProps {
  src: string
  alt: string
  bgColor?: string
}

export function PartnerLogo({ src, alt, bgColor = "bg-white" }: PartnerLogoProps) {
  return (
    <div className={`${bgColor} p-6 flex justify-center items-center h-48 rounded-t-lg`}>
      <div className="relative w-full h-full">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  )
}
