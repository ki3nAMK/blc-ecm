// Creates one real account per role (admin, 3 sellers, 1 affiliate, 2 buyers) through the
// actual auth flow (POST /auth/create + signature verify — same as a real MetaMask login),
// then elevates roles the same way the app itself requires:
//   - ADMIN / SELLER have no self-service upgrade path, so the role is flipped directly in
//     MongoDB (matches how this was done manually during development/testing).
//   - AFFILIATE has a real endpoint (POST /users/me/become-affiliate), so that's used instead.
// Each seller then gets 3 products created and listed through the REAL on-chain flow:
// POST /products (mints the ERC1155 + registers the seller, via the backend's admin signer)
// followed by the seller's own wallet approving + calling Escrow.list(...) directly — exactly
// what the "List on Blockchain" button does in the UI — then PATCH /products/:id/publish.
//
// Uses Hardhat's default deterministic accounts (indices 0-6), so re-running this script is
// idempotent: existing accounts just log back in, and sellers that already have products skip
// product creation instead of duplicating their catalog.
//
// Requires the full dev stack running (Hardhat node, MongoDB, backend on :3000).
// Run this BEFORE 02-mock-data.js — it depends on these accounts/products existing.
//
// Usage: node scripts/01-generate-accounts.js

const {
  ethers,
  ROLE_ACCOUNTS,
  getHardhatWallet,
  getProvider,
  apiCall,
  authHeaders,
  loginAccount,
  withMongo,
  ObjectId,
  toBytes32,
  getContractAddresses,
  loadAbi,
} = require('./config');

// Compact per-item specs, expanded into full CreateProductDto payloads by buildCatalog().
// Each category maps 1:1 to a seller (see productsForSeller), so every seller ends up with
// the same number of products from one consistent category.

function slug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function joinWithAnd(arr) {
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(', ')}, and ${arr[arr.length - 1]}`;
}

// Approximate names for every hex used across the catalog below, so the long-form
// description can say "Available in Black, White" instead of raw hex codes.
const COLOR_NAMES = {
  '#000000': 'Black', '#FFFFFF': 'White', '#4A4A4A': 'Charcoal', '#C2A877': 'Khaki',
  '#5A3E2B': 'Brown', '#E8DCC8': 'Sand', '#2E4A3E': 'Forest Green', '#C41E3A': 'Crimson',
  '#6B4423': 'Chestnut', '#1B1B1B': 'Jet Black', '#4A7C59': 'Olive Green', '#E8A33D': 'Amber',
  '#9CA3AF': 'Grey', '#2E4A6B': 'Navy', '#7A7A7A': 'Stone Grey', '#1E3A5F': 'Deep Navy',
  '#8B7355': 'Taupe', '#F2C14E': 'Mustard', '#E8A3B8': 'Blush Pink', '#808080': 'Slate Grey',
  '#3B5998': 'Denim Blue', '#7A1F2B': 'Burgundy', '#1B2A4A': 'Midnight Blue', '#7A6C5D': 'Taupe Grey',
  '#2F2F2F': 'Graphite', '#F5F0E6': 'Ivory', '#87A08C': 'Sage Green', '#5B2A86': 'Plum',
  '#C0C0C0': 'Silver', '#D4AF37': 'Gold', '#2E2E2E': 'Graphite Black', '#B08D57': 'Bronze',
  '#3B2A1A': 'Espresso', '#C41E5A': 'Magenta',
};

function colorNames(colors) {
  return colors.map((hex) => COLOR_NAMES[hex] || hex);
}

// A few rotating variants per category so 17-product catalogs don't all read identically —
// selected by index, combined with each item's own name/tags/colors/sizes for real per-item variety.
const MATERIAL_CARE = {
  Shoes: [
    'Built with a durable outsole and reinforced stitching designed to hold up to daily wear. Wipe the upper clean with a soft, damp cloth and let it air-dry away from direct heat — avoid the washing machine, which can weaken the sole bonding over time.',
    'Constructed from carefully selected upper materials for a balance of comfort and durability. Use a soft brush to remove surface dirt, spot-clean with a mild soap solution, and stuff with paper when not in use to help the shoe keep its shape.',
    'Finished with attention to detail at every seam. Rotate with another pair when possible — giving the cushioning time to decompress between wears noticeably extends its lifespan — and store away from direct sunlight to prevent yellowing.',
  ],
  Apparel: [
    'Made from a quality-checked fabric chosen for both comfort and shape retention. Machine wash cold with like colors, tumble dry low, and avoid high heat when ironing to keep the fibers looking new for longer.',
    'Cut and finished for a fit that holds up wash after wash. We recommend washing inside-out to protect any printed or embroidered details, and laying flat to dry instead of hanging when possible.',
    'Every piece goes through a quality check before it ships. Gentle machine wash or hand wash in cold water, avoid bleach, and store folded rather than on a hanger for fabrics prone to stretching.',
  ],
  Accessories: [
    'Crafted with attention to hardware and stitching detail. Keep away from prolonged moisture and direct sunlight, and store in a dust bag or soft pouch when not in use to protect the finish.',
    'Finished by hand for a refined look that holds up over time. Wipe down with a soft, dry cloth after use and condition periodically if the piece is leather-based to keep it supple.',
    'Built to be an everyday companion. Avoid contact with harsh chemicals or perfume sprays, and store flat or upright rather than compressed to help it keep its original shape.',
  ],
};

// Written as real HTML (not Markdown) because the frontend's content detector only
// recognizes Markdown when the string STARTS with markdown syntax (e.g. a leading "#"
// or list marker) — anything else, including our lead-in sentence, falls through to an
// HTML->Markdown converter that mangles plain "###"/"-" text. Blog posts already use
// this same real-HTML approach (see scripts/03-mock-blog.js) and render correctly.
function buildDescription(item, category, index) {
  const intro = `${item.description}${item.subDescription ? ` ${item.subDescription}` : ''}`;

  const highlights = [
    `Designed for: <strong>${item.gender.join(' / ')}</strong>`,
    `Great for ${joinWithAnd(item.tags)} looks.`,
    `Available in ${item.colors.length} colorway${item.colors.length > 1 ? 's' : ''}: ${joinWithAnd(colorNames(item.colors))}.`,
    item.sizes[0] === 'One Size'
      ? 'One size, designed to fit most people comfortably.'
      : `${item.sizes.length} size options available: ${item.sizes.join(', ')}.`,
  ];

  const materialCare = MATERIAL_CARE[category][index % MATERIAL_CARE[category].length];

  const sizingNote = item.sizes[0] === 'One Size'
    ? 'This item is designed to fit most people — no size chart needed.'
    : category === 'Shoes'
      ? 'Sizes are listed in EU. If you are between sizes, we recommend sizing up half a size. See the Size Chart on this page for full US/UK/EU conversions and foot-length measurements.'
      : 'If you prefer a relaxed fit, consider sizing up. See the Size Chart on this page for detailed measurements before choosing your size.';

  const boxContents = [
    `1 x ${item.name}`,
    'Care instruction card',
    ...(item.price >= 1 ? ['Dust bag for storage and protection'] : []),
  ];

  const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

  return [
    `<p>${intro}</p>`,
    '<h3>✨ Highlights</h3>',
    list(highlights),
    '<h3>🧵 Material &amp; Craftsmanship</h3>',
    `<p>${materialCare}</p>`,
    '<h3>📏 Fit &amp; Sizing</h3>',
    `<p>${sizingNote}</p>`,
    "<h3>📦 What's in the Box</h3>",
    list(boxContents),
    '<h3>🚚 Shipping &amp; Buyer Protection</h3>',
    list([
      'Ships within 1-2 business days from the seller.',
      'Payment is held in on-chain escrow and only released to the seller after you confirm receipt — real buyer protection on every order.',
      'Free returns within 7 days if the item is unused and in its original condition.',
    ]),
  ].join('\n');
}

function buildCatalog(category, prefix, items) {
  return items.map((item, index) => {
    const code = `${prefix}-${String(index + 1).padStart(3, '0')}`;
    return {
      name: item.name,
      description: buildDescription(item, category, index),
      subDescription: item.subDescription,
      code,
      sku: `${code}-${item.skuSuffix}`,
      category,
      gender: item.gender,
      colors: item.colors,
      sizes: item.sizes,
      tags: item.tags,
      images: [1, 2, 3].map((n) => `https://picsum.photos/seed/${slug(item.name)}-${n}/640/480`),
      price: item.price,
      escrow: item.escrow,
      quantity: item.quantity,
    };
  });
}

const SHOES = [
  { name: 'Classic Runner Sneakers', description: 'Lightweight everyday running sneakers with breathable mesh upper and cushioned sole.', subDescription: 'Breathable, lightweight, all-day comfort.', gender: ['Men', 'Women'], colors: ['#000000', '#FFFFFF'], sizes: ['39', '40', '41', '42', '43'], tags: ['running', 'sneakers', 'casual'], price: 0.9, escrow: 0.45, quantity: 30, skuSuffix: '42' },
  { name: 'Urban Canvas Trainers', description: 'Minimalist canvas trainers built for city walking and everyday wear.', subDescription: 'Minimalist city trainers.', gender: ['Unisex'], colors: ['#4A4A4A', '#C2A877'], sizes: ['38', '39', '40', '41'], tags: ['canvas', 'trainers', 'street'], price: 0.65, escrow: 0.3, quantity: 30, skuSuffix: '42' },
  { name: 'Trail Blazer Hiking Boots', description: 'Waterproof hiking boots with reinforced ankle support for rugged terrain.', subDescription: 'Waterproof, rugged, reinforced ankle support.', gender: ['Men'], colors: ['#5A3E2B'], sizes: ['41', '42', '43', '44'], tags: ['hiking', 'boots', 'outdoor'], price: 1.6, escrow: 0.8, quantity: 20, skuSuffix: '43' },
  { name: 'Canvas Slip-On Loafers', description: 'Easy slip-on canvas loafers with a flexible sole, built for warm-weather comfort.', subDescription: 'Slip-on, flexible, breathable.', gender: ['Unisex'], colors: ['#E8DCC8', '#2E4A3E'], sizes: ['38', '39', '40', '41', '42'], tags: ['loafers', 'canvas', 'slip-on'], price: 0.55, escrow: 0.25, quantity: 30, skuSuffix: '41' },
  { name: 'High-Top Basketball Sneakers', description: 'Cushioned high-top sneakers with ankle support, built for the court and the street.', subDescription: 'High-top, cushioned, ankle support.', gender: ['Men', 'Women'], colors: ['#C41E3A', '#000000'], sizes: ['40', '41', '42', '43', '44'], tags: ['basketball', 'high-top', 'sport'], price: 1.2, escrow: 0.55, quantity: 25, skuSuffix: '43' },
  { name: 'Suede Chelsea Boots', description: 'Classic suede Chelsea boots with elastic side panels and a pull tab.', subDescription: 'Suede finish, elastic side panels.', gender: ['Men'], colors: ['#6B4423', '#1B1B1B'], sizes: ['40', '41', '42', '43'], tags: ['chelsea', 'boots', 'suede'], price: 1.4, escrow: 0.7, quantity: 18, skuSuffix: '42' },
  { name: 'Trail Running Shoes', description: 'Grippy trail running shoes with a rock plate and aggressive outsole lugs.', subDescription: 'Rock plate, aggressive grip.', gender: ['Unisex'], colors: ['#4A7C59', '#E8A33D'], sizes: ['39', '40', '41', '42', '43'], tags: ['trail', 'running', 'outdoor'], price: 1.0, escrow: 0.45, quantity: 22, skuSuffix: '42' },
  { name: 'Classic Leather Oxfords', description: 'Hand-finished leather oxford shoes with a stitched cap-toe, built for formal wear.', subDescription: 'Hand-finished leather, cap-toe.', gender: ['Men'], colors: ['#000000', '#5A3E2B'], sizes: ['40', '41', '42', '43', '44'], tags: ['oxfords', 'formal', 'leather'], price: 1.8, escrow: 0.9, quantity: 15, skuSuffix: '42' },
  { name: 'Retro Skate Shoes', description: 'Low-profile skate shoes with a reinforced toe cap and vulcanized rubber sole.', subDescription: 'Reinforced toe, vulcanized sole.', gender: ['Unisex'], colors: ['#FFFFFF', '#1E3A5F'], sizes: ['38', '39', '40', '41', '42'], tags: ['skate', 'retro', 'casual'], price: 0.7, escrow: 0.32, quantity: 26, skuSuffix: '41' },
  { name: 'Waterproof Rain Boots', description: 'Fully waterproof rubber rain boots with a non-slip tread for wet conditions.', subDescription: 'Waterproof rubber, non-slip tread.', gender: ['Unisex'], colors: ['#F2C14E', '#1B1B1B'], sizes: ['37', '38', '39', '40', '41', '42'], tags: ['rain', 'waterproof', 'boots'], price: 0.85, escrow: 0.38, quantity: 24, skuSuffix: '40' },
  { name: 'Platform Espadrilles', description: 'Jute-wrapped platform espadrilles with a canvas upper, made for summer days.', subDescription: 'Jute platform, canvas upper.', gender: ['Women'], colors: ['#E8DCC8', '#E8A3B8'], sizes: ['36', '37', '38', '39', '40'], tags: ['espadrille', 'platform', 'summer'], price: 0.6, escrow: 0.27, quantity: 22, skuSuffix: '38' },
  { name: 'Steel-Toe Work Boots', description: 'Rugged steel-toe work boots with slip-resistant soles, built for job-site durability.', subDescription: 'Steel toe, slip-resistant sole.', gender: ['Men'], colors: ['#5A3E2B'], sizes: ['41', '42', '43', '44', '45'], tags: ['work', 'steel-toe', 'industrial'], price: 1.5, escrow: 0.7, quantity: 18, skuSuffix: '43' },
  { name: 'Knit Slip-On Sneakers', description: 'Sock-fit knit sneakers with a featherweight foam sole for all-day wear.', subDescription: 'Sock-fit knit, featherweight sole.', gender: ['Unisex'], colors: ['#9CA3AF', '#2E4A6B'], sizes: ['38', '39', '40', '41', '42'], tags: ['knit', 'sneaker', 'lightweight'], price: 0.5, escrow: 0.22, quantity: 28, skuSuffix: '40' },
  { name: 'Studded Combat Boots', description: 'Lace-up combat boots with subtle stud detailing and a chunky lug sole.', subDescription: 'Lace-up, chunky lug sole.', gender: ['Women'], colors: ['#000000'], sizes: ['37', '38', '39', '40'], tags: ['combat', 'boots', 'edgy'], price: 1.3, escrow: 0.6, quantity: 16, skuSuffix: '38' },
  { name: 'Mesh Trail Sandals', description: 'Breathable trail sandals with an adjustable strap system and grippy outsole.', subDescription: 'Adjustable straps, grippy sole.', gender: ['Unisex'], colors: ['#7A7A7A', '#E8A33D'], sizes: ['38', '39', '40', '41', '42', '43'], tags: ['sandals', 'trail', 'outdoor'], price: 0.4, escrow: 0.18, quantity: 30, skuSuffix: '41' },
  { name: 'Vintage Leather Boat Shoes', description: 'Hand-sewn leather boat shoes with a non-marking rubber sole, a timeless classic.', subDescription: 'Hand-sewn leather, non-marking sole.', gender: ['Men'], colors: ['#1E3A5F', '#8B7355'], sizes: ['40', '41', '42', '43', '44'], tags: ['boat', 'leather', 'classic'], price: 0.95, escrow: 0.42, quantity: 20, skuSuffix: '42' },
  { name: 'Cushioned Walking Shoes', description: 'Orthopedic-friendly walking shoes with extra cushioning and arch support.', subDescription: 'Extra cushioning, arch support.', gender: ['Unisex'], colors: ['#FFFFFF', '#9CA3AF'], sizes: ['38', '39', '40', '41', '42', '43'], tags: ['walking', 'comfort', 'casual'], price: 0.75, escrow: 0.34, quantity: 26, skuSuffix: '41' },
];

const APPAREL = [
  { name: 'Everyday Cotton Tee', description: '100% organic cotton t-shirt with a relaxed fit, available in soft neutral tones.', subDescription: 'Organic cotton, relaxed fit.', gender: ['Unisex'], colors: ['#FFFFFF', '#000000', '#808080'], sizes: ['S', 'M', 'L', 'XL'], tags: ['t-shirt', 'cotton', 'basics'], price: 0.25, escrow: 0.1, quantity: 50, skuSuffix: 'M' },
  { name: 'Slim Fit Denim Jacket', description: 'Classic slim-fit denim jacket with a durable stonewash finish.', subDescription: 'Stonewash finish, slim fit.', gender: ['Men', 'Women'], colors: ['#3B5998'], sizes: ['S', 'M', 'L'], tags: ['denim', 'jacket', 'outerwear'], price: 1.1, escrow: 0.5, quantity: 25, skuSuffix: 'M' },
  { name: 'Quilted Puffer Vest', description: 'Lightweight quilted puffer vest for layering in cooler weather.', subDescription: 'Lightweight, packable, warm.', gender: ['Unisex'], colors: ['#1B1B1B', '#7A1F2B'], sizes: ['M', 'L', 'XL'], tags: ['vest', 'puffer', 'layering'], price: 0.85, escrow: 0.4, quantity: 25, skuSuffix: 'M' },
  { name: 'Merino Wool Sweater', description: 'Soft merino wool sweater with a ribbed crew neck, breathable and naturally odor-resistant.', subDescription: 'Merino wool, ribbed crew neck.', gender: ['Unisex'], colors: ['#7A6C5D', '#1B2A4A'], sizes: ['S', 'M', 'L', 'XL'], tags: ['sweater', 'wool', 'winter'], price: 1.3, escrow: 0.6, quantity: 20, skuSuffix: 'M' },
  { name: 'Relaxed Fit Chino Pants', description: 'Everyday chino pants with a relaxed fit and a durable cotton-twill weave.', subDescription: 'Relaxed fit, cotton-twill.', gender: ['Men'], colors: ['#8B7355', '#2F2F2F'], sizes: ['30', '32', '34', '36'], tags: ['chinos', 'pants', 'casual'], price: 0.6, escrow: 0.25, quantity: 30, skuSuffix: '32' },
  { name: 'Water-Resistant Windbreaker', description: 'Packable windbreaker jacket with a water-resistant shell and adjustable hood.', subDescription: 'Packable, water-resistant, adjustable hood.', gender: ['Unisex'], colors: ['#1E3A5F', '#F2C14E'], sizes: ['S', 'M', 'L', 'XL'], tags: ['windbreaker', 'jacket', 'outdoor'], price: 0.95, escrow: 0.45, quantity: 25, skuSuffix: 'M' },
  { name: 'Graphic Print Hoodie', description: 'Heavyweight cotton-blend hoodie with a soft fleece lining and front kangaroo pocket.', subDescription: 'Heavyweight, fleece-lined.', gender: ['Unisex'], colors: ['#1B1B1B', '#9CA3AF'], sizes: ['S', 'M', 'L', 'XL'], tags: ['hoodie', 'streetwear', 'casual'], price: 0.75, escrow: 0.35, quantity: 28, skuSuffix: 'M' },
  { name: 'Linen Button-Down Shirt', description: 'Breathable linen button-down shirt, perfect for warm-weather everyday wear.', subDescription: 'Breathable linen, relaxed fit.', gender: ['Men', 'Women'], colors: ['#F5F0E6', '#87A08C'], sizes: ['S', 'M', 'L', 'XL'], tags: ['linen', 'shirt', 'summer'], price: 0.5, escrow: 0.2, quantity: 30, skuSuffix: 'M' },
  { name: 'High-Waisted Yoga Leggings', description: 'Squat-proof high-waisted leggings with a four-way stretch performance fabric.', subDescription: 'Squat-proof, four-way stretch.', gender: ['Women'], colors: ['#1B1B1B', '#5B2A86'], sizes: ['XS', 'S', 'M', 'L'], tags: ['yoga', 'leggings', 'activewear'], price: 0.45, escrow: 0.2, quantity: 32, skuSuffix: 'M' },
  { name: 'Flannel Plaid Shirt', description: 'Brushed cotton flannel shirt in a classic plaid pattern, soft and warm.', subDescription: 'Brushed cotton, classic plaid.', gender: ['Men'], colors: ['#7A1F2B', '#2E4A3E'], sizes: ['S', 'M', 'L', 'XL'], tags: ['flannel', 'plaid', 'casual'], price: 0.55, escrow: 0.25, quantity: 28, skuSuffix: 'M' },
  { name: 'Tailored Wool Blazer', description: 'Structured wool-blend blazer with a tailored fit, suitable for the office or evenings out.', subDescription: 'Structured fit, wool-blend.', gender: ['Men', 'Women'], colors: ['#2F2F2F', '#1E3A5F'], sizes: ['S', 'M', 'L'], tags: ['blazer', 'wool', 'formal'], price: 1.7, escrow: 0.8, quantity: 14, skuSuffix: 'M' },
  { name: 'Cotton Jersey Joggers', description: 'Soft cotton-jersey joggers with a tapered leg and ribbed cuffs, made for lounging.', subDescription: 'Tapered leg, ribbed cuffs.', gender: ['Unisex'], colors: ['#9CA3AF', '#1B1B1B'], sizes: ['S', 'M', 'L', 'XL'], tags: ['joggers', 'cotton', 'loungewear'], price: 0.4, escrow: 0.18, quantity: 32, skuSuffix: 'M' },
  { name: 'Pleated Midi Skirt', description: 'Flowing pleated midi skirt with an elastic waistband, dresses up or down easily.', subDescription: 'Flowing pleats, elastic waist.', gender: ['Women'], colors: ['#1B1B1B', '#7A1F2B'], sizes: ['XS', 'S', 'M', 'L'], tags: ['skirt', 'midi', 'pleated'], price: 0.5, escrow: 0.22, quantity: 24, skuSuffix: 'M' },
  { name: 'Performance Running Shorts', description: 'Quick-dry running shorts with a built-in liner and a zip pocket for essentials.', subDescription: 'Quick-dry, built-in liner.', gender: ['Unisex'], colors: ['#1B1B1B', '#1E3A5F'], sizes: ['S', 'M', 'L', 'XL'], tags: ['shorts', 'running', 'activewear'], price: 0.3, escrow: 0.14, quantity: 34, skuSuffix: 'M' },
  { name: 'Cable Knit Cardigan', description: 'Oversized cable knit cardigan with wooden toggle buttons, cozy and versatile.', subDescription: 'Oversized, wooden toggle buttons.', gender: ['Women'], colors: ['#F5F0E6', '#7A6C5D'], sizes: ['S', 'M', 'L'], tags: ['cardigan', 'knit', 'layering'], price: 1.0, escrow: 0.45, quantity: 20, skuSuffix: 'M' },
  { name: 'Waxed Canvas Field Jacket', description: 'Rugged waxed canvas field jacket with corduroy collar and multiple utility pockets.', subDescription: 'Waxed canvas, corduroy collar.', gender: ['Men'], colors: ['#4A7C59', '#8B7355'], sizes: ['S', 'M', 'L', 'XL'], tags: ['field-jacket', 'waxed', 'outdoor'], price: 1.6, escrow: 0.75, quantity: 16, skuSuffix: 'M' },
  { name: 'Silk Blend Camisole', description: 'Delicate silk-blend camisole with adjustable straps, layers beautifully under blazers.', subDescription: 'Silk-blend, adjustable straps.', gender: ['Women'], colors: ['#1B1B1B', '#E8A3B8'], sizes: ['XS', 'S', 'M', 'L'], tags: ['camisole', 'silk', 'layering'], price: 0.35, escrow: 0.16, quantity: 26, skuSuffix: 'M' },
];

const ACCESSORIES = [
  { name: 'Leather Crossbody Bag', description: 'Full-grain leather crossbody bag with adjustable strap and interior pockets.', subDescription: 'Full-grain leather, adjustable strap.', gender: ['Women'], colors: ['#5A3E2B', '#000000'], sizes: ['One Size'], tags: ['bag', 'leather', 'crossbody'], price: 1.3, escrow: 0.65, quantity: 20, skuSuffix: 'OS' },
  { name: 'Minimalist Wrist Watch', description: 'Slim-profile analog watch with a stainless steel mesh band.', subDescription: 'Slim profile, stainless steel mesh band.', gender: ['Unisex'], colors: ['#C0C0C0', '#D4AF37'], sizes: ['One Size'], tags: ['watch', 'accessories', 'minimalist'], price: 2.0, escrow: 1.0, quantity: 15, skuSuffix: 'OS' },
  { name: 'Polarized Aviator Sunglasses', description: 'UV400 polarized aviator sunglasses with a lightweight metal frame.', subDescription: 'UV400 polarized, lightweight metal frame.', gender: ['Unisex'], colors: ['#2E2E2E', '#B08D57'], sizes: ['One Size'], tags: ['sunglasses', 'aviator', 'summer'], price: 0.5, escrow: 0.2, quantity: 30, skuSuffix: 'OS' },
  { name: 'Canvas Backpack', description: 'Durable canvas backpack with a padded laptop sleeve and multiple organizer pockets.', subDescription: 'Padded laptop sleeve, organizer pockets.', gender: ['Unisex'], colors: ['#4A4A4A', '#6B4423'], sizes: ['One Size'], tags: ['backpack', 'canvas', 'travel'], price: 0.9, escrow: 0.4, quantity: 20, skuSuffix: 'OS' },
  { name: 'Leather Belt', description: 'Full-grain leather belt with a brushed nickel buckle, hand-cut and stitched.', subDescription: 'Full-grain leather, brushed nickel buckle.', gender: ['Men'], colors: ['#3B2A1A', '#000000'], sizes: ['32', '34', '36', '38'], tags: ['belt', 'leather', 'formal'], price: 0.35, escrow: 0.15, quantity: 35, skuSuffix: '34' },
  { name: 'Wool Beanie', description: 'Warm ribbed-knit wool beanie with a folded cuff, one size fits most.', subDescription: 'Ribbed-knit wool, folded cuff.', gender: ['Unisex'], colors: ['#1B1B1B', '#7A1F2B', '#2E4A3E'], sizes: ['One Size'], tags: ['beanie', 'wool', 'winter'], price: 0.2, escrow: 0.08, quantity: 40, skuSuffix: 'OS' },
  { name: 'Silk Scarf', description: 'Lightweight printed silk scarf, hand-rolled edges, versatile for any season.', subDescription: 'Printed silk, hand-rolled edges.', gender: ['Women'], colors: ['#C41E5A', '#E8A33D'], sizes: ['One Size'], tags: ['scarf', 'silk', 'accessories'], price: 0.4, escrow: 0.18, quantity: 25, skuSuffix: 'OS' },
  { name: 'Woven Card Holder', description: 'Slim woven card holder with RFID-blocking lining, holds up to 8 cards.', subDescription: 'RFID-blocking, holds up to 8 cards.', gender: ['Unisex'], colors: ['#2E2E2E', '#8B7355'], sizes: ['One Size'], tags: ['wallet', 'card-holder', 'minimalist'], price: 0.15, escrow: 0.06, quantity: 40, skuSuffix: 'OS' },
  { name: 'Leather Duffel Bag', description: 'Spacious full-grain leather duffel with brass hardware, built for weekend travel.', subDescription: 'Full-grain leather, brass hardware.', gender: ['Unisex'], colors: ['#5A3E2B', '#1B1B1B'], sizes: ['One Size'], tags: ['duffel', 'leather', 'travel'], price: 1.9, escrow: 0.9, quantity: 12, skuSuffix: 'OS' },
  { name: 'Structured Baseball Cap', description: 'Six-panel structured baseball cap with an adjustable strap and curved brim.', subDescription: 'Six-panel, adjustable strap.', gender: ['Unisex'], colors: ['#1E3A5F', '#FFFFFF'], sizes: ['One Size'], tags: ['cap', 'hat', 'casual'], price: 0.18, escrow: 0.08, quantity: 40, skuSuffix: 'OS' },
  { name: 'Stainless Steel Cufflinks', description: 'Polished stainless steel cufflinks with a subtle engraved edge, for formal occasions.', subDescription: 'Polished steel, engraved edge.', gender: ['Men'], colors: ['#C0C0C0', '#D4AF37'], sizes: ['One Size'], tags: ['cufflinks', 'formal', 'metal'], price: 0.3, escrow: 0.14, quantity: 22, skuSuffix: 'OS' },
  { name: 'Beaded Statement Necklace', description: 'Hand-strung beaded statement necklace, a bold layer for any outfit.', subDescription: 'Hand-strung beads, statement piece.', gender: ['Women'], colors: ['#D4AF37', '#C41E5A'], sizes: ['One Size'], tags: ['necklace', 'jewelry', 'statement'], price: 0.25, escrow: 0.11, quantity: 26, skuSuffix: 'OS' },
  { name: 'Leather Gloves', description: 'Lined leather gloves with a snug fit, built for warmth without losing dexterity.', subDescription: 'Lined, snug fit.', gender: ['Unisex'], colors: ['#1B1B1B', '#5A3E2B'], sizes: ['S', 'M', 'L'], tags: ['gloves', 'leather', 'winter'], price: 0.32, escrow: 0.15, quantity: 24, skuSuffix: 'M' },
  { name: 'Woven Straw Hat', description: 'Wide-brim woven straw hat with a grosgrain band, essential for sunny days.', subDescription: 'Wide-brim, grosgrain band.', gender: ['Unisex'], colors: ['#E8DCC8', '#1B1B1B'], sizes: ['One Size'], tags: ['hat', 'straw', 'summer'], price: 0.22, escrow: 0.1, quantity: 28, skuSuffix: 'OS' },
  { name: 'Chrome Aviator Keychain', description: 'Solid chrome keychain with a smooth aviator-style clasp, a small everyday-carry upgrade.', subDescription: 'Solid chrome, aviator clasp.', gender: ['Unisex'], colors: ['#C0C0C0'], sizes: ['One Size'], tags: ['keychain', 'accessories', 'gift'], price: 0.08, escrow: 0.03, quantity: 45, skuSuffix: 'OS' },
  { name: 'Quilted Makeup Pouch', description: 'Compact quilted makeup pouch with a wipeable lining, fits neatly into any bag.', subDescription: 'Wipeable lining, compact.', gender: ['Women'], colors: ['#1B1B1B', '#E8A3B8'], sizes: ['One Size'], tags: ['pouch', 'makeup', 'travel'], price: 0.12, escrow: 0.05, quantity: 40, skuSuffix: 'OS' },
  { name: 'Titanium Frame Reading Glasses', description: 'Ultra-light titanium frame reading glasses with spring hinges for a comfortable fit.', subDescription: 'Ultra-light titanium, spring hinges.', gender: ['Unisex'], colors: ['#1B1B1B', '#8B7355'], sizes: ['One Size'], tags: ['glasses', 'reading', 'minimalist'], price: 0.28, escrow: 0.13, quantity: 26, skuSuffix: 'OS' },
];

const PRODUCT_CATALOG = [
  ...buildCatalog('Shoes', 'SNK', SHOES),
  ...buildCatalog('Apparel', 'APP', APPAREL),
  ...buildCatalog('Accessories', 'ACC', ACCESSORIES),
];

function productsForSeller(sellerIndex) {
  const perSeller = PRODUCT_CATALOG.length / 3;
  return PRODUCT_CATALOG.slice(sellerIndex * perSeller, sellerIndex * perSeller + perSeller);
}

async function upgradeRole(session, role) {
  if (session.user.role === role) return session;
  await withMongo(async (db) => {
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { role } },
    );
  });
  const me = await apiCall('/users/me', { headers: authHeaders(session.accessToken) });
  return { ...session, user: me };
}

async function ensureAffiliate(session) {
  if (session.user.role === 'AFFILIATE') return session;
  await apiCall('/users/me/become-affiliate', {
    method: 'POST',
    headers: authHeaders(session.accessToken),
  });
  const me = await apiCall('/users/me', { headers: authHeaders(session.accessToken) });
  return { ...session, user: me };
}

async function createAndListProduct(sellerSession, sellerWallet, addresses, abis, product) {
  const created = await apiCall('/products', {
    method: 'POST',
    headers: authHeaders(sellerSession.accessToken),
    body: JSON.stringify(product),
  });
  const productId = created.id || (created._id && created._id.toString());
  const tokenId = created.tokenId;

  const myErc1155 = new ethers.Contract(addresses.myErc1155, abis.MyERC1155, sellerWallet);
  const escrow = new ethers.Contract(addresses.escrow, abis.Escrow, sellerWallet);

  const isApproved = await myErc1155.isApprovedForAll(sellerWallet.address, addresses.escrow);
  if (!isApproved) {
    await (await myErc1155.setApprovalForAll(addresses.escrow, true)).wait();
  }

  const listTx = await escrow.list(
    toBytes32(productId),
    ethers.parseEther(String(product.escrow)),
    ethers.parseEther(String(product.price)),
    product.quantity,
    tokenId,
  );
  await listTx.wait();

  await apiCall(`/products/${productId}/publish`, {
    method: 'PATCH',
    headers: authHeaders(sellerSession.accessToken),
  });

  return productId;
}

function describe(session, cfg, note = '') {
  return {
    role: cfg.role,
    name: cfg.name,
    address: session.wallet.address,
    privateKey: session.wallet.privateKey,
    note,
  };
}

async function main() {
  const provider = getProvider();
  const addresses = getContractAddresses();
  const abis = { MyERC1155: loadAbi('MyERC1155'), Escrow: loadAbi('Escrow') };

  console.log('=== Generating one account per role ===');
  const summary = [];

  console.log('\nAdmin...');
  let adminSession = await loginAccount(getHardhatWallet(ROLE_ACCOUNTS.admin.index, provider));
  adminSession = await upgradeRole(adminSession, 'ADMIN');
  summary.push(describe(adminSession, ROLE_ACCOUNTS.admin));

  for (let i = 0; i < ROLE_ACCOUNTS.sellers.length; i++) {
    const cfg = ROLE_ACCOUNTS.sellers[i];
    console.log(`\n${cfg.name} (${cfg.role})...`);

    let session = await loginAccount(getHardhatWallet(cfg.index, provider));
    session = await upgradeRole(session, 'SELLER');
    summary.push(describe(session, cfg));

    const existing = await apiCall('/products/me?page=1&limit=1', {
      headers: authHeaders(session.accessToken),
    });
    const alreadyHasProducts = (existing?.pagination?.total ?? 0) > 0;

    if (alreadyHasProducts) {
      console.log(`  already has ${existing.pagination.total} product(s) — skipping product creation`);
      continue;
    }

    const sellerWallet = getHardhatWallet(cfg.index, provider);
    for (const product of productsForSeller(i)) {
      process.stdout.write(`  listing "${product.name}"... `);
      const productId = await createAndListProduct(session, sellerWallet, addresses, abis, product);
      console.log(`done (${productId})`);
    }
  }

  console.log(`\n${ROLE_ACCOUNTS.affiliate.name} (${ROLE_ACCOUNTS.affiliate.role})...`);
  let affiliateSession = await loginAccount(getHardhatWallet(ROLE_ACCOUNTS.affiliate.index, provider));
  affiliateSession = await ensureAffiliate(affiliateSession);
  summary.push(
    describe(affiliateSession, ROLE_ACCOUNTS.affiliate, `referralCode=${affiliateSession.user.referralCode}`),
  );

  for (const cfg of ROLE_ACCOUNTS.buyers) {
    console.log(`\n${cfg.name} (${cfg.role})...`);
    const session = await loginAccount(getHardhatWallet(cfg.index, provider));
    summary.push(describe(session, cfg));
  }

  console.log('\n=== Accounts ready ===');
  console.table(summary);
  console.log('\nImport any private key above into MetaMask to log in as that account in the UI.');
  console.log('Next: node scripts/02-mock-data.js');
}

main().catch((err) => {
  console.error('\nAccount generation failed:', err);
  process.exit(1);
});
