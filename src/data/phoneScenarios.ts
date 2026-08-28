import { PhoneScenario } from '../types';

export const PHONE_SCENARIOS: PhoneScenario[] = [
  {
    id: 'phone_001',
    title: 'The "Urgent Core Banking Patch" Technician',
    callerName: 'Kevin from Huntington Easton IT Tier 2',
    callerNumber: 'Ext. 4091 (Spoofed Internal Extension)',
    departmentClaimed: 'Huntington Enterprise Infrastructure & Core Support',
    isSocialEngineering: true,
    difficulty: 1,
    tacticUsed: 'HELPDESK_IMPERSONATION',
    overallExplanation: 'The caller used Bank IT Helpdesk Impersonation and Urgency to rush you into granting remote workstation access and sharing MFA codes without an official ServiceNow ITSM change ticket.',
    initialNodeId: 'node_1',
    nodes: {
      'node_1': {
        id: 'node_1',
        speaker: 'Kevin (Caller)',
        dialogue: "Hey! This is Kevin from Huntington Core IT Support at the Easton Operations Center. We're getting critical telemetry alarms from your branch subnet right now. A credential brute-forcer is pinging the Hogan Core banking terminal. I need you to read me the 6-digit QuickAssist remote session code on your screen so I can isolate the socket immediately!",
        choices: [
          {
            text: "Oh no! Here is the remote session code: 849-210. Please fix the terminal fast!",
            response: "Awesome, establishing remote takeover session now...",
            nextNodeId: 'node_fail_remote',
            suspicionChange: -10,
            trustChange: 30,
            isCorrectCall: false
          },
          {
            text: "Hold on Kevin. What is our internal Huntington ServiceNow change ticket number (HNB-RFC) for this emergency maintenance?",
            response: "Look, this is an active zero-day exploit pinging customer deposit records, we don't have time to file tickets through ServiceNow while your machine is leaking packets!",
            nextNodeId: 'node_pushback_1',
            suspicionChange: 20,
            trustChange: -10,
            isCorrectCall: true
          },
          {
            text: "I cannot provide remote assistance codes over an inbound phone call. I will terminate this call and ring the verified Huntington IT Helpdesk directory line (x4444).",
            response: "Wait, don't hang up, your branch terminal will get quarantined from the entire Huntington Core domain!",
            nextNodeId: 'node_win_callback',
            suspicionChange: 30,
            trustChange: -20,
            isCorrectCall: true
          }
        ]
      },
      'node_pushback_1': {
        id: 'node_pushback_1',
        speaker: 'Kevin (Caller)',
        dialogue: "I'm telling you, the Director of Huntington Cyber Defense is standing right behind my desk watching this console. If you don't give me the remote session code in 30 seconds, your workstation will be locked down for the entire week!",
        choices: [
          {
            text: "Okay okay, don't lock me out of the bank! The code is 849-210.",
            response: "Got it. Taking full remote session control now...",
            nextNodeId: 'node_fail_remote',
            suspicionChange: -20,
            trustChange: 40,
            isCorrectCall: false
          },
          {
            text: "Huntington National Bank security policy strictly mandates all remote sessions require an active ServiceNow ticket or verified callback. I am terminating this call and reporting this to cyberdefense@huntington.com.",
            response: "Click... *The line goes dead*",
            nextNodeId: 'node_win_standfirm',
            suspicionChange: 35,
            trustChange: -30,
            isCorrectCall: true
          }
        ]
      },
      'node_fail_remote': {
        id: 'node_fail_remote',
        speaker: 'Huntington SecOps Incident Response',
        dialogue: "You gave the caller remote control access to your workstation. The attacker installed a banking remote access trojan (RAT) and dumped your cached Active Directory credentials and Fedwire settlement session keys!",
        isEndNode: true,
        outcome: 'FELL_FOR_PRETEXT',
        choices: [],
        redFlags: [
          'Unsolicited inbound call requesting remote desktop control',
          'Manufactured crisis / high-pressure countdown ("30 seconds")',
          'Refusal to provide official Huntington ServiceNow ticket or accept verified callback'
        ],
        cleanSignals: [],
        debrief: "Vishing attackers frequently pose as bank IT technicians because staff associate IT with technical authority. Never grant remote control or read MFA/QuickAssist codes over unsolicited incoming calls."
      },
      'node_win_callback': {
        id: 'node_win_callback',
        speaker: 'Huntington SecOps Debrief',
        dialogue: "You followed proper banking verification procedure! You hung up and called the official Huntington Helpdesk directory (x4444). IT confirmed no technician named Kevin was assigned to your workstation.",
        isEndNode: true,
        outcome: 'CAUGHT_ATTACKER',
        choices: [],
        redFlags: [
          'Caller panicked when you mentioned internal callback verification',
          'Threatened punitive consequences (quarantining PC) to force compliance'
        ],
        cleanSignals: [
          'You executed the "Hang Up and Call Back via Known Directory Extension" golden rule'
        ],
        debrief: "Outstanding defense! Out-of-band verification (hanging up and calling the published number in the company directory) completely neutralizes spoofed caller ID attacks."
      },
      'node_win_standfirm': {
        id: 'node_win_standfirm',
        speaker: 'Huntington SecOps Debrief',
        dialogue: "You held bank security policy under intense psychological pressure! The attacker realized you were impervious to intimidation tactics and hung up.",
        isEndNode: true,
        outcome: 'CAUGHT_ATTACKER',
        choices: [],
        redFlags: [
          'Name-dropping senior leadership ("Director of Cyber Defense is over my shoulder") to intimidate you',
          'Extreme urgency demanding bypass of standard change controls'
        ],
        cleanSignals: [],
        debrief: "Standing firm on standard security policy even when callers invoke executive authority is the gold standard of bank cyber defense."
      }
    }
  },
  {
    id: 'phone_002',
    title: 'The "Federal Reserve Wire Desk" Impersonator',
    callerName: 'Specialist Miller (Federal Reserve Wire Desk)',
    callerNumber: '+1 (216) 579-2000 (FRB Cleveland Spoof)',
    departmentClaimed: 'Federal Reserve Bank Financial Services / FedLine Gateway',
    isSocialEngineering: true,
    difficulty: 2,
    tacticUsed: 'AUTHORITY',
    overallExplanation: 'The caller utilized Federal Regulatory Authority, Scarcity, and High-Value Wire Liquidity Pressure to manipulate you into bypassing dual-control wire verification.',
    initialNodeId: 'node_1',
    nodes: {
      'node_1': {
        id: 'node_1',
        speaker: 'Specialist Miller (Caller)',
        dialogue: "Good afternoon. This is Specialist Miller from the Federal Reserve Bank of Cleveland clearing gateway. We have a high-value commercial wire of $3,450,000.00 from Huntington National Bank flagged in our queue due to an ISO 20022 message hash mismatch. To prevent the wire from failing and incurring overnight liquidity penalty fines, I need you to read me the 8-digit supervisor release token from your Hogan terminal right now.",
        choices: [
          {
            text: "Oh no, we cannot afford liquidity fines! The supervisor token is: 9942-8810.",
            response: "Token verified, releasing funds from Huntington reserves now...",
            nextNodeId: 'node_fail_wire',
            suspicionChange: -20,
            trustChange: 30,
            isCorrectCall: false
          },
          {
            text: "Federal Reserve wire exceptions are handled exclusively through secure FedLine Advantage private hardware channels, not telephone token reads. What is your FedLine reference ticket?",
            response: "Are you questioning the Federal Reserve? We are 5 minutes from the 5:30 PM Fedwire market cutoff! If this wire drops, Huntington will face regulatory sanctions!",
            nextNodeId: 'node_pressure_fed',
            suspicionChange: 25,
            trustChange: -15,
            isCorrectCall: true
          },
          {
            text: "I cannot release wire tokens over an inbound call. I will hang up and route this through the Huntington Commercial Treasury Wire Desk on our dedicated FedLine line.",
            response: "Fine, expect a formal regulatory inquiry! *Hangs up abruptly*",
            nextNodeId: 'node_win_fed',
            suspicionChange: 30,
            trustChange: -20,
            isCorrectCall: true
          }
        ]
      },
      'node_pressure_fed': {
        id: 'node_pressure_fed',
        speaker: 'Specialist Miller (Caller)',
        dialogue: "Listen to me very carefully. I am logging this call for the Federal Reserve Board of Governors. Give me the supervisor token right now or I will personally file an operational non-compliance report against your branch!",
        choices: [
          {
            text: "Please don't report us! Here is the supervisor release token: 9942-8810.",
            response: "Releasing funds to offshore beneficiary account now...",
            nextNodeId: 'node_fail_wire',
            suspicionChange: -30,
            trustChange: 40,
            isCorrectCall: false
          },
          {
            text: "Huntington National Bank dual-control wire policies strictly forbid phone disclosure of tokens. I am terminating this call and filing an immediate SAR / wire fraud alert with our Treasury Operations.",
            response: "*Aggressive click followed by dial tone*",
            nextNodeId: 'node_win_fed',
            suspicionChange: 35,
            trustChange: -30,
            isCorrectCall: true
          }
        ]
      },
      'node_fail_wire': {
        id: 'node_fail_wire',
        speaker: 'Huntington Treasury Fraud Log',
        dialogue: "You disclosed the supervisor wire release token over the phone. The attacker authorized a fraudulent $3.45M wire transfer to an offshore cryptocurrency laundering gateway!",
        isEndNode: true,
        outcome: 'FELL_FOR_PRETEXT',
        choices: [],
        redFlags: [
          'Caller demanded high-value wire release tokens over the telephone',
          'Urgency combined with threats of Federal Reserve fines and regulatory penalties',
          'Bypassing established FedLine secure terminal interfaces'
        ],
        cleanSignals: [],
        debrief: "Federal Reserve Wire operations are strictly conducted through dedicated, private cryptographic terminals (FedLine). The Federal Reserve will never call a bank operator demanding wire tokens or passwords."
      },
      'node_win_fed': {
        id: 'node_win_fed',
        speaker: 'Huntington Cyber Defense Recognition',
        dialogue: "You successfully blocked a massive $3.45M Wire Social Engineering attempt! Commercial Treasury confirmed the call originated from a spoofed VOIP provider in Eastern Europe.",
        isEndNode: true,
        outcome: 'CAUGHT_ATTACKER',
        choices: [],
        redFlags: [
          'Federal Reserve impersonation demanding token passwords',
          'Intimidation and threat of regulatory reporting to force non-compliance with bank controls'
        ],
        cleanSignals: [
          'Enforced strict dual-control banking wire authorization protocols'
        ],
        debrief: "Masterful composure. Wire fraud attackers rely on immense regulatory panic to make bank employees violate dual-control rules. Standing firm saved Huntington millions."
      }
    }
  },
  {
    id: 'phone_003',
    title: 'The Legitimate Huntington GLBA & Compliance Auditor',
    callerName: 'Aisha Chen (Internal Audit & Risk)',
    callerNumber: 'Ext. 1024 (Verified Easton Internal Line)',
    departmentClaimed: 'Huntington Governance, Risk & Compliance (GRC)',
    isSocialEngineering: false,
    difficulty: 3,
    tacticUsed: 'LEGITIMATE_AUDIT',
    overallExplanation: 'This was an authentic quarterly compliance review from Huntington GRC. They followed all standard bank protocols, provided a verified ticket, and did NOT ask for passwords or tokens.',
    initialNodeId: 'node_1',
    nodes: {
      'node_1': {
        id: 'node_1',
        speaker: 'Aisha Chen (GRC Auditor)',
        dialogue: "Hello! This is Aisha Chen from Huntington Internal Audit & Risk. We are conducting our quarterly GLBA customer PII access verification ahead of the upcoming OCC examination. I am confirming whether your workstation still requires read access to the 'Commercial Loan Escrow' repository. I do NOT need any passwords, tokens, or PINs — just confirming that Robert Martinez is still your department supervisor?",
        choices: [
          {
            text: "YOU'RE A PHISHER! STOP TRYING TO HACK HUNTINGTON! *Slam phone down*",
            response: "Wait what? I just need a simple yes or no for the OCC compliance audit...",
            nextNodeId: 'node_false_alarm',
            suspicionChange: 30,
            trustChange: -30,
            isCorrectCall: false
          },
          {
            text: "Hi Aisha. Yes, Robert Martinez is still my supervisor, and our team uses that escrow repository for commercial closing audits.",
            response: "Thank you for confirming! I will mark this role verified in our GRC audit portal. Have a great day at Huntington!",
            nextNodeId: 'node_win_legit',
            suspicionChange: -10,
            trustChange: 20,
            isCorrectCall: true
          },
          {
            text: "Can you confirm the GRC audit tracking ticket number so I can cross-reference our department compliance logs?",
            response: "Certainly! The audit tracking ID is #HNB-GRC-2026-904. You can cross-reference it on our internal SharePoint compliance ledger.",
            nextNodeId: 'node_ask_ticket',
            suspicionChange: -15,
            trustChange: 25,
            isCorrectCall: true
          }
        ]
      },
      'node_ask_ticket': {
        id: 'node_ask_ticket',
        speaker: 'Aisha Chen (GRC Auditor)',
        dialogue: "Everything is logged under #HNB-GRC-2026-904. Can you confirm if Robert Martinez is still your department supervisor?",
        choices: [
          {
            text: "Verified! Robert Martinez is indeed our supervisor, and the repository access is active.",
            response: "Awesome. Thank you for following proper compliance verification procedures. Have a productive day!",
            nextNodeId: 'node_win_legit',
            suspicionChange: -10,
            trustChange: 20,
            isCorrectCall: true
          }
        ]
      },
      'node_false_alarm': {
        id: 'node_false_alarm',
        speaker: 'Audit Review',
        dialogue: "You panicked and hung up on an authentic Huntington internal risk auditor who was conducting a standard OCC compliance check without asking for sensitive credentials.",
        isEndNode: true,
        outcome: 'POLITE_REFUSAL',
        choices: [],
        redFlags: [],
        cleanSignals: [
          'Caller asked only for public organizational verification (manager name)',
          'Caller explicitly stated they did NOT need passwords or MFA tokens',
          'Caller provided a verifiable internal audit ticket reference'
        ],
        debrief: "Calibration is key to effective bank security. Recognizing safe, legitimate operational inquiries is just as vital as stopping malicious attacks."
      },
      'node_win_legit': {
        id: 'node_win_legit',
        speaker: 'Huntington Compliance Commendation',
        dialogue: "You correctly handled a legitimate internal compliance inquiry! You verified the auditor's scope, confirmed organizational facts without disclosing secret credentials, and kept audit logs clean.",
        isEndNode: true,
        outcome: 'VERIFIED_LEGITIMATE',
        choices: [],
        redFlags: [],
        cleanSignals: [
          'No request for secrets, passwords, or tokens',
          'Verifiable internal business purpose (OCC/GLBA access review)'
        ],
        debrief: "Perfect calibration! A true security champion knows how to distinguish legitimate bank governance workflows from malicious social engineering."
      }
    }
  }
];
