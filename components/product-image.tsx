'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Skeleton } from './ui/skeleton'

interface ProductImageProps {
  src: string
  alt: string
  priority?: boolean
}

export function ProductImage({ src, alt, priority = false }: ProductImageProps) {
  const [imgError, setImgError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const handleError = () => {
    setImgError(true)
    setIsLoading(false) // 에러 시에도 로딩 종료
  }
  
  return (
    <>
      {isLoading && <Skeleton className="absolute inset-0 z-10" />}
      <Image
        src={imgError ? "/placeholder-product.svg" : (src || "/placeholder-product.svg")}
        alt={alt}
        fill
        className={`object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        onLoad={() => setIsLoading(false)}
        onError={handleError}
      />
    </>
  )
}

