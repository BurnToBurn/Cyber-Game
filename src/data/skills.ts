import { SkillNode } from '../types';

export const SKILL_TREE_DATA: SkillNode[] = [
  // ==========================================
  // BRANCH 1: AWARENESS (Banking Threat Forensics)
  // ==========================================
  {
    id: 'skill_domain_inspector',
    name: 'Banking Domain & Typosquat Inspector',
    branch: 'AWARENESS',
    description: 'Highlights lookalike domains, spoofed banking subdomains, and punycode targeting Huntington credentials.',
    cost: 40,
    icon: 'Search',
    unlocked: false,
    effectDescription: 'Activates live domain breakdown & suspicious syntax tags in Phishing Terminal.',
    tier: 1
  },
  {
    id: 'skill_header_analyzer',
    name: 'Fedwire & SPF/DKIM Crypto Validator',
    branch: 'AWARENESS',
    description: 'Automates deep inspection of SPF, DKIM, DMARC, and ISO 20022 message authentication headers in banking emails.',
    cost: 75,
    icon: 'FileCode',
    unlocked: false,
    effectDescription: 'Adds live SPF/DKIM verification badge to email headers in Phishing Terminal.',
    tier: 2,
    prerequisiteId: 'skill_domain_inspector'
  },
  {
    id: 'skill_heuristic_sandbox',
    name: 'Air-Gapped ATM & Payload Sandbox',
    branch: 'AWARENESS',
    description: 'Safely detonates suspicious email attachments, macro-enabled spreadsheets, and dropped USB drives in an isolated enclave.',
    cost: 90,
    icon: 'ShieldAlert',
    unlocked: false,
    effectDescription: 'Unlocks sandbox detonation preview in Phishing Terminal and USB drop inspection.',
    tier: 2
  },
  {
    id: 'skill_urgency_classifier',
    name: 'Wire Urgency & BEC Classifier',
    branch: 'AWARENESS',
    description: 'Flags artificial wire cutoff deadlines, CFO impersonation language, and coercive psychological patterns in banking messages.',
    cost: 130,
    icon: 'AlertCircle',
    unlocked: false,
    effectDescription: 'Highlights manipulative wire urgency triggers and coercive phrases in email bodies.',
    tier: 3,
    prerequisiteId: 'skill_header_analyzer'
  },
  {
    id: 'skill_threat_intel_feed',
    name: 'Huntington CTI Threat Intel Feed',
    branch: 'AWARENESS',
    description: 'Connects your workstation to live FS-ISAC banking threat intelligence, flagging high-risk TLDs with instant threat warnings.',
    cost: 175,
    icon: 'Flame',
    unlocked: false,
    effectDescription: '+25% XP bonus for identifying advanced banking spearphishing and malicious domains.',
    tier: 3,
    prerequisiteId: 'skill_heuristic_sandbox'
  },

  // ==========================================
  // BRANCH 2: COMMUNICATION (Vishing & Dual Control)
  // ==========================================
  {
    id: 'skill_caller_verifier',
    name: 'Easton Active Directory Caller Lookup',
    branch: 'COMMUNICATION',
    description: 'Queries internal Huntington Active Directory to flag external or spoofed caller extensions during phone calls.',
    cost: 40,
    icon: 'PhoneCall',
    unlocked: false,
    effectDescription: 'Displays live Directory Registration badge on phone handsets during calls.',
    tier: 1
  },
  {
    id: 'skill_social_radar',
    name: 'Social Engineering & Pretext Radar',
    branch: 'COMMUNICATION',
    description: 'Analyzes caller cadence to highlight banking persuasion tactics (Pretexting, Authority, Fear of Regulatory Fines).',
    cost: 75,
    icon: 'Radio',
    unlocked: false,
    effectDescription: 'Marks psychological tactic tags next to caller dialogue in real-time.',
    tier: 2,
    prerequisiteId: 'skill_caller_verifier'
  },
  {
    id: 'skill_deescalation_protocol',
    name: 'Bank Dual-Control De-escalation Script',
    branch: 'COMMUNICATION',
    description: 'Standardized challenge-response script that dampens caller hostility and lowers suspicion build-up during wire inquiries.',
    cost: 95,
    icon: 'ShieldCheck',
    unlocked: false,
    effectDescription: 'Reduces suspicion rate by 30% and cushions minor dialogue missteps.',
    tier: 2
  },
  {
    id: 'skill_executive_verification',
    name: 'Dual-Control Out-of-Band Wire Verification',
    branch: 'COMMUNICATION',
    description: 'Enables an immediate out-of-band cross-reference option in high-pressure executive impersonation calls.',
    cost: 140,
    icon: 'UserCheck',
    unlocked: false,
    effectDescription: 'Unlocks instant Out-of-Band secondary confirmation option in Vishing mini-games.',
    tier: 3,
    prerequisiteId: 'skill_social_radar'
  },
  {
    id: 'skill_secops_pushback',
    name: 'Regulatory Authority Pushback',
    branch: 'COMMUNICATION',
    description: 'Confidence training allows you to firmly rebuff malicious actors claiming federal authority and guide coworkers without hesitation.',
    cost: 180,
    icon: 'Award',
    unlocked: false,
    effectDescription: '+35% XP bonus on all vishing resolutions and coworker security consultations.',
    tier: 3,
    prerequisiteId: 'skill_deescalation_protocol'
  },

  // ==========================================
  // BRANCH 3: EFFICIENCY (Speed & Clean Floor)
  // ==========================================
  {
    id: 'skill_coffee_hyperfocus',
    name: 'Easton Nitro Cold Brew Stamina',
    branch: 'EFFICIENCY',
    description: 'Doubles breakroom coffee machine boost duration to 60 seconds and grants +50% movement speed across bank corridors.',
    cost: 40,
    icon: 'Coffee',
    unlocked: false,
    effectDescription: 'Extended coffee duration (60s) + faster traversal across bank floors.',
    tier: 1
  },
  {
    id: 'skill_rapid_triage',
    name: 'Hogan Terminal Rapid Triage Hotkeys',
    branch: 'EFFICIENCY',
    description: 'Master terminal hotkeys ([1] Report Phish, [2] Mark Safe, [W]/[S] Navigate) for instantaneous categorization.',
    cost: 70,
    icon: 'Zap',
    unlocked: false,
    effectDescription: 'Enables rapid single-key triage hotkeys in the Phishing Terminal.',
    tier: 2,
    prerequisiteId: 'skill_coffee_hyperfocus'
  },
  {
    id: 'skill_clean_desk_sweep',
    name: 'GLBA Rapid Desk Audit Protocol',
    branch: 'EFFICIENCY',
    description: 'Streamlines clean desk remediation, detecting unattended terminals and customer PII sticky notes from farther away.',
    cost: 95,
    icon: 'Eye',
    unlocked: false,
    effectDescription: 'Increases interaction proximity range and auto-highlights physical GLBA violations.',
    tier: 2
  },
  {
    id: 'skill_auto_triage_feed',
    name: 'Huntington Cyber Pipeline Quick-Escalate',
    branch: 'EFFICIENCY',
    description: 'Directly pipes confirmed threats into SecOps ticketing, granting instant XP credits upon banking email review.',
    cost: 135,
    icon: 'TrendingUp',
    unlocked: false,
    effectDescription: '+20% score multiplier on all confusion matrix true calls.',
    tier: 3,
    prerequisiteId: 'skill_rapid_triage'
  },
  {
    id: 'skill_incident_shield',
    name: 'Overclocked Bank Incident Shield',
    branch: 'EFFICIENCY',
    description: 'Algorithmic fail-safe absorbs one False Negative security breach per floor without spiking the bank DEFCON threat level.',
    cost: 180,
    icon: 'Shield',
    unlocked: false,
    effectDescription: 'Grants 1 Incident Absorb Shield per floor (prevents initial breach threat surge).',
    tier: 3,
    prerequisiteId: 'skill_clean_desk_sweep'
  }
];
