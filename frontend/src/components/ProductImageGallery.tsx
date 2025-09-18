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
  
  // Debug logging
  console.log('ProductImageGallery Debug:', {
    mainImage,
    additionalImages,
    additionalImagesLength: additionalImages.length,
    productName,
    imageUrls: additionalImages.map(img => img.url),
    allImagesCount: [mainImage, ...additionalImages.map(img => img.url)].length
  })
  
  // Clean up image URLs by decoding HTML entities
  const cleanUrl = (url: string) => {
    return url.replace(/&quot;/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim()
  }
  
  const allImageUrls = [cleanUrl(mainImage), ...additionalImages.map(img => cleanUrl(img.url))]
  
  console.log('All images debug:', {
    mainImage,
    additionalImageUrls: additionalImages.map(img => img.url),
    allImageUrls,
    totalCount: allImageUrls.length
  })

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
      {allImageUrls.length > 1 && (
        <div>
          <p className="text-sm text-gray-500 mb-2">Showing {allImageUrls.length} images</p>
          <div className="flex gap-2 justify-start overflow-x-auto pb-2" style={{maxWidth: '100%'}}>
            {allImageUrls.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`w-16 h-16 min-w-16 rounded border-2 overflow-hidden flex-shrink-0 bg-gray-100 ${
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
        </div>
      )}
    </div>
  )
}

export default ProductImageGallery