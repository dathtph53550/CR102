export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isHot?: boolean;
  isNew?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'The latest iPhone with A17 Pro chip, 48MP camera system, and titanium design.',
    price: 999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484bce71?q=80&w=2070&auto=format&fit=crop',
    category: 'Smartphones',
    rating: 4.8,
    reviews: 245,
    isHot: true,
    isNew: true
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Featuring a 200MP camera, Snapdragon 8 Gen 3, and advanced AI capabilities.',
    price: 1199,
    image: 'https://images.unsplash.com/photo-1707227156456-e5e6c9d7e7c5?q=80&w=2071&auto=format&fit=crop',
    category: 'Smartphones',
    rating: 4.7,
    reviews: 189,
    isHot: true
  },
  {
    id: '3',
    name: 'Google Pixel 8 Pro',
    description: 'With Tensor G3 chip, advanced computational photography, and 7 years of updates.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1696446702183-be9a86e34480?q=80&w=2070&auto=format&fit=crop',
    category: 'Smartphones',
    rating: 4.6,
    reviews: 156,
    isNew: true
  },
  {
    id: '4',
    name: 'OnePlus 12',
    description: 'Snapdragon 8 Gen 3, Hasselblad cameras, and 100W fast charging.',
    price: 799,
    image: 'https://images.unsplash.com/photo-1706886583624-2c0a0d9bf2a5?q=80&w=1974&auto=format&fit=crop',
    category: 'Smartphones',
    rating: 4.5,
    reviews: 132,
    isHot: true
  },
  {
    id: '5',
    name: 'Xiaomi 14 Ultra',
    description: 'Leica quad cameras, Snapdragon 8 Gen 3, and 120W HyperCharge.',
    price: 899,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2127&auto=format&fit=crop',
    category: 'Smartphones',
    rating: 4.4,
    reviews: 98,
    isNew: true
  },
  {
    id: '6',
    name: 'Nothing Phone 2',
    description: 'Unique Glyph Interface, clean software, and solid performance.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1690214392603-b5a3c73f24ed?q=80&w=2069&auto=format&fit=crop',
    category: 'Smartphones',
    rating: 4.3,
    reviews: 87
  },
  {
    id: '7',
    name: 'ASUS ROG Phone 8 Pro',
    description: 'Ultimate gaming phone with Snapdragon 8 Gen 3, 165Hz display, and AirTriggers.',
    price: 1099,
    image: 'https://images.unsplash.com/photo-1662219708489-dd8f9aea9dba?q=80&w=2127&auto=format&fit=crop',
    category: 'Smartphones',
    rating: 4.7,
    reviews: 76,
    isHot: true
  },
  {
    id: '8',
    name: 'Motorola Edge 50 Ultra',
    description: 'Curved pOLED display, 125W charging, and clean Android experience.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?q=80&w=2064&auto=format&fit=crop',
    category: 'Smartphones',
    rating: 4.2,
    reviews: 64
  }
];

export const getProductById = (id: string): Product | undefined => {
  return PRODUCTS.find(product => product.id === id);
};

export const getHotProducts = (): Product[] => {
  return PRODUCTS.filter(product => product.isHot);
};

export const getNewProducts = (): Product[] => {
  return PRODUCTS.filter(product => product.isNew);
};
