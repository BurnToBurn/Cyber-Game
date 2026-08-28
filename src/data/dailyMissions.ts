import { DailyMission, DailyMissionProgress } from '../types';

export const DAILY_MISSION_POOL: Omit<DailyMission, 'completed' | 'claimed' | 'currentCount'>[] = [
  {
    id: 'daily_triage_phish',
    type: 'TRIAGE_PHISHING',
    title: 'Triage 5 Phishing Emails',
    description: 'Inspect inbox headers, verify domains, and accurately report or clear 5 emails on the terminal.',
    targetCount: 5,
    rewardXp: 150,
    rewardSchruteBucks: 25,
    rewardBonusText: '+150 XP & 25 Schrute Bucks',
    icon: 'MailCheck',
    officeQuote: '"Whenever I\'m about to do something, I think, \'Would an idiot click that link?\' And if they would, I do not click that link." — Dwight'
  },
  {
    id: 'daily_secure_desks',
    type: 'SECURE_DESKS',
    title: 'Secure 3 Unattended Desks',
    description: 'Enforce clean desk policy by locking unlocked workstations and shredding exposed credentials.',
    targetCount: 3,
    rewardXp: 120,
    rewardSchruteBucks: 20,
    rewardBonusText: '+120 XP & "Toughest Desk Auditor" Dundie',
    icon: 'Lock',
    officeQuote: '"Question: What is the number one cause of identity theft? Answer: Unlocked terminals and sticky notes." — Dwight'
  },
  {
    id: 'daily_defend_vishing',
    type: 'DEFEND_VISHING',
    title: 'Neutralize 2 Vishing Phone Calls',
    description: 'Answer ringing office phones, challenge pretexting callers, and enforce verified callback protocol.',
    targetCount: 2,
    rewardXp: 140,
    rewardSchruteBucks: 30,
    rewardBonusText: '+140 XP & Dual-Control Ribbon',
    icon: 'PhoneCall',
    officeQuote: '"Dunder Mifflin Scranton SecOps, this is Pam. No, I will not give you our server password."'
  },
  {
    id: 'daily_quarantine_usb',
    type: 'QUARANTINE_USB',
    title: 'Quarantine 2 Rogue USB Drops',
    description: 'Recover baiting flash drives from the carpet and safely analyze them in the hardware sandbox.',
    targetCount: 2,
    rewardXp: 130,
    rewardSchruteBucks: 20,
    rewardBonusText: '+130 XP & Zero-Trust Pin',
    icon: 'HardDrive',
    officeQuote: '"If someone leaves a USB labeled \'Stanley\'s Secrets\', you do not plug it in. You destroy it." — Stanley'
  },
  {
    id: 'daily_coffee_boost',
    type: 'COFFEE_BOOST',
    title: "Sip from 'World's Best Boss' Mug",
    description: 'Grab a fresh roast from the breakroom coffee station to gain hyperfocus inspection speed.',
    targetCount: 1,
    rewardXp: 50,
    rewardSchruteBucks: 10,
    rewardBonusText: '+50 XP & Hyperfocus Aura',
    icon: 'Coffee',
    officeQuote: '"I bought this mug myself at Spencer Gifts. It gives me 200% processing throughput." — Michael Scott'
  },
  {
    id: 'daily_confer_colleagues',
    type: 'CONFER_COLLEAGUES',
    title: 'Consult with 2 Department Leads',
    description: 'Speak with Bob, Linda, Dave, Marcus, or Karen to assess active floor threat intelligence.',
    targetCount: 2,
    rewardXp: 80,
    rewardSchruteBucks: 15,
    rewardBonusText: '+80 XP & Morale Boost',
    icon: 'Users',
    officeQuote: '"Conference room, five minutes! We need to discuss perimeter firewall discipline."'
  }
];

export function getTodayDateKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export function getNextDailyResetTimestamp(): number {
  const now = new Date();
  const nextReset = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  return nextReset.getTime();
}

export function getFormattedCountdownToReset(): string {
  const now = Date.now();
  const nextReset = getNextDailyResetTimestamp();
  const diffMs = Math.max(0, nextReset - now);
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function generateDailyMissions(): DailyMission[] {
  return DAILY_MISSION_POOL.map(m => ({
    ...m,
    currentCount: 0,
    completed: false,
    claimed: false
  }));
}

const DAILY_STORAGE_KEY = 'cyberfloor_daily_missions_v1';

export function loadDailyMissions(): DailyMissionProgress {
  const todayKey = getTodayDateKey();
  try {
    const saved = localStorage.getItem(DAILY_STORAGE_KEY);
    if (saved) {
      const parsed: DailyMissionProgress = JSON.parse(saved);
      if (parsed.dateKey === todayKey && parsed.missions && parsed.missions.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading daily missions:', e);
  }

  // Generate fresh daily missions for today
  const newProgress: DailyMissionProgress = {
    dateKey: todayKey,
    lastResetEpoch: Date.now(),
    missions: generateDailyMissions(),
    streakDays: 3, // Starter veteran streak
    allCompletedBonusClaimed: false
  };

  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(newProgress));
  } catch (e) {
    console.error('Error saving daily missions:', e);
  }

  return newProgress;
}

export function saveDailyMissions(progress: DailyMissionProgress) {
  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving daily missions:', e);
  }
}
