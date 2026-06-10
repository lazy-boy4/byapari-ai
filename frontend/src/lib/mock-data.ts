export const kpis = [
  { label: "Revenue (30d)", value: "৳ 8,42,500", delta: "+12.4%", tone: "success" as const, mono: "842500" },
  { label: "Gross Profit", value: "৳ 2,16,300", delta: "+8.1%", tone: "success" as const, mono: "216300" },
  { label: "Orders", value: "1,284", delta: "+204", tone: "success" as const, mono: "1284" },
  { label: "Avg Rating", value: "4.6 / 5", delta: "+0.2", tone: "success" as const, mono: "4.6" },
  { label: "Return Rate", value: "6.8%", delta: "+1.1%", tone: "warning" as const, mono: "6.8" },
  { label: "Stock Health", value: "72 / 100", delta: "-4", tone: "danger" as const, mono: "72" },
];

export const healthBreakdown = [
  { label: "Revenue trend", score: 82 },
  { label: "Profit margin", score: 71 },
  { label: "Customer rating", score: 88 },
  { label: "Return rate", score: 64 },
  { label: "Stock discipline", score: 58 },
];

export const forecast = Array.from({ length: 30 }, (_, i) => {
  const base = 24000 + Math.sin(i / 4) * 6000 + i * 280;
  return {
    day: `D${i + 1}`,
    actual: i < 18 ? Math.round(base + ((Math.sin(i * 12.9898) * 43758.5453) % 1 * 3000 - 1500)) : null,
    forecast: i >= 14 ? Math.round(base + 2400) : null,
  };
});

export const pricing = [
  { sku: "DRS-COTTON-01", product: "Cotton kurti, navy", current: 1290, suggested: 1390, lift: "+5.4%", why: "Top 10% sales velocity, low return rate." },
  { sku: "DRS-SAREE-22", product: "Jamdani saree, cream", current: 4500, suggested: 4250, lift: "+11.2%", why: "Elastic demand; small drop unlocks volume." },
  { sku: "ACC-BAG-08", product: "Leather tote bag", current: 2100, suggested: 2100, lift: "0%", why: "Hold price — competitive median matched." },
  { sku: "HOM-LAMP-03", product: "Brass table lamp", current: 1800, suggested: 1950, lift: "+6.0%", why: "Stock low, demand rising into Eid." },
  { sku: "FUR-CHAIR-11", product: "Cane lounge chair", current: 6500, suggested: 5990, lift: "+14.0%", why: "Slow mover, 22 day inventory cover." },
];

export const recommendations = [
  {
    en: "Push the cotton kurti to the top of your Facebook shop — it has the strongest margin-to-velocity ratio this month.",
    bn: "এই মাসে কটন কুর্তির মার্জিন আর বিক্রির গতি সবচেয়ে ভালো — ফেসবুক শপে এটাকে উপরে তুলে দিন।",
    tag: "Merchandising",
  },
  {
    en: "Returns on saree SKUs jumped 1.1% — most are due to size mismatch. Add a size chart to the listing.",
    bn: "শাড়ির রিটার্ন ১.১% বেড়েছে — বেশিরভাগই সাইজের জন্য। লিস্টিংয়ে সাইজ চার্ট যোগ করুন।",
    tag: "Quality",
  },
  {
    en: "Eid window opens in 38 days. Increase brass lamp order by 40% — forecast shows stock-out by week 3.",
    bn: "৩৮ দিনে ঈদের সিজন শুরু। পিতলের ল্যাম্পের অর্ডার ৪০% বাড়ান — সপ্তাহ ৩-এ স্টক শেষ হবে।",
    tag: "Inventory",
  },
  {
    en: "Cane lounge chair has 22 days of stock cover. A 7.8% discount frees ৳ 38,000 in working capital.",
    bn: "বেতের চেয়ারে ২২ দিনের স্টক জমা। ৭.৮% ছাড় দিলে ৩৮,০০০ টাকা ক্যাপিটাল মুক্ত হবে।",
    tag: "Cashflow",
  },
];

export const tips = [
  { title: "Eid demand follows a 3-week ramp", body: "Historical Daraz data shows orders climb 30-40% per week for three weeks before Eid. Plan stock and ad spend around this curve, not on Eid day itself." },
  { title: "Friday is your real weekend", body: "Bangladeshi shoppers convert highest on Friday afternoons. Schedule new product launches and promo posts between 2-5 PM Friday." },
  { title: "bKash conversion lifts AOV", body: "Adding bKash at checkout typically raises average order value by 12-18% versus cash-on-delivery only." },
];

export const personas = [
  { who: "Facebook shop owners", what: "Page-only sellers with manual order spreadsheets." },
  { who: "Daraz / Pickaboo sellers", what: "Marketplace sellers exporting weekly order reports." },
  { who: "Neighborhood retailers", what: "POS-using shops digitizing daily ledgers." },
  { who: "Small wholesalers", what: "B2B operators tracking SKU velocity by district." },
];
