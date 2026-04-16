import { Dish } from '@/data/menuData';

export interface Recommendation {
  dish: Dish;
  reason: string;
}

type MealGroup = 'Appetizer' | 'Main' | 'Drink' | 'Dessert' | 'Side';

const CATEGORY_GROUPS: Record<string, MealGroup> = {
  'Salads': 'Appetizer',
  'Soups': 'Appetizer',
  'Starters': 'Appetizer',
  'Wok, Noodles & Rice': 'Main',
  'Tempura': 'Appetizer',
  'Sugi Dishes': 'Main',
  'Sashimi': 'Appetizer',
  'Tataki': 'Appetizer',
  'Ceviche': 'Appetizer',
  'Nigiri': 'Appetizer',
  'Gunkan': 'Appetizer',
  'Temaki': 'Appetizer',
  'Maki Rolls': 'Main',
  'Aromaki Rolls': 'Main',
  'Aromaki Fried': 'Main',
  'California Rolls': 'Main',
  'Special Rolls': 'Main',
  'Fried Rolls': 'Main',
  'Boxes': 'Main',
  'Sugi Boat': 'Main',
  'Cold Drinks': 'Drink',
  'Fresh Juices': 'Drink',
  'Hot Drinks': 'Drink',
  'Desserts': 'Dessert',
  'Extra Sauces': 'Side',
};

const REASONS: Record<string, { en: string; ar: string }> = {
  STRIKE_BALANCE: {
    en: "A refreshing balance to the heat of your dish.",
    ar: "توازن منعش يخفف من حرارة الطبق.",
  },
  PERFECT_START: {
    en: "The perfect light starter for this meal.",
    ar: "البداية الخفيفة المثالية لهذه الوجبة.",
  },
  COMPLEMENTARY: {
    en: "Highly recommended pairing for a complete experience.",
    ar: "توصية مثالية لتجربة كاملة.",
  },
  SIGNATURE_PAIR: {
    en: "Our signature pairing for this flavor profile.",
    ar: "مزيجنا الخاص لهذه النكهة.",
  },
  SWEET_FINISH: {
    en: "A sweet conclusion to your Sugi journey.",
    ar: "نهاية حلوة لرحلتك مع سوجي.",
  },
  QUENCH: {
    en: "Refreshing drink to accompany your meal.",
    ar: "مشروب منعش يرافق وجبتك.",
  },
};

export function getDynamicRecommendations(
  currentDish: Dish,
  allDishes: Dish[],
  lang: 'en' | 'ar' = 'en'
): Recommendation[] {
  const currentGroup = CATEGORY_GROUPS[currentDish.category] || 'Main';
  const isSpicy = currentDish.tags.includes('Spicy');
  const isSeafood = currentDish.tags.includes('Seafood');

  const recommendations: Recommendation[] = [];
  const usedIds = new Set([currentDish.id]);

  const findAndAdd = (
    predicate: (d: Dish) => boolean,
    reasonKey: keyof typeof REASONS,
    limit: number = 1
  ) => {
    const matches = allDishes
      .filter((d) => !usedIds.has(d.id) && predicate(d))
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);

    matches.forEach((d) => {
      recommendations.push({
        dish: d,
        reason: REASONS[reasonKey][lang],
      });
      usedIds.add(d.id);
    });
  };

  // Logic 1: Spicy dishes always need a cooling drink
  if (isSpicy) {
    findAndAdd(
      (d) => CATEGORY_GROUPS[d.category] === 'Drink' && (d.category === 'Fresh Juices' || d.category === 'Cold Drinks'),
      'STRIKE_BALANCE'
    );
  }

  // Logic 2: If Main, suggest an Appetizer/Soup
  if (currentGroup === 'Main') {
    findAndAdd(
      (d) => CATEGORY_GROUPS[d.category] === 'Appetizer' && d.tags.includes('Best Seller'),
      'PERFECT_START'
    );
  }

  // Logic 3: If Appetizer/Drink, suggest a Main (Signature)
  if (currentGroup === 'Appetizer' || currentGroup === 'Drink') {
    findAndAdd(
      (d) => CATEGORY_GROUPS[d.category] === 'Main' && d.tags.includes('Signature'),
      'COMPLEMENTARY'
    );
  }

  // Logic 4: Fallback - Fill with Signatures or Best Sellers
  if (recommendations.length < 3) {
    findAndAdd(
      (d) => d.tags.includes('Signature') || d.tags.includes('Best Seller'),
      'SIGNATURE_PAIR',
      3 - recommendations.length
    );
  }

  // Logic 5: If it's a dessert, maybe suggest a hot drink? 
  // (Adding more variety to the fallback if still empty)
  if (recommendations.length < 3) {
    findAndAdd(
      (d) => true,
      'COMPLEMENTARY',
      3 - recommendations.length
    );
  }

  return recommendations.slice(0, 3);
}
