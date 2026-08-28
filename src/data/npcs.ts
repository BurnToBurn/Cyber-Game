import { OfficeNPC } from '../types';

export const OFFICE_NPCS: OfficeNPC[] = [
  // 1. Bob Miller - Stressed Commercial Wire & Treasury Officer
  {
    id: 'npc_bob',
    name: 'Bob Miller',
    role: 'Commercial Wire & Treasury Officer',
    department: 'Commercial Treasury Operations',
    avatar: '💼',
    location: 'Cubicle 4B (Near Terminal #4A)',
    personality: 'Stressed, coffee-dependent, terrified of fraudulent $2.8M Fedwire reroutes and Business Email Compromise (BEC).',
    initialDialogueId: 'bob_intro',
    dialogueTree: {
      bob_intro: {
        id: 'bob_intro',
        text: "Thank goodness you're here! End-of-day Fedwire and NACHA batch settlement is chaotic. I just received an urgent email claiming to be from our CFO demanding an expedited $2.84M wire reroute for 'Project Buckeye'. My hands were literally trembling over the release button on the Hogan Core terminal!",
        speakerMood: 'SUSPICIOUS',
        threatSpecificDialogue: {
          highThreat: "We are getting flooded with spoofed SWIFT & Fedwire change requests! If any unauthorized wire slips past dual-control, the OCC and FinCEN will be all over us by morning!",
          criticalThreat: "CRITICAL BANK BREACH ALARM IS SOUNDING! I froze the Commercial Treasury clearing gateway! Don't let anyone touch the wire authorization consoles!",
          perfectStreak: "I heard you've been intercepting fraudulent wire phishing lures with zero false alarms. You're saving Huntington millions!"
        },
        options: [
          {
            text: "What made that CFO wire email look suspicious to you?",
            response: "The sender claimed to be our CFO Zachary Palmer, but the domain was 'huntington-bancshares-corp.com' instead of authentic 'huntington.com'! Plus, the message explicitly instructed me to 'bypass secondary phone callback verification' because he was 'in a confidential board meeting'.",
            nextNodeId: 'bob_lore',
            triggerHint: "Watch for Business Email Compromise (BEC) and requests to bypass mandatory dual-control phone callbacks."
          },
          {
            text: "Need me to audit the pending emails on your workstation terminal?",
            response: "Yes, please! I left the suspicious Fedwire notification loaded on Terminal #4A. If you can triage it without blacklisting legitimate Federal Reserve settlement reports, that would give our treasury team immense peace of mind.",
            nextNodeId: 'bob_quest',
            grantObjective: {
              id: 'obj_bob_terminal',
              title: "Audit Bob's Suspicious Wire Email",
              description: "Review and accurately triage the pending banking email on Terminal #4A.",
              rewardXp: 35
            }
          },
          {
            text: "Hang in there, Bob. I'm actively patrolling the banking floor.",
            response: "Thanks! I'm grabbing another cold brew from the breakroom. Watch out for strange vishing calls asking for customer routing numbers or wire override codes!",
            nextNodeId: 'bob_farewell'
          }
        ]
      },
      bob_lore: {
        id: 'bob_lore',
        text: "Attackers know commercial wire desks operate under strict Federal Reserve cutoffs (like 5:30 PM EST). They weaponize urgency like 'WIRE NOW OR DEAL FAILS' so operators skip secondary verification. At Huntington, dual-control callback is non-negotiable!",
        speakerMood: 'CALM',
        options: [
          {
            text: "I'll keep a sharp eye on all banking terminals.",
            response: "Much appreciated! Remember: verify cryptographic SPF/DKIM headers and never release high-value wires without out-of-band callback!",
            nextNodeId: 'bob_farewell'
          }
        ]
      },
      bob_quest: {
        id: 'bob_quest',
        text: "Terminal #4A is right by the cubicle divider. If you find spoofed wire instructions or malicious macro payloads, report them to the Huntington Cyber Defense filter immediately!",
        speakerMood: 'GRATEFUL',
        options: [
          {
            text: "On it right now, Bob.",
            response: "You're the guardian angel of Floor 1!",
            nextNodeId: 'bob_farewell'
          }
        ]
      },
      bob_farewell: {
        id: 'bob_farewell',
        text: "Let me know if you need any Fedwire transaction logs or NACHA exception summaries.",
        speakerMood: 'CALM',
        options: [
          {
            text: "Will do. Back to patrol.",
            response: "Keep the bank secure!"
          }
        ]
      }
    }
  },

  // 2. Linda Chen - VP of Regulatory Compliance & GLBA
  {
    id: 'npc_linda',
    name: 'Linda Chen',
    role: 'VP of Regulatory Compliance & GLBA',
    department: 'Risk & Bank Regulatory Governance',
    avatar: '📋',
    location: 'Central Corridor (Near Breakroom)',
    personality: 'Strict on banking compliance, protective of customer PII and GLBA data privacy, passionate about clean desk hygiene.',
    initialDialogueId: 'linda_intro',
    dialogueTree: {
      linda_intro: {
        id: 'linda_intro',
        text: "Welcome to the Huntington Cyber Operations floor. As VP of Regulatory Compliance, I audit our physical and digital security hygiene against OCC, FDIC, and GLBA standards. Someone in commercial lending left their workstation unlocked with unmasked customer Social Security and account numbers displayed in plain view!",
        speakerMood: 'SUSPICIOUS',
        threatSpecificDialogue: {
          highThreat: "The OCC Bank IT Examination committee is arriving for our annual audit! If they spot unencrypted customer SSNs or unlocked teller screens, we could face severe regulatory enforcement actions!",
          criticalThreat: "CRITICAL GLBA COMPLIANCE BREACH! Lock every terminal and shred every unredacted mortgage document on the floor immediately!",
          perfectStreak: "Your zero-trust hygiene scores are impeccable. The audit committee will be thoroughly impressed."
        },
        options: [
          {
            text: "Why is the Clean Desk Policy so critical in banking?",
            response: "Under the Gramm-Leach-Bliley Act (GLBA) and Bank Secrecy Act (BSA), customer financial privacy is federally mandated. If an unauthorized visitor or cleaner spots loan applications or teller passwords on sticky notes, it constitutes an immediate reportable data breach.",
            nextNodeId: 'linda_lore',
            triggerHint: "Always lock workstations (Win+L) when stepping away and shred customer financial records."
          },
          {
            text: "Where is the unlocked commercial workstation located?",
            response: "Over at Cubicle 5C. The monitor is awake with confidential customer credit reports and a password note stuck to the bezel. Please execute immediate remediation and secure the desk!",
            nextNodeId: 'linda_quest',
            grantObjective: {
              id: 'obj_linda_cleandesk',
              title: "Secure Unlocked Lending Workstation",
              description: "Navigate to Cubicle 5C, lock the screen, and secure confidential customer records.",
              rewardXp: 30
            }
          },
          {
            text: "Understood, Linda. Continuing compliance inspection.",
            response: "Thank you. Remember: zero-trust begins with physical workspace hygiene!",
            nextNodeId: 'linda_farewell'
          }
        ]
      },
      linda_lore: {
        id: 'linda_lore',
        text: "Clean desk violations account for nearly 30% of insider and visitor security incidents in regional banking. A single discarded printout in a public printer tray containing customer routing numbers can fuel check-kiting and synthetic identity fraud.",
        speakerMood: 'CALM',
        options: [
          {
            text: "I'll ensure strict adherence across all desks.",
            response: "Excellent. Keep Huntington's customer trust sacred!",
            nextNodeId: 'linda_farewell'
          }
        ]
      },
      linda_quest: {
        id: 'linda_quest',
        text: "Lock the terminal, remove any exposed credentials, and make sure confidential customer dossiers are placed in the locked cross-cut shredder bin.",
        speakerMood: 'GRATEFUL',
        options: [
          {
            text: "Handling it immediately.",
            response: "Protecting customer privacy is our highest duty.",
            nextNodeId: 'linda_farewell'
          }
        ]
      },
      linda_farewell: {
        id: 'linda_farewell',
        text: "Check in with me if you need updated FFIEC IT examination guidelines or customer PII handling protocols.",
        speakerMood: 'CALM',
        options: [
          {
            text: "Understood. Resuming sweep.",
            response: "Stay vigilant for compliance!"
          }
        ]
      }
    }
  },

  // 3. Dave 'Root' Kowalski - Core Mainframe & ATM Switch SysAdmin
  {
    id: 'npc_dave',
    name: "Dave 'Root' Kowalski",
    role: 'Lead Core Banking & ATM Infrastructure Engineer',
    department: 'Bank Systems & Core Infrastructure',
    avatar: '💻',
    location: 'Core Server Vault (North-East Room)',
    personality: 'Cynical infrastructure veteran, protective of the Hogan mainframe, hardware security modules (HSM), and Diebold ATM switch network.',
    initialDialogueId: 'dave_intro',
    dialogueTree: {
      dave_intro: {
        id: 'dave_intro',
        text: "Listen up. The Core Banking Mainframe and ATM switch processors on this floor process over 40,000 transactions a second. I just discovered a suspicious metallic USB drive dropped right outside the server vestibule labeled 'HNB_ATM_CashDispenser_Firmware_v4.bin'. Someone is attempting physical baiting on our infrastructure!",
        speakerMood: 'CYNICAL',
        threatSpecificDialogue: {
          highThreat: "I'm detecting anomalous CAN-bus polling across our regional branch ATM network. If an attacker connects a malicious USB to our ATM maintenance ports, they can execute a jackpotting attack!",
          criticalThreat: "MAINFRAME ISOLATION ACTIVATED! Hardware security modules (HSM) are in lockdown! Isolate rogue endpoints immediately!",
          perfectStreak: "I checked the firewall packet capture. You haven't let a single malicious payload touch the core bank subnet. Solid work, kid."
        },
        options: [
          {
            text: "Why would someone drop a USB drive near the server room?",
            response: "It's classic 'Baiting'. Attackers load weaponized scripts or BadUSB HID keystroke injects onto cheap thumb drives with alluring titles like 'Executive_Salaries' or 'ATM_Patches'. When curious techs plug it in to check the owner, the payload dumps memory keys and bypasses our network perimeter.",
            nextNodeId: 'dave_lore',
            triggerHint: "Never plug unknown USB drives into banking workstations. Use air-gapped sandboxes for hardware analysis."
          },
          {
            text: "Where is the dropped drive? I can isolate and sandbox it.",
            response: "It's on the rug near the breakroom espresso machine. Pick it up, take it to the hardware quarantine sandbox, and analyze the payload without executing the autorun binary.",
            nextNodeId: 'dave_quest',
            grantObjective: {
              id: 'obj_dave_usb',
              title: "Quarantine Baiting USB Drive",
              description: "Recover the dropped flash drive from the breakroom and safely analyze it in the air-gapped sandbox.",
              rewardXp: 40
            }
          },
          {
            text: "I'll keep the core server enclaves secure, Dave.",
            response: "Good. Keep your fingers off untrusted ports and maintain the air-gap!",
            nextNodeId: 'dave_farewell'
          }
        ]
      },
      dave_lore: {
        id: 'dave_lore',
        text: "Hardware-level security is the bedrock of banking. Our Hardware Security Modules (HSMs) manage PIN encryption and EMV chip authorization. If someone plants a physical keystroke logger or rogue drop, software firewalls can't save you.",
        speakerMood: 'CALM',
        options: [
          {
            text: "Understood. Zero-trust on all physical ports.",
            response: "Exactly what I like to hear. Now get out there and keep the core clean.",
            nextNodeId: 'dave_farewell'
          }
        ]
      },
      dave_quest: {
        id: 'dave_quest',
        text: "The USB analysis sandbox is primed. Check the file extensions—look out for hidden .vbs or .exe payloads disguised as PDF or Excel files.",
        speakerMood: 'GRATEFUL',
        options: [
          {
            text: "Heading to the sandbox now.",
            response: "Show those script-kiddies how Huntington defends its core.",
            nextNodeId: 'dave_farewell'
          }
        ]
      },
      dave_farewell: {
        id: 'dave_farewell',
        text: "Mainframe telemetry is streaming. Let me know if you spot any anomalous port scans on the 3270 terminal gateways.",
        speakerMood: 'CALM',
        options: [
          {
            text: "Copy that, Dave. Back to work.",
            response: "Keep the packets clean."
          }
        ]
      }
    }
  },

  // 4. Marcus Vance - Cyber Defense Center Incident Commander
  {
    id: 'npc_marcus',
    name: 'Marcus Vance',
    role: 'Cyber Defense Incident Commander',
    department: 'Huntington Enterprise SOC / SecOps',
    avatar: '🛡️',
    location: 'SecOps Command Station (Reception Area)',
    personality: 'Tactical security leader, tracks the DEFCON bank threat level, specializes in thwarting social engineering and Helpdesk vishing attacks.',
    initialDialogueId: 'marcus_intro',
    dialogueTree: {
      marcus_intro: {
        id: 'marcus_intro',
        text: "Operative! We're monitoring a coordinated social engineering blitz targeting Huntington National Bank branch networks. Threat actors are running targeted vishing calls, spoofing internal IT Helpdesk extensions to trick staff into disclosing MFA push tokens and wire release codes!",
        speakerMood: 'SUSPICIOUS',
        threatSpecificDialogue: {
          highThreat: "DEFCON Threat Level is ELEVATED! The SOC is fielding multiple concurrent pretexting attempts across retail branch phones! Intercept and challenge every suspicious inbound caller!",
          criticalThreat: "DEFCON 1: ACTIVE BANK BREACH IMMINENT! Isolate compromised subnets and terminate all unverified caller sessions!",
          perfectStreak: "Outstanding operational discipline! You've neutralized incoming attack vectors without a single compromise."
        },
        options: [
          {
            text: "How should I handle a caller claiming to be IT Helpdesk?",
            response: "Always demand an official ITSM change ticket number and enforce the 'Out-of-Band Callback Rule'. Hang up and dial the official Huntington Helpdesk directory extension (x4444). Authentic IT will never pressure you to read QuickAssist remote access codes or MFA tokens over an unsolicited call.",
            nextNodeId: 'marcus_lore',
            triggerHint: "Never provide remote screen control codes or MFA passwords over inbound phone calls."
          },
          {
            text: "Is there an active incoming call that needs immediate handling?",
            response: "The red line on Desk Phone Ext. 4091 is blinking right now! The caller is claiming to be an IT specialist handling a 'zero-day exploit'. Pick up the receiver, probe their pretext, and refuse remote screen takeovers!",
            nextNodeId: 'marcus_quest',
            grantObjective: {
              id: 'obj_marcus_vishing',
              title: "Neutralize Helpdesk Vishing Caller",
              description: "Answer the ringing phone on Ext. 4091 and defend against the social engineering pretext.",
              rewardXp: 35
            }
          },
          {
            text: "SecOps perimeter is holding strong, Commander.",
            response: "Stay sharp. When the threat level rises, social engineers get much more aggressive.",
            nextNodeId: 'marcus_farewell'
          }
        ]
      },
      marcus_lore: {
        id: 'marcus_lore',
        text: "Social engineering works by exploiting human empathy, fear of authority, and artificial urgency. By keeping your composure, asking for verifiable ticket IDs, and adhering to strict banking verification procedures, you render their entire attack playbook useless.",
        speakerMood: 'CALM',
        options: [
          {
            text: "I'm ready to defend the floor.",
            response: "That's what makes you an elite Huntington Cyber Operative. Carry on!",
            nextNodeId: 'marcus_farewell'
          }
        ]
      },
      marcus_quest: {
        id: 'marcus_quest',
        text: "Ext. 4091 is right in the center desk row. Interrogate the caller's credentials and use verified callback protocols to shut them down.",
        speakerMood: 'GRATEFUL',
        options: [
          {
            text: "Intercepting the call now.",
            response: "Hold the line, Operative.",
            nextNodeId: 'marcus_farewell'
          }
        ]
      },
      marcus_farewell: {
        id: 'marcus_farewell',
        text: "DEFCON status is monitored in real-time on your HUD. Keep the threat level below 25% for maximum operational rating.",
        speakerMood: 'CALM',
        options: [
          {
            text: "Understood, Commander.",
            response: "SecOps out."
          }
        ]
      }
    }
  },

  // 5. Karen Sterling - Executive Treasury & Board Audit Liaison
  {
    id: 'npc_karen',
    name: 'Karen Sterling',
    role: 'Executive Treasury & Board Audit Liaison',
    department: 'Office of the CEO & Board Risk Committee',
    avatar: '👔',
    location: 'Executive Boardroom Wing (South-East)',
    personality: 'Poised, strategic, manages high-stakes regulatory clearance and executive out-of-band wire authorizations.',
    initialDialogueId: 'karen_intro',
    dialogueTree: {
      karen_intro: {
        id: 'karen_intro',
        text: "Welcome to the Executive Suite wing. As liaison to the Board Risk Committee, I manage the security clearance locks for the executive elevator to higher bank floors. Before I can grant you elevator clearance, you must demonstrate mastery over banking cyber defense across this floor.",
        speakerMood: 'CALM',
        threatSpecificDialogue: {
          highThreat: "The Board Risk Committee is in emergency session reviewing threat telemetry! Clear the active floor incidents before advancing!",
          criticalThreat: "Elevator access is locked under bank emergency protocol! Quell the breach alarms to restore clearance!",
          perfectStreak: "Your cyber defense rating is exemplary. The Executive Committee commendation is well deserved."
        },
        options: [
          {
            text: "What criteria are required to unlock the Floor Elevator?",
            response: "You need to complete key floor objectives: audit suspicious wire emails, neutralize incoming social engineering calls, and maintain a safe DEFCON threat level. Once your clearance criteria are verified, the elevator door will illuminate green.",
            nextNodeId: 'karen_lore',
            triggerHint: "Complete floor tasks and keep threat levels low to gain clearance to the next banking operations level."
          },
          {
            text: "I am ready to verify my clearance for the elevator.",
            response: "Review your active objectives. When you're ready, proceed to the elevator gate at the east corridor to ascend to the next operational floor.",
            nextNodeId: 'karen_quest',
            grantObjective: {
              id: 'obj_karen_elevator',
              title: "Unlock Executive Elevator Clearance",
              description: "Complete floor defense objectives and access the elevator to advance to the next bank floor.",
              rewardXp: 50
            }
          },
          {
            text: "Thank you, Karen. I will continue securing the floor.",
            response: "Huntington National Bank relies on dedicated guardians like you. Best of luck.",
            nextNodeId: 'karen_farewell'
          }
        ]
      },
      karen_lore: {
        id: 'karen_lore',
        text: "Each ascending floor of Huntington represents a deeper layer of bank infrastructure: from Retail Branch Operations to Commercial Treasury, Core Mainframe Vaults, and Executive Risk Governance. The cyber challenges will escalate in sophistication.",
        speakerMood: 'CALM',
        options: [
          {
            text: "I'm prepared for higher clearance levels.",
            response: "Excellent. Keep your cyber skills calibrated.",
            nextNodeId: 'karen_farewell'
          }
        ]
      },
      karen_quest: {
        id: 'karen_quest',
        text: "Complete your floor objectives, keep the threat meter in the green zone, and use the elevator keycard console to advance.",
        speakerMood: 'GRATEFUL',
        options: [
          {
            text: "Heading to the elevator gate.",
            response: "Ascend with confidence, Operative.",
            nextNodeId: 'karen_farewell'
          }
        ]
      },
      karen_farewell: {
        id: 'karen_farewell',
        text: "May your audit logs remain clean and your defense impenetrable.",
        speakerMood: 'CALM',
        options: [
          {
            text: "Thank you, Karen.",
            response: "Protect the bank."
          }
        ]
      }
    }
  }
];
