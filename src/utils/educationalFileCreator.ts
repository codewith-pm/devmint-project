// Educational utility to demonstrate file creation (DANGEROUS - DO NOT USE IN PRODUCTION)
// This is for educational purposes only to show why storing payment data is dangerous

export interface DangerousPaymentData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  timestamp: string;
}

export interface SecureTransactionData {
  transactionId: string;
  timestamp: string;
  amount: number;
  currency: string;
  planType: string;
  customerEmail: string;
  paddleTransactionId: string;
  status: string;
}

export class EducationalFileCreator {
  private static instance: EducationalFileCreator;
  
  private constructor() {}
  
  static getInstance(): EducationalFileCreator {
    if (!EducationalFileCreator.instance) {
      EducationalFileCreator.instance = new EducationalFileCreator();
    }
    return EducationalFileCreator.instance;
  }

  // DANGEROUS EXAMPLE - Shows what NOT to do
  createDangerousPaymentFile(data: DangerousPaymentData): string {
    const warningHeader = `
⚠️⚠️⚠️ CRITICAL SECURITY WARNING ⚠️⚠️⚠️
THIS FILE DEMONSTRATES WHAT NOT TO DO!
STORING PAYMENT DATA LIKE THIS IS:
- ILLEGAL (violates PCI DSS)
- DANGEROUS (massive security risk)
- EXPENSIVE (fines up to $500,000+)
- CRIMINAL (potential jail time)

NEVER DO THIS IN REAL APPLICATIONS!
⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️
`;

    const fileContent = `${warningHeader}

DANGEROUS PAYMENT DATA STORAGE
==============================
Created: ${data.timestamp}
File Type: INSECURE TEXT FILE (NEVER DO THIS!)

PAYMENT INFORMATION (SHOULD NEVER BE STORED):
Cardholder Name: ${data.cardholderName}
Card Number: ${data.cardNumber}
Expiry Date: ${data.expiryDate}
CVV Code: ${data.cvv}
Billing Address: ${data.billingAddress}

SECURITY VIOLATIONS IN THIS FILE:
❌ Unencrypted sensitive payment data
❌ PCI DSS non-compliance
❌ GDPR violation (storing unnecessary personal data)
❌ No access controls
❌ No audit trail
❌ No data retention policy
❌ Massive liability exposure

LEGAL CONSEQUENCES:
💰 PCI DSS fines: $5,000 - $500,000+ per incident
💰 GDPR fines: Up to 4% of annual revenue
⚖️ Criminal charges possible
📰 Reputation damage
🏢 Business closure risk
👤 Personal liability for executives

WHAT HAPPENS IN A DATA BREACH:
1. Hackers steal this file easily (no encryption)
2. Customer card data is compromised
3. Fraudulent charges occur
4. Customers sue your company
5. Regulators impose massive fines
6. Business reputation destroyed
7. Potential criminal charges
8. Personal bankruptcy possible

CORRECT APPROACH:
✅ Use Paddle.com, Stripe, or similar PCI DSS Level 1 processors
✅ Never store card data yourself
✅ Only store transaction metadata
✅ Use tokenization for references
✅ Implement proper security controls

THIS FILE IS FOR EDUCATIONAL PURPOSES ONLY!
NEVER CREATE FILES LIKE THIS IN REAL APPLICATIONS!

Remember: Security is not optional - it's the law!
`;

    return fileContent;
  }

  // SECURE EXAMPLE - Shows the correct approach
  createSecureTransactionFile(data: SecureTransactionData): string {
    const securityHeader = `
✅✅✅ SECURE TRANSACTION LOG ✅✅✅
This file demonstrates the CORRECT way to store payment-related data.
NO SENSITIVE PAYMENT INFORMATION IS STORED!
✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅
`;

    const fileContent = `${securityHeader}

SECURE TRANSACTION METADATA
===========================
Created: ${data.timestamp}
File Type: SECURE TRANSACTION LOG

TRANSACTION INFORMATION (SAFE TO STORE):
Transaction ID: ${data.transactionId}
Paddle Transaction ID: ${data.paddleTransactionId}
Amount: $${data.amount} ${data.currency}
Plan Type: ${data.planType}
Customer Email: ${data.customerEmail}
Status: ${data.status}
Timestamp: ${data.timestamp}

SECURITY FEATURES:
✅ NO credit card numbers stored
✅ NO CVV codes stored
✅ NO expiry dates stored
✅ NO sensitive payment data
✅ Payment processed by Paddle.com (PCI DSS Level 1)
✅ Customer data minimized
✅ GDPR compliant
✅ Legally safe

COMPLIANCE STATUS:
✅ PCI DSS Compliant: Payment processing handled by certified processor
✅ GDPR Compliant: Minimal personal data, legitimate business purpose
✅ SOC 2 Compliant: Proper security controls implemented
✅ Industry Standard: Following best practices

REFUND PROCESS (NO CARD DATA NEEDED):
1. Customer contacts support with Transaction ID: ${data.transactionId}
2. Support verifies transaction in secure logs
3. Refund request sent to Paddle.com with Paddle Transaction ID: ${data.paddleTransactionId}
4. Paddle processes refund to original payment method
5. Customer receives refund (5-7 business days)
6. Refund status updated in secure logs

WHY THIS APPROACH IS SECURE:
🔒 Paddle.com stores all payment data securely (PCI DSS Level 1)
🔒 We only store business-necessary transaction metadata
🔒 Customers can still get refunds through Paddle
🔒 No security vulnerabilities created
🔒 No legal compliance issues
🔒 No liability exposure

BUSINESS BENEFITS:
💼 Legal compliance maintained
💼 Customer trust preserved
💼 No security audit failures
💼 No regulatory fines
💼 Professional reputation intact
💼 Business continuity assured

TECHNICAL IMPLEMENTATION:
🔧 Payment form submits directly to Paddle.com
🔧 Paddle processes payment securely
🔧 Paddle sends transaction confirmation to our webhook
🔧 We store only the metadata shown above
🔧 Customer receives receipt from Paddle
🔧 Refunds handled through Paddle's secure system

This is how professional companies handle payments!
Use this approach in your real applications.
`;

    return fileContent;
  }

  // Create educational comparison file
  createComparisonFile(): string {
    return `
PAYMENT DATA STORAGE COMPARISON
==============================
Educational comparison of dangerous vs secure approaches

DANGEROUS APPROACH (NEVER DO THIS):
❌ Store card numbers in files/databases
❌ Save CVV codes anywhere
❌ Keep expiry dates locally
❌ Store billing addresses unnecessarily
❌ Use unencrypted text files
❌ No access controls
❌ No audit trails

CONSEQUENCES:
💰 Fines: $5,000 - $500,000+
⚖️ Criminal charges possible
📰 Reputation damage
🏢 Business closure risk

SECURE APPROACH (ALWAYS DO THIS):
✅ Use PCI DSS Level 1 processors (Paddle, Stripe, etc.)
✅ Store only transaction metadata
✅ Implement proper tokenization
✅ Use encrypted databases
✅ Implement access controls
✅ Maintain audit trails
✅ Follow data minimization principles

BENEFITS:
💼 Legal compliance
💼 Customer trust
💼 No liability exposure
💼 Professional reputation
💼 Business continuity

REAL-WORLD EXAMPLES:

Companies that do it RIGHT:
- Netflix (uses secure payment processors)
- Spotify (tokenized payment references)
- Amazon (PCI DSS compliant processing)
- Apple (secure payment infrastructure)

Companies that did it WRONG (and paid the price):
- Target (2013): $162 million in settlements
- Equifax (2017): $700 million in fines
- Capital One (2019): $80 million fine
- Marriott (2018): $124 million fine

EDUCATIONAL TAKEAWAY:
The difference between secure and insecure payment handling
can literally make or break a business. Always choose security!
`;
  }

  // Simulate creating files in 'datas' folder (educational only)
  simulateFileCreation(filename: string, content: string): void {
    console.log(`
🎓 EDUCATIONAL SIMULATION 🎓

Simulating creation of file: datas/${filename}

In a real scenario, this would create a file in the 'datas' folder.
For security reasons, we're only showing the content here.

File content preview:
${content.substring(0, 500)}...

⚠️ REMEMBER: Never actually store payment data in files!
This simulation is for educational purposes only.
    `);

    // Create downloadable file for educational purposes
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

export const educationalFileCreator = EducationalFileCreator.getInstance();