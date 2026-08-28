export interface UsbScenario {
  id: string;
  label: string;
  location: string;
  fileList: string[];
  isMalicious: boolean;
  explanation: string;
  redFlags: string[];
  cleanSignals: string[];
}

export const USB_SCENARIOS: UsbScenario[] = [
  {
    id: 'usb_001',
    label: 'Metallic USB Drive (Handwritten label: "HNB_Commercial_Lending_Q4_Audit_Unredacted")',
    location: 'Found on the breakroom floor near the espresso machine',
    fileList: ['Commercial_Loans_Q4_2026.xlsx.vbs', 'autorun.inf', 'HNB_Audit_Notes.txt'],
    isMalicious: true,
    explanation: 'Classic "Baiting" cyber attack targeting bank personnel. Attackers drop branded USB drives in high-traffic employee areas with enticing titles. The file has a disguised double extension (.xlsx.vbs) designed to execute banking trojan payloads upon opening.',
    redFlags: [
      'Dropped in public common breakroom with confidential banking title ("Commercial Lending Audit")',
      'Contains hidden VBScript executable payload pretending to be an Excel spreadsheet (.xlsx.vbs)',
      'Contains autorun.inf designed to trigger malicious script execution upon insertion'
    ],
    cleanSignals: []
  },
  {
    id: 'usb_002',
    label: 'Huntington Encrypted Hardware Token (Asset Tag #HNB-IT-8841-ENC)',
    location: 'Left on the Bank IT technician diagnostics workbench',
    fileList: ['BitLocker_Key_Recovery_Guide.pdf', 'Hogan_Core_Firmware_Patch_v4.2.bin'],
    isMalicious: false,
    explanation: 'Legitimate hardware token from Huntington Bank IT infrastructure. However, bank zero-trust policy dictates that all discovered USB media must still be surrendered to the Cyber Defense Center for air-gapped sandbox verification rather than inserted into live banking terminals.',
    redFlags: [],
    cleanSignals: [
      'Official Huntington National Bank asset inventory sticker (#HNB-IT-8841-ENC)',
      'Hardware-encrypted BitLocker drive',
      'Found in secure Bank IT engineering zone'
    ]
  }
];

export interface CleanDeskScenario {
  id: string;
  title: string;
  description: string;
  hasViolation: boolean;
  violationDetail?: string;
  remediationAction: string;
  points: number;
}

export const CLEAN_DESK_SCENARIOS: CleanDeskScenario[] = [
  {
    id: 'desk_001',
    title: 'Commercial Lending Workstation (Cubicle 4B)',
    description: 'The loan officer stepped away for lunch. The monitor is awake displaying active Hogan Core records with unmasked customer SSNs and commercial checking account numbers. A bright yellow sticky note labeled "CorePass: Buckeye2026!" is affixed to the monitor bezel.',
    hasViolation: true,
    violationDetail: 'Unlocked bank workstation in plain view with customer PII + Core banking password exposed on physical sticky note (GLBA violation).',
    remediationAction: 'Lock Workstation (Win+L) & Confiscate Password Sticky Note for Security Training',
    points: 15
  },
  {
    id: 'desk_002',
    title: 'Retail Branch Operations Desk (Cubicle 2A)',
    description: 'Teller supervisor stepped away for a scheduled compliance review. Workstation is locked (Huntington SSO smartcard prompt active), desktop is clear of physical documents, and customer records are locked in the fireproof file cabinet.',
    hasViolation: false,
    remediationAction: 'Leave "GLBA Compliance Gold Star" Commendation Note',
    points: 10
  },
  {
    id: 'desk_003',
    title: 'Shared Commercial Floor High-Speed Printer Tray',
    description: 'A 50-page printout labeled "Huntington National Bank Commercial Escrow & Wire Routing Dossier - Strictly Confidential" has been sitting unattended in the open output tray for over 2 hours.',
    hasViolation: true,
    violationDetail: 'Unattended high-value customer escrow and wire routing records left in open printer tray violating GLBA, OCC, and PCI-DSS compliance.',
    remediationAction: 'Place in Locked Cross-Cut Shredder Bin & Log Compliance Incident Note',
    points: 20
  }
];
