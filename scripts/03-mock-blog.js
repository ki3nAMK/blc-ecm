// Seeds a diverse set of published blog posts (real cover photos, varied topics/content)
// as the ADMIN account, and removes any pre-existing posts first so the result is a
// reproducible default dataset rather than an ever-growing pile.
//
// Safe to run any time the backend + Mongo are up. Does NOT require 01/02 to have run
// first (only needs the ADMIN account, which this script logs into/creates itself), but
// it's listed alongside them since `00-reset-data.js` clears the `blogs` collection too.
//
// Usage: node scripts/03-mock-blog.js

const { getHardhatWallet, ROLE_ACCOUNTS, apiCall, authHeaders, loginAccount } = require('./config');

const POSTS = [
  {
    title: '5 Trends Shaping Sneaker Culture in 2026',
    excerpt: 'From chunky retros to bio-based foams, here is what is actually moving units on the marketplace this year.',
    tags: ['Sneakers', 'Trends'],
    coverUrl: 'https://picsum.photos/seed/blog-sneaker-trends-2026/1200/675',
    content: `<p>Sneaker culture never sits still, but a few threads from this year are strong enough to call out. We pulled sales and wishlist data from across the marketplace to see what buyers are actually chasing, not just what is loud on social media.</p>
<p><strong>1. Chunky retros are cooling off, technical runners are heating up.</strong> Two years of maximalist soles trained everyone's eye, and now the pendulum is swinging toward slimmer, performance-driven silhouettes — the kind you would actually take on a run.</p>
<p><strong>2. Bio-based foams and recycled uppers are no longer a niche add-on.</strong> Listings that mention recycled ocean plastic or plant-based EVA are converting noticeably better than identical pairs without that detail in the description.</p>
<p><strong>3. Collaborations are getting hyper-local.</strong> Instead of global mega-drops, sellers are finding more traction pairing with regional artists and small studios — a trend the marketplace's independent-seller model is a natural fit for.</p>
<p><strong>4. Resale and provenance matter more.</strong> Buyers want to know a pair is authentic and where it came from — one of the reasons every purchase here is settled on-chain with a verifiable record.</p>
<p><strong>5. Comfort tech beats logo size.</strong> Cushioning, breathability, and fit are outranking branding in what shoppers search for first.</p>
<p>We will keep tracking these as the seasons turn — subscribe to seller updates if you want first pick when a trend-aligned drop lands.</p>`,
  },
  {
    title: 'The Art of the Sole: Sustainable Materials in Modern Footwear',
    excerpt: 'A look at the recycled rubber, plant-based leather, and low-waste stitching techniques our sellers are adopting.',
    tags: ['Sustainability', 'Craftsmanship'],
    coverUrl: 'https://picsum.photos/seed/blog-sustainable-materials/1200/675',
    content: `<p>"Sustainable" gets printed on a lot of tags, so we asked a handful of sellers on the marketplace to walk us through what actually changes on the workbench when a shoe is built with lower impact in mind.</p>
<p>The most common shift is in the outsole: reclaimed rubber ground down from factory offcuts and old tires, remolded under heat rather than freshly vulcanized. It performs almost identically to virgin rubber but avoids a resource-heavy production step entirely.</p>
<p>Uppers are following a similar path. Mycelium leather (grown from mushroom root structure) and pineapple-leaf fiber weaves are showing up in accessory lines and select apparel, offering a genuine leather-like hand-feel without livestock inputs.</p>
<p>Even stitching patterns have changed — several small studios have moved to single-thread construction that uses roughly 20% less material per pair and, as a side benefit, makes repairs far easier than a fused sole ever could.</p>
<p>None of this is about perfection; it is about sellers making one better material choice at a time. Look for the "Sustainability" tag on product listings if this is something you want to support with your next order.</p>`,
  },
  {
    title: 'Sizing Guide: How to Get the Perfect Fit for Boots and Sneakers',
    excerpt: 'Half sizes, width profiles, and the one measurement most people skip — everything you need before you check out.',
    tags: ['Guides', 'Fit'],
    coverUrl: 'https://picsum.photos/seed/blog-sizing-guide/1200/675',
    content: `<p>Nothing kills the excitement of a new pair faster than a fit that is just slightly wrong. Here is the short version of what we tell buyers who message a seller asking "will this fit me?"</p>
<p><strong>Measure at the end of the day.</strong> Feet swell slightly over the day, so an evening measurement gives you the true worst-case length — measure heel to longest toe, standing, with your weight on the foot.</p>
<p><strong>Width matters as much as length.</strong> If your foot measures wider than the "D" standard width most sneaker lasts are built on, size up half a size rather than forcing a narrow fit — cramped toe boxes are the single most common return reason.</p>
<p><strong>Boots run differently than sneakers.</strong> Leather boots stretch slightly with wear, especially across the vamp, so a snug-but-not-tight fit out of the box is normal and expected to loosen slightly in the first two weeks.</p>
<p><strong>Read the listing's fit notes.</strong> Sellers on the marketplace are encouraged to note whether a model runs small, true to size, or large — that single line in the description is worth more than any generic size chart.</p>
<p>Still unsure? Message the seller directly from the product page before you buy — most respond within a day and would rather answer a sizing question than process a return.</p>`,
  },
  {
    title: 'Introducing Our Affiliate Program: Earn Crypto for Every Referral',
    excerpt: 'Share your referral link, and earn a share of every purchase it drives — paid out automatically, on-chain.',
    tags: ['Announcements', 'Affiliate'],
    coverUrl: 'https://picsum.photos/seed/blog-affiliate-program/1200/675',
    content: `<p>We are opening up the Affiliate Program to anyone who wants to help grow the marketplace and get paid for it — no application backlog, no manual payout requests.</p>
<p>Here is how it works: switch your account to an Affiliate role, and you get a unique referral link and code. Share it however makes sense for your audience — a blog post, a social profile, a group chat. When someone checks out after following your link, a commission is calculated automatically and settled straight to your wallet as part of the same on-chain transaction as the sale.</p>
<p>Because payouts happen at the smart-contract level, there is no waiting period, no minimum threshold, and no dashboard to reconcile — you can verify every payment yourself on-chain if you want to.</p>
<p>Your affiliate dashboard shows referred orders, pending and completed commission, and click-through stats in real time, so you always know what is converting.</p>
<p>If you already have an audience that cares about independent sellers, sustainable materials, or just good sneakers, this is the most direct way to turn that into ongoing income. Head to your account settings to switch on the Affiliate role and grab your link.</p>`,
  },
  {
    title: 'Behind the Scenes: Meet the Independent Sellers on Our Marketplace',
    excerpt: 'Three small studios, three very different stories — and what it takes to run a shop entirely on-chain.',
    tags: ['Community', 'Sellers'],
    coverUrl: 'https://picsum.photos/seed/blog-meet-sellers/1200/675',
    content: `<p>Behind every listing on the marketplace is a seller who chose to run their shop without a traditional payment processor sitting in the middle. We asked three of them what that actually looks like day to day.</p>
<p><strong>Seller One</strong> started with a single line of canvas sneakers made in small batches, and says the biggest surprise was how much trust an on-chain order history builds with repeat buyers — "people can see the shop has real order volume, not just claims."</p>
<p><strong>Seller Two</strong> runs a leather goods line and leans heavily on the review system, since word of mouth is still how most new customers find a small studio in a marketplace this size.</p>
<p><strong>Seller Three</strong> ships apparel and told us the biggest adjustment was pricing in ETH rather than a fiat currency — watching the market and updating listings so the real-world price stays consistent for buyers.</p>
<p>What they all agreed on: settlement happening automatically through escrow, without a payment processor holding funds or taking a cut, is the single biggest difference from selling on a traditional platform.</p>
<p>New sellers are always welcome — registration takes a few minutes and your first listing can go live the same day.</p>`,
  },
  {
    title: 'Care Guide: Keeping Canvas and Leather Sneakers Fresh All Season',
    excerpt: 'Simple, low-effort habits that add real months to the life of your favorite pair.',
    tags: ['Guides', 'Care'],
    coverUrl: 'https://picsum.photos/seed/blog-sneaker-care/1200/675',
    content: `<p>Good sneakers are an investment, and most of what shortens their life is avoidable. A few habits make the biggest difference.</p>
<p><strong>Canvas:</strong> spot-clean with a soft brush and a mild detergent solution rather than tossing pairs in a washing machine — machine washing breaks down the glue bonding the sole to the upper far faster than hand cleaning does.</p>
<p><strong>Leather:</strong> condition every 4-6 weeks with a proper leather conditioner, especially before a season of heavy wear. Dry leather cracks; conditioned leather flexes and lasts years longer.</p>
<p><strong>Storage:</strong> keep pairs stuffed (tissue paper works fine) when not in use, and out of direct sunlight — UV exposure is the single fastest way to yellow a white midsole.</p>
<p><strong>Rotation:</strong> wearing the same pair every day compresses the foam faster than the material itself wears out. Rotating between two pairs roughly doubles the useful life of the cushioning in both.</p>
<p><strong>Rain:</strong> a inexpensive water-and-stain spray applied before first wear does more to protect suede and canvas than any post-rain fix ever will.</p>
<p>None of this takes more than a few minutes a week, and it is the difference between a pair that looks tired after one season and one that still looks good after three.</p>`,
  },
  {
    title: 'Why We Built a Decentralized Marketplace (And What It Means for You)',
    excerpt: 'Escrow you can verify, sellers who keep what they earn, and a review system nobody can quietly edit.',
    tags: ['Blockchain', 'Company'],
    coverUrl: 'https://picsum.photos/seed/blog-why-decentralized/1200/675',
    content: `<p>We get asked fairly often why a shoe and apparel marketplace needs to be "on-chain" at all. It is a fair question — most of what you do here looks like any other online store. The difference is underneath.</p>
<p><strong>Escrow you can verify.</strong> When you pay for an order, funds move into a smart-contract escrow rather than directly to the seller or a payment processor. They are released once the order is confirmed delivered — a rule enforced by code, not by a support ticket queue.</p>
<p><strong>Sellers keep more of what they earn.</strong> Without a payment processor taking a percentage of every transaction, more of each sale reaches the person who actually made or sourced the product.</p>
<p><strong>Reviews that cannot be quietly edited or deleted.</strong> Product reviews are tied to verified on-chain purchases, so review history reflects real transactions rather than being something a shop owner can curate after the fact.</p>
<p><strong>Ownership is portable.</strong> Product listings are represented as tokens, meaning provenance and purchase history exist independently of any single company's database staying online forever.</p>
<p>None of this changes how it feels to browse and buy — that part is still just shopping. It changes what happens underneath, in ways we think make the whole system more honest for both sides.</p>`,
  },
  {
    title: 'Fall Restock: Our Favorite New Arrivals This Season',
    excerpt: 'Warmer palettes, heavier canvas, and a few boots worth clearing space in your closet for.',
    tags: ['New Arrivals', 'Style'],
    coverUrl: 'https://picsum.photos/seed/blog-fall-restock/1200/675',
    content: `<p>Sellers have been restocking for the season, and a few new arrivals stood out enough that we wanted to point them out directly rather than let them get lost in the catalog.</p>
<p>Expect to see heavier-weight canvas sneakers built for cooler weather, a handful of new boot silhouettes in both leather and vegan alternatives, and apparel leaning into warmer, muted palettes — rust, olive, and charcoal are showing up across multiple sellers independently, which usually means it is a real seasonal shift rather than one shop's taste.</p>
<p>A few accessories are also worth a look this month: wool-blend caps, canvas crossbody bags, and the first small batch of leather wallets from one of our newer sellers.</p>
<p>As always, everything is available in limited seller-set quantities, so a listing selling out simply means that batch is gone — check back, since most sellers restock on a rolling basis rather than a fixed schedule.</p>
<p>Browse the storefront and filter by "New Arrivals" to see everything that has landed in the last two weeks.</p>`,
  },
];

async function main() {
  console.log('=== Seeding diverse blog content ===');

  const adminWallet = getHardhatWallet(ROLE_ACCOUNTS.admin.index);
  const admin = await loginAccount(adminWallet);
  console.log(`Logged in as admin (${admin.user.publicAddress}).`);

  console.log('\nRemoving existing posts (fresh, reproducible dataset)...');
  const existing = await apiCall('/admin/blog?page=1&limit=100', { headers: authHeaders(admin.accessToken) });
  for (const post of existing.data || []) {
    await apiCall(`/admin/blog/${post.id}`, { method: 'DELETE', headers: authHeaders(admin.accessToken) });
    console.log(`      - removed "${post.title}"`);
  }

  console.log(`\nCreating ${POSTS.length} published posts...`);
  for (const post of POSTS) {
    await apiCall('/admin/blog', {
      method: 'POST',
      headers: authHeaders(admin.accessToken),
      body: JSON.stringify({ ...post, publish: 'published' }),
    });
    console.log(`      - created "${post.title}"`);
  }

  console.log('\n=== Done ===');
  console.log(`${POSTS.length} posts published. Reload the home page to see "Latest from the Blog".`);
}

main().catch((err) => {
  console.error('\nSeeding blog content failed:', err);
  process.exit(1);
});
