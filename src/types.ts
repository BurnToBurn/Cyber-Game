export type GameScreen = 
  | 'HUB' 
  | 'PHISHING_TERMINAL' 
  | 'PHONE_CALL' 
  | 'USB_SANDBOX' 
  | 'CLEAN_DESK' 
  | 'SKILL_TREE' 
  | 'INCIDENT_LOGS' 
  | 'DEBRIEF' 
  | 'RUN_SUMMARY'
  | 'TUTORIAL'
  | 'BADGES'
  | 'INCIDENTS'
  | 'NPC_DIALOGUE'
  | 'DAILY_MISSIONS'
  | 'LEADERBOARD';

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export type TileType = 
  | 'FLOOR' 
  | 'WALL' 
  | 'DOOR' 
  | 'DESK' 
  | 'CARPET' 
  | 'SERVER' 
  | 'WINDOW' 
  | 'PLANT' 
  | 'WATER_COOLER' 
  | 'COFFEE_STATION' 
  | 'RESTROOM'
  | 'PRINTER' 
  | 'TURNSTILE' 
  | 'WHITEBOARD'
  | 'ELEVATOR'
  | 'JELLO_STAPLER'
  | 'DUNDIE_DISPLAY'
  | 'PAPER_STACK';

export type OfficeCollectibleType = 
  | 'JELLO_STAPLER' 
  | 'BEET_CARVING' 
  | 'DUNDIE_TROPHY' 
  | 'BOBBLEHEAD' 
  | 'CHILI_POT' 
  | 'PRETZEL_TICKET' 
  | 'WORLDS_BEST_BOSS_MUG' 
  | 'THREAT_LEVEL_MIDNIGHT_SCRIPT' 
  | 'SERENITY_CANDLE' 
  | 'SCHRUTE_BUCKS_STASH'
  | 'PAM_WATERCOLOR'
  | 'WUPHF_CARD';

export interface OfficeCollectibleData {
  collectibleType: OfficeCollectibleType;
  title: string;
  lore: string;
  quote: string;
  character: string;
  iconEmoji: string;
  rewardXp: number;
  rewardSchruteBucks: number;
  dundieTitle?: string;
  sparkleColor: string;
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY';
}

export type EntityType = 
  | 'TERMINAL' 
  | 'PHONE' 
  | 'USB_DROP' 
  | 'NPC_COWORKER' 
  | 'COFFEE_MACHINE' 
  | 'UNLOCKED_PC' 
  | 'PRINTER_LEAK' 
  | 'ELEVATOR_EXIT'
  | 'PEER_OPERATIVE'
  | 'DUNDIE_TROPHY'
  | 'JELLO_PRANK'
  | 'COLLECTIBLE_PROP';

export interface OfficeEntity {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  name: string;
  description: string;
  status: 'ACTIVE' | 'RESOLVED' | 'FAILED' | 'LOCKED';
  difficulty?: number;
  dataId?: string; // Links to specific email or phone call or scenario or NPC ID
  collectible?: OfficeCollectibleData;
}

export interface MapGrid {
  width: number;
  height: number;
  tiles: TileType[][];
  entities: OfficeEntity[];
  playerSpawn: { x: number; y: number };
  elevatorPos: { x: number; y: number };
}

export interface SideObjective {
  id: string;
  title: string;
  description: string;
  rewardXp: number;
  npcId?: string;
  npcName?: string;
  completed?: boolean;
}

export interface PlayerStats {
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  securityClearance: number; // 1 to 5
  credits: number;
  currentFloor: number;
  coffeeBuffDuration: number; // in steps/seconds
  hasInspectVision: boolean;
  unlockedSkills: string[];
  badges: string[];
  characterSkin?: string;
  activeObjectives: string[];
  completedObjectives: string[];
  schruteBucks?: number;
  dundieAwards?: string[];
  collectedProps?: string[];
  branchName?: string;
  username?: string;
  workdaySecondsRemaining?: number;
  dayTimerMax?: number;
}

export type DailyMissionType = 
  | 'TRIAGE_PHISHING' 
  | 'SECURE_DESKS' 
  | 'DEFEND_VISHING' 
  | 'QUARANTINE_USB' 
  | 'COFFEE_BOOST' 
  | 'CONFER_COLLEAGUES'
  | 'ZERO_INCIDENTS_FLOOR';

export interface DailyMission {
  id: string;
  type: DailyMissionType;
  title: string;
  description: string;
  currentCount: number;
  targetCount: number;
  rewardXp: number;
  rewardSchruteBucks?: number;
  rewardBonusText?: string;
  completed: boolean;
  claimed: boolean;
  icon: string;
  officeQuote?: string; // The Office TV show easter egg quote
}

export interface DailyMissionProgress {
  dateKey: string; // e.g. "2026-08-25"
  lastResetEpoch: number;
  missions: DailyMission[];
  streakDays: number;
  allCompletedBonusClaimed: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatarSkin: string;
  branch: string; // e.g. "Scranton Branch (1725 Slough Ave)", "Corporate HQ (NYC)", "Stamford Annex", "Utica SOC"
  department: 'SALES' | 'ACCOUNTING' | 'MANAGEMENT' | 'IT_SECOPS' | 'QUALITY_ASSURANCE';
  title: string;
  clearanceLevel: number;
  dailyXp: number;
  totalScore: number;
  triageAccuracy: number; // percentage (e.g. 96%)
  incidentsCaused: number;
  dundieAward?: string;
  status: 'ONLINE' | 'PATROLLING' | 'IN_TRIAGE' | 'COFFEE_BREAK' | 'OFFLINE';
  statusMessage?: string;
  currentFloor: number;
  isCurrentPlayer?: boolean;
}

export interface MultiplayerOperative {
  id: string;
  username: string;
  avatarSkin: string;
  role: string;
  pos: Position;
  targetPos?: Position;
  facing: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  isMoving: boolean;
  walkFrame: number;
  statusMessage: string;
  speechBubble?: string;
  bubbleTimeout?: number;
  dundieAward?: string;
  color: string;
  accentColor: string;
  department: string;
  score: number;
  clearanceLevel: number;
  branch: string;
}

export interface MultiplayerActivityFeedItem {
  id: string;
  timestamp: string;
  username: string;
  branch: string;
  action: string;
  points: number;
  type: 'SUCCESS' | 'ALERT' | 'DUNDIE' | 'PRANK' | 'INCIDENT';
}

export interface PhishingEmail {
  id: string;
  isPhishing: boolean;
  difficulty: 1 | 2 | 3;
  sender: {
    displayName: string;
    address: string;
    replyTo?: string;
    spfDkimStatus: 'PASS' | 'FAIL' | 'UNVERIFIED' | 'NEUTRAL';
  };
  subject: string;
  timestamp: string;
  body: string;
  links: Array<{
    text: string;
    url: string;
    targetUrl: string; // Real hover target
  }>;
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
    isMalicious: boolean;
  }>;
  redFlags: string[];
  cleanSignals: string[];
  explanation: string;
  category: 'FINANCE' | 'HR' | 'IT_SUPPORT' | 'DELIVERY' | 'EXECUTIVE' | 'VENDOR';
}

export type MatrixOutcome = 'TRUE_POSITIVE' | 'TRUE_NEGATIVE' | 'FALSE_POSITIVE' | 'FALSE_NEGATIVE';

export interface MatrixScore {
  truePositives: number;
  trueNegatives: number;
  falsePositives: number;
  falseNegatives: number;
  totalScore: number;
  streak: number;
  bestStreak: number;
}

export interface DialogueChoice {
  text: string;
  response: string;
  nextNodeId?: string;
  suspicionChange: number; // -20 to +30
  trustChange: number;
  skillRequired?: string;
  isCorrectCall?: boolean;
  consequenceText?: string;
}

export interface DialogueNode {
  id: string;
  speaker: string;
  dialogue: string;
  choices: DialogueChoice[];
  isEndNode?: boolean;
  outcome?: 'CAUGHT_ATTACKER' | 'FELL_FOR_PRETEXT' | 'POLITE_REFUSAL' | 'VERIFIED_LEGITIMATE';
  debrief?: string;
  redFlags?: string[];
  cleanSignals?: string[];
}

export interface PhoneScenario {
  id: string;
  title: string;
  callerName: string;
  callerNumber: string;
  departmentClaimed: string;
  isSocialEngineering: boolean;
  difficulty: 1 | 2 | 3;
  initialNodeId: string;
  nodes: Record<string, DialogueNode>;
  overallExplanation: string;
  tacticUsed: 'AUTHORITY' | 'URGENCY' | 'FEAR' | 'HELPDESK_IMPERSONATION' | 'VENDOR_PRETEXT' | 'LEGITIMATE_AUDIT';
}

export interface IncidentRecord {
  id: string;
  timestamp: string;
  title: string;
  type: 'PHISHING' | 'VISHING' | 'USB_MALWARE' | 'UNLOCKED_DESK' | 'TAILGATING';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  lessonLearned: string;
  resolved: boolean;
  pointsDelta: number;
}

export type SkillBranch = 'AWARENESS' | 'COMMUNICATION' | 'EFFICIENCY';

export interface SkillNode {
  id: string;
  name: string;
  branch: SkillBranch;
  description: string;
  cost: number;
  icon: string;
  unlocked: boolean;
  effectDescription: string;
  tier: 1 | 2 | 3;
  prerequisiteId?: string;
}

export interface NPCDialogueOption {
  text: string;
  response: string;
  nextNodeId?: string;
  grantObjective?: SideObjective;
  triggerHint?: string;
}

export interface NPCDialogueState {
  id: string;
  text: string;
  speakerMood?: 'CALM' | 'PANICKED' | 'SUSPICIOUS' | 'GRATEFUL' | 'CYNICAL';
  options: NPCDialogueOption[];
  threatSpecificDialogue?: {
    highThreat?: string;
    criticalThreat?: string;
    perfectStreak?: string;
  };
}

export interface OfficeNPC {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar: string;
  location: string;
  personality: string;
  dialogueTree: Record<string, NPCDialogueState>;
  initialDialogueId: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  criteria: string;
}
