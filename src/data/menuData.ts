export interface Dish {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  price: string;
  category: string;
  tags: string[];
}

export const MENU_DATA: Dish[] = [
  {
    id: 'sushi-1',
    name: 'Imperial Gold Nigiri',
    nameAr: 'نيجيري الذهب الإمبراطوري',
    description: 'Triple-marbled fatty tuna, gold leaf, aged soy glaze over koshihikari rice.',
    descriptionAr: 'تونا دهنية رخامية ثلاثية، ورق ذهب، صلصة صويا معتقة فوق أرز كوشيهيكاري.',
    price: '28',
    category: 'Sushi',
    tags: ['Signature', 'Rare'],
  },
  {
    id: 'sushi-2',
    name: 'Hokkaido Uni Ritual',
    nameAr: 'طقوس أوني هوكايدو',
    description: 'Fresh sea urchin from Hokkaido, washi-wrapped seaweed, shiso flower.',
    descriptionAr: 'قنفذ بحر طازج من هوكايدو، عشب بحري مغلف بورق الواشي، زهرة الشيسو.',
    price: '34',
    category: 'Sushi',
    tags: ['Premium'],
  },
  {
    id: 'ramen-1',
    name: 'Kuro-Shoyu Ramen',
    nameAr: 'رامن كورو-شويو',
    description: '12-hour black chicken broth, truffle paste, hand-cut noodles, gold-brushed chashu.',
    descriptionAr: 'مرق دجاج أسود مطهو لمدة ١٢ ساعة، معجون ترافل، نودلز مقطعة يدوياً، تشاشو مطلي بالذهب.',
    price: '42',
    category: 'Ramen',
    tags: ['Artisan'],
  },
  {
    id: 'wagyu-1',
    name: 'A5 Miyazakigyu',
    nameAr: 'A5 ميازاكي-غيو',
    description: 'A5 Wagyu seared over Binchotan charcoal, sea salt, wasabi root.',
    descriptionAr: 'لحم واغيو A5 مشوي فوق فحم بينشوتان، ملح بحري، جذر واسابي.',
    price: '85',
    category: 'Grill',
    tags: ['Luxury'],
  }
];

export const CATEGORIES = ['Sushi', 'Ramen', 'Grill', 'Sake'];
