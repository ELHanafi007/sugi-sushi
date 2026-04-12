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
  // --- STARTERS ---
  {
    id: 'starter-1',
    name: 'Sugi Signature Salad',
    nameAr: 'سلطة سوجي المميزة',
    description: 'Fresh sea food selection, vermicile, mixed greens with house specialty dressing.',
    descriptionAr: 'تشكيلة مأكولات بحرية طازجة، نودلز الأرز، خضروات مشكلة مع صلصة سوجي الخاصة.',
    price: '48',
    category: 'Starters',
    tags: ['Signature', 'Fresh'],
  },
  {
    id: 'starter-2',
    name: 'Gyoza Shrimp',
    nameAr: 'جيوزا الجمبري',
    description: 'Handmade dumplings filled with seasoned shrimp, seared to perfection.',
    descriptionAr: 'فطائر محضرة يدوياً محشوة بالجمبري المتبل، مشوية بدقة.',
    price: '54',
    category: 'Starters',
    tags: ['Handmade'],
  },
  {
    id: 'starter-3',
    name: 'Miso Soup',
    nameAr: 'شوربة ميسو',
    description: 'Traditional Japanese miso broth with tofu, seaweed, and spring onion.',
    descriptionAr: 'مرق الميسو الياباني التقليدي مع التوفو، عشب البحر، والبصل الأخضر.',
    price: '28',
    category: 'Starters',
    tags: ['Classic'],
  },
  {
    id: 'starter-4',
    name: 'Tom Yum Kung',
    nameAr: 'توم يوم كونغ',
    description: 'Spicy and sour Thai soup with shrimp, mushrooms, and lemongrass.',
    descriptionAr: 'شوربة تايلاندية حامضة وحارة مع الجمبري، الفطر، وعشب الليمون.',
    price: '42',
    category: 'Starters',
    tags: ['Spicy'],
  },

  // --- SUSHI & SASHIMI ---
  {
    id: 'sushi-1',
    name: 'Imperial Gold Nigiri',
    nameAr: 'نيجيري الذهب الإمبراطوري',
    description: 'Triple-marbled fatty tuna, gold leaf, aged soy glaze over koshihikari rice.',
    descriptionAr: 'تونا دهنية رخامية ثلاثية، ورق ذهب، صلصة صويا معتقة فوق أرز كوشيهيكاري.',
    price: '28',
    category: 'Sushi & Sashimi',
    tags: ['Signature', 'Rare'],
  },
  {
    id: 'sushi-2',
    name: 'Salmon Sashimi',
    nameAr: 'سلمون ساشيمي',
    description: 'Five premium slices of fresh Atlantic salmon.',
    descriptionAr: 'خمس شرائح فاخرة من السلمون الأطلسي الطازج.',
    price: '65',
    category: 'Sushi & Sashimi',
    tags: ['Premium'],
  },
  {
    id: 'sushi-3',
    name: 'Tuna Sashimi',
    nameAr: 'تونا ساشيمي',
    description: 'Five slices of deep-sea bluefin tuna.',
    descriptionAr: 'خمس شرائح من تونا البلوفين من أعماق البحار.',
    price: '75',
    category: 'Sushi & Sashimi',
    tags: ['Rare'],
  },
  {
    id: 'sushi-4',
    name: 'Hokkaido Uni Ritual',
    nameAr: 'طقوس أوني هوكايدو',
    description: 'Fresh sea urchin from Hokkaido, washi-wrapped seaweed, shiso flower.',
    descriptionAr: 'قنفذ بحر طازج من هوكايدو، عشب بحري مغلف بورق الواشي، زهرة الشيسو.',
    price: '34',
    category: 'Sushi & Sashimi',
    tags: ['Luxury'],
  },

  // --- SPECIALTY ROLLS ---
  {
    id: 'roll-1',
    name: 'Dynamite Roll',
    nameAr: 'داينمت رول',
    description: 'Shrimp tempura, avocado, crab, topped with spicy dynamite sauce and caviar.',
    descriptionAr: 'جمبري تمبورا، أفوكادو، كراب، مغطى بصوص الداينمت الحار والكافيار.',
    price: '78',
    category: 'Specialty Rolls',
    tags: ['Best Seller', 'Spicy'],
  },
  {
    id: 'roll-2',
    name: 'Las Vegas Aromaki',
    nameAr: 'لاس فيغاس أروماكي',
    description: 'Salmon, crab, avocado, cheese, and mango for a vibrant taste.',
    descriptionAr: 'سلمون، كراب، أفوكادو، جبنة، ومانجو لطعم حيوي.',
    price: '82',
    category: 'Specialty Rolls',
    tags: ['Vibrant'],
  },
  {
    id: 'roll-3',
    name: 'Fire Roll',
    nameAr: 'فاير رول',
    description: 'Spicy tuna, cucumber, topped with flamed salmon and jalapeno.',
    descriptionAr: 'تونا حارة، خيار، مغطاة بالسلمون الملهب والهلابينو.',
    price: '85',
    category: 'Specialty Rolls',
    tags: ['Flamed'],
  },
  {
    id: 'roll-4',
    name: 'Sugi Roll',
    nameAr: 'سوجي رول',
    description: 'Our house special with tempura shrimp, marinated salmon, and gold flakes.',
    descriptionAr: 'لفافة سوجي الخاصة مع جمبري تمبورا، سلمون متبل، ورقائق الذهب.',
    price: '92',
    category: 'Specialty Rolls',
    tags: ['Signature'],
  },

  // --- MAIN DISHES ---
  {
    id: 'main-1',
    name: 'A5 Miyazakigyu',
    nameAr: 'A5 ميازاكي-غيو',
    description: 'A5 Wagyu seared over Binchotan charcoal, sea salt, wasabi root.',
    descriptionAr: 'لحم واغيو A5 مشوي فوق فحم بينشوتان، ملح بحري، جذر واسابي.',
    price: '285',
    category: 'Main Dishes',
    tags: ['Ultimate Luxury'],
  },
  {
    id: 'main-2',
    name: 'Kuro-Shoyu Ramen',
    nameAr: 'رامن كورو-شويو',
    description: '12-hour black chicken broth, truffle paste, hand-cut noodles, gold-brushed chashu.',
    descriptionAr: 'مرق دجاج أسود مطهو لمدة ١٢ ساعة، معجون ترافل، نودلز مقطعة يدوياً، تشاشو مطلي بالذهب.',
    price: '142',
    category: 'Main Dishes',
    tags: ['Artisan'],
  },
  {
    id: 'main-3',
    name: 'Beef Teppanyaki',
    nameAr: 'تيبانياكي لحم البقر',
    description: 'Sliced beef tenderloin served with seasonal vegetables and special sauce.',
    descriptionAr: 'شرائح لحم بقري فيليه تقدم مع خضروات موسمية وصوص خاص.',
    price: '165',
    category: 'Main Dishes',
    tags: ['Classic'],
  },
  {
    id: 'main-4',
    name: 'Chicken Katsu',
    nameAr: 'كاتسو الدجاج',
    description: 'Crispy breaded chicken breast served with traditional tonkatsu sauce.',
    descriptionAr: 'صدر دجاج مقرمش يقدم مع صوص التونكاتسو التقليدي.',
    price: '95',
    category: 'Main Dishes',
    tags: ['Classic'],
  },

  // --- DESSERTS ---
  {
    id: 'dessert-1',
    name: 'Mochi Ritual',
    nameAr: 'طقوس الموتشي',
    description: 'Assorted seasonal mochi flavors served with gold leaf and fresh berries.',
    descriptionAr: 'نكهات موتشي موسمية متنوعة تقدم مع ورق الذهب والتوت الطازج.',
    price: '45',
    category: 'Desserts',
    tags: ['Sweet'],
  },
  {
    id: 'dessert-2',
    name: 'Chocolate Souffle',
    nameAr: 'سوفليه الشوكولاتة',
    description: 'Warm chocolate souffle with a molten center, served with vanilla bean ice cream.',
    descriptionAr: 'سوفليه شوكولاتة دافئ بمركز ذائب، يقدم مع آيس كريم فانيليا.',
    price: '52',
    category: 'Desserts',
    tags: ['Warm'],
  }
];

export const CATEGORIES = ['Starters', 'Sushi & Sashimi', 'Specialty Rolls', 'Main Dishes', 'Desserts'];
