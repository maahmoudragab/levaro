-- ============================================================================
-- LÉVARO ATELIER — DATABASE RE-SEED SCRIPT
-- 1. مسح كافة البيانات السابقة (الصور، المنتجات، الكولكشنات، والـ Disciplines) دون حذف الجداول
-- 2. إنشاء Disciplines جديدة كلياً (الأقسام الرئيسية)
-- 3. إنشاء Collections جديدة كلياً مرتبطة بالـ Disciplines
-- 4. إضافة 50 منتج متكامل بجميع التفاصيل والمواصفات وربطهم بالكولكشنات والأقسام
-- 5. إضافة صور عالية الدقة لكل منتج في جدول product_images
-- ============================================================================

-- ----------------------------------------------------------------------------
-- الخطوة 1: مسح كافة البيانات من الجداول (تفريغ المحتوى بالكامل دون حذف الجداول)
-- ----------------------------------------------------------------------------

-- الطريقة الموصى بها (أسرع وتصفر عدادات التسلسل التلقائية):
TRUNCATE TABLE product_images, products, categories CASCADE;

-- (بديل مباشر في حال كنت تفضل DELETE):
-- DELETE FROM product_images;
-- DELETE FROM products;
-- DELETE FROM categories;


-- ----------------------------------------------------------------------------
-- الخطوة 2: إنشاء الـ DISCIPLINES الجديدة (الأقسام الرئيسية - Parent Categories)
-- ----------------------------------------------------------------------------

INSERT INTO categories (id, name, slug, parent_id, description, image, is_active, created_at)
VALUES
  -- 1. MEN DISCIPLINES
  (
    '00000000-0000-0000-0000-000000000001',
    'MEN',
    'men',
    NULL,
    'Sculptural outerwear, Japanese shuttle-loom denim & architectural forms designed for movement.',
    'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1400&q=85',
    true,
    now()
  ),

  -- 2. WOMEN DISCIPLINES
  (
    '00000000-0000-0000-0000-000000000002',
    'WOMEN',
    'women',
    NULL,
    'Columnar silhouettes, fluid silk drape & modern bespoke essentials engineered with austere precision.',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85',
    true,
    now()
  ),

  -- 3. OBJECTS & ACCESSORIES DISCIPLINES
  (
    '00000000-0000-0000-0000-000000000003',
    'ACCESSORIES',
    'accessories',
    NULL,
    'Cured Italian block acetate eyewear, vegetable-tanned leather goods & tactile machined metal objects.',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1400&q=85',
    true,
    now()
  );


-- ----------------------------------------------------------------------------
-- الخطوة 3: إنشاء الـ COLLECTIONS الجديدة (الكولكشنات التابعة لكل Discipline)
-- ----------------------------------------------------------------------------

INSERT INTO categories (id, name, slug, parent_id, description, image, is_active, created_at)
VALUES
  -- =================== COLLECTIONS UNDER MEN ===================
  (
    '10000000-0000-0000-0000-000000000001',
    'Outerwear & Shells',
    'men-outerwear',
    '00000000-0000-0000-0000-000000000001',
    'Technical memory nylon parkas, storm trenches, and protective weather coats.',
    'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Architectural Tailoring',
    'men-tailoring',
    '00000000-0000-0000-0000-000000000001',
    'Sculpted virgin wool overcoats, double-breasted blazers, and wide-leg trousers.',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Raw Selvedge Denim',
    'men-denim',
    '00000000-0000-0000-0000-000000000001',
    'Vintage shuttle-loom 14.5oz Okayama raw denim jackets and relaxed tapered jeans.',
    'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Atelier Knitwear',
    'men-knitwear',
    '00000000-0000-0000-0000-000000000001',
    'Biella extra-fine merino wool turtlenecks, brushed superkid mohair, and cashmere.',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'Daily Heavyweight Essentials',
    'men-essentials',
    '00000000-0000-0000-0000-000000000001',
    '280 GSM Giza cotton tees, 500 GSM loopback French Terry hoodies, and poplin shirts.',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),

  -- =================== COLLECTIONS UNDER WOMEN ===================
  (
    '20000000-0000-0000-0000-000000000001',
    'Sculptural Coats & Trench',
    'women-coats',
    '00000000-0000-0000-0000-000000000002',
    'Double-faced camel cocoon coats, cape overcoats, and longline gabardine trenches.',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    'Fluid Drapery & Pleats',
    'women-fluid-drape',
    '00000000-0000-0000-0000-000000000002',
    'Japanese triacetate knife-pleat culottes, permanent-pleat maxi skirts, and fluid linen.',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    'Modern Power Tailoring',
    'women-tailoring',
    '00000000-0000-0000-0000-000000000002',
    'Hourglass structured roped shoulder blazers and sweeping wide-leg wool trousers.',
    'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000004',
    'Pure Silks & Crisp Poplin',
    'women-silks-poplin',
    '00000000-0000-0000-0000-000000000002',
    '22 Momme sandwashed mulberry silk blouses, cowl tops, and Giza poplin shirts.',
    'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '20000000-0000-0000-0000-000000000005',
    'Haute Atelier & Column Gowns',
    'women-haute',
    '00000000-0000-0000-0000-000000000002',
    'Minimalist floor-length bias-cut silk gowns and compact virgin wool column dresses.',
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),

  -- =================== COLLECTIONS UNDER ACCESSORIES ===================
  (
    '30000000-0000-0000-0000-000000000001',
    'Hand-Cut Acetate Eyewear',
    'cured-acetate',
    '00000000-0000-0000-0000-000000000003',
    '8mm cured Italian Mazzucchelli acetate sunglasses with flat Carl Zeiss UV400 optics.',
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Tuscan Vachetta Leather',
    'tuscan-leather',
    '00000000-0000-0000-0000-000000000003',
    'Vegetable-tanned full-grain leather cardholders, box calfskin totes, belts, and crossbodies.',
    'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Sculptural Objects & Silver',
    'minimal-objects',
    '00000000-0000-0000-0000-000000000003',
    'Solid 925 sterling silver knife-edge cuffs and CNC-machined solid naval brass keyrings.',
    'https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    'Goodyear Welted Footwear',
    'atelier-footwear',
    '00000000-0000-0000-0000-000000000003',
    'Northampton handcrafted Commando lug boots and French box calf plain-toe derbies.',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
    true,
    now()
  );


-- ----------------------------------------------------------------------------
-- الخطوة 4: إضافة 50 منتج واقعي بجميع التفاصيل مربوطة مباشرة بالكولكشنات والأقسام
-- ----------------------------------------------------------------------------

INSERT INTO products (
  id, name, slug, price, sale_price, description, short_description,
  brand, material, gender, sku, is_active, is_featured, is_new, fit,
  country_of_origin, tags, product_type, category_id, color, stock, created_at
) VALUES
-- =================== MEN'S PRODUCTS (20) ===================

-- 1. Outerwear & Shells (4)
(
  '40000000-0000-0000-0000-000000000001',
  'Kinetics Technical Minimalist Parka',
  'kinetics-technical-minimalist-parka',
  7200, 6400,
  'Crafted from Japanese memory nylon with matte water-repellent finishing. Storm flap front, taped seam construction, concealed RiRi two-way zipper, and high architectural storm collar.',
  'Matte technical shell parka designed for urban climates with concealed hardware.',
  'LÉVARO Sport', 'Tech Fleece', 'Men', 'LVR-AW26-PRK01',
  true, true, true, 'Oversized Fit', 'Japan',
  ARRAY['OUTERWEAR', 'TECHNICAL', 'SPORT', 'WATERPROOF', 'AW26'],
  'Jacket', '10000000-0000-0000-0000-000000000001', 'Midnight Navy',
  '[{"size": "S", "stock": 4}, {"size": "M", "stock": 8}, {"size": "L", "stock": 6}, {"size": "XL", "stock": 2}]'::jsonb,
  now() - interval '1 day'
),
(
  '40000000-0000-0000-0000-000000000002',
  'Columnar Cotton Gabardine Trench',
  'columnar-cotton-gabardine-trench',
  8900, NULL,
  'Heavy double-weave English cotton gabardine trench coat. Features a sweeping longline drape, throat latch storm collar, belted waist with leather covered buckle, and storm back flap.',
  'Timeless double-breasted longline trench engineered from tightly woven weather-proof gabardine.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Men', 'LVR-AW26-TRN02',
  true, true, false, 'Tailored Fit', 'France',
  ARRAY['TRENCH', 'GABARDINE', 'COAT', 'LUXURY', 'AW26'],
  'Coat', '10000000-0000-0000-0000-000000000001', 'Beige / Sand',
  '[{"size": "S", "stock": 2}, {"size": "M", "stock": 5}, {"size": "L", "stock": 4}, {"size": "XL", "stock": 1}]'::jsonb,
  now() - interval '2 days'
),
(
  '40000000-0000-0000-0000-000000000003',
  'Minimalist Raw Edge Wool Overshirt',
  'minimalist-raw-edge-wool-overshirt',
  4300, 3750,
  'Crafted from boiled virgin wool with raw laser-cut edges and horn button closure. Features two oversized chest patch pockets and relaxed side split vents.',
  'Structured boiled wool overshirt functional as an outerwear piece or mid-layer.',
  'LÉVARO Atelier', 'Wool & Cashmere', 'Men', 'LVR-AW26-OVS03',
  true, false, false, 'Relaxed Fit', 'Italy',
  ARRAY['OVERSHIRT', 'WOOL', 'MINIMALIST', 'AUTUMN'],
  'Overshirt', '10000000-0000-0000-0000-000000000001', 'Olive Green',
  '[{"size": "S", "stock": 4}, {"size": "M", "stock": 8}, {"size": "L", "stock": 5}, {"size": "XL", "stock": 2}]'::jsonb,
  now() - interval '3 days'
),
(
  '40000000-0000-0000-0000-000000000004',
  'Architectural Melton Wool Bomber',
  'architectural-melton-wool-bomber',
  6800, 5900,
  '550 GSM dense Melton wool bomber featuring exaggerated drop shoulders, heavy gauge RiRi two-way metal zipper, and hidden welt handwarmer pockets.',
  'Sculpted Melton wool bomber jacket offering substantial drape and insulation.',
  'LÉVARO Atelier', 'Wool & Cashmere', 'Men', 'LVR-AW26-BMB04',
  true, false, true, 'Boxy Fit', 'Portugal',
  ARRAY['BOMBER', 'MELTON WOOL', 'OUTERWEAR', 'BOXY'],
  'Jacket', '10000000-0000-0000-0000-000000000001', 'Obsidian Black',
  '[{"size": "S", "stock": 3}, {"size": "M", "stock": 6}, {"size": "L", "stock": 5}, {"size": "XL", "stock": 1}]'::jsonb,
  now() - interval '4 days'
),

-- 2. Architectural Tailoring (4)
(
  '40000000-0000-0000-0000-000000000005',
  'Monolith Wool Overcoat',
  'monolith-wool-overcoat',
  8400, NULL,
  'Tailored in Florence from high-density 480gsm virgin wool fleece. Designed with sharp architectural shoulders, unvented columnar drape, horn button closure, and concealed interior pockets.',
  'Sculptural full-length wool overcoat engineered for extreme structure and warmth.',
  'LÉVARO Noir', 'Wool & Cashmere', 'Men', 'LVR-AW26-MNT05',
  true, true, false, 'Tailored Fit', 'Italy',
  ARRAY['TAILORING', 'COAT', 'NOIR', 'FLORENCE', 'LUXURY'],
  'Coat', '10000000-0000-0000-0000-000000000002', 'Obsidian Black',
  '[{"size": "S", "stock": 3}, {"size": "M", "stock": 6}, {"size": "L", "stock": 4}, {"size": "XL", "stock": 1}]'::jsonb,
  now() - interval '5 days'
),
(
  '40000000-0000-0000-0000-000000000006',
  'Double-Breasted Cashmere Blazer',
  'double-breasted-cashmere-blazer',
  9600, NULL,
  'Six-on-two buttoning double-breasted jacket tailored from blended Tuscan cashmere and superfine virgin wool. Peak lapels, hand-stitched pick detailing, and cupro full lining.',
  'Impeccably tailored double-breasted blazer in midnight wool-cashmere with peak lapels.',
  'LÉVARO Noir', 'Wool & Cashmere', 'Men', 'LVR-AW26-BLZ06',
  true, true, false, 'Tailored Fit', 'Italy',
  ARRAY['BLAZER', 'CASHMERE', 'NOIR', 'FORMAL', 'ATELIER'],
  'Blazer', '10000000-0000-0000-0000-000000000002', 'Obsidian Black',
  '[{"size": "48", "stock": 3}, {"size": "50", "stock": 5}, {"size": "52", "stock": 4}, {"size": "54", "stock": 2}]'::jsonb,
  now() - interval '6 days'
),
(
  '40000000-0000-0000-0000-000000000007',
  'Fluid Pleated Wide-Leg Trousers',
  'fluid-pleated-wide-leg-trousers',
  4200, 3800,
  'Double reverse-pleat trousers crafted from high-twist wool and mohair tropical crepe. Provides a fluid, pendulum-like motion when walking with sharp permanent front creases.',
  'High-twist fluid wool trousers cut with a deep rise and expansive wide leg.',
  'LÉVARO Atelier', 'Wool & Cashmere', 'Men', 'LVR-AW26-TRS07',
  true, false, false, 'Wide Leg', 'Portugal',
  ARRAY['TROUSERS', 'PLEATED', 'WIDE-LEG', 'TAILORING'],
  'Trousers', '10000000-0000-0000-0000-000000000002', 'Charcoal Grey',
  '[{"size": "30", "stock": 5}, {"size": "32", "stock": 9}, {"size": "34", "stock": 7}, {"size": "36", "stock": 3}]'::jsonb,
  now() - interval '7 days'
),
(
  '40000000-0000-0000-0000-000000000008',
  'Sculptural Double-Face Wool Peacoat',
  'sculptural-double-face-wool-peacoat',
  8200, NULL,
  'Double-face hand-stitched virgin wool peacoat. Broad notch lapels, anchor embossed horn buttons, and high center vent designed for movement.',
  'Short structured double-breasted peacoat in deep navy hand-stitched wool.',
  'LÉVARO Noir', 'Wool & Cashmere', 'Men', 'LVR-AW26-PEA08',
  true, false, true, 'Tailored Fit', 'France',
  ARRAY['PEACOAT', 'WOOL', 'DOUBLE-FACE', 'NOIR', 'AW26'],
  'Coat', '10000000-0000-0000-0000-000000000002', 'Midnight Navy',
  '[{"size": "S", "stock": 2}, {"size": "M", "stock": 5}, {"size": "L", "stock": 4}, {"size": "XL", "stock": 2}]'::jsonb,
  now() - interval '8 days'
),

-- 3. Raw Selvedge Denim (4)
(
  '40000000-0000-0000-0000-000000000009',
  'Raw Selvedge Denim Trucker',
  'raw-selvedge-denim-trucker',
  4800, 4200,
  'Constructed on vintage Toyoda shuttle looms in Kurashiki, this trucker jacket features continuous red-line selvedge along the placket and knife pleats. Dropped shoulders, truncated length, and solid oxidized silver hardware.',
  'Heavyweight 14.5oz Japanese shuttle-loom selvedge denim jacket engineered for architectural drape.',
  'LÉVARO Atelier', 'Raw Denim', 'Men', 'LVR-AW26-TRK09',
  true, true, true, 'Oversized Boxy Fit', 'Japan',
  ARRAY['DENIM', 'SELVEDGE', 'KURASHIKI', 'JAPAN', 'ICONIC'],
  'Jacket', '10000000-0000-0000-0000-000000000003', 'Obsidian Black',
  '[{"size": "S", "stock": 4}, {"size": "M", "stock": 8}, {"size": "L", "stock": 5}, {"size": "XL", "stock": 2}]'::jsonb,
  now() - interval '9 days'
),
(
  '40000000-0000-0000-0000-000000000010',
  'Selvedge Relaxed Tapered Jeans',
  'selvedge-relaxed-tapered-jeans',
  4600, NULL,
  'Woven on slow shuttle looms in Okayama using natural indigo dyed rope yarns. Roomy through seat and thigh with gentle architectural taper towards the hem.',
  '15oz Japanese raw denim jeans featuring red-line selvedge ID and custom matte silver hardware.',
  'LÉVARO Atelier', 'Raw Denim', 'Men', 'LVR-AW26-DEN10',
  true, false, false, 'Relaxed Fit', 'Japan',
  ARRAY['DENIM', 'SELVEDGE', 'JEANS', 'OKAYAMA', 'RAW'],
  'Denim Jeans', '10000000-0000-0000-0000-000000000003', 'Midnight Navy',
  '[{"size": "30", "stock": 6}, {"size": "32", "stock": 10}, {"size": "34", "stock": 8}, {"size": "36", "stock": 4}]'::jsonb,
  now() - interval '10 days'
),
(
  '40000000-0000-0000-0000-000000000011',
  'Technical Selvedge Cargo Trousers',
  'technical-selvedge-cargo-trousers',
  4900, NULL,
  'Combines 13oz shuttle loom denim with Cordura high-tenacity yarns. Flat architectural cargo bellows with concealed magnetic closures and articulated knees.',
  'Durable technical denim cargo trousers with clean geometric pocket geometry.',
  'LÉVARO Sport', 'Raw Denim', 'Men', 'LVR-AW26-CRG11',
  true, false, true, 'Relaxed Fit', 'Japan',
  ARRAY['CARGO', 'SELVEDGE', 'CORDURA', 'TECHNICAL'],
  'Trousers', '10000000-0000-0000-0000-000000000003', 'Midnight Navy',
  '[{"size": "30", "stock": 4}, {"size": "32", "stock": 8}, {"size": "34", "stock": 6}, {"size": "36", "stock": 2}]'::jsonb,
  now() - interval '11 days'
),
(
  '40000000-0000-0000-0000-000000000012',
  'Tailored Wool Flannel Cigarette Pants',
  'tailored-wool-flannel-cigarette-pants',
  4500, NULL,
  'Super 130s Italian wool flannel trousers with sharp pressed creases and tapered cigarette leg. Extended tab waistband with interior curtain lining.',
  'Monochromatic slim tailored flannel trousers in pitch black wool.',
  'LÉVARO Noir', 'Wool & Cashmere', 'Men', 'LVR-AW26-PNT12',
  true, false, false, 'Slim Fit', 'Italy',
  ARRAY['TROUSERS', 'FLANNEL', 'NOIR', 'SLIM', 'TAILORED'],
  'Trousers', '10000000-0000-0000-0000-000000000003', 'Obsidian Black',
  '[{"size": "30", "stock": 4}, {"size": "32", "stock": 7}, {"size": "34", "stock": 5}, {"size": "36", "stock": 2}]'::jsonb,
  now() - interval '12 days'
),

-- 4. Atelier Knitwear (4)
(
  '40000000-0000-0000-0000-000000000013',
  'Brushed Mohair Knit Sweater',
  'brushed-mohair-knit-sweater',
  5100, 4500,
  'Spun in Biella, Italy with superkid mohair and soft merino wool. Hand-brushed finish produces a soft halo texture with subtle thermal insulation.',
  'Luxuriously brushed mohair-blend crewneck sweater with relaxed drop-shoulder cut.',
  'LÉVARO Atelier', 'Merino Wool', 'Men', 'LVR-AW26-KNT13',
  true, false, true, 'Relaxed Fit', 'Italy',
  ARRAY['MOHAIR', 'KNITWEAR', 'MERINO', 'BIELLA', 'WINTER'],
  'Knitwear', '10000000-0000-0000-0000-000000000004', 'Heather Grey',
  '[{"size": "S", "stock": 5}, {"size": "M", "stock": 9}, {"size": "L", "stock": 6}, {"size": "XL", "stock": 3}]'::jsonb,
  now() - interval '13 days'
),
(
  '40000000-0000-0000-0000-000000000014',
  'Fine Biella Merino Turtleneck',
  'fine-biella-merino-turtleneck',
  3800, NULL,
  'Knitted on 16-gauge machines in Biella from extra-fine 19.5 micron merino wool. Ribbed collar that holds shape and subtle raglan sleeve articulation.',
  'Ultra-soft fine gauge merino wool turtleneck knit with refined neck retention.',
  'LÉVARO Atelier', 'Merino Wool', 'Men', 'LVR-AW26-TRT14',
  true, false, false, 'Regular Fit', 'Italy',
  ARRAY['MERINO', 'TURTLENECK', 'KNITWEAR', 'ESSENTIAL', 'ITALY'],
  'Knitwear', '10000000-0000-0000-0000-000000000004', 'Charcoal Grey',
  '[{"size": "S", "stock": 6}, {"size": "M", "stock": 11}, {"size": "L", "stock": 8}, {"size": "XL", "stock": 4}]'::jsonb,
  now() - interval '14 days'
),
(
  '40000000-0000-0000-0000-000000000015',
  'Clean Loopback Minimalist Sweatshirt',
  'clean-loopback-minimalist-sweatshirt',
  2800, NULL,
  'Constructed from 420 GSM unbrushed Egyptian cotton loopback. Tailored with clean flatlock seams, minimal crew neckline, and set-in sleeves for tailored casualwear.',
  'Substantial 420 GSM Egyptian cotton crewneck sweatshirt with architectural fit.',
  'LÉVARO Studio', 'French Terry', 'Men', 'LVR-AW26-SWT15',
  true, false, false, 'Regular Fit', 'Egypt',
  ARRAY['SWEATSHIRT', 'ESSENTIAL', 'MINIMAL', 'STUDIO'],
  'Sweatshirt', '10000000-0000-0000-0000-000000000004', 'Heather Grey',
  '[{"size": "S", "stock": 8}, {"size": "M", "stock": 16}, {"size": "L", "stock": 12}, {"size": "XL", "stock": 4}]'::jsonb,
  now() - interval '15 days'
),
(
  '40000000-0000-0000-0000-000000000016',
  'Heavy French Terry Loopback Hoodie',
  'heavy-french-terry-loopback-hoodie',
  3200, NULL,
  'Weighing 500 GSM, this custom knitted loopback fleece provides a sculptural heavyweight silhouette. Double-layered hood without drawstring, hidden kangaroo pocket openings.',
  '500 GSM loopback cotton hoodie with double-layer structural hood and relaxed boxy cut.',
  'LÉVARO Studio', 'French Terry', 'Men', 'LVR-AW26-HOD16',
  true, false, true, 'Boxy Fit', 'Portugal',
  ARRAY['HOODIE', 'FRENCH TERRY', 'HEAVYWEIGHT', 'STREETWEAR'],
  'Hoodie', '10000000-0000-0000-0000-000000000004', 'Obsidian Black',
  '[{"size": "S", "stock": 7}, {"size": "M", "stock": 14}, {"size": "L", "stock": 10}, {"size": "XL", "stock": 5}]'::jsonb,
  now() - interval '16 days'
),

-- 5. Daily Heavyweight Essentials (4)
(
  '40000000-0000-0000-0000-000000000017',
  'Boxy Heavyweight Atelier Tee',
  'boxy-heavyweight-atelier-tee',
  1950, NULL,
  'Knitted from 280 GSM combed Egyptian cotton jersey. Features a seamless tubular neck ribbing, drop-shoulder geometry, and blind-stitched hem.',
  'Heavyweight 280 GSM boxy cotton tee offering an architectural drape that retains shape.',
  'LÉVARO Studio', 'Heavyweight Cotton (240+ GSM)', 'Men', 'LVR-AW26-TEE17',
  true, true, true, 'Boxy Fit', 'Egypt',
  ARRAY['TEE', 'HEAVYWEIGHT', 'ESSENTIAL', 'STUDIO', 'EGYPTIAN COTTON'],
  'Oversized Tee', '10000000-0000-0000-0000-000000000005', 'Off-White',
  '[{"size": "S", "stock": 10}, {"size": "M", "stock": 20}, {"size": "L", "stock": 15}, {"size": "XL", "stock": 8}]'::jsonb,
  now() - interval '17 days'
),
(
  '40000000-0000-0000-0000-000000000018',
  'Sculpted Poplin Column Shirt',
  'sculpted-poplin-column-shirt',
  3400, NULL,
  'Woven from fine Giza extra-long staple Egyptian cotton. Features a hidden covered placket, structured high collar, double-pleated back yoke, and crisp architectural cuffs.',
  'Minimalist high-density Egyptian cotton poplin shirt with crisp columnar drape.',
  'LÉVARO', '100% Egyptian Cotton', 'Men', 'LVR-AW26-SHT18',
  true, false, false, 'Tailored Fit', 'Egypt',
  ARRAY['SHIRT', 'POPLIN', 'GIZA', 'WHITE', 'TAILORED'],
  'Button-Up Shirt', '10000000-0000-0000-0000-000000000005', 'Pure White',
  '[{"size": "S", "stock": 6}, {"size": "M", "stock": 12}, {"size": "L", "stock": 8}, {"size": "XL", "stock": 4}]'::jsonb,
  now() - interval '18 days'
),
(
  '40000000-0000-0000-0000-000000000019',
  'Silk-Cotton Camp Collar Resort Shirt',
  'silk-cotton-camp-collar-resort-shirt',
  3600, NULL,
  'Woven with 55% mulberry silk and 45% long-staple cotton for a fluid, cooling drape. Clean open camp collar, mother of pearl buttons, and straight boxy hem.',
  'Airy silk-cotton resort shirt with relaxed convertible camp collar.',
  'LÉVARO Studio', 'Silk Satin', 'Men', 'LVR-AW26-CMP19',
  true, false, false, 'Relaxed Fit', 'Italy',
  ARRAY['SHIRT', 'SILK', 'RESORT', 'CAMP COLLAR', 'SUMMER'],
  'Button-Up Shirt', '10000000-0000-0000-0000-000000000005', 'Beige / Sand',
  '[{"size": "S", "stock": 5}, {"size": "M", "stock": 10}, {"size": "L", "stock": 7}, {"size": "XL", "stock": 3}]'::jsonb,
  now() - interval '19 days'
),
(
  '40000000-0000-0000-0000-000000000020',
  'Atelier Relaxed Linen Trousers',
  'atelier-relaxed-linen-trousers',
  3900, 3300,
  'Spun from 100% Normandy flax linen with a washed, rumpled surface texture. Elasticated drawstring waistband with tailored faux fly and clean straight leg.',
  'Heavyweight washed European linen trousers combining tailored lines with relaxed ease.',
  'LÉVARO Atelier', '100% Pure Linen', 'Men', 'LVR-AW26-LNN20',
  true, false, false, 'Wide Leg', 'Portugal',
  ARRAY['LINEN', 'TROUSERS', 'RELAXED', 'ATELIER', 'NORMANDY'],
  'Trousers', '10000000-0000-0000-0000-000000000005', 'Taupe',
  '[{"size": "30", "stock": 6}, {"size": "32", "stock": 10}, {"size": "34", "stock": 7}, {"size": "36", "stock": 3}]'::jsonb,
  now() - interval '20 days'
),

-- =================== WOMEN'S PRODUCTS (20) ===================

-- 6. Sculptural Coats & Trench (4)
(
  '40000000-0000-0000-0000-000000000021',
  'Sculpted Cocoon Wool Coat',
  'sculpted-cocoon-wool-coat',
  9200, NULL,
  'Architectural cocoon silhouette tailored from double-faced virgin wool. Dropped curved shoulders, minimalist shawl collar, single hidden snap closure, and deep slash pockets.',
  'Monumental cocoon coat cut from double-faced camel wool with curved sleeve geometry.',
  'LÉVARO Atelier', 'Wool & Cashmere', 'Women', 'LVR-AW26-WCT21',
  true, true, true, 'Oversized Fit', 'Italy',
  ARRAY['COAT', 'WOOL', 'SCULPTURAL', 'CAMEL', 'AW26'],
  'Coat', '20000000-0000-0000-0000-000000000001', 'Camel',
  '[{"size": "XS", "stock": 3}, {"size": "S", "stock": 5}, {"size": "M", "stock": 6}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '1 day'
),
(
  '40000000-0000-0000-0000-000000000022',
  'Minimalist Oversized Poplin Trench',
  'minimalist-oversized-poplin-trench',
  8800, 7900,
  'Water-resistant high-density technical poplin trench coat. Raglan sleeve construction, dramatic ankle length, storm collar, and tonal webbing waist belt.',
  'Voluminous waterproof cotton poplin trench coat engineered for dynamic fluid motion.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Women', 'LVR-AW26-WTR22',
  true, false, false, 'Tailored Fit', 'Portugal',
  ARRAY['TRENCH', 'POPLIN', 'WATERPROOF', 'MINIMALIST'],
  'Coat', '20000000-0000-0000-0000-000000000001', 'Beige / Sand',
  '[{"size": "XS", "stock": 2}, {"size": "S", "stock": 5}, {"size": "M", "stock": 4}, {"size": "L", "stock": 1}]'::jsonb,
  now() - interval '2 days'
),
(
  '40000000-0000-0000-0000-000000000023',
  'French Washed Heavy Linen Duster',
  'french-washed-heavy-linen-duster',
  5400, 4800,
  'Crafted from 100% Normandy washed flax linen. Ankle-grazing open silhouette with a self-tie belt, generous storm pockets, and raw hem finishes.',
  'Effortless lightweight linen duster coat with fluid movement for seasonal layering.',
  'LÉVARO Studio', '100% Pure Linen', 'Women', 'LVR-AW26-WDS23',
  true, false, false, 'Oversized Fit', 'France',
  ARRAY['LINEN', 'DUSTER', 'OVERSIZED', 'SUMMER', 'FRANCE'],
  'Jacket', '20000000-0000-0000-0000-000000000001', 'Beige / Sand',
  '[{"size": "XS", "stock": 3}, {"size": "S", "stock": 6}, {"size": "M", "stock": 5}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '3 days'
),
(
  '40000000-0000-0000-0000-000000000024',
  'Sculpted Draped Cape Coat',
  'sculpted-draped-cape-coat',
  8600, 7500,
  '500 GSM virgin wool double-cloth tailored with an integrated architectural shoulder cape. Hidden welt armholes, horn buttons, and fluid circular movement.',
  'Monumental cape coat cut from midnight virgin wool with dramatic draped wings.',
  'LÉVARO Noir', 'Wool & Cashmere', 'Women', 'LVR-AW26-WCJ24',
  true, false, false, 'Oversized Fit', 'France',
  ARRAY['CAPE', 'JACKET', 'WOOL', 'SCULPTURAL', 'NOIR'],
  'Coat', '20000000-0000-0000-0000-000000000001', 'Obsidian Black',
  '[{"size": "XS", "stock": 2}, {"size": "S", "stock": 4}, {"size": "M", "stock": 4}, {"size": "L", "stock": 1}]'::jsonb,
  now() - interval '4 days'
),

-- 7. Fluid Drapery & Pleats (4)
(
  '40000000-0000-0000-0000-000000000025',
  'High-Waist Fluid Pleated Culottes',
  'high-waist-fluid-pleated-culottes',
  4100, 3600,
  'Cut with an exaggerated high-rise and wide architectural legs. Permanent knife pleats create volume and liquid movement during stride.',
  'Architectural wide-leg fluid culottes tailored from Japanese triacetate crepe.',
  'LÉVARO Atelier', 'Linen Blend', 'Women', 'LVR-AW26-WTR25',
  true, false, false, 'Wide Leg', 'Italy',
  ARRAY['PLEATED', 'WIDE LEG', 'FLUID', 'CULOTTES', 'JAPANESE CREPE'],
  'Trousers', '20000000-0000-0000-0000-000000000002', 'Charcoal Grey',
  '[{"size": "XS", "stock": 5}, {"size": "S", "stock": 9}, {"size": "M", "stock": 8}, {"size": "L", "stock": 3}]'::jsonb,
  now() - interval '5 days'
),
(
  '40000000-0000-0000-0000-000000000026',
  'Micro-Pleated Column Maxi Skirt',
  'micro-pleated-column-maxi-skirt',
  3900, NULL,
  'Heat-set micro pleats tailored from Japanese fluid crepe. Elasticized interior waist with unbroken columnar lines that move effortlessly with the body.',
  'Sculptural permanent-pleat column skirt creating dramatic kinetic movement.',
  'LÉVARO Atelier', 'Linen Blend', 'Women', 'LVR-AW26-WSK26',
  true, false, false, 'Slim Fit', 'Japan',
  ARRAY['SKIRT', 'PLEATED', 'COLUMN', 'CREPE', 'KINETIC'],
  'Trousers', '20000000-0000-0000-0000-000000000002', 'Charcoal Grey',
  '[{"size": "XS", "stock": 4}, {"size": "S", "stock": 8}, {"size": "M", "stock": 6}, {"size": "L", "stock": 3}]'::jsonb,
  now() - interval '6 days'
),
(
  '40000000-0000-0000-0000-000000000027',
  'Wide Selvedge White Denim Jeans',
  'wide-selvedge-white-denim-jeans',
  4400, NULL,
  '12.5oz Japanese shuttle-loom white denim with natural ecru selvedge ID. Cut with a high waist, room through hips, and straight unhemmed cuff.',
  'Crisp off-white shuttle loom selvedge denim trousers with clean architectural rise.',
  'LÉVARO Atelier', 'Raw Denim', 'Women', 'LVR-AW26-WDT27',
  true, false, false, 'Relaxed Fit', 'Japan',
  ARRAY['DENIM', 'SELVEDGE', 'WHITE DENIM', 'RELAXED', 'JAPAN'],
  'Denim Jeans', '20000000-0000-0000-0000-000000000002', 'Pure White',
  '[{"size": "26", "stock": 4}, {"size": "28", "stock": 7}, {"size": "30", "stock": 6}, {"size": "32", "stock": 2}]'::jsonb,
  now() - interval '7 days'
),
(
  '40000000-0000-0000-0000-000000000028',
  'Minimalist Wool Suiting Halter',
  'minimalist-wool-suiting-halter',
  2900, NULL,
  'Tailored from Super 120s summer wool suiting. Clean high halter neckline, open architectural back, and tailored hem designed to tuck cleanly into high-rise trousers.',
  'Sculptural wool suiting halter top cut with an austere minimalist profile.',
  'LÉVARO Atelier', 'Wool & Cashmere', 'Women', 'LVR-AW26-WHT28',
  true, false, true, 'Slim Fit', 'Portugal',
  ARRAY['HALTER', 'SUITING', 'MINIMALIST', 'SUMMER WOOL'],
  'T-Shirt', '20000000-0000-0000-0000-000000000002', 'Charcoal Grey',
  '[{"size": "XS", "stock": 4}, {"size": "S", "stock": 8}, {"size": "M", "stock": 6}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '8 days'
),

-- 8. Modern Power Tailoring (4)
(
  '40000000-0000-0000-0000-000000000029',
  'Sharp Architectural Wool Blazer',
  'sharp-architectural-wool-blazer',
  7800, NULL,
  'Structured shoulders with hand-stitched canvassing in Italian wool gabardine. Minimalist single-button closure, razor-sharp peak lapels, and cinched waistline.',
  'Hourglass architectural blazer with structured roped shoulders and sharp peak lapels.',
  'LÉVARO Noir', 'Wool & Cashmere', 'Women', 'LVR-AW26-WBZ29',
  true, true, false, 'Tailored Fit', 'Italy',
  ARRAY['BLAZER', 'TAILORING', 'STRUCTURED', 'NOIR', 'POWER SUIT'],
  'Blazer', '20000000-0000-0000-0000-000000000003', 'Obsidian Black',
  '[{"size": "XS", "stock": 3}, {"size": "S", "stock": 6}, {"size": "M", "stock": 5}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '9 days'
),
(
  '40000000-0000-0000-0000-000000000030',
  'Wide-Leg Wool Gabardine Trousers',
  'wide-leg-wool-gabardine-trousers',
  4400, NULL,
  'Woven from fine Italian wool gabardine with deep front inverted pleats. Tailored with a clean high waistband and sweeping wide hem.',
  'Pristine tailored wide-leg trousers cut from heavy draping navy wool gabardine.',
  'LÉVARO Atelier', 'Wool & Cashmere', 'Women', 'LVR-AW26-WGB30',
  true, false, false, 'Wide Leg', 'Italy',
  ARRAY['TROUSERS', 'GABARDINE', 'WIDE LEG', 'TAILORING', 'NAVY'],
  'Trousers', '20000000-0000-0000-0000-000000000003', 'Midnight Navy',
  '[{"size": "XS", "stock": 4}, {"size": "S", "stock": 8}, {"size": "M", "stock": 7}, {"size": "L", "stock": 3}]'::jsonb,
  now() - interval '10 days'
),
(
  '40000000-0000-0000-0000-000000000031',
  'Sculptural Double-Weave Bolero',
  'sculptural-double-weave-bolero',
  6200, NULL,
  'Cropped bolero jacket tailored in double-faced Italian wool. High architectural mock neck, wide elbow-length sleeves, and clean open front styling.',
  'High-impact sculptural cropped wool bolero designed for minimalist layered form.',
  'LÉVARO Noir', 'Wool & Cashmere', 'Women', 'LVR-AW26-WBJ31',
  true, false, true, 'Boxy Fit', 'Italy',
  ARRAY['BOLERO', 'JACKET', 'WOOL', 'CROPPED', 'NOIR'],
  'Jacket', '20000000-0000-0000-0000-000000000003', 'Obsidian Black',
  '[{"size": "XS", "stock": 2}, {"size": "S", "stock": 5}, {"size": "M", "stock": 4}, {"size": "L", "stock": 1}]'::jsonb,
  now() - interval '11 days'
),
(
  '40000000-0000-0000-0000-000000000032',
  'High-Neck Cashmere Cocoon Knit',
  'high-neck-cashmere-cocoon-knit',
  5600, NULL,
  'Spun from 100% Grade-A Mongolian cashmere yarns. High architectural funnel neck, cocooning sleeves, and rib-knit finish along cuffs and hem.',
  'Sublime pure cashmere funnel neck knit offering cloud-like softness and architectural volume.',
  'LÉVARO Atelier', 'Wool & Cashmere', 'Women', 'LVR-AW26-WKN32',
  true, true, false, 'Relaxed Fit', 'Italy',
  ARRAY['CASHMERE', 'KNITWEAR', 'COCOON', 'MONGOLIAN CASHMERE'],
  'Knitwear', '20000000-0000-0000-0000-000000000003', 'Off-White',
  '[{"size": "XS", "stock": 3}, {"size": "S", "stock": 6}, {"size": "M", "stock": 5}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '12 days'
),

-- 9. Pure Silks & Crisp Poplin (4)
(
  '40000000-0000-0000-0000-000000000033',
  'Mulberry Silk Mandarin Blouse',
  'mulberry-silk-mandarin-blouse',
  4400, NULL,
  'Pure 22 Momme sandwashed mulberry silk. Features an architectural stand collar, concealed button placket, and wide French cuff details.',
  'Luxurious matte mulberry silk shirt with minimalist mandarin collar and flowing silhouette.',
  'LÉVARO Atelier', 'Silk Satin', 'Women', 'LVR-AW26-WBL33',
  true, false, true, 'Relaxed Fit', 'France',
  ARRAY['SILK', 'BLOUSE', 'MANDARIN', 'MULBERRY SILK', 'LUXURY'],
  'Button-Up Shirt', '20000000-0000-0000-0000-000000000004', 'Pure White',
  '[{"size": "XS", "stock": 4}, {"size": "S", "stock": 8}, {"size": "M", "stock": 6}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '13 days'
),
(
  '40000000-0000-0000-0000-000000000034',
  'Monochrome Asymmetric Poplin Shirt',
  'monochrome-asymmetric-poplin-shirt',
  3700, 3200,
  'Crafted from Egyptian Giza cotton poplin. Engineered with an asymmetric draped button placket, sculptural curved hemline, and elongated cuffs.',
  'Avant-garde crisp white poplin shirt with asymmetric architectural fastening.',
  'LÉVARO Studio', '100% Egyptian Cotton', 'Women', 'LVR-AW26-WSH34',
  true, false, true, 'Boxy Fit', 'Egypt',
  ARRAY['POPLIN', 'SHIRT', 'ASYMMETRIC', 'GIZA COTTON', 'WHITE'],
  'Button-Up Shirt', '20000000-0000-0000-0000-000000000004', 'Pure White',
  '[{"size": "XS", "stock": 5}, {"size": "S", "stock": 10}, {"size": "M", "stock": 7}, {"size": "L", "stock": 3}]'::jsonb,
  now() - interval '14 days'
),
(
  '40000000-0000-0000-0000-000000000035',
  'Draped Cowl Back Silk Top',
  'draped-cowl-back-silk-top',
  3600, NULL,
  'Woven from 100% pure silk crepe de Chine. Features a high modest boat neckline at the front and a sweeping draped cowl back with minimal ribbon ties.',
  'Sensuous draped silk top featuring a dramatic open cowl back line.',
  'LÉVARO Atelier', 'Silk Satin', 'Women', 'LVR-AW26-WTP35',
  true, false, false, 'Relaxed Fit', 'France',
  ARRAY['SILK', 'TOP', 'DRAPE', 'COWL BACK', 'PARIS'],
  'T-Shirt', '20000000-0000-0000-0000-000000000004', 'Taupe',
  '[{"size": "XS", "stock": 4}, {"size": "S", "stock": 8}, {"size": "M", "stock": 5}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '15 days'
),
(
  '40000000-0000-0000-0000-000000000036',
  'Architectural Poplin Peplum Blouse',
  'architectural-poplin-peplum-blouse',
  3800, 3300,
  '120s two-ply Giza cotton poplin blouse tailored with internal boning. Geometric flared peplum hem, standing collar, and concealed mother-of-pearl buttons.',
  'Structured Egyptian poplin blouse with architectural fluted peplum silhouette.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Women', 'LVR-AW26-WPB36',
  true, false, false, 'Tailored Fit', 'Egypt',
  ARRAY['BLOUSE', 'POPLIN', 'PEPLUM', 'STRUCTURED'],
  'Button-Up Shirt', '20000000-0000-0000-0000-000000000004', 'Off-White',
  '[{"size": "XS", "stock": 4}, {"size": "S", "stock": 7}, {"size": "M", "stock": 5}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '16 days'
),

-- 10. Haute Atelier & Column Gowns (4)
(
  '40000000-0000-0000-0000-000000000037',
  'Fluid Bias-Cut Silk Column Gown',
  'fluid-bias-cut-silk-column-gown',
  6400, NULL,
  'Cut on the bias from heavy 30 Momme mulberry silk satin. Skims the silhouette with an effortless pendulum drape, delicate spaghetti straps, and ankle-grazing raw hem.',
  'Floor-length minimalist silk slip gown cut on the bias for fluid kinetic motion.',
  'LÉVARO Atelier', 'Silk Satin', 'Women', 'LVR-AW26-WDR37',
  true, true, true, 'Relaxed Fit', 'France',
  ARRAY['GOWN', 'DRESS', 'SILK', 'BIAS CUT', 'EVENING'],
  'Suit', '20000000-0000-0000-0000-000000000005', 'Obsidian Black',
  '[{"size": "XS", "stock": 4}, {"size": "S", "stock": 7}, {"size": "M", "stock": 5}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '17 days'
),
(
  '40000000-0000-0000-0000-000000000038',
  'Structured Wool Column Midi Dress',
  'structured-wool-column-midi-dress',
  5900, NULL,
  'Tailored from compact virgin wool crepe. Clean square neckline, darted bodice contouring, invisible back zipper, and high rear walking vent.',
  'Minimalist architectural column dress cut from dense Italian wool crepe.',
  'LÉVARO Noir', 'Wool & Cashmere', 'Women', 'LVR-AW26-WCD38',
  true, false, false, 'Tailored Fit', 'Portugal',
  ARRAY['DRESS', 'COLUMN', 'WOOL CREPE', 'NOIR', 'FORMAL'],
  'Suit', '20000000-0000-0000-0000-000000000005', 'Obsidian Black',
  '[{"size": "XS", "stock": 3}, {"size": "S", "stock": 6}, {"size": "M", "stock": 4}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '18 days'
),
(
  '40000000-0000-0000-0000-000000000039',
  'Monochrome Raw-Edge Silk Slip',
  'monochrome-raw-edge-silk-slip',
  5200, NULL,
  'Sandwashed heavy silk charmeuse with matte exterior finish. Delicate French bust darts, subtle side slit, and frayed raw hemline.',
  'Pure sandwashed silk slip dress embodying relaxed minimalist evening ease.',
  'LÉVARO Noir', 'Silk Satin', 'Women', 'LVR-AW26-WSD39',
  true, true, false, 'Relaxed Fit', 'France',
  ARRAY['SLIP', 'SILK', 'RAW EDGE', 'NOIR', 'EVENING'],
  'Suit', '20000000-0000-0000-0000-000000000005', 'Obsidian Black',
  '[{"size": "XS", "stock": 3}, {"size": "S", "stock": 6}, {"size": "M", "stock": 5}, {"size": "L", "stock": 2}]'::jsonb,
  now() - interval '19 days'
),
(
  '40000000-0000-0000-0000-000000000040',
  'Boxy Makò Cotton Knit Top',
  'boxy-mako-cotton-knit-top',
  3400, NULL,
  'Knitted from extra-long staple Egyptian Makò cotton. Compact jersey knit with clean finished crewneck, ribbed cuffs, and truncated square silhouette.',
  'Crisp architectural cotton knit sweater with minimalist square proportions.',
  'LÉVARO Studio', '100% Egyptian Cotton', 'Women', 'LVR-AW26-WCK40',
  true, false, false, 'Boxy Fit', 'Italy',
  ARRAY['KNITWEAR', 'MAKO COTTON', 'CREWNECK', 'MINIMAL'],
  'Knitwear', '20000000-0000-0000-0000-000000000005', 'Pure White',
  '[{"size": "XS", "stock": 5}, {"size": "S", "stock": 9}, {"size": "M", "stock": 7}, {"size": "L", "stock": 3}]'::jsonb,
  now() - interval '20 days'
),

-- =================== ACCESSORIES & OBJECTS (10) ===================

-- 11. Hand-Cut Acetate Eyewear (3)
(
  '40000000-0000-0000-0000-000000000041',
  'Sculpted Geometric Acetate Shades',
  'sculpted-geometric-acetate-shades',
  3200, NULL,
  'Milled from 8mm cured Italian Mazzucchelli block acetate. Features thick beveled temples, 5-barrel custom hinges, laser-engraved atelier insignia, and Category 3 Carl Zeiss UV400 lenses.',
  'Substantial 8mm geometric Italian acetate sunglasses with flat Carl Zeiss optics.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Unisex', 'LVR-AW26-ACC41',
  true, true, true, 'Regular Fit', 'Italy',
  ARRAY['EYEWEAR', 'ACETATE', 'SUNGLASSES', 'MAZZUCCHELLI', 'ZEISS'],
  'Accessories', '30000000-0000-0000-0000-000000000001', 'Obsidian Black',
  '[{"size": "ONE SIZE", "stock": 25}]'::jsonb,
  now() - interval '1 day'
),
(
  '40000000-0000-0000-0000-000000000042',
  'Monolith Beveled Sunglasses',
  'monolith-beveled-sunglasses',
  3400, 2950,
  'Bold architectural rectangular silhouette hand-polished over 72 hours. Features 0-base completely flat dark lenses and wire core reinforced temples.',
  'Sharp monolithic rectangular sunglasses cut from pitch black cured acetate.',
  'LÉVARO Noir', '100% Egyptian Cotton', 'Unisex', 'LVR-AW26-ACC42',
  true, false, false, 'Regular Fit', 'Italy',
  ARRAY['SUNGLASSES', 'MONOLITH', 'NOIR', 'RECTANGULAR', 'FLAT LENS'],
  'Accessories', '30000000-0000-0000-0000-000000000001', 'Obsidian Black',
  '[{"size": "ONE SIZE", "stock": 20}]'::jsonb,
  now() - interval '2 days'
),
(
  '40000000-0000-0000-0000-000000000043',
  'Tortoiseshell Architectural Frames',
  'tortoiseshell-architectural-frames',
  3300, NULL,
  'Custom amber tortoiseshell acetate cured in Lombardy. Soft beveled edges, gold-toned interior core wire, and smoke gradient Carl Zeiss lenses.',
  'Architectural amber tortoiseshell acetate frames with gradient UV protection.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Unisex', 'LVR-AW26-ACC43',
  true, false, true, 'Regular Fit', 'Italy',
  ARRAY['EYEWEAR', 'TORTOISESHELL', 'ZEISS', 'ACCESSORIES'],
  'Accessories', '30000000-0000-0000-0000-000000000001', 'Amber Gold',
  '[{"size": "ONE SIZE", "stock": 18}]'::jsonb,
  now() - interval '3 days'
),

-- 12. Tuscan Vachetta Leather (3)
(
  '40000000-0000-0000-0000-000000000044',
  'Saddle Leather Minimalist Cardholder',
  'saddle-leather-minimalist-cardholder',
  1900, NULL,
  'Handcrafted from 1.8mm full-grain Tuscan vegetable tanned Vachetta leather. Four card slots and a central bill pocket with beveled, burnished beeswax edges.',
  'Artisanal Tuscan vegetable-tanned leather cardholder designed to develop rich patina.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Unisex', 'LVR-AW26-ACC44',
  true, true, false, 'Regular Fit', 'Italy',
  ARRAY['LEATHER', 'CARDHOLDER', 'VACHETTA', 'TUSCANY', 'ESSENTIAL'],
  'Accessories', '30000000-0000-0000-0000-000000000002', 'Obsidian Black',
  '[{"size": "ONE SIZE", "stock": 35}]'::jsonb,
  now() - interval '4 days'
),
(
  '40000000-0000-0000-0000-000000000045',
  'Monochrome Leather Atelier Tote',
  'monochrome-leather-atelier-tote',
  6800, NULL,
  'Constructed from supple Italian box calfskin leather with microfiber suede lining. Structural reinforced base, interior laptop compartment, and dual tubular shoulder straps.',
  'Architectural daily leather tote bag engineered from seamless full-grain calfskin.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Unisex', 'LVR-AW26-ACC45',
  true, true, true, 'Regular Fit', 'Italy',
  ARRAY['BAG', 'TOTE', 'CALFSKIN', 'LEATHER', 'ATELIER'],
  'Accessories', '30000000-0000-0000-0000-000000000002', 'Obsidian Black',
  '[{"size": "ONE SIZE", "stock": 12}]'::jsonb,
  now() - interval '5 days'
),
(
  '40000000-0000-0000-0000-000000000046',
  'Minimalist Crossbody Leather Pouch',
  'minimalist-crossbody-leather-pouch',
  3500, 3100,
  'Compact architectural crossbody bag cut from pebbled grain calfskin. Features magnetic flap closure, subtle silver heat-stamped atelier coordinates, and adjustable leather strap.',
  'Sleek geometric crossbody pouch for essential transit items in obsidian leather.',
  'LÉVARO Studio', '100% Egyptian Cotton', 'Unisex', 'LVR-AW26-ACC46',
  true, false, false, 'Regular Fit', 'Portugal',
  ARRAY['BAG', 'CROSSBODY', 'PEBBLED LEATHER', 'MINIMAL'],
  'Accessories', '30000000-0000-0000-0000-000000000002', 'Charcoal Grey',
  '[{"size": "ONE SIZE", "stock": 18}]'::jsonb,
  now() - interval '6 days'
),

-- 13. Sculptural Objects & Silver (2)
(
  '40000000-0000-0000-0000-000000000047',
  'Sculptural Sterling Silver Signet Cuff',
  'sculptural-sterling-silver-signet-cuff',
  4200, NULL,
  'Cast in solid 925 sterling silver with a brushed matte finish. Knife-edge beveled exterior and mirror-polished interior with hallmarked atelier stamp.',
  'Solid 925 sterling silver architectural open cuff bracelet with tactile knife-edge profile.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Unisex', 'LVR-AW26-ACC47',
  true, false, true, 'Regular Fit', 'Egypt',
  ARRAY['JEWELRY', 'SILVER', 'CUFF', 'STERLING SILVER', 'OBJECT'],
  'Accessories', '30000000-0000-0000-0000-000000000003', 'Pure White',
  '[{"size": "S/M", "stock": 8}, {"size": "M/L", "stock": 10}]'::jsonb,
  now() - interval '7 days'
),
(
  '40000000-0000-0000-0000-000000000048',
  'Machined Brass Monolith Keyring',
  'machined-brass-monolith-keyring',
  1400, NULL,
  'Precision CNC milled from a solid billet of naval brass. Raw unlacquered finish engineered to age uniquely with natural handling. Threaded screw bar closure.',
  'Solid naval brass geometric key ring milled from a single block of raw metal.',
  'LÉVARO Studio', '100% Egyptian Cotton', 'Unisex', 'LVR-AW26-ACC48',
  true, false, false, 'Regular Fit', 'Egypt',
  ARRAY['BRASS', 'KEYRING', 'CNC', 'NAVAL BRASS', 'OBJECT'],
  'Accessories', '30000000-0000-0000-0000-000000000003', 'Amber Gold',
  '[{"size": "ONE SIZE", "stock": 40}]'::jsonb,
  now() - interval '8 days'
),

-- 14. Goodyear Welted Footwear (2)
(
  '40000000-0000-0000-0000-000000000049',
  'Goodyear Welted Commando Leather Boot',
  'goodyear-welted-commando-leather-boot',
  9800, NULL,
  'Handcrafted in Northampton using Goodyear welt construction. Waxed Italian box calf leather upper, storm welt seal, and rugged Vibram commando lug sole.',
  'Substantial Goodyear welted military ankle boots crafted from durable oiled box calf.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Men', 'LVR-AW26-ACC49',
  true, true, false, 'Regular Fit', 'United Kingdom',
  ARRAY['BOOTS', 'FOOTWEAR', 'GOODYEAR WELTED', 'VIBRAM', 'NORTHAMPTON'],
  'Footwear', '30000000-0000-0000-0000-000000000004', 'Obsidian Black',
  '[{"size": "41", "stock": 4}, {"size": "42", "stock": 7}, {"size": "43", "stock": 6}, {"size": "44", "stock": 3}]'::jsonb,
  now() - interval '9 days'
),
(
  '40000000-0000-0000-0000-000000000050',
  'Minimalist Box Calf Derby Shoes',
  'minimalist-box-calf-derby-shoes',
  8400, 7500,
  'Plain-toe minimalist derby shoes constructed from fine French box calf. Hand-channeled leather soles, calfskin interior lining, and blind eyelets.',
  'Architectural plain-toe derby shoes in flawless black calfskin with beveled waist.',
  'LÉVARO Atelier', '100% Egyptian Cotton', 'Unisex', 'LVR-AW26-ACC50',
  true, false, true, 'Regular Fit', 'Italy',
  ARRAY['DERBY', 'SHOES', 'FOOTWEAR', 'BOX CALF', 'HANDMADE'],
  'Footwear', '30000000-0000-0000-0000-000000000004', 'Obsidian Black',
  '[{"size": "40", "stock": 3}, {"size": "41", "stock": 5}, {"size": "42", "stock": 8}, {"size": "43", "stock": 6}, {"size": "44", "stock": 2}]'::jsonb,
  now() - interval '10 days'
);


-- ----------------------------------------------------------------------------
-- الخطوة 5: إضافة صور المعرض عالية الجودة في جدول product_images
-- ----------------------------------------------------------------------------

INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
-- Product 1
('40000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80', 'Kinetics Technical Parka Front', true, 0),
('40000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1200&q=80', 'Kinetics Technical Parka Collar Detail', false, 1),
-- Product 2
('40000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80', 'Cotton Gabardine Trench Sand', true, 0),
('40000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80', 'Gabardine Trench Storm Flap', false, 1),
-- Product 3
('40000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1622445268023-863a34a62174?auto=format&fit=crop&w=1200&q=80', 'Raw Edge Wool Overshirt Olive', true, 0),
('40000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80', 'Raw Edge Wool Overshirt Pocket', false, 1),
-- Product 4
('40000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=80', 'Melton Wool Bomber Obsidian', true, 0),
('40000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=80', 'Melton Wool Bomber Metal Zipper', false, 1),
-- Product 5
('40000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80', 'Monolith Wool Overcoat Obsidian', true, 0),
('40000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80', 'Monolith Wool Overcoat Profile', false, 1),
-- Product 6
('40000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80', 'Double-Breasted Cashmere Blazer', true, 0),
('40000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80', 'Double-Breasted Blazer Lapel', false, 1),
-- Product 7
('40000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'Fluid Pleated Wide-Leg Trousers', true, 0),
('40000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80', 'Fluid Pleated Trousers Drape', false, 1),
-- Product 8
('40000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80', 'Double-Face Wool Peacoat Navy', true, 0),
('40000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80', 'Double-Face Wool Peacoat Anchor Button', false, 1),
-- Product 9
('40000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80', 'Raw Selvedge Denim Trucker Front', true, 0),
('40000000-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=80', 'Raw Selvedge Denim Trucker Stitch', false, 1),
-- Product 10
('40000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=80', 'Selvedge Relaxed Tapered Jeans', true, 0),
('40000000-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=80', 'Selvedge Red-Line ID Cuff', false, 1),
-- Product 11
('40000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1200&q=80', 'Technical Selvedge Cargo Front', true, 0),
('40000000-0000-0000-0000-000000000011', 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=80', 'Technical Cargo Pocket Construction', false, 1),
-- Product 12
('40000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80', 'Wool Flannel Cigarette Pants Black', true, 0),
('40000000-0000-0000-0000-000000000012', 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80', 'Wool Flannel Pants Waistband', false, 1),
-- Product 13
('40000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80', 'Brushed Mohair Knit Sweater Front', true, 0),
('40000000-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80', 'Brushed Mohair Halo Texture', false, 1),
-- Product 14
('40000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=1200&q=80', 'Biella Merino Turtleneck Charcoal', true, 0),
('40000000-0000-0000-0000-000000000014', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80', 'Biella Merino Rib Collar', false, 1),
-- Product 15
('40000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=80', 'Loopback Sweatshirt Grey', true, 0),
('40000000-0000-0000-0000-000000000015', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80', 'Loopback Sweatshirt Seam', false, 1),
-- Product 16
('40000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=80', 'French Terry Hoodie Black', true, 0),
('40000000-0000-0000-0000-000000000016', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80', 'French Terry Structural Hood', false, 1),
-- Product 17
('40000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80', 'Boxy Heavyweight Atelier Tee Off-White', true, 0),
('40000000-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=80', 'Boxy Heavyweight Tee Collar', false, 1),
-- Product 18
('40000000-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80', 'Sculpted Poplin Shirt Pure White', true, 0),
('40000000-0000-0000-0000-000000000018', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80', 'Sculpted Poplin Shirt Cuff', false, 1),
-- Product 19
('40000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80', 'Silk-Cotton Resort Shirt Sand', true, 0),
('40000000-0000-0000-0000-000000000019', 'https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80', 'Silk-Cotton Resort Camp Collar', false, 1),
-- Product 20
('40000000-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'Relaxed Linen Trousers Taupe', true, 0),
('40000000-0000-0000-0000-000000000020', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80', 'Relaxed Linen Trousers Texture', false, 1),

-- Product 21
('40000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80', 'Sculpted Cocoon Wool Coat Camel', true, 0),
('40000000-0000-0000-0000-000000000021', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80', 'Sculpted Cocoon Wool Collar', false, 1),
-- Product 22
('40000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=80', 'Oversized Poplin Trench Sand', true, 0),
('40000000-0000-0000-0000-000000000022', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80', 'Oversized Poplin Trench Belt', false, 1),
-- Product 23
('40000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?auto=format&fit=crop&w=1200&q=80', 'Heavy Linen Duster Sand', true, 0),
('40000000-0000-0000-0000-000000000023', 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&w=1200&q=80', 'Heavy Linen Duster Open Front', false, 1),
-- Product 24
('40000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80', 'Draped Cape Coat Obsidian', true, 0),
('40000000-0000-0000-0000-000000000024', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1200&q=80', 'Draped Cape Coat Sleeve Motion', false, 1),
-- Product 25
('40000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80', 'High-Waist Fluid Culottes Charcoal', true, 0),
('40000000-0000-0000-0000-000000000025', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'High-Waist Fluid Culottes Stride', false, 1),
-- Product 26
('40000000-0000-0000-0000-000000000026', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=1200&q=80', 'Micro-Pleated Maxi Skirt Charcoal', true, 0),
('40000000-0000-0000-0000-000000000026', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'Micro-Pleated Maxi Skirt Motion', false, 1),
-- Product 27
('40000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80', 'Wide Selvedge White Denim Jeans', true, 0),
('40000000-0000-0000-0000-000000000027', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80', 'Wide Selvedge White Denim Hem', false, 1),
-- Product 28
('40000000-0000-0000-0000-000000000028', 'https://images.unsplash.com/photo-1525450824786-227cbef70703?auto=format&fit=crop&w=1200&q=80', 'Wool Suiting Halter Charcoal', true, 0),
('40000000-0000-0000-0000-000000000028', 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=80', 'Wool Suiting Halter Open Back', false, 1),
-- Product 29
('40000000-0000-0000-0000-000000000029', 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=80', 'Architectural Wool Blazer Obsidian', true, 0),
('40000000-0000-0000-0000-000000000029', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=80', 'Architectural Wool Blazer Peak Lapel', false, 1),
-- Product 30
('40000000-0000-0000-0000-000000000030', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1200&q=80', 'Wool Gabardine Trousers Navy', true, 0),
('40000000-0000-0000-0000-000000000030', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80', 'Wool Gabardine Trousers Silhouette', false, 1),
-- Product 31
('40000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=1200&q=80', 'Double-Weave Bolero Black', true, 0),
('40000000-0000-0000-0000-000000000031', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1200&q=80', 'Double-Weave Bolero Shoulder Line', false, 1),
-- Product 32
('40000000-0000-0000-0000-000000000032', 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=80', 'Cashmere Cocoon Knit Off-White', true, 0),
('40000000-0000-0000-0000-000000000032', 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1200&q=80', 'Cashmere Cocoon Knit Collar', false, 1),
-- Product 33
('40000000-0000-0000-0000-000000000033', 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=1200&q=80', 'Mulberry Silk Mandarin Blouse White', true, 0),
('40000000-0000-0000-0000-000000000033', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80', 'Mulberry Silk French Cuff', false, 1),
-- Product 34
('40000000-0000-0000-0000-000000000034', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80', 'Asymmetric Poplin Shirt White', true, 0),
('40000000-0000-0000-0000-000000000034', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80', 'Asymmetric Poplin Buttoning', false, 1),
-- Product 35
('40000000-0000-0000-0000-000000000035', 'https://images.unsplash.com/photo-1534126511673-b6899657816a?auto=format&fit=crop&w=1200&q=80', 'Draped Cowl Back Silk Top Taupe', true, 0),
('40000000-0000-0000-0000-000000000035', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80', 'Draped Cowl Back Ribbon Tie', false, 1),
-- Product 36
('40000000-0000-0000-0000-000000000036', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80', 'Poplin Peplum Blouse Off-White', true, 0),
('40000000-0000-0000-0000-000000000036', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80', 'Poplin Peplum Fluted Hem', false, 1),
-- Product 37
('40000000-0000-0000-0000-000000000037', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80', 'Fluid Bias-Cut Silk Gown Black', true, 0),
('40000000-0000-0000-0000-000000000037', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80', 'Fluid Bias-Cut Gown Stride', false, 1),
-- Product 38
('40000000-0000-0000-0000-000000000038', 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80', 'Structured Wool Column Dress Black', true, 0),
('40000000-0000-0000-0000-000000000038', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80', 'Structured Column Dress Profile', false, 1),
-- Product 39
('40000000-0000-0000-0000-000000000039', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80', 'Raw-Edge Silk Slip Black', true, 0),
('40000000-0000-0000-0000-000000000039', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1200&q=80', 'Raw-Edge Silk Slip Texture', false, 1),
-- Product 40
('40000000-0000-0000-0000-000000000040', 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&w=1200&q=80', 'Boxy Makò Cotton Knit White', true, 0),
('40000000-0000-0000-0000-000000000040', 'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=1200&q=80', 'Boxy Makò Cotton Knit Cuff', false, 1),

-- Product 41
('40000000-0000-0000-0000-000000000041', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80', 'Geometric Acetate Shades Obsidian', true, 0),
('40000000-0000-0000-0000-000000000041', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80', 'Geometric Acetate Shades Flat Lens', false, 1),
-- Product 42
('40000000-0000-0000-0000-000000000042', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80', 'Monolith Beveled Sunglasses Black', true, 0),
('40000000-0000-0000-0000-000000000042', 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80', 'Monolith Beveled Temple Angle', false, 1),
-- Product 43
('40000000-0000-0000-0000-000000000043', 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80', 'Tortoiseshell Architectural Frames', true, 0),
('40000000-0000-0000-0000-000000000043', 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=1200&q=80', 'Tortoiseshell Acetate Texture', false, 1),
-- Product 44
('40000000-0000-0000-0000-000000000044', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80', 'Saddle Leather Cardholder Obsidian', true, 0),
('40000000-0000-0000-0000-000000000044', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', 'Saddle Leather Edge Burnish', false, 1),
-- Product 45
('40000000-0000-0000-0000-000000000045', 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80', 'Leather Atelier Tote Black', true, 0),
('40000000-0000-0000-0000-000000000045', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80', 'Leather Atelier Tote Compartment', false, 1),
-- Product 46
('40000000-0000-0000-0000-000000000046', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', 'Crossbody Leather Pouch Charcoal', true, 0),
('40000000-0000-0000-0000-000000000046', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80', 'Crossbody Leather Pouch Strap Angle', false, 1),
-- Product 47
('40000000-0000-0000-0000-000000000047', 'https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?auto=format&fit=crop&w=1200&q=80', 'Sterling Silver Signet Cuff Matte', true, 0),
('40000000-0000-0000-0000-000000000047', 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80', 'Sterling Silver Hallmark Engraving', false, 1),
-- Product 48
('40000000-0000-0000-0000-000000000048', 'https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?auto=format&fit=crop&w=1200&q=80', 'Machined Brass Keyring Gold', true, 0),
('40000000-0000-0000-0000-000000000048', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=1200&q=80', 'Machined Brass Threaded Bar', false, 1),
-- Product 49
('40000000-0000-0000-0000-000000000049', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=80', 'Goodyear Welted Commando Boot Black', true, 0),
('40000000-0000-0000-0000-000000000049', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80', 'Goodyear Welted Boot Vibram Sole', false, 1),
-- Product 50
('40000000-0000-0000-0000-000000000050', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80', 'Box Calf Derby Shoes Obsidian', true, 0),
('40000000-0000-0000-0000-000000000050', 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=1200&q=80', 'Box Calf Derby Leather Channel Sole', false, 1);

-- ============================================================================
-- تم التنفيذ بنجاح: تم تفريغ البيانات السابقة بالكامل، وإنشاء الأقسام 
-- والكولكشنات الجديدة، وإدراج 50 منتجاً فاخراً مكتمل التفاصيل وربطها بالكامل!
-- ============================================================================
