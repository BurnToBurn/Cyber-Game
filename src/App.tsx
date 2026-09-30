/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GameScreen, PlayerStats, MatrixScore, MatrixOutcome, 
  IncidentRecord, PhishingEmail, PhoneScenario, OfficeEntity, 
  OfficeNPC, SideObjective, DailyMissionProgress, LeaderboardEntry, MultiplayerActivityFeedItem,
  OfficeCollectibleData
} from './types';
import { generateOfficeFloor } from './utils/mapGenerator';
import { INITIAL_EMAILS } from './data/emails';
import { PHONE_SCENARIOS } from './data/phoneScenarios';
import { USB_SCENARIOS, CLEAN_DESK_SCENARIOS } from './data/extraScenarios';
import { SKILL_TREE_DATA } from './data/skills';
import { INITIAL_BADGES } from './data/badges';
import { OFFICE_NPCS } from './data/npcs';
import { audio } from './utils/audio';
import confetti from 'canvas-confetti';

import { ThreatMeter } from './components/ThreatMeter';
import { OfficeHub } from './components/OfficeHub';
import { PhishingTerminal } from './components/PhishingTerminal';
import { PhoneCallMiniGame } from './components/PhoneCallMiniGame';
import { UsbSandboxMiniGame } from './components/UsbSandboxMiniGame';
import { CleanDeskMiniGame } from './components/CleanDeskMiniGame';
import { NPCDialogueModal } from './components/NPCDialogueModal';
import { SkillTreeModal } from './components/SkillTreeModal';
import { BadgeLanyard } from './components/BadgeLanyard';
import { IncidentCorkboard } from './components/IncidentCorkboard';
import { RunSummaryModal } from './components/RunSummaryModal';
import { OperativeSelectModal } from './components/OperativeSelectModal';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { OfficeCollectibleModal } from './components/OfficeCollectibleModal';
import { TrophyRoomModal } from './components/TrophyRoomModal';

import { loadDailyMissions, saveDailyMissions } from './data/dailyMissions';
import { INITIAL_LEADERBOARD, INITIAL_ACTIVITY_FEED } from './data/leaderboardData';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('HUB');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showRosterModal, setShowRosterModal] = useState<boolean>(false);
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showTrophyRoomModal, setShowTrophyRoomModal] = useState<boolean>(false);
  const [activeCollectible, setActiveCollectible] = useState<OfficeCollectibleData | null>(null);
  const [activeCollectibleEntityId, setActiveCollectibleEntityId] = useState<string | null>(null);

  // Daily Missions State (Refreshes every 24 hours)
  const [dailyProgress, setDailyProgress] = useState<DailyMissionProgress>(() => loadDailyMissions());

  // Multiplayer Leaderboard & Live Activity Feed
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>(INITIAL_LEADERBOARD);
  const [activityFeed, setActivityFeed] = useState<MultiplayerActivityFeedItem[]>(INITIAL_ACTIVITY_FEED);

  // Player Progression State
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    hp: 100,
    maxHp: 100,
    xp: 0,
    level: 1,
    securityClearance: 1,
    credits: 60, // Starting XP
    currentFloor: 1,
    coffeeBuffDuration: 0,
    hasInspectVision: false,
    unlockedSkills: [],
    badges: [],
    activeObjectives: [],
    completedObjectives: [],
    characterSkin: 'player_alex',
    bonusTokens: 50,
    awards: ['🏆 Security Operations Rookie Award']
  });

  // World Threat Level (0 - 100%)
  const [threatLevel, setThreatLevel] = useState<number>(10);

  // 2x2 Confusion Matrix Stats
  const [matrixScore, setMatrixScore] = useState<MatrixScore>({
    truePositives: 0,
    trueNegatives: 0,
    falsePositives: 0,
    falseNegatives: 0,
    totalScore: 0,
    streak: 0,
    bestStreak: 0
  });

  // Active Incidents Log (World Consequence)
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);

  // Procedural Floor Grid Map
  const [mapGrid, setMapGrid] = useState(() => generateOfficeFloor(1));

  // Current active scenarios & NPC
  const [activeEmails, setActiveEmails] = useState<PhishingEmail[]>(INITIAL_EMAILS);
  const [activePhoneScenario, setActivePhoneScenario] = useState<PhoneScenario>(PHONE_SCENARIOS[0]);
  const [activeUsbScenario, setActiveUsbScenario] = useState(USB_SCENARIOS[0]);
  const [activeCleanDeskScenario, setActiveCleanDeskScenario] = useState(CLEAN_DESK_SCENARIOS[0]);
  const [activeNpc, setActiveNpc] = useState<OfficeNPC | null>(OFFICE_NPCS[0]);
  const [incidentShieldAvailable, setIncidentShieldAvailable] = useState<boolean>(true);
  const [objectiveToast, setObjectiveToast] = useState<string | null>(null);

  // Coffee Buff countdown timer
  useEffect(() => {
    if (playerStats.coffeeBuffDuration > 0) {
      const timer = setInterval(() => {
        setPlayerStats(prev => ({
          ...prev,
          coffeeBuffDuration: Math.max(0, prev.coffeeBuffDuration - 1)
        }));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [playerStats.coffeeBuffDuration]);

  // Synchronize player score to multi-user leaderboard
  useEffect(() => {
    setLeaderboardEntries(prevEntries => {
      const updated = prevEntries.map(entry => {
        if (entry.isCurrentPlayer) {
          return {
            ...entry,
            totalScore: 2800 + playerStats.credits + (matrixScore.totalScore * 10),
            dailyXp: 450 + playerStats.xp,
            clearanceLevel: playerStats.securityClearance
          };
        }
        return entry;
      });

      // Sort by score descending and recalculate ranks
      updated.sort((a, b) => b.totalScore - a.totalScore);
      return updated.map((e, idx) => ({ ...e, rank: idx + 1 }));
    });
  }, [playerStats.credits, playerStats.xp, playerStats.securityClearance, matrixScore.totalScore]);

  // Helper to increment daily mission task counters
  const incrementDailyMission = (type: string, countDelta: number = 1) => {
    setDailyProgress(prev => {
      let changed = false;
      const updatedMissions = prev.missions.map(mission => {
        if (mission.type === type && !mission.completed) {
          const nextCount = Math.min(mission.targetCount, mission.currentCount + countDelta);
          const isNowCompleted = nextCount >= mission.targetCount;
          if (nextCount !== mission.currentCount) changed = true;
          if (isNowCompleted && !mission.completed) {
            setObjectiveToast(`DAILY MISSION COMPLETE: ${mission.title}!`);
            audio.playBadgeUnlock();
            confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
          }
          return {
            ...mission,
            currentCount: nextCount,
            completed: isNowCompleted
          };
        }
        return mission;
      });

      if (!changed) return prev;

      const newProgress: DailyMissionProgress = {
        ...prev,
        missions: updatedMissions
      };
      saveDailyMissions(newProgress);
      return newProgress;
    });
  };

  // Claim specific daily mission reward
  const handleClaimDailyMission = (missionId: string) => {
    setDailyProgress(prev => {
      const mission = prev.missions.find(m => m.id === missionId);
      if (!mission || !mission.completed || mission.claimed) return prev;

      audio.playSuccess();
      confetti({ particleCount: 50, spread: 80, origin: { y: 0.5 } });

      setPlayerStats(p => ({
        ...p,
        credits: p.credits + mission.rewardXp,
        xp: p.xp + mission.rewardXp,
        bonusTokens: (p.bonusTokens || 0) + (mission.rewardTokens || 0)
      }));

      // Add to multiplayer activity feed
      const newFeedItem: MultiplayerActivityFeedItem = {
        id: `feed_${Date.now()}`,
        timestamp: 'Just now',
        username: 'You (Agent Alex)',
        branch: 'Security Operations',
        action: `Claimed daily mission: "${mission.title}"`,
        points: mission.rewardXp,
        type: 'SUCCESS'
      };
      setActivityFeed(f => [newFeedItem, ...f.slice(0, 15)]);

      const updated = prev.missions.map(m => m.id === missionId ? { ...m, claimed: true } : m);
      const newProgress = { ...prev, missions: updated };
      saveDailyMissions(newProgress);
      return newProgress;
    });
  };

  // Claim grand daily bonus (all missions done)
  const handleClaimAllDailyBonus = () => {
    if (dailyProgress.allCompletedBonusClaimed) return;
    audio.playSuccess();
    confetti({ particleCount: 90, spread: 100, origin: { y: 0.4 } });

    setPlayerStats(p => ({
      ...p,
      credits: p.credits + 300,
      xp: p.xp + 300,
      bonusTokens: (p.bonusTokens || 0) + 100,
      awards: [...(p.awards || []), '🏆 Security Operations Excellence Award']
    }));

    setDailyProgress(prev => {
      const newProg = { ...prev, allCompletedBonusClaimed: true };
      saveDailyMissions(newProg);
      return newProg;
    });
  };

  // High five peer operative
  const handleHighFivePeer = (peerName: string) => {
    setPlayerStats(p => ({
      ...p,
      credits: p.credits + 15,
      xp: p.xp + 15
    }));
    const newFeedItem: MultiplayerActivityFeedItem = {
      id: `feed_hf_${Date.now()}`,
      timestamp: 'Just now',
      username: 'You (Agent Alex)',
      branch: 'Security Operations',
      action: `Exchanged high-five with ${peerName} on Floor ${playerStats.currentFloor}`,
      points: 15,
      type: 'SUCCESS'
    };
    setActivityFeed(f => [newFeedItem, ...f.slice(0, 15)]);
  };

  // Sound toggle helper
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    audio.enabled = next;
  };

  // Badge award helper
  const awardBadge = (badgeId: string) => {
    if (!playerStats.badges.includes(badgeId)) {
      setPlayerStats(prev => ({
        ...prev,
        badges: [...prev.badges, badgeId]
      }));
      audio.playBadgeUnlock();
    }
  };

  // Objective Completion Helper
  const checkAndCompleteObjective = (targetType: string, rewardOverride?: number) => {
    const allObjectives: SideObjective[] = [];
    OFFICE_NPCS.forEach(npc => {
      Object.values(npc.dialogueTree).forEach(state => {
        state.options.forEach(opt => {
          if (opt.grantObjective) {
            allObjectives.push(opt.grantObjective);
          }
        });
      });
    });

    const objectiveTypeMap: Record<string, string> = {
      'PHISHING_TRIAGE': 'obj_bob_terminal',
      'CLEAN_DESK_LOCK': 'obj_linda_cleandesk',
      'USB_QUARANTINE': 'obj_dave_usb',
      'VISHING_CHALLENGE': 'obj_marcus_vishing',
      'ELEVATOR_EXIT': 'obj_karen_elevator'
    };

    const targetId = objectiveTypeMap[targetType];
    const matchedObj = allObjectives.find(
      obj => (obj.id === targetId || obj.id === targetType) && 
             playerStats.activeObjectives.includes(obj.id) && 
             !playerStats.completedObjectives.includes(obj.id)
    );

    if (matchedObj) {
      const reward = rewardOverride || matchedObj.rewardXp;
      setPlayerStats(prev => ({
        ...prev,
        credits: prev.credits + reward,
        xp: prev.xp + reward,
        completedObjectives: [...prev.completedObjectives, matchedObj.id],
        activeObjectives: prev.activeObjectives.filter(id => id !== matchedObj.id)
      }));

      setObjectiveToast(`OBJECTIVE COMPLETE: ${matchedObj.title} (+${reward} XP)`);
      audio.playSuccess();
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });

      setTimeout(() => setObjectiveToast(null), 4000);
    }
  };

  // Handle entity interaction from office floor
  const handleInteractEntity = (entity: OfficeEntity) => {
    switch (entity.type) {
      case 'TERMINAL':
        audio.playClick();
        setCurrentScreen('PHISHING_TERMINAL');
        break;

      case 'PHONE':
        audio.playClick();
        setActivePhoneScenario(
          PHONE_SCENARIOS[(playerStats.currentFloor - 1) % PHONE_SCENARIOS.length]
        );
        setCurrentScreen('PHONE_CALL');
        break;

      case 'USB_DROP':
        audio.playClick();
        setActiveUsbScenario(
          USB_SCENARIOS[(playerStats.currentFloor - 1) % USB_SCENARIOS.length]
        );
        setCurrentScreen('USB_SANDBOX');
        break;

      case 'UNLOCKED_PC':
        audio.playClick();
        setActiveCleanDeskScenario(
          CLEAN_DESK_SCENARIOS[(playerStats.currentFloor - 1) % CLEAN_DESK_SCENARIOS.length]
        );
        setCurrentScreen('CLEAN_DESK');
        break;

      case 'NPC_COWORKER': {
        audio.playClick();
        const foundNpc = OFFICE_NPCS.find(n => n.id === entity.dataId) || OFFICE_NPCS[0];
        setActiveNpc(foundNpc);
        incrementDailyMission('CONFER_COLLEAGUES', 1);
        setCurrentScreen('NPC_DIALOGUE');
        break;
      }

      case 'COFFEE_MACHINE': {
        audio.playCoffeeSip();
        const buffSeconds = playerStats.unlockedSkills.includes('skill_coffee_hyperfocus') ? 60 : 30;
        setPlayerStats(prev => ({
          ...prev,
          coffeeBuffDuration: buffSeconds,
          hasInspectVision: true
        }));
        incrementDailyMission('COFFEE_BOOST', 1);
        break;
      }

      case 'ELEVATOR_EXIT':
        audio.playClick();
        checkAndCompleteObjective('ELEVATOR_EXIT', 50);
        setCurrentScreen('RUN_SUMMARY');
        break;

      case 'COLLECTIBLE_PROP':
        if (entity.collectible) {
          audio.playBadgeUnlock();
          setActiveCollectible(entity.collectible);
          setActiveCollectibleEntityId(entity.id);
        }
        break;

      default:
        if (entity.collectible) {
          audio.playBadgeUnlock();
          setActiveCollectible(entity.collectible);
          setActiveCollectibleEntityId(entity.id);
        }
        break;
    }
  };

  // Collectible Prop claim handler
  const handleClaimCollectible = () => {
    if (!activeCollectible) return;

    const item = activeCollectible;
    const xpReward = item.rewardXp;
    const tokenReward = item.rewardTokens;

    setPlayerStats(prev => {
      const existingProps = prev.collectedProps || [];
      const existingAwards = prev.awards || [];
      
      const nextProps = existingProps.includes(item.title) 
        ? existingProps 
        : [...existingProps, item.title];

      const nextAwards = (item.awardTitle && !existingAwards.includes(item.awardTitle))
        ? [...existingAwards, item.awardTitle]
        : existingAwards;

      // Coffee collectibles provide a short speed boost.
      const coffeeBoost = item.collectibleType === 'COFFEE_MUG' ? 35 : 0;

      return {
        ...prev,
        credits: prev.credits + xpReward,
        xp: prev.xp + xpReward,
        bonusTokens: (prev.bonusTokens || 0) + tokenReward,
        collectedProps: nextProps,
        awards: nextAwards,
        coffeeBuffDuration: Math.max(prev.coffeeBuffDuration, coffeeBoost),
        hasInspectVision: coffeeBoost > 0 ? true : prev.hasInspectVision
      };
    });

    // Remove collected item from mapGrid entities
    if (activeCollectibleEntityId) {
      setMapGrid(prev => ({
        ...prev,
        entities: prev.entities.filter(e => e.id !== activeCollectibleEntityId)
      }));
    }

    // Add to multiplayer activity feed
    const feedEntry: MultiplayerActivityFeedItem = {
      id: `feed_prop_${Date.now()}`,
      timestamp: 'Just now',
      username: 'You',
      branch: 'Security Operations',
      action: `Discovered secret prop "${item.title}"!`,
      points: xpReward,
      type: 'SUCCESS'
    };
    setActivityFeed(prev => [feedEntry, ...prev.slice(0, 19)]);

    setObjectiveToast(`COLLECTED: ${item.title} (+${xpReward} XP, +${tokenReward} tokens)`);
    audio.playSuccess();
    confetti({ particleCount: 45, spread: 75, origin: { y: 0.6 } });

    setActiveCollectible(null);
    setActiveCollectibleEntityId(null);
    setTimeout(() => setObjectiveToast(null), 4000);
  };

  // Phishing Terminal decision handler (2x2 Confusion Matrix)
  const handlePhishingDecision = (
    email: PhishingEmail,
    action: 'REPORT_PHISHING' | 'MARK_SAFE',
    outcome: MatrixOutcome,
    pointsDelta: number
  ) => {
    setMatrixScore(prev => {
      const isTP = outcome === 'TRUE_POSITIVE';
      const isTN = outcome === 'TRUE_NEGATIVE';
      const isFP = outcome === 'FALSE_POSITIVE';
      const isFN = outcome === 'FALSE_NEGATIVE';

      const nextStreak = (isTP || isTN) ? prev.streak + 1 : 0;

      return {
        truePositives: prev.truePositives + (isTP ? 1 : 0),
        trueNegatives: prev.trueNegatives + (isTN ? 1 : 0),
        falsePositives: prev.falsePositives + (isFP ? 1 : 0),
        falseNegatives: prev.falseNegatives + (isFN ? 1 : 0),
        totalScore: Math.max(0, prev.totalScore + pointsDelta),
        streak: nextStreak,
        bestStreak: Math.max(prev.bestStreak, nextStreak)
      };
    });

    // Update player XP credits
    let finalDelta = pointsDelta;
    if (pointsDelta > 0 && playerStats.unlockedSkills.includes('skill_auto_triage_feed')) {
      finalDelta = Math.round(pointsDelta * 1.2);
    }

    if (finalDelta > 0) {
      setPlayerStats(prev => ({
        ...prev,
        credits: prev.credits + finalDelta,
        xp: prev.xp + finalDelta
      }));
    }

    // Advance daily mission progress
    incrementDailyMission('TRIAGE_PHISHING', 1);

    // World Consequence: Shift threat level
    if (outcome === 'TRUE_POSITIVE' || outcome === 'TRUE_NEGATIVE') {
      setThreatLevel(prev => Math.max(0, prev - 8));
      if (outcome === 'TRUE_POSITIVE') awardBadge('badge_first_catch');
      if (outcome === 'TRUE_NEGATIVE') awardBadge('badge_perfect_calibration');
      checkAndCompleteObjective('PHISHING_TRIAGE');
    } else if (outcome === 'FALSE_POSITIVE') {
      setThreatLevel(prev => Math.min(100, prev + 5));
    } else if (outcome === 'FALSE_NEGATIVE') {
      const hasShield = playerStats.unlockedSkills.includes('skill_incident_shield') && incidentShieldAvailable;
      if (hasShield) {
        setIncidentShieldAvailable(false);
        setThreatLevel(prev => Math.min(100, prev + 10));
        audio.playCoffeeSip();
      } else {
        setThreatLevel(prev => Math.min(100, prev + 25));
      }

      const newIncident: IncidentRecord = {
        id: `inc_${Date.now()}`,
        timestamp: 'Just Now',
        title: `Phishing Breach: "${email.subject.substring(0, 35)}..."`,
        type: 'PHISHING',
        severity: email.difficulty === 3 ? 'CRITICAL' : 'HIGH',
        description: `Employee failed to detect malicious sender "${email.sender.address}" and marked threat as safe. Credential harvest triggered.`,
        lessonLearned: email.explanation,
        resolved: false,
        pointsDelta: -15
      };
      setIncidents(prev => [newIncident, ...prev]);
    }
  };

  // Phone call completion handler
  const handlePhoneComplete = (
    outcome: 'CAUGHT_ATTACKER' | 'FELL_FOR_PRETEXT' | 'POLITE_REFUSAL' | 'VERIFIED_LEGITIMATE',
    pointsDelta: number,
    incidentNote?: string
  ) => {
    if (outcome === 'CAUGHT_ATTACKER' || outcome === 'VERIFIED_LEGITIMATE') {
      setThreatLevel(prev => Math.max(0, prev - 12));
      const award = playerStats.unlockedSkills.includes('skill_secops_pushback') ? 20 : 15;
      setPlayerStats(prev => ({ 
        ...prev, 
        credits: prev.credits + award,
        xp: prev.xp + award 
      }));
      awardBadge('badge_vishing_slayer');
      checkAndCompleteObjective('VISHING_CHALLENGE');
      incrementDailyMission('DEFEND_VISHING', 1);
    } else if (outcome === 'FELL_FOR_PRETEXT') {
      setThreatLevel(prev => Math.min(100, prev + 25));
      if (incidentNote) {
        setIncidents(prev => [
          {
            id: `inc_vishing_${Date.now()}`,
            timestamp: 'Just Now',
            title: `Vishing Attack Successful: ${activePhoneScenario.title}`,
            type: 'VISHING',
            severity: 'CRITICAL',
            description: incidentNote,
            lessonLearned: activePhoneScenario.overallExplanation,
            resolved: false,
            pointsDelta: -20
          },
          ...prev
        ]);
      }
    } else if (outcome === 'POLITE_REFUSAL') {
      setThreatLevel(prev => Math.min(100, prev + 5));
    }
  };

  // USB Drop completion handler
  const handleUsbComplete = (action: 'QUARANTINE' | 'PLUG_IN', pointsDelta: number, incidentNote?: string) => {
    if (action === 'QUARANTINE') {
      setThreatLevel(prev => Math.max(0, prev - 10));
      setPlayerStats(prev => ({ 
        ...prev, 
        credits: prev.credits + 15,
        xp: prev.xp + 15 
      }));
      awardBadge('badge_zero_trust');
      checkAndCompleteObjective('USB_QUARANTINE');
      incrementDailyMission('QUARANTINE_USB', 1);
    } else {
      setThreatLevel(prev => Math.min(100, prev + 30));
      if (incidentNote) {
        setIncidents(prev => [
          {
            id: `inc_usb_${Date.now()}`,
            timestamp: 'Just Now',
            title: 'Physical Security: Rogue USB Key Connected',
            type: 'USB_MALWARE',
            severity: 'CRITICAL',
            description: incidentNote,
            lessonLearned: activeUsbScenario.explanation,
            resolved: false,
            pointsDelta: -25
          },
          ...prev
        ]);
      }
    }
  };

  // Clean Desk handler
  const handleCleanDeskComplete = (action: 'SECURE' | 'IGNORE', pointsDelta: number, incidentNote?: string) => {
    if (action === 'SECURE') {
      const reward = pointsDelta > 0 ? pointsDelta : 10;
      setThreatLevel(prev => Math.max(0, prev - 8));
      setPlayerStats(prev => ({ 
        ...prev, 
        credits: prev.credits + reward,
        xp: prev.xp + reward 
      }));
      checkAndCompleteObjective('CLEAN_DESK_LOCK');
      incrementDailyMission('SECURE_DESKS', 1);
    } else if (incidentNote) {
      setThreatLevel(prev => Math.min(100, prev + 15));
      setIncidents(prev => [
        {
          id: `inc_desk_${Date.now()}`,
          timestamp: 'Just Now',
          title: 'Clean Desk Policy Violation',
          type: 'UNLOCKED_DESK',
          severity: 'MEDIUM',
          description: incidentNote,
          lessonLearned: 'Unattended workstations and confidential printouts must be locked or shredded.',
          resolved: false,
          pointsDelta: -10
        },
        ...prev
      ]);
    } else if (pointsDelta > 0) {
      setPlayerStats(prev => ({
        ...prev,
        credits: prev.credits + pointsDelta,
        xp: prev.xp + pointsDelta
      }));
    }
  };

  // Unlock skill perk
  const handleUnlockSkill = (skillId: string, cost: number) => {
    setPlayerStats(prev => ({
      ...prev,
      credits: prev.credits - cost,
      unlockedSkills: [...prev.unlockedSkills, skillId]
    }));
  };

  // Accept Objective from NPC
  const handleAcceptObjective = (objective: SideObjective) => {
    if (!playerStats.activeObjectives.includes(objective.id)) {
      setPlayerStats(prev => ({
        ...prev,
        activeObjectives: [...prev.activeObjectives, objective.id]
      }));
      setObjectiveToast(`NEW SIDE OBJECTIVE: ${objective.title}`);
      audio.playBadgeUnlock();
      setTimeout(() => setObjectiveToast(null), 3500);
    }
  };

  // Advance to next floor
  const handleNextFloor = () => {
    const nextFloorNumber = playerStats.currentFloor + 1;
    setPlayerStats(prev => ({
      ...prev,
      currentFloor: nextFloorNumber,
      securityClearance: Math.min(5, prev.securityClearance + 1)
    }));
    setMapGrid(generateOfficeFloor(nextFloorNumber));
    setThreatLevel(15);
    setIncidentShieldAvailable(true);
    setCurrentScreen('HUB');
  };

  // Reset run
  const handleRestartGame = () => {
    setPlayerStats({
      hp: 100,
      maxHp: 100,
      xp: 0,
      level: 1,
      securityClearance: 1,
      credits: 60,
      currentFloor: 1,
      coffeeBuffDuration: 0,
      hasInspectVision: false,
      unlockedSkills: [],
      badges: [],
      activeObjectives: [],
      completedObjectives: [],
      characterSkin: 'player_alex',
      bonusTokens: 50,
      awards: ['🏆 Security Operations Rookie Award']
    });
    setThreatLevel(10);
    setMatrixScore({
      truePositives: 0,
      trueNegatives: 0,
      falsePositives: 0,
      falseNegatives: 0,
      totalScore: 0,
      streak: 0,
      bestStreak: 0
    });
    setIncidents([]);
    setMapGrid(generateOfficeFloor(1));
    setIncidentShieldAvailable(true);
    setCurrentScreen('HUB');
  };

  const handleSelectSkin = (skinId: string) => {
    audio.playSuccess();
    setPlayerStats(prev => ({
      ...prev,
      characterSkin: skinId
    }));
  };

  const completedDailyCount = dailyProgress.missions.filter(m => m.completed).length;
  const playerRank = leaderboardEntries.find(e => e.isCurrentPlayer)?.rank || 4;

  return (
    <div id="cyberfloor-app" className="h-screen w-screen bg-[#090d16] text-[#e2e8f0] font-tech flex flex-col overflow-hidden relative selection:bg-[#0284c7] selection:text-white">
      {/* Background High Density Grid Overlay */}
      <div className="absolute inset-0 grid-lines pointer-events-none z-0 opacity-50" />

      {/* Persistent Top Threat Level Meter & Status Bar */}
      <ThreatMeter
        threatLevel={threatLevel}
        playerStats={playerStats}
        onOpenSkills={() => setCurrentScreen('SKILL_TREE')}
        onOpenBadges={() => setCurrentScreen('BADGES')}
        onOpenIncidents={() => setCurrentScreen('INCIDENTS')}
        incidentCount={incidents.length}
        onOpenRoster={() => setShowRosterModal(true)}
        onOpenDailyMissions={() => setShowDailyModal(true)}
        dailyMissionsCompletedCount={completedDailyCount}
        dailyMissionsTotalCount={dailyProgress.missions.length}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        playerRank={playerRank}
        onOpenTrophyRoom={() => setShowTrophyRoomModal(true)}
      />

      {/* Objective Notification Toast */}
      {objectiveToast && (
        <div className="absolute top-20 right-6 z-40 bg-[#0f172a] text-yellow-300 border-2 border-yellow-400 px-4 py-2 font-pixel text-xs shadow-2xl animate-bounce">
          🎯 {objectiveToast}
        </div>
      )}

      {/* Main Office Hub Canvas & Roaming Stage with Freeform Movement */}
      <OfficeHub
        mapGrid={mapGrid}
        playerStats={playerStats}
        threatLevel={threatLevel}
        onInteractEntity={handleInteractEntity}
        onToggleSound={handleToggleSound}
        soundEnabled={soundEnabled}
        onSelectSkin={handleSelectSkin}
        onHighFivePeer={handleHighFivePeer}
      />

      <footer className="z-10 flex shrink-0 items-center justify-center gap-2 border-t border-white/10 bg-slate-950/90 px-3 py-2 text-center text-xs text-slate-300">
        <span className="hidden sm:inline">Move: WASD or arrow keys</span>
        <span className="hidden sm:inline text-slate-600">·</span>
        <span>Click a challenge to play</span>
        <span className="hidden sm:inline text-slate-600">·</span>
        <span className="hidden sm:inline">Walk close and press E to interact</span>
      </footer>

      {/* Mini-Game 1: Phishing Terminal */}
      {currentScreen === 'PHISHING_TERMINAL' && (
        <PhishingTerminal
          emails={activeEmails}
          matrixScore={matrixScore}
          hasDomainInspector={playerStats.unlockedSkills.includes('skill_domain_inspector')}
          hasHeaderCrypto={playerStats.unlockedSkills.includes('skill_header_forensics')}
          hasSandbox={playerStats.unlockedSkills.includes('skill_heuristic_sandbox')}
          hasUrgencyClassifier={playerStats.unlockedSkills.includes('skill_urgency_classifier')}
          hasRapidTriage={playerStats.unlockedSkills.includes('skill_rapid_triage')}
          hasThreatIntelFeed={playerStats.unlockedSkills.includes('skill_threat_intel_feed')}
          onDecision={handlePhishingDecision}
          onExit={() => setCurrentScreen('HUB')}
        />
      )}

      {/* Mini-Game 2: Phone Call / Social Engineering Vishing */}
      {currentScreen === 'PHONE_CALL' && (
        <PhoneCallMiniGame
          scenario={activePhoneScenario}
          hasCallerLookupSkill={playerStats.unlockedSkills.includes('skill_caller_verifier')}
          hasSocialRadar={playerStats.unlockedSkills.includes('skill_social_radar')}
          hasDeescalation={playerStats.unlockedSkills.includes('skill_deescalation')}
          hasExecutiveVerification={playerStats.unlockedSkills.includes('skill_executive_verification')}
          hasSecOpsPushback={playerStats.unlockedSkills.includes('skill_secops_pushback')}
          onComplete={handlePhoneComplete}
          onExit={() => setCurrentScreen('HUB')}
        />
      )}

      {/* Mini-Game 3: USB Sandbox Mini-Game */}
      {currentScreen === 'USB_SANDBOX' && (
        <UsbSandboxMiniGame
          scenario={activeUsbScenario}
          hasSandboxSkill={playerStats.unlockedSkills.includes('skill_heuristic_sandbox')}
          onComplete={handleUsbComplete}
          onExit={() => setCurrentScreen('HUB')}
        />
      )}

      {/* Mini-Game 4: Clean Desk Mini-Game */}
      {currentScreen === 'CLEAN_DESK' && (
        <CleanDeskMiniGame
          scenario={activeCleanDeskScenario}
          onComplete={handleCleanDeskComplete}
          onExit={() => setCurrentScreen('HUB')}
        />
      )}

      {/* NPC Dialogue Modal */}
      {currentScreen === 'NPC_DIALOGUE' && activeNpc && (
        <NPCDialogueModal
          npc={activeNpc}
          threatLevel={threatLevel}
          unlockedSkills={playerStats.unlockedSkills}
          activeObjectives={playerStats.activeObjectives}
          completedObjectives={playerStats.completedObjectives}
          onAcceptObjective={handleAcceptObjective}
          onClose={() => setCurrentScreen('HUB')}
        />
      )}

      {/* Skill Tree Modal */}
      {currentScreen === 'SKILL_TREE' && (
        <SkillTreeModal
          skills={SKILL_TREE_DATA}
          playerStats={playerStats}
          onUnlockSkill={handleUnlockSkill}
          onClose={() => setCurrentScreen('HUB')}
        />
      )}

      {/* Badges & Lanyard Modal */}
      {currentScreen === 'BADGES' && (
        <BadgeLanyard
          badges={INITIAL_BADGES}
          playerStats={playerStats}
          onClose={() => setCurrentScreen('HUB')}
        />
      )}

      {/* Incident War Room Corkboard */}
      {currentScreen === 'INCIDENTS' && (
        <IncidentCorkboard
          incidents={incidents}
          threatLevel={threatLevel}
          onClose={() => setCurrentScreen('HUB')}
        />
      )}

      {/* Run Summary / Floor Completion */}
      {currentScreen === 'RUN_SUMMARY' && (
        <RunSummaryModal
          playerStats={playerStats}
          matrixScore={matrixScore}
          threatLevel={threatLevel}
          onNextFloor={handleNextFloor}
          onRestartGame={handleRestartGame}
        />
      )}

      {/* Operative Roster Selection Modal */}
      {showRosterModal && (
        <OperativeSelectModal
          currentSkin={playerStats.characterSkin || 'player_alex'}
          onSelectSkin={handleSelectSkin}
          onClose={() => setShowRosterModal(false)}
        />
      )}

      {/* Daily Missions Modal (24h Refresh System) */}
      {showDailyModal && (
        <DailyMissionsModal
          progress={dailyProgress}
          onClose={() => setShowDailyModal(false)}
          onClaimMission={handleClaimDailyMission}
          onClaimAllBonus={handleClaimAllDailyBonus}
        />
      )}

      {/* Multi-User Leaderboard & Activity Feed Modal */}
      {showLeaderboardModal && (
        <LeaderboardModal
          entries={leaderboardEntries}
          activityFeed={activityFeed}
          currentScore={2800 + playerStats.credits + (matrixScore.totalScore * 10)}
          onClose={() => setShowLeaderboardModal(false)}
        />
      )}

      {/* Collectible discovery modal */}
      {activeCollectible && (
        <OfficeCollectibleModal
          collectible={activeCollectible}
          onClaim={handleClaimCollectible}
          onClose={() => {
            setActiveCollectible(null);
            setActiveCollectibleEntityId(null);
          }}
        />
      )}

      {/* Awards and collectibles */}
      {showTrophyRoomModal && (
        <TrophyRoomModal
          playerStats={playerStats}
          onClose={() => setShowTrophyRoomModal(false)}
        />
      )}
    </div>
  );
}
