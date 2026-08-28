import { Badge } from '../types';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'badge_first_catch',
    title: 'Wire Phish Interceptor',
    description: 'Intercepted your first genuine banking phishing email targeting Huntington credentials.',
    icon: 'Fish',
    rarity: 'COMMON',
    criteria: '1 True Positive in Terminal'
  },
  {
    id: 'badge_perfect_calibration',
    title: 'Calibrated Treasury Eye',
    description: 'Correctly allowed a legitimate Federal Reserve settlement report without false-positive panic.',
    icon: 'CheckCircle2',
    rarity: 'COMMON',
    criteria: '1 True Negative in Terminal'
  },
  {
    id: 'badge_vishing_slayer',
    title: 'Dual-Control Vanguard',
    description: 'Repelled an aggressive Vishing attacker attempting Core Banking Helpdesk remote takeover.',
    icon: 'PhoneOff',
    rarity: 'RARE',
    criteria: 'Win Phone Call 1'
  },
  {
    id: 'badge_zero_trust',
    title: 'Zero-Trust ATM Guardian',
    description: 'Safely quarantined a dropped baiting USB drive instead of inserting it into banking hardware.',
    icon: 'ShieldCheck',
    rarity: 'RARE',
    criteria: 'Proper USB quarantine'
  },
  {
    id: 'badge_clean_floor',
    title: 'OCC Audit Distinction',
    description: 'Cleared an entire procedural bank floor with DEFCON threat level maintained below 20%.',
    icon: 'Award',
    rarity: 'EPIC',
    criteria: 'Complete Floor with <20% Threat'
  },
  {
    id: 'badge_speedrun_demigod',
    title: 'Huntington CISO Vanguard',
    description: 'Attained Level 5 Bank Security Clearance and mastered all 3 cyber defense skill trees.',
    icon: 'Crown',
    rarity: 'LEGENDARY',
    criteria: 'Level 5 Clearance + All Skills'
  }
];
