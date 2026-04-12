export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  tags: string[];
}

export const MENU_DATA: Dish[] = [
  {
    id: 'sushi-1',
    name: 'Imperial Gold Nigiri',
    description: 'Triple-marbled fatty tuna, gold leaf, aged soy glaze over koshihikari rice.',
    price: '28',
    category: 'Sushi',
    tags: ['Signature', 'Rare'],
  },
  {
    id: 'sushi-2',
    name: 'Hokkaido Uni Ritual',
    description: 'Fresh sea urchin from Hokkaido, washi-wrapped seaweed, shiso flower.',
    price: '34',
    category: 'Sushi',
    tags: ['Premium'],
  },
  {
    id: 'ramen-1',
    name: 'Kuro-Shoyu Ramen',
    description: '12-hour black chicken broth, truffle paste, hand-cut noodles, gold-brushed chashu.',
    price: '42',
    category: 'Ramen',
    tags: ['Artisan'],
  },
  {
    id: 'wagyu-1',
    name: 'A5 Miyazakigyu',
    description: 'A5 Wagyu seared over Binchotan charcoal, sea salt, wasabi root.',
    price: '85',
    category: 'Grill',
    tags: ['Luxury'],
  }
];

export const CATEGORIES = ['Sushi', 'Ramen', 'Grill', 'Sake'];
