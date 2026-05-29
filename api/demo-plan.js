export function demoPlan() {
  return {
    title: "Coastal & Capital Packing Plan",
    subtitle: "A polished carry-on strategy for changing city, shore, and dinner rhythms",
    dateLine: "Itinerary-generated dates",
    strategy: "Carry-on capsule with repeatable neutrals, destination-specific polish, and one planned laundry reset.",
    palette: ["Ink navy", "Ivory", "Tobacco", "Mist blue", "Stone"],
    destinations: [
      {
        name: "Arrival City",
        dates: "Day 1–2",
        nights: 2,
        mood: "Architectural, walkable, polished",
        heroPrompt: "fine ink and watercolor travel sketch of an elegant European arrival city landmark, ivory paper, navy and tobacco accents"
      },
      {
        name: "Countryside Stay",
        dates: "Day 3–5",
        nights: 3,
        mood: "Soft tailoring, lunches, slow evenings",
        heroPrompt: "fine ink and watercolor travel sketch of a luxury countryside inn and garden, editorial packing plan style"
      },
      {
        name: "Coastal Finale",
        dates: "Day 6–7",
        nights: 2,
        mood: "Relaxed resort polish",
        heroPrompt: "fine ink and watercolor travel sketch of a refined coastal town with blue water, ivory paper, navy accents"
      }
    ],
    laundry: {
      headline: "Laundry Strategy",
      bullets: [
        "Plan one wash after the city segment, before the most wardrobe-flexible days.",
        "Prioritize linen shirts, socks, underwear, tees, and travel base layers.",
        "Avoid same-day laundry for structured jackets, delicate knits, or dinner pieces."
      ]
    },
    luggagePlan: {
      headline: "Carry-On Capacity",
      bags: [
        "1 carry-on roller for folded capsule pieces, shoes, and laundry kit.",
        "1 personal item for tech, jewelry case, toiletries, and the in-transit layer."
      ],
      constraints: [
        "Two-shoe limit plus the travel shoe",
        "One structured jacket",
        "Mid-trip wash protects the shirt count",
        "Palette stays navy, ivory, tobacco, mist, and stone"
      ]
    },
    packingRecommendations: [
      {
        category: "Tops",
        quantity: "6 total",
        items: ["2 linen shirts", "1 mist blue shirt", "1 ivory tee", "1 cream knit", "1 print shirt"],
        reasoning: "Enough fresh top layers for city polish, countryside repeats, and coastal evenings with one laundry reset."
      },
      {
        category: "Bottoms",
        quantity: "4 total",
        items: ["2 tailored trousers", "1 stone chino", "1 short or relaxed pant"],
        reasoning: "Neutral bottoms do the heavy repeat work while still covering warm days."
      },
      {
        category: "Layers",
        quantity: "3 total",
        items: ["tan sport coat", "tobacco overshirt", "light travel jacket"],
        reasoning: "A single structured layer keeps dinner looks sharp; soft layers handle transfers and weather shifts."
      },
      {
        category: "Shoes",
        quantity: "2 packed + 1 worn",
        items: ["clean trainers worn in transit", "brown loafers", "optional sandal if coastal plans require it"],
        reasoning: "Three footwear roles are enough without crowding the carry-on."
      },
      {
        category: "Daily essentials",
        quantity: "Trip length + 2",
        items: ["underwear", "socks", "sleepwear", "swim or wellness layer"],
        reasoning: "Small essentials scale with nights and should be the first laundry priority."
      }
    ],
    outfits: [
      {
        destination: "Arrival City",
        date: "Day 1",
        label: "Arrival Day",
        dayLook: ["light blue shirt", "cream trousers", "tobacco overshirt", "clean trainers"],
        dinnerLook: ["white linen shirt", "navy trousers", "tan sport coat", "brown loafers"],
        note: "Comfortable enough for transfer, composed enough for a first dinner."
      },
      {
        destination: "Arrival City",
        date: "Day 2",
        label: "Full Day",
        dayLook: ["ivory tee", "navy overshirt", "stone chinos", "clean trainers"],
        dinnerLook: ["cream knit", "blue trousers", "tan sport coat", "brown loafers"],
        note: "Strongest city walking look."
      },
      {
        destination: "Countryside Stay",
        date: "Day 3",
        label: "Arrival / Dinner",
        dayLook: ["blue linen shirt", "stone trousers", "tobacco overshirt", "loafers"],
        dinnerLook: ["ivory shirt", "navy trousers", "tan jacket", "brown loafers"],
        note: "Soft-tailored and relaxed."
      },
      {
        destination: "Countryside Stay",
        date: "Day 5",
        label: "Full Day",
        dayLook: ["cream knit", "navy trousers", "light jacket", "trainers"],
        dinnerLook: ["mist blue shirt", "stone trousers", "tan sport coat", "loafers"],
        note: "Best balanced capsule repeat."
      },
      {
        destination: "Coastal Finale",
        date: "Day 6",
        label: "Travel + Dinner",
        dayLook: ["white tee", "blue overshirt", "stone shorts", "trainers"],
        dinnerLook: ["linen shirt", "navy trousers", "tan jacket", "loafers"],
        note: "Resort polish without feeling overpacked."
      },
      {
        destination: "Coastal Finale",
        date: "Day 7",
        label: "Full Day",
        dayLook: ["blue print shirt", "ivory trousers", "clean trainers"],
        dinnerLook: ["cream knit", "navy trousers", "brown loafers"],
        note: "The final signature look."
      }
    ],
    packingList: [
      "2 linen shirts",
      "2 overshirts",
      "1 cream knit",
      "1 tan sport coat",
      "2 trousers",
      "1 short or relaxed pant",
      "trainers",
      "brown loafers",
      "laundry kit"
    ],
    bestLooks: [
      "White linen shirt + navy trousers + tan sport coat",
      "Cream knit + blue trousers + loafers",
      "Blue linen shirt + stone trousers + tobacco overshirt",
      "Print shirt + ivory trousers + clean trainers"
    ],
    verdict: "One thoughtful laundry reset keeps the capsule crisp. The strongest repeats are shirts, trousers, and light layers; protect jacket and knit pieces from rushed cleaning.",
    illustrationPrompts: [
      "isolated luxury editorial watercolor illustration of a white linen shirt, transparent background",
      "isolated luxury editorial watercolor illustration of navy tailored trousers, transparent background",
      "isolated luxury editorial watercolor illustration of a tan sport coat, transparent background",
      "isolated luxury editorial watercolor illustration of brown leather loafers, transparent background"
    ]
  };
}
