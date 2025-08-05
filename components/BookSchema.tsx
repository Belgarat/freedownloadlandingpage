export default function BookSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": "Fish Cannot Carry Guns",
    "author": {
      "@type": "Person",
      "name": "Michael B. Morgan"
    },
    "description": "A collection of speculative short stories that delve into how technology fractures identity, erodes trust, and distorts reality. For fans of Black Mirror, cyberpunk noir, and fringe futurism.",
    "genre": ["Science Fiction", "Speculative Fiction", "Cyberpunk"],
    "publisher": {
      "@type": "Organization",
      "name": "3/7 Indie Lab"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://fishcannotcarryguns.aroundscifi.us"
    },
    "image": "https://fishcannotcarryguns.aroundscifi.us/ebook_cover.webp",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "1"
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
} 