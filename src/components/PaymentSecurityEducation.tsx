import React, { useState } from 'react';
import { AlertTriangle, Shield, FileText, Lock, Eye, EyeOff } from 'lucide-react';

interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
}

const PaymentSecurityEducation: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: ''
  });
  const [showDangerousExample, setShowDangerousExample] = useState(false);
  const [showSecureExample, setShowSecureExample] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // DANGEROUS EXAMPLE - DO NOT USE IN PRODUCTION
  const demonstrateDangerousStorage = () => {
    if (!formData.cardNumber || !formData.cardholderName) {
      alert('Please fill in card details for the demonstration');
      return;
    }

    // This demonstrates what NOT to do
    const dangerousData = {
      timestamp: new Date().toISOString(),
      cardholderName: formData.cardholderName,
      cardNumber: formData.cardNumber,
      expiryDate: formData.expiryDate,
      cvv: formData.cvv,
      billingAddress: formData.billingAddress,
      warningMessage: 'THIS IS EXTREMELY DANGEROUS AND ILLEGAL!'
    };

    // Show what the dangerous file would contain
    const fileContent = `
PAYMENT DATA - ${dangerousData.timestamp}
=====================================
⚠️ WARNING: THIS VIOLATES PCI DSS COMPLIANCE ⚠️

Cardholder Name: ${dangerousData.cardholderName}
Card Number: ${dangerousData.cardNumber}
Expiry Date: ${dangerousData.expiryDate}
CVV: ${dangerousData.cvv}
Billing Address: ${dangerousData.billingAddress}

SECURITY VIOLATIONS:
- Unencrypted sensitive data
- PCI DSS non-compliance
- GDPR violation
- Massive security risk
- Legal liability exposure

POTENTIAL CONSEQUENCES:
- Fines up to $500,000+
- Criminal charges
- Lawsuits from customers
- Business closure
- Personal liability

DO NOT DO THIS IN REAL APPLICATIONS!
`;

    // Create a blob to simulate file creation (educational only)
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DANGEROUS_payment_data_${Date.now()}.txt`;
    
    // Show warning before download
    const confirmed = confirm(`
⚠️ EDUCATIONAL WARNING ⚠️

This will create a file showing how payment data would be stored unsecurely.

NEVER do this in real applications as it:
- Violates PCI DSS compliance
- Breaks data protection laws
- Creates massive security risks
- Could result in fines and lawsuits

Continue with educational demonstration?
    `);

    if (confirmed) {
      link.click();
      URL.revokeObjectURL(url);
      
      alert(`
🚨 EDUCATIONAL DEMONSTRATION COMPLETE 🚨

You just saw how dangerous it is to store payment data in files!

In a real scenario, this would:
- Violate PCI DSS (fines up to $500K)
- Break GDPR (fines up to 4% of revenue)
- Create massive security vulnerabilities
- Expose you to criminal liability

ALWAYS use secure payment processors like Paddle.com!
      `);
    }
  };

  // SECURE EXAMPLE - This is the correct approach
  const demonstrateSecureStorage = () => {
    // This shows what we SHOULD store (transaction metadata only)
    const secureData = {
      transactionId: 'txn_' + Date.now(),
      timestamp: new Date().toISOString(),
      amount: 29.00,
      currency: 'USD',
      planType: 'professional',
      billingCycle: 'monthly',
      customerEmail: 'customer@example.com', // Would be hashed in production
      paddleTransactionId: 'paddle_' + Date.now(),
      status: 'completed',
      // NO CARD DATA STORED!
      securityNote: 'Payment processed securely by Paddle.com',
      complianceNote: 'PCI DSS Level 1 compliant'
    };

    const secureFileContent = `
SECURE TRANSACTION LOG - ${secureData.timestamp}
===============================================
✅ PCI DSS COMPLIANT - NO CARD DATA STORED ✅

Transaction ID: ${secureData.transactionId}
Paddle Transaction: ${secureData.paddleTransactionId}
Amount: $${secureData.amount} ${secureData.currency}
Plan: ${secureData.planType} (${secureData.billingCycle})
Customer: ${secureData.customerEmail}
Status: ${secureData.status}

SECURITY FEATURES:
✅ No card numbers stored
✅ No CVV codes stored
✅ No expiry dates stored
✅ Payment processed by Paddle.com (PCI DSS Level 1)
✅ Customer can get refunds through Paddle
✅ GDPR compliant
✅ Legally safe

REFUND PROCESS:
1. Customer contacts support with transaction ID
2. We verify transaction in our secure logs
3. Refund processed through Paddle.com
4. Customer receives refund to original payment method
5. No card data needed!

This is the CORRECT way to handle payment data!
`;

    const blob = new Blob([secureFileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SECURE_transaction_log_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);

    alert(`
✅ SECURE EXAMPLE COMPLETE ✅

This shows the CORRECT way to store payment-related data:

✅ Only transaction metadata stored
✅ No sensitive payment information
✅ PCI DSS compliant
✅ Legally safe
✅ Refunds possible through Paddle.com

This is how professional applications handle payments!
    `);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Payment Security Education
        </h1>
        <p className="text-xl text-gray-600">
          Learn why storing payment data is dangerous and how to do it securely
        </p>
      </div>

      {/* Critical Warning */}
      <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              🚨 CRITICAL EDUCATIONAL WARNING 🚨
            </h2>
            <div className="text-red-800 space-y-2">
              <p><strong>This demonstration shows why storing payment data is EXTREMELY DANGEROUS!</strong></p>
              <p>In real applications, storing credit card data in files would:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Violate PCI DSS compliance (fines up to $500,000+)</li>
                <li>Break GDPR and data protection laws (fines up to 4% of revenue)</li>
                <li>Create massive security vulnerabilities</li>
                <li>Expose you to criminal liability and lawsuits</li>
                <li>Result in business closure and personal bankruptcy</li>
              </ul>
              <p className="font-bold text-lg">NEVER DO THIS IN PRODUCTION!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sample Payment Form</h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="4111 1111 1111 1111"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Address
              </label>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>
          </form>
        </div>

        {/* Demonstration Buttons */}
        <div className="space-y-6">
          {/* Dangerous Example */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-bold text-red-900">
                ❌ DANGEROUS: File Storage
              </h3>
            </div>
            <p className="text-red-800 mb-4">
              This demonstrates the WRONG way to handle payment data. 
              <strong> NEVER do this in real applications!</strong>
            </p>
            <div className="space-y-2 text-sm text-red-700 mb-4">
              <p>• Violates PCI DSS compliance</p>
              <p>• Creates security vulnerabilities</p>
              <p>• Illegal in most jurisdictions</p>
              <p>• Could result in massive fines</p>
            </div>
            <button
              onClick={demonstrateDangerousStorage}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center"
            >
              <FileText className="w-5 h-5 mr-2" />
              Show Dangerous Example (Educational Only)
            </button>
          </div>

          {/* Secure Example */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-green-900">
                ✅ SECURE: Metadata Only
              </h3>
            </div>
            <p className="text-green-800 mb-4">
              This shows the CORRECT way to store payment-related data.
              <strong> This is how professionals do it!</strong>
            </p>
            <div className="space-y-2 text-sm text-green-700 mb-4">
              <p>• PCI DSS compliant</p>
              <p>• No sensitive data stored</p>
              <p>• Legally safe</p>
              <p>• Industry standard</p>
            </div>
            <button
              onClick={demonstrateSecureStorage}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Lock className="w-5 h-5 mr-2" />
              Show Secure Example
            </button>
          </div>

          {/* Educational Resources */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              📚 Educational Resources
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <strong>PCI DSS Standards:</strong>
                <p>Learn about payment card industry security standards</p>
              </div>
              <div>
                <strong>GDPR Compliance:</strong>
                <p>Understand data protection requirements</p>
              </div>
              <div>
                <strong>Secure Payment Processing:</strong>
                <p>How companies like Stripe, Paddle, and PayPal handle payments</p>
              </div>
              <div>
                <strong>Tokenization:</strong>
                <p>How to reference payments without storing card data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Takeaways</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-3">❌ Never Do This:</h3>
            <ul className="space-y-2 text-red-800">
              <li>• Store credit card numbers in files</li>
              <li>• Save CVV codes anywhere</li>
              <li>• Keep expiry dates in databases</li>
              <li>• Store any payment credentials locally</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Always Do This:</h3>
            <ul className="space-y-2 text-green-800">
              <li>• Use PCI DSS compliant processors</li>
              <li>• Store only transaction metadata</li>
              <li>• Implement proper tokenization</li>
              <li>• Follow industry best practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSecurityEducation;