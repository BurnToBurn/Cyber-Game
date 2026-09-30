import { OfficeCollectibleData, OfficeEntity, OfficeCollectibleType } from '../types';

export const OFFICE_COLLECTIBLE_CATALOG: OfficeCollectibleData[] = [
  {
    collectibleType: 'DESK_STAPLER',
    title: 'Desk stapler',
    character: 'Office equipment',
    iconEmoji: '📎',
    lore: 'A sturdy stapler left behind after a busy shift.',
    quote: 'Keep shared equipment in its place.',
    rewardXp: 25,
    rewardTokens: 30,
    sparkleColor: '#f59e0b',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'DESK_PLANT',
    title: 'Desk plant',
    character: 'Workplace decor',
    iconEmoji: '🪴',
    lore: 'A small plant brightens the security operations floor.',
    quote: 'A little green makes a long shift better.',
    rewardXp: 30,
    rewardTokens: 35,
    sparkleColor: '#e11d48',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'TEAM_TROPHY',
    title: 'Security excellence award',
    character: 'Team recognition',
    iconEmoji: '🏆',
    lore: 'A team award for careful work and strong security habits.',
    quote: 'Good security is a team effort.',
    rewardXp: 50,
    rewardTokens: 75,
    awardTitle: 'Security excellence award',
    sparkleColor: '#fbbf24',
    rarity: 'LEGENDARY'
  },
  {
    collectibleType: 'COFFEE_MUG',
    title: 'Insulated coffee mug',
    character: 'Breakroom item',
    iconEmoji: '☕',
    lore: 'A well-used mug left beside the coffee machine.',
    quote: 'Remember to take a break.',
    rewardXp: 20,
    rewardTokens: 25,
    sparkleColor: '#38bdf8',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'BOBBLEHEAD',
    title: 'Security analyst bobblehead',
    character: 'Desk decor',
    iconEmoji: '🧑‍💼',
    lore: 'A cheerful desk decoration from a past team event.',
    quote: 'Stay curious. Check the details.',
    rewardXp: 25,
    rewardTokens: 30,
    sparkleColor: '#a855f7',
    rarity: 'RARE'
  },
  {
    collectibleType: 'CHILI_POT',
    title: 'Shared lunch pot',
    character: 'Breakroom item',
    iconEmoji: '🍲',
    lore: 'A covered pot set aside for the team lunch.',
    quote: 'Label food before storing it.',
    rewardXp: 35,
    rewardTokens: 45,
    sparkleColor: '#ea580c',
    rarity: 'RARE'
  },
  {
    collectibleType: 'PRETZEL_TICKET',
    title: 'Break voucher',
    character: 'Team perk',
    iconEmoji: '🥨',
    lore: 'A voucher for a snack during your next break.',
    quote: 'Take a moment to recharge.',
    rewardXp: 30,
    rewardTokens: 40,
    sparkleColor: '#d97706',
    rarity: 'RARE'
  },
  {
    collectibleType: 'INCIDENT_NOTES',
    title: 'Incident response notes',
    character: 'Security operations',
    iconEmoji: '🗒️',
    lore: 'A field guide with practical steps for handling a security incident.',
    quote: 'Identify, contain, and report.',
    rewardXp: 60,
    rewardTokens: 90,
    awardTitle: 'Incident response award',
    sparkleColor: '#ef4444',
    rarity: 'LEGENDARY'
  },
  {
    collectibleType: 'DESK_CANDLE',
    title: 'Desk candle',
    character: 'Workplace decor',
    iconEmoji: '🕯️',
    lore: 'A small candle for a quiet, screen-free break.',
    quote: 'Step away from the screen now and then.',
    rewardXp: 20,
    rewardTokens: 25,
    sparkleColor: '#f43f5e',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'TOKEN_STASH',
    title: 'Bonus token stash',
    character: 'Team reward',
    iconEmoji: '💵',
    lore: 'A set of bonus tokens saved for the next team challenge.',
    quote: 'Small wins add up.',
    rewardXp: 15,
    rewardTokens: 100,
    sparkleColor: '#10b981',
    rarity: 'COMMON'
  },
  {
    collectibleType: 'OFFICE_ART',
    title: 'Workplace landscape',
    character: 'Workplace art',
    iconEmoji: '🎨',
    lore: 'A framed painting of a quiet city street.',
    quote: 'Notice the details around you.',
    rewardXp: 40,
    rewardTokens: 50,
    awardTitle: 'Team creativity award',
    sparkleColor: '#06b6d4',
    rarity: 'RARE'
  },
  {
    collectibleType: 'ACCESS_CARD',
    title: 'Security access card',
    character: 'Access control',
    iconEmoji: '🪪',
    lore: 'A spare access card stored securely for authorized staff.',
    quote: 'Never lend your access card.',
    rewardXp: 25,
    rewardTokens: 35,
    sparkleColor: '#8b5cf6',
    rarity: 'COMMON'
  }
];

export function generateRandomOfficeCollectibles(
  floorNumber: number,
  deskLocations: { x: number; y: number }[],
  openTileLocations: { x: number; y: number }[],
  blockedPositions: Set<string>
): OfficeEntity[] {
  const collectibles: OfficeEntity[] = [];
  const countToSpawn = 3 + Math.floor(Math.random() * 3);

  const shuffledDesks = [...deskLocations].filter(pos => !blockedPositions.has(`${pos.x},${pos.y}`));
  for (let i = shuffledDesks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledDesks[i], shuffledDesks[j]] = [shuffledDesks[j], shuffledDesks[i]];
  }

  const shuffledOpen = [...openTileLocations].filter(pos => !blockedPositions.has(`${pos.x},${pos.y}`));
  for (let i = shuffledOpen.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOpen[i], shuffledOpen[j]] = [shuffledOpen[j], shuffledOpen[i]];
  }

  const candidateSpots = [...shuffledDesks, ...shuffledOpen];
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
        rewardXp: itemData.rewardXp + (floorNumber - 1) * 5,
        rewardTokens: itemData.rewardTokens + (floorNumber - 1) * 10
      }
    });

    spawned++;
  }

  return collectibles;
}
