import React, { useState } from 'react'

interface ProductImageGalleryProps {
  mainImage: string
  additionalImages?: { url: string }[]
  productName: string
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  mainImage,
  additionalImages = [],
  productName
}) => {
  const [selectedImage, setSelectedImage] = useState(mainImage)
  
  const allImages = [mainImage, ...additionalImages.map(img => img.url)]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square w-full">
        <img
          src={selectedImage}
          alt={productName}
          className="w-full h-full object-cover rounded-lg border"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg'
          }}
        />
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="flex gap-2 justify-center flex-wrap">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`w-16 h-16 rounded border-2 overflow-hidden ${
                selectedImage === image 
                  ? 'border-blue-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg'
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImageGallery