import { OfficeCollectibleData, OfficeEntity, OfficeCollectibleType } from '../types';

export const OFFICE_COLLECTIBLE_CATALOG: OfficeCollectibleData[] = [
  {
    collectibleType: 'JELLO_STAPLER',
    title: "Jim's Stapler in Jell-O",
    character: 'Dwight & Jim',
    iconEmoji: '🍮',
    lore: 'A Swingline heavy-duty desktop stapler perfectly preserved in a lime-yellow gelatin prism. Still remarkably functional.',
    quote: '"DAMMIT JIM! He put my stapler in Jell-O again! You can\'t put my things in Jell-O, I\'m the Assistant Regional Manager!"',
    rewardXp: 25,
    rewardSchruteBucks: 30,
    sparkleColor: '#f59e0b',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'BEET_CARVING',
    title: 'Schrute Farms Heirloom Beet Carving',
    character: 'Dwight K. Schrute',
    iconEmoji: '🪴',
    lore: 'An organic root vegetable hand-sculpted by Dwight into the likeness of a Cylon Raider from Battlestar Galactica.',
    quote: '"Those who can\'t farm, teach. And those who can\'t teach, teach gym. Schrute Farm Heirloom beet carving."',
    rewardXp: 30,
    rewardSchruteBucks: 35,
    sparkleColor: '#e11d48',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'DUNDIE_TROPHY',
    title: 'The Bushiest Beaver Dundie Award',
    character: 'Michael Scott',
    iconEmoji: '🏆',
    lore: 'An authentic gold plastic figurine mounted on faux marble, presenting the premier corporate honor of Lackawanna County.',
    quote: '"The Dundies are about celebrating the best in all of us! And the Bushiest Beaver Dundie goes to... you!"',
    rewardXp: 50,
    rewardSchruteBucks: 75,
    dundieTitle: '🏆 The Bushiest Beaver Dundie Award',
    sparkleColor: '#fbbf24',
    rarity: 'LEGENDARY'
  },
  {
    collectibleType: 'WORLDS_BEST_BOSS_MUG',
    title: '"World\'s Best Boss" Ceramic Mug',
    character: 'Michael Scott',
    iconEmoji: '☕',
    lore: 'Purchased at Spencer Gifts by Michael himself. Grants supreme managerial confidence and instant focus.',
    quote: '"I bought it for myself at Spencer Gifts. People say I\'m the best boss, so it\'s technically certified."',
    rewardXp: 20,
    rewardSchruteBucks: 25,
    sparkleColor: '#38bdf8',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'BOBBLEHEAD',
    title: 'Dwight Schrute Sales Bobblehead',
    character: 'Angela Martin',
    iconEmoji: '🧑‍💼',
    lore: 'A customized bobblehead wearing mustard short sleeves, nodding approvingly at strict security protocol enforcement.',
    quote: '"A small plastic version of myself that nods in agreement with all my superior tactical decisions."',
    rewardXp: 25,
    rewardSchruteBucks: 30,
    sparkleColor: '#a855f7',
    rarity: 'RARE'
  },
  {
    collectibleType: 'CHILI_POT',
    title: 'Kevin\'s Secret Famous Chili Pot',
    character: 'Kevin Malone',
    iconEmoji: '🍲',
    lore: 'A massive industrial stockpot with a hand-written recipe card. Handled with extreme, cautious balance across the carpet.',
    quote: '"The trick is to undercook the onions. Everybody is going to get to know each other in the pot."',
    rewardXp: 35,
    rewardSchruteBucks: 45,
    sparkleColor: '#ea580c',
    rarity: 'RARE'
  },
  {
    collectibleType: 'PRETZEL_TICKET',
    title: 'Stanley\'s Golden Pretzel Day Ticket',
    character: 'Stanley Hudson',
    iconEmoji: '🥨',
    lore: 'VIP fast-track coupon for the 18 sweet and savory glazes cart in the Scranton lobby. Irreplaceable.',
    quote: '"I wake up in a bed that\'s too small, drive to a job where I get paid too little... but on Pretzel Day? Well, I like Pretzel Day."',
    rewardXp: 30,
    rewardSchruteBucks: 40,
    sparkleColor: '#d97706',
    rarity: 'RARE'
  },
  {
    collectibleType: 'THREAT_LEVEL_MIDNIGHT_SCRIPT',
    title: '"Threat Level Midnight" Draft Screenplay',
    character: 'Michael Scarn',
    iconEmoji: '🎬',
    lore: 'An 85-page typed screenplay with annotations by Cherokee Jack and coffee stains from the breakroom.',
    quote: '"Clean up on aisle five. Goldenface, you\'ll never get away with blowing up the NHL All-Star Game!"',
    rewardXp: 60,
    rewardSchruteBucks: 90,
    dundieTitle: '🏆 Scarn Cinema Mastermind Dundie',
    sparkleColor: '#ef4444',
    rarity: 'LEGENDARY'
  },
  {
    collectibleType: 'SERENITY_CANDLE',
    title: 'Serenity by Jan "Bonfire" Scented Candle',
    character: 'Jan Levinson',
    iconEmoji: '🕯️',
    lore: '100% natural soy wax candle handcrafted by Jan. Radiates soothing cedar and intense deposition energy.',
    quote: '"You burn it, you melt with it, you become the fire. Jan\'s artisanal workshop masterpiece."',
    rewardXp: 20,
    rewardSchruteBucks: 25,
    sparkleColor: '#f43f5e',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'SCHRUTE_BUCKS_STASH',
    title: 'Emergency Stash of 100 Schrute Bucks',
    character: 'Dwight K. Schrute',
    iconEmoji: '💵',
    lore: 'Official currency of Schrute Farms, convertible at an exchange rate of 1,000 Schrute Bucks per 5 minutes of extra lunch.',
    quote: '"What is the cash-in value? Ten thousand Schrute Bucks equals an extra five minutes of lunch break!"',
    rewardXp: 15,
    rewardSchruteBucks: 100,
    sparkleColor: '#10b981',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'PAM_WATERCOLOR',
    title: 'Pam\'s Dunder Mifflin Watercolor Painting',
    character: 'Pam Beesly',
    iconEmoji: '🎨',
    lore: 'A framed watercolor painting capturing the Scranton business park and Michael\'s Sebring in the parking lot.',
    quote: '"There\'s a lot of beauty in ordinary things. Isn\'t that kind of the point?"',
    rewardXp: 40,
    rewardSchruteBucks: 50,
    dundieTitle: '🏆 Finest Art of Slough Ave Dundie',
    sparkleColor: '#06b6d4',
    rarity: 'RARE'
  },
  {
    collectibleType: 'WUPHF_CARD',
    title: 'Ryan\'s WUPHF.com Calling Card',
    character: 'Ryan Howard',
    iconEmoji: '🐕',
    lore: 'The cross-platform notification protocol connecting fax, pager, text, home phone, and printer in 0.4 seconds.',
    quote: '"It\'s not just an app, it\'s Washington University Public Health Fund dot com!"',
    rewardXp: 25,
    rewardSchruteBucks: 35,
    sparkleColor: '#8b5cf6',
    rarity: 'COMMON'
  }
];

/**
 * Procedurally generates 3-5 randomized 'The Office' collectibles on available desks and open tiles
 */
export function generateRandomOfficeCollectibles(
  floorNumber: number,
  deskLocations: { x: number; y: number }[],
  openTileLocations: { x: number; y: number }[],
  blockedPositions: Set<string>
): OfficeEntity[] {
  const collectibles: OfficeEntity[] = [];
  
  // Decide how many collectibles to spawn on this floor (between 3 and 5)
  const countToSpawn = 3 + Math.floor(Math.random() * 3); // 3, 4, or 5
  
  // Shuffle available desk locations first (preferred spots for office items)
  const shuffledDesks = [...deskLocations].filter(pos => !blockedPositions.has(`${pos.x},${pos.y}`));
  for (let i = shuffledDesks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDesks[i], shuffledDesks[j]] = [shuffledDesks[j], shuffledDesks[i]];
  }

  // Shuffle open floor spots as fallback
  const shuffledOpen = [...openTileLocations].filter(pos => !blockedPositions.has(`${pos.x},${pos.y}`));
  for (let i = shuffledOpen.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOpen[i], shuffledOpen[j]] = [shuffledOpen[j], shuffledOpen[i]];
  }

  // Candidate positions: first desks, then open tiles
  const candidateSpots = [...shuffledDesks, ...shuffledOpen];

  // Shuffle catalog to pick unique items
  const catalogPool = [...OFFICE_COLLECTIBLE_CATALOG];
  for (let i = catalogPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [catalogPool[i], catalogPool[j]] = [catalogPool[j], catalogPool[i]];
  }

  let spawned = 0;
  for (const spot of candidateSpots) {
    if (spawned >= countToSpawn) break;
    const posKey = `${spot.x},${spot.y}`;
    if (blockedPositions.has(posKey)) continue;

    // Pick a collectible from catalog
    const itemData = catalogPool[spawned % catalogPool.length];
    blockedPositions.add(posKey);

    collectibles.push({
      id: `office_collectible_f${floorNumber}_${spawned}_${itemData.collectibleType.toLowerCase()}`,
      type: 'COLLECTIBLE_PROP',
      x: spot.x,
      y: spot.y,
      name: itemData.title,
      description: itemData.lore,
      status: 'ACTIVE',
      collectible: {
        ...itemData,
        // Floor scaling multiplier
        rewardXp: itemData.rewardXp + (floorNumber - 1) * 5,
        rewardSchruteBucks: itemData.rewardSchruteBucks + (floorNumber - 1) * 10
      }
    });

    spawned++;
  }

  return collectibles;
}
