import { getMenu } from '../src/lib/data';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  const data = await getMenu();
  console.log('Categories from getMenu:', data.categories);
}

test();
