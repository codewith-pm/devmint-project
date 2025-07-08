import React, { useState } from 'react';
import { AlertTriangle, Download, FileText, CreditCard, Shield, Eye, EyeOff, Folder, Trash2 } from 'lucide-react';
import { fileStorage } from '../utils/fileStorage';

interface PaymentFormData {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  billingAddress: string;
  email: string;
  amount: string;
}

const PaymentFileDemo: React.FC = () => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    billingAddress: '',
    email: '',
    amount: ''
  });
  const [showCvv, setShowCvv] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdFiles, setCreatedFiles] = useState<string[]>([]);
  const [showFileManager, setShowFileManager] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      cardNumber: formatted
    }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    setFormData(prev => ({
      ...prev,
      expiryDate: value
    }));
  };

  const createPaymentFile = async () => {
    if (!formData.cardholderName || !formData.cardNumber) {
      alert('Please fill in required fields for the educational demonstration');
      return;
    }

    setIsProcessing(true);

    // Show warning before download
    const confirmed = confirm(`
🎓 EDUCATIONAL DEMONSTRATION 🎓

This will create a file showing how payment data would be stored unsecurely.

⚠️ IMPORTANT WARNINGS:
- This demonstrates what NOT to do
- Real applications should NEVER store card data
- This violates PCI DSS compliance
- Could result in massive fines and lawsuits
- Use secure payment processors instead

Continue with educational demonstration?
    `);

    if (confirmed) {
      try {
        console.log('Creating dangerous payment file with data:', formData);
        const filename = await fileStorage.createDangerousPaymentFile(formData);
        setCreatedFiles(prev => [...prev, filename]);
        
        // Show educational summary
        setTimeout(() => {
          alert(`
🎓 EDUCATIONAL DEMONSTRATION COMPLETE 🎓

File created: ${filename}
📁 Saved to: datas/${filename}
💾 Also downloaded to your Downloads folder

📚 WHAT YOU LEARNED:
✅ How dangerous it is to store payment data in files
✅ What legal consequences this could have
✅ Why PCI DSS compliance matters
✅ How data breaches happen and their impact

🔒 SECURE ALTERNATIVE:
Instead of storing card data:
1. Use Paddle.com, Stripe, or PayPal
2. They handle all payment data securely
3. You only receive transaction confirmations
4. Refunds are processed through their systems
5. No liability or compliance issues for you

Remember: Professional developers NEVER store payment data!
        `);
        }, 1000);
      } catch (error) {
        alert(`Failed to create file: ${error}`);
      }
    }

    setIsProcessing(false);
  };

  const createSecureExample = async () => {
    try {
      console.log('Creating secure transaction file with data:', formData);
      const filename = await fileStorage.createSecureTransactionFile(formData);
      setCreatedFiles(prev => [...prev, filename]);
      
      alert(`
✅ SECURE EXAMPLE CREATED ✅

File created: ${filename}
📁 Saved to: datas/${filename}
💾 Also downloaded to your Downloads folder

This shows the CORRECT way to handle payment data:
- Only transaction metadata stored
- No sensitive payment information
- PCI DSS compliant
- Legally safe
- Professional approach

This is how real businesses should handle payments!
    `);
    } catch (error) {
      alert(`Failed to create secure example: ${error}`);
    }
  };

  const viewFile = (filename: string) => {
    const content = fileStorage.getFileContent(filename);
    if (content) {
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>${filename}</title>
              <style>
                body { font-family: monospace; white-space: pre-wrap; padding: 20px; background: #f5f5f5; }
                .header { background: #333; color: white; padding: 10px; margin: -20px -20px 20px -20px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h2>📁 File: ${filename}</h2>
                <p>Location: datas/${filename}</p>
              </div>
              ${content.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;')}
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  const deleteFile = (filename: string) => {
    if (confirm(`Delete file: ${filename}?`)) {
      if (fileStorage.deleteFile(filename)) {
        setCreatedFiles(prev => prev.filter(f => f !== filename));
        alert(`File deleted: ${filename}`);
      } else {
        alert(`Failed to delete file: ${filename}`);
      }
    }
  };

  // Load existing files on component mount
  React.useEffect(() => {
    setCreatedFiles(fileStorage.getDatasFolderContents());
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Educational Payment File Demo
        </h1>
        <p className="text-xl text-gray-600">
          Learn why storing payment data in files is dangerous
        </p>
      </div>

      {/* Critical Warning */}
      <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-4">
          <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
          <div>
            <h2 className="text-2xl font-bold text-red-900 mb-4">
              🚨 EDUCATIONAL WARNING 🚨
            </h2>
            <div className="text-red-800 space-y-2">
              <p><strong>This demonstration shows why storing payment data is EXTREMELY DANGEROUS!</strong></p>
              <p>Even with fake data, this approach would:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Violate PCI DSS compliance (fines up to $500,000+)</li>
                <li>Break GDPR and data protection laws</li>
                <li>Create massive security vulnerabilities</li>
                <li>Expose you to criminal liability</li>
                <li>Result in business closure</li>
              </ul>
              <p className="font-bold text-lg">NEVER DO THIS IN PRODUCTION!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <CreditCard className="w-6 h-6 mr-2" />
            Educational Payment Form
          </h2>
          
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe (fake name for demo)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="4111 1111 1111 1111 (test number)"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleExpiryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  placeholder="12/25"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <div className="relative">
                  <input
                    type={showCvv ? "text" : "password"}
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    maxLength={4}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showCvv ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="test@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="29.00"
                step="0.01"
              />
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

        {/* Action Buttons */}
        <div className="space-y-6">
          {/* Dangerous Example */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <h3 className="text-xl font-bold text-red-900">
                ❌ DANGEROUS: File Storage Demo
              </h3>
            </div>
            <p className="text-red-800 mb-4">
              This creates a file showing how payment data would be stored unsecurely.
              <strong> This demonstrates what NOT to do!</strong>
            </p>
            <div className="space-y-2 text-sm text-red-700 mb-4">
              <p>• Shows PCI DSS violations</p>
              <p>• Demonstrates security vulnerabilities</p>
              <p>• Explains legal consequences</p>
              <p>• Educational purposes only</p>
            </div>
            <button
              onClick={createPaymentFile}
              disabled={isProcessing}
              className="w-full py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center disabled:opacity-50"
            >
              <FileText className="w-5 h-5 mr-2" />
              {isProcessing ? 'Creating...' : 'Create Dangerous File (Educational)'}
            </button>
          </div>

          {/* Secure Example */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-bold text-green-900">
                ✅ SECURE: Proper Transaction Log
              </h3>
            </div>
            <p className="text-green-800 mb-4">
              This shows the CORRECT way to store payment-related data.
              <strong> This is how professionals do it!</strong>
            </p>
            <div className="space-y-2 text-sm text-green-700 mb-4">
              <p>• PCI DSS compliant approach</p>
              <p>• No sensitive data stored</p>
              <p>• Legally safe method</p>
              <p>• Industry standard practice</p>
            </div>
            <button
              onClick={createSecureExample}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
            >
              <Download className="w-5 h-5 mr-2" />
              Create Secure Example
            </button>
          </div>

          {/* Educational Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Folder className="w-8 h-8 text-yellow-600" />
              <h3 className="text-xl font-bold text-yellow-900">
                📁 Datas Folder Manager
              </h3>
            </div>
            <p className="text-yellow-800 mb-4">
              Files created in this demo are saved to the <code>datas</code> folder.
            </p>
            <button
              onClick={() => setShowFileManager(!showFileManager)}
              className="w-full py-3 bg-yellow-600 text-white rounded-xl font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center"
            >
              <Folder className="w-5 h-5 mr-2" />
              {showFileManager ? 'Hide' : 'Show'} File Manager ({createdFiles.length} files)
            </button>
            
            {showFileManager && (
              <div className="mt-4 space-y-2">
                {createdFiles.length === 0 ? (
                  <p className="text-yellow-700 text-sm italic">No files created yet</p>
                ) : (
                  createdFiles.map((filename, index) => (
                    <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm">{filename}</div>
                        <div className="text-xs text-gray-500">datas/{filename}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewFile(filename)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteFile(filename)}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
                {createdFiles.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Delete all files in datas folder?')) {
                        fileStorage.clearAllFiles();
                        setCreatedFiles([]);
                        alert('All files deleted from datas folder');
                      }
                    }}
                    className="w-full py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                  >
                    Clear All Files
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              📚 Educational Objectives
            </h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <strong>Learn the Dangers:</strong>
                <p>Understand why storing payment data is illegal and dangerous</p>
              </div>
              <div>
                <strong>See Real Consequences:</strong>
                <p>Learn about companies that failed due to poor security</p>
              </div>
              <div>
                <strong>Understand Compliance:</strong>
                <p>Learn about PCI DSS, GDPR, and other regulations</p>
              </div>
              <div>
                <strong>Practice Secure Methods:</strong>
                <p>See how professional companies handle payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 bg-gray-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-red-900 mb-3">❌ What This Demo Shows (DON'T DO):</h3>
            <ul className="space-y-2 text-red-800">
              <li>• Storing card data in text files</li>
              <li>• Unencrypted sensitive information</li>
              <li>• PCI DSS compliance violations</li>
              <li>• Legal liability exposure</li>
              <li>• Security vulnerabilities</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-3">✅ What You Should Do Instead:</h3>
            <ul className="space-y-2 text-green-800">
              <li>• Use PCI DSS compliant processors</li>
              <li>• Store only transaction metadata</li>
              <li>• Implement proper tokenization</li>
              <li>• Follow industry best practices</li>
              <li>• Maintain legal compliance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFileDemo;