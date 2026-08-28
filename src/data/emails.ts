import { PhishingEmail } from '../types';

export const INITIAL_EMAILS: PhishingEmail[] = [
  // =========================================================================
  // TIER 1 - FOUNDATIONAL (HNB IT Helpdesk, HR Wellness, Hogan Core Maint)
  // =========================================================================
  {
    id: 'email_001',
    isPhishing: true,
    difficulty: 1,
    sender: {
      displayName: 'Huntington IT Service Desk',
      address: 'servicedesk-support@huntington-bank-verify.net',
      spfDkimStatus: 'FAIL'
    },
    subject: 'URGENT: Mandatory Hogan Core Banking SSO Session Migration (2-Hour Deadline)',
    timestamp: 'Today, 09:14 AM',
    body: `Attention Huntington Colleague,

Our Information Security team is migrating all branch and commercial banking workstations to the new Huntington Zero-Trust Single Sign-On (SSO) gateway for the Hogan Core mainframe.

Failure to re-authenticate your Microsoft Entra & Huntington Active Directory credentials within 2 hours will result in immediate suspension of your core banking terminal access.

Click the link below to verify your domain credentials and prevent branch service disruption:`,
    links: [
      {
        text: 'Authenticate Huntington Core SSO Credentials Now',
        url: 'https://sso.huntington.com/auth/login',
        targetUrl: 'https://login.huntington-bank-verify.net/harvest/login.html'
      }
    ],
    redFlags: [
      'Sender domain is "huntington-bank-verify.net" instead of official "huntington.com"',
      'Aggressive urgency & fear tactic ("2-Hour Deadline", "immediate suspension")',
      'SPF/DKIM cryptographic headers failed validation',
      'Hyperlink text displays "sso.huntington.com" but real target routes to lookalike phishing harvester',
      'Generic greeting ("Attention Huntington Colleague") rather than personalized employee name'
    ],
    cleanSignals: [],
    explanation: 'Credential harvesting phishing lure spoofing Huntington IT Support. The attacker leverages fear of losing access to the Hogan Core banking mainframe to rush the employee into submitting credentials to an external lookalike domain.',
    category: 'IT_SUPPORT'
  },
  {
    id: 'email_002',
    isPhishing: false,
    difficulty: 1,
    sender: {
      displayName: 'Huntington Enterprise Technology Operations',
      address: 'ent-notifications@huntington.com',
      spfDkimStatus: 'PASS'
    },
    subject: 'Operational Notice: Scheduled Hogan Core Batch Processing Window (Sunday 02:00-04:00 AM EST)',
    timestamp: 'Today, 09:40 AM',
    body: `Hello Team,

Please be advised that Enterprise Technology will perform routine database indexing and maintenance on our Hogan Core banking cluster this Sunday between 02:00 AM and 04:00 AM EST.

Impact:
- Online Banking & Huntington Mobile App transfers will queue in batch mode.
- Branch ATM transaction authorizations will route to secondary standby ledger.
- Commercial Fedwire processing will resume normally at Monday 07:00 AM market open.

No employee action or password entry is required. For full release notes, visit the internal Enterprise Wiki:`,
    links: [
      {
        text: 'View Hogan Core Maintenance Schedule on Huntington Intranet',
        url: 'https://intranet.huntington.com/tech-ops/release-notes/2026-03',
        targetUrl: 'https://intranet.huntington.com/tech-ops/release-notes/2026-03'
      }
    ],
    redFlags: [],
    cleanSignals: [
      'Sender address is authentic verified internal domain (@huntington.com)',
      'SPF/DKIM passes cryptographic signing',
      'Informational operational advisory with standard RFC change-management protocol',
      'Hyperlink points strictly to verified internal intranet (intranet.huntington.com)',
      'Zero requests for passwords, credentials, or remote desktop software'
    ],
    explanation: 'Legitimate internal advisory email. Cryptographic signatures match Huntington domain standards, the link routes to the internal employee intranet, and it contains standard operational notice without asking for sensitive data.',
    category: 'VENDOR'
  },
  {
    id: 'email_003',
    isPhishing: true,
    difficulty: 1,
    sender: {
      displayName: 'Huntington HR Benefits & Compensation',
      address: 'payroll-allowance@hnb-rewards-portal.com',
      spfDkimStatus: 'FAIL'
    },
    subject: 'Mandatory: Unclaimed Employee Annual Wellness Allowance ($750.00)',
    timestamp: 'Today, 10:05 AM',
    body: `Hello Colleague,

Our records indicate that you have $750.00 in unallocated annual wellness & transit benefits for the current fiscal quarter. Unclaimed employee balances will be forfeited to state treasury by 5:00 PM today.

To direct-deposit this allowance directly into your personal Huntington Checking Account or external account, confirm your Social Security Number and Routing Number on the claim portal below.

Huntington People Operations & Benefits Team`,
    links: [
      {
        text: 'Claim Your $750.00 Huntington Employee Allowance',
        url: 'https://www.huntington.com/benefits/claim',
        targetUrl: 'http://hnb-rewards-portal.com.attacker-c2.cc/deposit.php?token=9281'
      }
    ],
    redFlags: [
      'Sender domain (hnb-rewards-portal.com) is not official huntington.com',
      'Artificial deadline pressure ("by 5:00 PM today" or funds forfeited)',
      'Requests highly sensitive financial PII (SSN and full account routing details)',
      'SPF/DKIM signature failed validation',
      'Hyperlink routes to suspicious third-party .cc domain'
    ],
    cleanSignals: [],
    explanation: 'Targeted bank employee social engineering. Attackers use monetary lures ($750 wellness incentive) and tight deadlines to harvest employee banking credentials and SSNs. Huntington HR never asks employees to enter SSNs into third-party claim links.',
    category: 'HR'
  },

  // =========================================================================
  // TIER 2 - INTERMEDIATE (Commercial Banking, Wire Fraud & BEC, Diebold ATM)
  // =========================================================================
  {
    id: 'email_004',
    isPhishing: true,
    difficulty: 2,
    sender: {
      displayName: 'Diebold Nixdorf ATM Support',
      address: 'service-dispatch@dieb0ld-nixdorf-support.com',
      replyTo: 'dispatch-update@atm-firmware-patch.xyz',
      spfDkimStatus: 'UNVERIFIED'
    },
    subject: 'CRITICAL SECURITY BULLETIN: Mandatory Firmware Update for Series 7700 Branch ATMs',
    timestamp: 'Today, 11:20 AM',
    body: `ATTN: Huntington Branch IT Systems Administrator,

Diebold Nixdorf has issued an emergency zero-day patch (CVE-2026-4401) affecting the motorized card reader and cash dispenser controllers in your region's Series 7700 drive-thru ATMs.

Please download the attached executable firmware patch utility and load it onto your branch diagnostic maintenance USB key immediately. Failure to update within 24 hours will violate PCI-DSS compliance.

Attachment: Diebold_ATM_CashDispenser_Patch_v4.2.exe (3.4 MB)

Regards,
Diebold Nixdorf Global Field Service`,
    links: [],
    attachments: [
      {
        name: 'Diebold_ATM_CashDispenser_Patch_v4.2.exe',
        size: '3.4 MB',
        type: 'EXECUTABLE',
        isMalicious: true
      }
    ],
    redFlags: [
      'Typosquatted vendor domain ("dieb0ld" with a zero instead of the letter "o")',
      'Unsolicited executable attachment (.exe) targeting ATM infrastructure (ATM Jackpotting malware strain)',
      'Unverified SPF/DKIM validation status',
      'Reply-To points to a completely separate untrusted TLD (.xyz)',
      'Threat of regulatory non-compliance penalty (PCI-DSS violation) to force rapid execution'
    ],
    cleanSignals: [],
    explanation: 'Hardware vendor impersonation attack attempting to deliver ATM jackpotting malware. Attackers exploit banking ATM maintenance relationships to trick branch IT engineers into deploying malicious executables onto physical teller and ATM hardware.',
    category: 'VENDOR'
  },
  {
    id: 'email_005',
    isPhishing: false,
    difficulty: 2,
    sender: {
      displayName: 'Huntington Commercial Treasury & Clearing Operations',
      address: 'treasury-settlement@huntington.com',
      spfDkimStatus: 'PASS'
    },
    subject: 'EOD Commercial Fedwire & NACHA Batch Reconciliation Report #TR-8841',
    timestamp: 'Today, 01:15 PM',
    body: `Commercial Banking & Treasury Operations,

Attached is the encrypted end-of-day reconciliation summary for Commercial Wire and Automated Clearing House (ACH) transfers processed through the Federal Reserve Bank of Cleveland gateway.

Batch Statistics:
- Total Fedwire Outbound: 1,420 items ($384.2M)
- NACHA Same-Day ACH Settlement: 8,910 items ($62.1M)
- Exceptions / Flagged OFAC Holds: 0 items

Please review the audit log in the Treasury Portal. Dual-control approval tokens remain synchronized.

Regards,
Commercial Treasury Operations Group
Huntington National Bank`,
    links: [
      {
        text: 'Access Treasury Settlement Portal',
        url: 'https://treasury.huntington.com/reports/TR-8841',
        targetUrl: 'https://treasury.huntington.com/reports/TR-8841'
      }
    ],
    attachments: [
      {
        name: 'Settlement_Reconciliation_Summary_TR8841.pdf',
        size: '412 KB',
        type: 'PDF',
        isMalicious: false
      }
    ],
    redFlags: [],
    cleanSignals: [
      'Cryptographically verified sender (@huntington.com with valid SPF and DKIM signatures)',
      'Standard sanitized banking PDF document without active script macros',
      'Link points exclusively to authentic internal treasury subdomain (treasury.huntington.com)',
      'Tone is professional, factual, and references established internal dual-control procedures',
      'No requests for credentials, password changes, or unverified wire rerouting'
    ],
    explanation: 'Legitimate Huntington Treasury operational report. The cryptographic headers are fully verified, the attachment is a safe PDF report, and the link points to the authentic Huntington treasury portal.',
    category: 'FINANCE'
  },
  {
    id: 'email_006',
    isPhishing: true,
    difficulty: 2,
    sender: {
      displayName: 'Zachary Palmer (Chief Financial Officer)',
      address: 'z.palmer@huntington-bancshares-corp.com',
      replyTo: 'exec-confidential-desk@fastmail-secure.is',
      spfDkimStatus: 'FAIL'
    },
    subject: 'STRICTLY CONFIDENTIAL: Immediate Dual-Control Wire Reroute for Project Buckeye ($2,840,000.00)',
    timestamp: 'Today, 02:45 PM',
    body: `Bob,

I am currently in an offsite closed-door acquisition meeting with the Huntington Board of Directors regarding Project Buckeye. 

Due to a last-minute closing escrow amendment with outside legal counsel, we need to expedite an immediate outbound Fedwire transfer of $2,840,000.00 to the updated title escrow account at First Commercial Escrow LLC.

Updated Beneficiary Wire Instructions:
- Routing (ABA): 044000804
- Account Number: 8829-1029-4410
- Beneficiary: First Commercial Escrow LLC / Acq Trust

Please bypass the standard secondary phone callback verification for this transaction since I cannot take calls during the board session. Release the wire immediately in the Hogan terminal.

Thanks,
Zachary Palmer
Executive Vice President & CFO | Huntington Bancshares`,
    links: [],
    redFlags: [
      'Executive Impersonation / Business Email Compromise (BEC) spoofing the bank CFO',
      'Lookalike domain (huntington-bancshares-corp.com instead of huntington.com)',
      'Reply-To points to an anonymous offshore mailbox (fastmail-secure.is)',
      'Explicitly demands bypassing mandatory dual-control wire verification ("bypass secondary phone callback")',
      'Extreme manufactured pressure citing a confidential board acquisition',
      'SPF/DKIM validation failed'
    ],
    cleanSignals: [],
    explanation: 'Classic Business Email Compromise (BEC) wire fraud attack. The attacker spoofed the CFO using a lookalike domain and ordered staff to bypass dual-control phone verification to wire $2.84M to a criminal money mule account. Never bypass dual-control wire authorization protocols under any circumstance.',
    category: 'EXECUTIVE'
  },

  // =========================================================================
  // TIER 3 - ADVANCED (OCC/FFIEC Audit, FinCEN SARs, Core Mainframe Zero-Days)
  // =========================================================================
  {
    id: 'email_007',
    isPhishing: true,
    difficulty: 3,
    sender: {
      displayName: 'OCC Bank IT Examination Committee',
      address: 'examinations-notice@occ-treas-gov-portal.org',
      replyTo: 'compliance-auditor@secure-fincen-review.info',
      spfDkimStatus: 'FAIL'
    },
    subject: 'URGENT: Office of the Comptroller of the Currency (OCC) Cybersecurity Examination Findings',
    timestamp: 'Today, 03:30 PM',
    body: `CONFIDENTIAL REGULATORY COMMUNICATION

To: Huntington National Bank IT Governance & CISO Office,

Pursuant to Section 7 of the Bank Service Company Act and FFIEC Information Technology Examination standards, the OCC Examination Team has identified critical security compliance deficiencies in Huntington's Core Banking and GLBA Customer PII storage systems.

Attached is the encrypted Supervisory Letter and Corrective Action Plan. You must enable macro content in the attached spreadsheet to decrypt the examination findings and submit your mitigation plan within 48 hours.

Attachment: OCC_Exam_Deficiency_Report_2026.xlsm (890 KB)

Office of the Comptroller of the Currency
Large Bank Supervision Division | US Department of the Treasury`,
    links: [],
    attachments: [
      {
        name: 'OCC_Exam_Deficiency_Report_2026.xlsm',
        size: '890 KB',
        type: 'SPREADSHEET',
        isMalicious: true
      }
    ],
    redFlags: [
      'Lookalike spoof of federal banking regulator (occ-treas-gov-portal.org instead of official occ.gov)',
      'Malicious macro-enabled Excel document (.xlsm) containing weaponized VBA dropper (Emotet/Qakbot banking trojan)',
      'Instructs recipient to "enable macro content" to bypass Microsoft Office Protected View security controls',
      'Weaponizes regulatory fear and severe compliance penalties to force immediate compliance',
      'Failed SPF/DKIM verification'
    ],
    cleanSignals: [],
    explanation: 'High-level Advanced Persistent Threat (APT) targeting banking infrastructure. Attackers impersonate federal bank regulators (OCC/FDIC) with macro-enabled spreadsheets (.xlsm) designed to deploy banking trojans onto bank endpoints. Authentic regulatory examinations never require enabling macros or downloading unverified email attachments.',
    category: 'IT_SUPPORT'
  },
  {
    id: 'email_008',
    isPhishing: false,
    difficulty: 3,
    sender: {
      displayName: 'Huntington Enterprise Cyber Defense Center',
      address: 'cyberdefense@huntington.com',
      spfDkimStatus: 'PASS'
    },
    subject: 'SecOps Threat Advisory: Zero-Day Mitigation for Apache ActiveMQ & Core Messaging Gateway',
    timestamp: 'Today, 04:15 PM',
    body: `SecOps & Bank IT Engineering,

Enterprise Cyber Defense has deployed emergency signature updates across all Huntington perimeter firewalls and WAFs to mitigate an industry-wide vulnerability affecting message queue brokers in commercial banking environments.

Action Items for System Administrators:
1. Verify patch levels on Linux core application servers (Cluster HNB-PROD-01 through 08).
2. Audit service accounts according to Principle of Least Privilege.
3. No user action is required for standard teller or commercial lending workstations.

Full remediation checklist and hash indicators of compromise (IOCs) are published on the SecOps Confluence Space.

Regards,
Enterprise Cyber Defense Center (SOC)
Huntington National Bank`,
    links: [
      {
        text: 'View SecOps Internal IOC Bulletin & Remediation Checklist',
        url: 'https://security.huntington.com/advisories/SEC-2026-091',
        targetUrl: 'https://security.huntington.com/advisories/SEC-2026-091'
      }
    ],
    redFlags: [],
    cleanSignals: [
      'Authentic internal domain (@huntington.com) with valid SPF, DKIM, and DMARC passes',
      'Hyperlink points to verified internal security portal (security.huntington.com)',
      'Provides actionable technical guidance without asking for user credentials, passwords, or remote access',
      'Clear, non-panicked engineering advisory following formal incident response procedures'
    ],
    explanation: 'Legitimate internal Huntington SecOps threat bulletin. Cryptographic validation passes, links route to internal security wiki pages, and it outlines standard operational patch actions.',
    category: 'IT_SUPPORT'
  },
  {
    id: 'email_009',
    isPhishing: true,
    difficulty: 3,
    sender: {
      displayName: 'Federal Reserve Wire Network (FedLine)',
      address: 'fedline-direct-alert@frb-cleveland-clearing.net',
      spfDkimStatus: 'FAIL'
    },
    subject: 'Action Required: ISO 20022 High-Value Fedwire Payment Message Rejection (FedRef #99281)',
    timestamp: 'Today, 05:02 PM',
    body: `ATTN: Huntington National Bank Commercial Settlement Desk,

Outbound Fedwire transaction #99281 ($12,450,000.00 USD) has been rejected at the Federal Reserve Bank gateway due to an unformatted ISO 20022 pacs.008 XML syntax exception.

To manually re-route and sign the release payload before the 5:30 PM EST Fedwire cutoff, load the FedLine Direct web-authenticator link below and supply your hardware RSA token PIN.

Failure to resolve before cutoff will incur overnight liquidity penalty charges.

Federal Reserve Financial Services
FedLine Customer Support Operations`,
    links: [
      {
        text: 'Access FedLine Direct Emergency Re-Sign Gateway',
        url: 'https://www.frbservices.org/fedline/auth',
        targetUrl: 'https://frb-cleveland-clearing.net/fedline/token-harvest.php'
      }
    ],
    redFlags: [
      'Lookalike domain posing as Federal Reserve clearing service (frb-cleveland-clearing.net instead of frbservices.org)',
      'High-pressure liquidity cutoff deadline (5:30 PM Fedwire settlement rush)',
      'Attempts to harvest hardware RSA SecurID token PINs for wire authorization',
      'Link destination mismatches visible text and routes to external credential harvester',
      'Failed SPF/DKIM validation'
    ],
    cleanSignals: [],
    explanation: 'High-stakes bank wire heist attempt. Attackers target commercial wire operators with fake Federal Reserve FedLine settlement errors to steal hardware token PINs and take over the bank wire terminal. Authentic FedLine operations use dedicated, isolated private network lines (FedLine Advantage/Direct), never public email click-throughs.',
    category: 'FINANCE'
  }
];
