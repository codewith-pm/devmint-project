import React, { useState, useEffect } from 'react';
import { paddle } from '../utils/paddle';
import { CreditCard, Loader, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

interface PaddleCheckoutProps {
  planType: 'pro' | 'enterprise' | 'donation';
  billingCycle?: 'monthly' | 'yearly';
  userEmail?: string;
  customAmount?: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const PaddleCheckout: React.FC<PaddleCheckoutProps> = ({
  planType,
  billingCycle = 'monthly',
  userEmail,
  customAmount,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [paddleStatus, setPaddleStatus] = useState<string>('Initializing...');

  // Real Paddle Price IDs from your dashboard
  const priceIds = {
    pro: {
      monthly: 'pri_01jxkfd08h8gwv7mqxw1ah948b', // Professional $29/month
      yearly: 'pri_01jxkfsmdcw6tfx7s0wjkdbazr'   // Professional $288/year
    },
    enterprise: {
      monthly: 'pri_01jxkfk7whgk1q9pjfxdt4kbg6', // Enterprise $99/month
      yearly: 'pri_01jxkfxs04a3gxkrwj32kpzk30'   // Enterprise $984/year
    }
  };

  useEffect(() => {
    initializePaddle();
  }, []);

  const initializePaddle = async () => {
    try {
      setIsLoading(true);
      setPaddleStatus('Loading Paddle.js...');
      
      await paddle.initialize();
      
      setIsInitialized(true);
      setInitError(null);
      setPaddleStatus('Ready for payment');
      
      console.log('Paddle initialization completed successfully');
    } catch (error) {
      console.error('Failed to initialize Paddle:', error);
      setInitError(`Failed to initialize payment system: ${error}`);
      setPaddleStatus('Failed to load');
      onError?.('Failed to initialize payment system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!isInitialized) {
      onError?.('Payment system not ready. Please refresh the page.');
      return;
    }

    if (!paddle.isReady()) {
      onError?.('Paddle is not ready. Please try again.');
      return;
    }

    setIsLoading(true);
    setPaddleStatus('Opening checkout...');

    try {
      if (planType === 'donation' && customAmount) {
        console.log(`Starting donation checkout for $${customAmount}`);
        await paddle.createDonationCheckout(customAmount, 'Donation to Devmint');
      } else {
        const priceId = priceIds[planType][billingCycle];
        if (!priceId) {
          throw new Error('Invalid plan type or billing cycle');
        }

        console.log(`Starting subscription checkout for ${planType} ${billingCycle} plan`);
        console.log(`Using price ID: ${priceId}`);

        await paddle.openCheckout({
          items: [{ priceId, quantity: 1 }],
          customer: userEmail ? { email: userEmail } : undefined,
          customData: {
            planType,
            billingCycle,
            userId: userEmail || 'anonymous'
          },
          settings: {
            displayMode: 'overlay',
            theme: 'light',
            locale: 'en'
          }
        });
      }
      
      setPaddleStatus('Checkout opened successfully');
      onSuccess?.();
      
    } catch (error) {
      console.error('Checkout error:', error);
      setPaddleStatus('Checkout failed');
      onError?.(`Failed to start checkout: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanDetails = () => {
    switch (planType) {
      case 'pro':
        return {
          name: 'Professional Plan',
          price: billingCycle === 'monthly' ? '$29/month' : '$288/year',
          originalPrice: billingCycle === 'yearly' ? '$348/year' : undefined,
          savings: billingCycle === 'yearly' ? '$60/year' : undefined,
          description: '50,000 API calls, premium templates, priority support',
          features: [
            '50,000 API calls per month',
            '25+ premium invoice templates',
            'Priority email support',
            'Advanced analytics dashboard',
            'Custom branding options',
            'Team collaboration (5 seats)'
          ]
        };
      case 'enterprise':
        return {
          name: 'Enterprise Plan',
          price: billingCycle === 'monthly' ? '$99/month' : '$984/year',
          originalPrice: billingCycle === 'yearly' ? '$1,188/year' : undefined,
          savings: billingCycle === 'yearly' ? '$204/year' : undefined,
          description: 'Unlimited API calls, custom templates, 24/7 support',
          features: [
            'Unlimited API calls',
            'All premium templates + custom design',
            '24/7 phone & email support',
            'Dedicated account manager',
            'White-label solution',
            'Unlimited team members',
            '99.9% SLA guarantee'
          ]
        };
      case 'donation':
        return {
          name: 'Support Devmint',
          price: customAmount ? `$${customAmount.toFixed(2)}` : 'Custom amount',
          description: 'Help us continue building amazing API tools',
          features: [
            'Support ongoing development',
            'Help maintain 99.9% uptime',
            'Enable new feature development',
            'Keep free tier available',
            'Improve documentation & support'
          ]
        };
      default:
        return { name: '', price: '', description: '', features: [] };
    }
  };

  const planDetails = getPlanDetails();

  if (initError) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Payment System Error</h3>
          <p className="text-red-600 mb-4">{initError}</p>
          <button
            onClick={initializePaddle}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Retry Initialization
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          {planType === 'donation' ? (
            <DollarSign className="w-8 h-8 text-white" />
          ) : (
            <CreditCard className="w-8 h-8 text-white" />
          )}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{planDetails.name}</h3>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {planDetails.price}
          {planDetails.originalPrice && (
            <div className="text-lg text-gray-500 line-through">{planDetails.originalPrice}</div>
          )}
        </div>
        {planDetails.savings && (
          <div className="text-green-600 font-semibold mb-2">Save {planDetails.savings}</div>
        )}
        <p className="text-gray-600">{planDetails.description}</p>
        
        {billingCycle === 'yearly' && planType !== 'donation' && (
          <div className="mt-3 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            🎉 Best Value - Save {planDetails.savings}
          </div>
        )}
      </div>

      {/* Features List */}
      {planDetails.features && planDetails.features.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
          <ul className="space-y-2">
            {planDetails.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Status Display */}
      <div className="mb-4 p-3 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Payment System Status:</span>
          <span className={`font-medium ${
            isInitialized ? 'text-green-600' : isLoading ? 'text-blue-600' : 'text-red-600'
          }`}>
            {paddleStatus}
          </span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handleCheckout}
        disabled={isLoading || !isInitialized}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader className="w-5 h-5 mr-2 animate-spin" />
            {paddleStatus}
          </>
        ) : !isInitialized ? (
          'Loading Payment System...'
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            {planType === 'donation' 
              ? `Donate $${customAmount?.toFixed(2) || '0.00'}` 
              : `Subscribe ${billingCycle === 'yearly' ? 'Yearly' : 'Monthly'}`
            }
          </>
        )}
      </button>

      {/* Payment Info */}
      <div className="mt-4 text-center">
        <div className="text-xs text-gray-500 mb-2">
          🔒 Secure payment processing by{' '}
          <a href="https://paddle.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            Paddle.com
          </a>
        </div>
        
        <div className="text-xs text-gray-500 mb-2">
          💳 Accepts: Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay
        </div>
        
        {planType !== 'donation' && (
          <div className="text-xs text-gray-500">
            ✅ Cancel anytime • 30-day money-back guarantee
          </div>
        )}
        
        {planType === 'donation' && (
          <div className="text-xs text-gray-500">
            ❤️ Thank you for supporting open-source development
          </div>
        )}
      </div>

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-xl">
          <div className="text-xs text-yellow-800">
            <strong>Debug Info:</strong><br />
            Paddle Status: {paddle.getStatus()}<br />
            Plan: {planType} ({billingCycle})<br />
            {planType !== 'donation' && `Price ID: ${priceIds[planType][billingCycle]}`}<br />
            {planType === 'donation' && `Amount: $${customAmount?.toFixed(2)}`}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaddleCheckout;