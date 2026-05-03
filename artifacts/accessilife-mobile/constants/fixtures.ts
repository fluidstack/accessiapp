export type Provider = {
  id: string;
  name: string;
  category: string;
  suburb: string;
  state: string;
  rating: number;
  reviewCount: number;
  blurb: string;
  supports: string[];
  ndisRegistered: boolean;
  bio: string;
  contactName: string;
};

export type Listing = {
  id: string;
  title: string;
  category: "Equipment" | "Mobility" | "Sensory" | "Daily living";
  price: number;
  condition: "New" | "As new" | "Good" | "Used";
  suburb: string;
  state: string;
  description: string;
  sellerName: string;
  postedDaysAgo: number;
};

export type CommunityEvent = {
  id: string;
  title: string;
  host: string;
  date: string;
  startTime: string;
  endTime: string;
  suburb: string;
  state: string;
  format: "In person" | "Online" | "Hybrid";
  capacity: number;
  attending: number;
  description: string;
  accessNotes: string;
};

export type Post = {
  id: string;
  author: string;
  authorRole: string;
  topic: string;
  title: string;
  excerpt: string;
  body: string;
  postedDaysAgo: number;
  replyCount: number;
};

export const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

export const CATEGORIES = [
  "Support coordination",
  "Therapy",
  "Allied health",
  "Plan management",
  "Community access",
  "SIL & SDA",
  "Transport",
  "Recreation",
];

export const PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "Sunrise Allied Health",
    category: "Allied health",
    suburb: "Newtown",
    state: "NSW",
    rating: 4.8,
    reviewCount: 42,
    blurb: "Occupational therapy and physio for adults across Sydney inner west.",
    supports: ["OT", "Physio", "Speech"],
    ndisRegistered: true,
    bio: "We're a small team of allied health practitioners working across home, school and clinic settings. Our therapists hold current Working with Children Checks and NDIS Worker Screening clearances.",
    contactName: "Priya Nair",
  },
  {
    id: "p2",
    name: "Wattle Support Coordination",
    category: "Support coordination",
    suburb: "Ballarat",
    state: "VIC",
    rating: 4.9,
    reviewCount: 28,
    blurb: "Independent support coordination across regional Victoria.",
    supports: ["Support coordination", "Specialist SC"],
    ndisRegistered: true,
    bio: "Independent, conflict-free support coordination focused on building participant capacity. Plain English plan summaries available on request.",
    contactName: "James O'Connor",
  },
  {
    id: "p3",
    name: "Kookaburra Plan Management",
    category: "Plan management",
    suburb: "Brisbane",
    state: "QLD",
    rating: 4.7,
    reviewCount: 64,
    blurb: "Fast invoice turnaround, monthly statements in plain English.",
    supports: ["Plan management"],
    ndisRegistered: true,
    bio: "Family-run plan manager. We pay invoices within 48 hours and send a monthly budget snapshot. No lock-in service agreements.",
    contactName: "Mei Chen",
  },
  {
    id: "p4",
    name: "Coastline SIL Homes",
    category: "SIL & SDA",
    suburb: "Fremantle",
    state: "WA",
    rating: 4.6,
    reviewCount: 19,
    blurb: "Supported independent living vacancies on the WA coast.",
    supports: ["SIL", "SDA", "Respite"],
    ndisRegistered: true,
    bio: "Three-bedroom homes with 1:3 daytime support. Wheelchair accessible, hoist-equipped, sensory-quiet zones.",
    contactName: "Dani Baker",
  },
  {
    id: "p5",
    name: "Open Skies Recreation",
    category: "Recreation",
    suburb: "Adelaide",
    state: "SA",
    rating: 4.9,
    reviewCount: 51,
    blurb: "Adaptive surfing, sailing and bushwalking groups.",
    supports: ["Group programs", "Capacity building"],
    ndisRegistered: false,
    bio: "Self-managed and plan-managed participants welcome. Equipment provided. Sessions cap at six participants with two qualified staff.",
    contactName: "Tom Whitlock",
  },
  {
    id: "p6",
    name: "Quiet Mind Therapy",
    category: "Therapy",
    suburb: "Hobart",
    state: "TAS",
    rating: 4.8,
    reviewCount: 33,
    blurb: "Trauma-informed psychology, telehealth across Australia.",
    supports: ["Psychology", "Counselling"],
    ndisRegistered: true,
    bio: "Telehealth-first practice with sliding-scale concession spots. Auslan interpreters can be arranged with two weeks' notice.",
    contactName: "Dr Rachel Hume",
  },
];

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Quickie Q500 power wheelchair",
    category: "Mobility",
    price: 3200,
    condition: "As new",
    suburb: "Geelong",
    state: "VIC",
    description:
      "Used 6 months. Tilt-in-space, gel cushion, fresh batteries. NDIS receipt available.",
    sellerName: "Aaron",
    postedDaysAgo: 3,
  },
  {
    id: "l2",
    title: "Tobii Dynavox I-13 communication device",
    category: "Sensory",
    price: 1800,
    condition: "Good",
    suburb: "Parramatta",
    state: "NSW",
    description:
      "Eye-tracking AAC device. Includes mounting bracket and carry case.",
    sellerName: "Linh",
    postedDaysAgo: 7,
  },
  {
    id: "l3",
    title: "Hoyer Advance hoist + sling set",
    category: "Equipment",
    price: 950,
    condition: "Used",
    suburb: "Mount Gambier",
    state: "SA",
    description: "Manual hydraulic hoist. Large + medium slings included.",
    sellerName: "Robyn",
    postedDaysAgo: 12,
  },
  {
    id: "l4",
    title: "Weighted blanket 7kg, organic cotton",
    category: "Sensory",
    price: 80,
    condition: "New",
    suburb: "Toowoomba",
    state: "QLD",
    description: "Unopened gift. Sage green cover.",
    sellerName: "Indira",
    postedDaysAgo: 1,
  },
  {
    id: "l5",
    title: "Adjustable shower stool with backrest",
    category: "Daily living",
    price: 60,
    condition: "Good",
    suburb: "Launceston",
    state: "TAS",
    description: "Aluminium frame, non-slip feet. Cleaned and ready to go.",
    sellerName: "Marcus",
    postedDaysAgo: 5,
  },
];

export const EVENTS: CommunityEvent[] = [
  {
    id: "e1",
    title: "Sensory-friendly morning at the gallery",
    host: "Open Skies Recreation",
    date: "Sat 16 May",
    startTime: "9:00am",
    endTime: "11:00am",
    suburb: "Adelaide",
    state: "SA",
    format: "In person",
    capacity: 24,
    attending: 11,
    description:
      "Lights dimmed, audio reduced, quiet rooms available. Carers welcome at no cost.",
    accessNotes:
      "Step-free access. Companion card honoured. Auslan interpreter on request.",
  },
  {
    id: "e2",
    title: "Plan reviews demystified — webinar",
    host: "Wattle Support Coordination",
    date: "Wed 20 May",
    startTime: "7:00pm",
    endTime: "8:00pm",
    suburb: "Online",
    state: "—",
    format: "Online",
    capacity: 200,
    attending: 86,
    description:
      "Plain English walkthrough of preparing for your annual plan review.",
    accessNotes: "Live captions and recording available.",
  },
  {
    id: "e3",
    title: "Adaptive surf morning",
    host: "Open Skies Recreation",
    date: "Sun 24 May",
    startTime: "8:30am",
    endTime: "11:30am",
    suburb: "Glenelg",
    state: "SA",
    format: "In person",
    capacity: 6,
    attending: 4,
    description:
      "Beach wheelchairs and qualified surf instructors provided. All experience levels.",
    accessNotes:
      "Accessible toilets and changing space onsite. Hot showers and warm clothing welcome.",
  },
  {
    id: "e4",
    title: "Carers coffee catch-up",
    host: "Accessilife Community",
    date: "Thu 28 May",
    startTime: "10:30am",
    endTime: "12:00pm",
    suburb: "Brisbane CBD",
    state: "QLD",
    format: "In person",
    capacity: 30,
    attending: 18,
    description: "Informal catch-up for family carers. Tea, coffee and pastries on us.",
    accessNotes: "Pram and wheelchair accessible. Quiet booth available.",
  },
];

export const POSTS: Post[] = [
  {
    id: "c1",
    author: "Sam",
    authorRole: "Self-managed participant",
    topic: "Plan management",
    title: "Anyone moved from plan-managed to self-managed mid-plan?",
    excerpt:
      "I'm thinking about switching for the flexibility — keen to hear what worked and what didn't.",
    body: "I'm halfway through my plan and the admin side of plan management has felt opaque. Considering self-managed for the back half of the plan. Has anyone done this mid-plan? How did the LAC respond?",
    postedDaysAgo: 2,
    replyCount: 14,
  },
  {
    id: "c2",
    author: "Jules",
    authorRole: "Carer",
    topic: "Sensory tools",
    title: "Best weighted blanket weight for a 9 year old?",
    excerpt: "Looking for something that doesn't overheat in summer.",
    body: "We're in a warm part of QLD and our current blanket is too hot to use past September. Open to brands and weights people have had luck with.",
    postedDaysAgo: 4,
    replyCount: 22,
  },
  {
    id: "c3",
    author: "Devi",
    authorRole: "Participant",
    topic: "Allied health",
    title: "OT recommendations in regional VIC?",
    excerpt:
      "Telehealth is fine but I'd like at least one in-person session per quarter.",
    body: "Based in Bendigo. Looking for an OT who has worked with adults with ABI and is happy to do the occasional home visit.",
    postedDaysAgo: 1,
    replyCount: 6,
  },
  {
    id: "c4",
    author: "Marcus",
    authorRole: "Self-managed participant",
    topic: "Travel",
    title: "Companion Card acceptance — running list",
    excerpt: "Building a thread of venues that consistently honour the card.",
    body: "Add your finds and I'll keep the top post updated. Bonus points for accessible bathroom notes.",
    postedDaysAgo: 9,
    replyCount: 41,
  },
];
