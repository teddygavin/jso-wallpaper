/**
 * lib/seed.js
 * Run at deploy time via vercel.json "buildCommand": "node lib/seed.js"
 * Creates tables (idempotent) and seeds categories + sample products.
 *
 * Safe to run multiple times — uses INSERT ... ON CONFLICT DO NOTHING.
 */

import 'dotenv/config';
import { sql, ensureTables } from './db.js';

async function seed() {
  console.log('🌱 Running seed...');
  await ensureTables();
  console.log('✅ Tables ready');

  /* ── CATEGORIES ── */
  const categories = [
    [1,  'Wallpapers',                 'wallpapers',
     'Premium designer wallpapers for homes and offices across Nairobi and Kenya.',
     'Wallpapers Nairobi | Buy Designer Wallpaper Kenya | JSO',
     'Shop luxury and affordable designer wallpapers in Nairobi. Wide range of textures, patterns and finishes. Professional installation across Kenya.',
     'wallpapers nairobi, buy wallpaper kenya, designer wallpaper nairobi, wallpaper installation kenya',
     '🖼️'],
    [2,  'Window Film & Privacy Film', 'window-film',
     'Frosted, UV-blocking and decorative window films for homes and offices in Nairobi.',
     'Window Film Nairobi | Privacy Film Kenya | Frosted Glass Film | JSO',
     'Buy window film and privacy film in Nairobi. Frosted glass, UV protection and decorative wraps for offices and bathrooms.',
     'window film nairobi, privacy film kenya, frosted glass film, office window film nairobi',
     '🪟'],
    [3,  'Carpet Grass',               'carpet-grass',
     'Premium artificial carpet grass for balconies, offices and outdoor spaces.',
     'Carpet Grass Nairobi | Artificial Turf Kenya | JSO Interiors',
     'Shop carpet grass and artificial turf in Nairobi. Durable UV-resistant grass for balconies, offices and events.',
     'carpet grass nairobi, artificial turf kenya, synthetic grass nairobi, balcony grass kenya',
     '🌿'],
    [4,  'Artificial Fence & Plants',  'artificial-fence-plants',
     'Artificial hedge panels, green walls and indoor plants for low-maintenance spaces.',
     'Artificial Fence Nairobi | Fake Hedge Kenya | Artificial Plants | JSO',
     'Buy artificial fence panels, hedge walls and indoor plants in Nairobi. Low-maintenance greenery for homes and offices.',
     'artificial fence nairobi, fake hedge kenya, artificial plants nairobi, green wall kenya',
     '🌱'],
    [5,  'Flowers',                    'flowers',
     'Fresh and artificial flowers for interior décor, events and gifting across Nairobi.',
     'Flowers Nairobi | Floral Décor Kenya | Interior Flowers | JSO',
     'Shop fresh and artificial flowers in Nairobi. Elegant floral arrangements for home décor and corporate offices.',
     'flowers nairobi, floral decor kenya, artificial flowers nairobi, decorative flowers kenya',
     '🌸'],
    [6,  'Décor Books',                'decor-books',
     'Curated coffee table books and design books for stylish Nairobi interiors.',
     'Décor Books Nairobi | Coffee Table Books Kenya | JSO',
     'Browse curated décor and coffee table books in Nairobi. Elevate your styling with premium art and design books.',
     'decor books nairobi, coffee table books kenya, interior design books nairobi',
     '📚'],
    [7,  'Décor Pieces',               'decor-pieces',
     'Vases, sculptures, candles and accent pieces for any home or office interior.',
     'Décor Pieces Nairobi | Home Accessories Kenya | JSO',
     'Shop unique décor pieces and home accessories in Nairobi. Vases, candles and accent items for every interior style.',
     'decor pieces nairobi, home accessories kenya, vases nairobi, candles kenya',
     '🏺'],
    [8,  'Household Items',            'household-items',
     'Practical and stylish household essentials for modern Nairobi homes.',
     'Household Items Nairobi | Home Essentials Kenya | JSO',
     'Shop quality household items in Nairobi. Practical, stylish products for the modern Kenyan home.',
     'household items nairobi, home essentials kenya, household supplies nairobi',
     '🏠'],
    [9,  'Bedsheets & Towels',         'bedsheets-towels',
     'Premium Egyptian cotton bedsheets, duvet covers and luxury hotel-quality towels.',
     'Bedsheets Nairobi | Luxury Towels Kenya | Premium Linen | JSO',
     'Buy premium bedsheets and towels in Nairobi. Egyptian cotton and luxury linen for hotels and homes across Kenya.',
     'bedsheets nairobi, towels kenya, luxury linen nairobi, cotton bedsheets kenya',
     '🛏️'],
    [10, 'Hanging Racks',              'hanging-racks',
     'Wall-mounted and freestanding hanging racks for clothes, plants and décor.',
     'Hanging Racks Nairobi | Clothes Rack Kenya | Wall Rack | JSO',
     'Shop hanging racks in Nairobi. Wall-mounted and freestanding racks for bedrooms, hallways and offices.',
     'hanging racks nairobi, clothes rack kenya, wall rack nairobi, storage rack kenya',
     '🪝'],
  ];

  for (const [sort_order, name, slug, description, seo_title, seo_desc, seo_keywords, icon] of categories) {
    await sql`
      INSERT INTO categories (sort_order, name, slug, description, seo_title, seo_desc, seo_keywords, icon)
      VALUES (${sort_order}, ${name}, ${slug}, ${description}, ${seo_title}, ${seo_desc}, ${seo_keywords}, ${icon})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log('✅ Categories seeded');

  /* ── SAMPLE PRODUCTS ── */
  const products = [
    // WALLPAPERS
    ['Arabesque Coral Wallpaper','arabesque-coral-wallpaper','wallpapers',
     'Luxurious coral arabesque pattern on silk blend. Ideal for feature walls in living rooms and master bedrooms.',
     8500,'KSh 8,500','per roll',null,'New',1,1,
     'Arabesque Coral Wallpaper Nairobi | Feature Wall Wallpaper | JSO',
     'Buy Arabesque Coral Wallpaper in Nairobi. Premium silk-blend with delivery and installation across Kenya.',
     'arabesque wallpaper nairobi, coral wallpaper kenya, feature wall nairobi'],

    ['Teal Grid Wallpaper','teal-grid-wallpaper','wallpapers',
     'Modern geometric teal grid on Belgian linen. Perfect for offices and contemporary Nairobi interiors.',
     6200,'KSh 6,200','per roll',null,null,1,0,
     'Teal Grid Wallpaper Nairobi | Geometric Wallpaper Kenya | JSO',
     'Shop Teal Grid geometric wallpaper in Nairobi. Belgian linen base with professional installation available.',
     'teal wallpaper nairobi, geometric wallpaper kenya, office wallpaper nairobi'],

    ['Wave Terracotta Wallpaper','wave-terracotta-wallpaper','wallpapers',
     'Organic wave grasscloth in earthy terracotta — warm texture for living rooms and dining spaces.',
     9800,'KSh 9,800','per roll',null,null,1,1,
     'Terracotta Wave Wallpaper Nairobi | Grasscloth Wallpaper Kenya | JSO',
     'Buy Wave Terracotta grasscloth wallpaper in Nairobi. Natural texture, earthy tones for warm interiors.',
     'terracotta wallpaper nairobi, grasscloth wallpaper kenya, wave wallpaper nairobi'],

    ['Diamond Noir Wallpaper','diamond-noir-wallpaper','wallpapers',
     'Bold diamond velvet emboss in deep noir. A bestselling luxury feature wall wallpaper in Nairobi.',
     12400,'KSh 12,400','per roll',null,'Bestseller',1,1,
     'Diamond Noir Luxury Wallpaper Nairobi | Velvet Wallpaper Kenya | JSO',
     'Shop Diamond Noir luxury velvet wallpaper in Nairobi — the top-selling wallpaper for premium interiors.',
     'luxury wallpaper nairobi, velvet wallpaper kenya, diamond wallpaper nairobi'],

    // WINDOW FILM
    ['Frosted Privacy Film','frosted-privacy-film','window-film',
     'UV-blocking frosted glass-effect film for offices, bathrooms and glass partitions. Easy to apply and removable.',
     3500,'KSh 3,500','per metre',null,'Popular',1,1,
     'Frosted Privacy Window Film Nairobi | Office Glass Film Kenya | JSO',
     'Buy frosted privacy window film in Nairobi. UV-blocking easy-apply film for offices and bathrooms.',
     'frosted window film nairobi, privacy film kenya, office glass film nairobi'],

    // CARPET GRASS
    ['Premium Carpet Grass','premium-carpet-grass','carpet-grass',
     'Ultra-soft UV-resistant artificial carpet grass for balconies, offices and indoor green spaces.',
     1800,'KSh 1,800','per sq. metre',null,null,1,1,
     'Premium Carpet Grass Nairobi | Artificial Turf Kenya | JSO',
     'Shop premium carpet grass in Nairobi. UV-resistant turf for balconies, offices and event décor.',
     'carpet grass nairobi, artificial turf kenya, balcony carpet grass nairobi'],

    // ARTIFICIAL FENCE & PLANTS
    ['Artificial Boxwood Hedge','artificial-boxwood-hedge','artificial-fence-plants',
     'Dense UV-treated boxwood hedge panels for garden fencing, green walls and event backdrops.',
     4500,'KSh 4,500','per panel',null,'New',1,1,
     'Artificial Hedge Panel Nairobi | Green Wall Kenya | JSO',
     'Buy artificial boxwood hedge panels in Nairobi. UV-treated for garden fencing and green walls.',
     'artificial hedge nairobi, green wall kenya, boxwood panel nairobi'],

    // FLOWERS
    ['Bespoke Floral Arrangement','bespoke-floral-arrangement','flowers',
     'Custom floral arrangements for home décor, corporate offices and special events across Nairobi.',
     2500,'From KSh 2,500','per arrangement',null,null,1,1,
     'Floral Arrangements Nairobi | Interior Flowers Kenya | JSO',
     'Order bespoke floral arrangements in Nairobi for home décor, offices and events.',
     'floral arrangements nairobi, interior flowers kenya, event flowers kenya'],

    // DÉCOR BOOKS
    ['Interior Design Coffee Table Book','interior-coffee-table-book','decor-books',
     'Curated hardcover design books to elevate your coffee table, shelf or reception area.',
     2400,'KSh 2,400','per book',null,null,1,1,
     'Coffee Table Books Nairobi | Interior Design Books Kenya | JSO',
     'Buy curated interior design coffee table books in Nairobi. Premium titles that elevate your space.',
     'coffee table books nairobi, interior design books kenya, decor books nairobi'],

    // DÉCOR PIECES
    ['Ceramic Vase Set','ceramic-vase-set','decor-pieces',
     'Handcrafted earth-tone ceramic vases — perfect accent pieces for sideboards and shelves.',
     3500,'KSh 3,500','set of 3',null,'New',1,1,
     'Ceramic Vases Nairobi | Decorative Vases Kenya | JSO',
     'Shop handcrafted ceramic vase sets in Nairobi. Earth-tone accent pieces for any home.',
     'ceramic vases nairobi, decorative vases kenya, home accents nairobi'],

    // HOUSEHOLD ITEMS
    ['Kitchen Essentials Set','kitchen-essentials-set','household-items',
     'Practical and stylish kitchen essentials for the modern Nairobi household.',
     4200,'KSh 4,200','per set',null,null,1,1,
     'Kitchen Essentials Nairobi | Household Items Kenya | JSO',
     'Shop premium kitchen essentials and household items in Nairobi.',
     'kitchen essentials nairobi, household items kenya, home products nairobi'],

    // BEDSHEETS & TOWELS
    ['Egyptian Cotton Bedsheet Set','egyptian-cotton-bedsheet','bedsheets-towels',
     'Hotel-quality Egyptian cotton — fitted sheet, flat sheet and 2 pillowcases in all bed sizes.',
     7500,'KSh 7,500','per set',null,'Bestseller',1,1,
     'Egyptian Cotton Bedsheets Nairobi | Luxury Bedsheets Kenya | JSO',
     'Buy premium Egyptian cotton bedsheet sets in Nairobi in all bed sizes — delivered across Kenya.',
     'bedsheets nairobi, egyptian cotton bedsheets kenya, luxury sheets nairobi'],

    ['Luxury Hotel Bath Towel Set','luxury-bath-towels','bedsheets-towels',
     'Plush 600 GSM hotel-quality bath towels — highly absorbent and quick-dry.',
     3200,'KSh 3,200','set of 2',null,null,1,1,
     'Luxury Bath Towels Nairobi | Hotel Towels Kenya | JSO',
     'Buy luxury 600 GSM hotel bath towels in Nairobi. Quick-dry towels delivered across Kenya.',
     'bath towels nairobi, luxury towels kenya, hotel towels nairobi'],

    // HANGING RACKS
    ['Wall-Mounted Iron Rack','wall-mounted-hanging-rack','hanging-racks',
     'Minimalist matte black iron wall rack for clothes, bags and décor in bedrooms and hallways.',
     5500,'KSh 5,500','per piece',null,'Popular',1,1,
     'Wall Hanging Rack Nairobi | Clothes Rack Kenya | JSO',
     'Buy wall-mounted hanging racks in Nairobi. Stylish black iron racks with installation available.',
     'hanging rack nairobi, wall rack kenya, clothes rack nairobi'],

    ['Freestanding Clothes Rack','freestanding-clothes-rack','hanging-racks',
     'Elegant freestanding matte black steel rack with wood shelf for open wardrobes.',
     7800,'KSh 7,800','per piece',null,null,1,0,
     'Freestanding Clothes Rack Nairobi | Open Wardrobe Kenya | JSO',
     'Shop freestanding clothes racks in Nairobi. Sleek steel racks for open wardrobes across Kenya.',
     'clothes rack nairobi, freestanding rack kenya, open wardrobe nairobi'],
  ];

  for (const [
    name, slug, category_slug, description, price, price_label,
    unit, image, badge, in_stock, featured,
    seo_title, seo_desc, seo_keywords
  ] of products) {
    await sql`
      INSERT INTO products
        (name, slug, category_slug, description, price, price_label, unit,
         image, badge, in_stock, featured, seo_title, seo_desc, seo_keywords)
      VALUES
        (${name}, ${slug}, ${category_slug}, ${description}, ${price}, ${price_label},
         ${unit}, ${image}, ${badge}, ${in_stock}, ${featured},
         ${seo_title}, ${seo_desc}, ${seo_keywords})
      ON CONFLICT (slug) DO NOTHING
    `;
  }
  console.log('✅ Products seeded');
  console.log('🎉 Seed complete');
  process.exit(0);
}

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
