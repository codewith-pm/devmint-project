// Paddle.js integration utility for real-time payments
declare global {
  interface Window {
    Paddle: any;
  }
}

export interface PaddleCheckoutOptions {
  items: Array<{
    priceId: string;
    quantity?: number;
  }>;
  customData?: {
    userId?: string;
    planType?: string;
  };
  customer?: {
    email?: string;
  };
  successUrl?: string;
  settings?: {
    displayMode?: 'inline' | 'overlay';
    theme?: 'light' | 'dark';
    locale?: string;
  };
}

export class PaddleService {
  private static instance: PaddleService;
  private isInitialized = false;
  private readonly sellerId = '233505';
  private readonly environment = 'production'; // Live environment
  private readonly apiKey = 'pdl_live_apikey_01jxjhr5jjh2mhne2dnf9yz5s3_67xW4eB7Tt7Zk2FyP8pNM5_AnN';

  private constructor() {}

  static getInstance(): PaddleService {
    if (!PaddleService.instance) {
      PaddleService.instance = new PaddleService();
    }
    return PaddleService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    return new Promise((resolve, reject) => {
      // Remove existing Paddle script if any
      const existingScript = document.querySelector('script[src*="paddle"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Load Paddle.js script
      const script = document.createElement('script');
      script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js';
      script.async = true;
      
      script.onload = () => {
        try {
          // Initialize Paddle with your seller ID
          if (window.Paddle) {
            window.Paddle.Environment.set(this.environment);
            window.Paddle.Setup({ 
              seller: parseInt(this.sellerId),
              eventCallback: this.handlePaddleEvent.bind(this)
            });
            this.isInitialized = true;
            console.log('Paddle initialized successfully');
            resolve();
          } else {
            throw new Error('Paddle object not available');
          }
        } catch (error) {
          console.error('Paddle initialization error:', error);
          reject(error);
        }
      };

      script.onerror = () => {
        console.error('Failed to load Paddle.js script');
        reject(new Error('Failed to load Paddle.js'));
      };

      document.head.appendChild(script);
    });
  }

  private handlePaddleEvent(data: any) {
    console.log('Paddle Event:', data);
    
    switch (data.name) {
      case 'checkout.completed':
        this.handleCheckoutCompleted(data);
        break;
      case 'checkout.closed':
        this.handleCheckoutClosed(data);
        break;
      case 'checkout.error':
        this.handleCheckoutError(data);
        break;
      case 'checkout.loaded':
        console.log('Checkout loaded successfully');
        break;
    }
  }

  private handleCheckoutCompleted(data: any) {
    console.log('Payment completed successfully:', data);
    
    // Show success message
    const customData = data.data?.custom_data;
    if (customData?.planType === 'donation') {
      alert(`Thank you for your generous donation! 🙏\nTransaction ID: ${data.data?.transaction_id}`);
      window.location.href = '/dashboard?payment=success&type=donation';
    } else {
      alert(`Subscription activated successfully! 🎉\nWelcome to ${customData?.planType} plan!\nTransaction ID: ${data.data?.transaction_id}`);
      window.location.href = '/dashboard?payment=success';
    }
  }

  private handleCheckoutClosed(data: any) {
    console.log('Checkout closed by user:', data);
  }

  private handleCheckoutError(data: any) {
    console.error('Checkout error occurred:', data);
    alert(`Payment failed: ${data.error?.message || 'Unknown error occurred'}\nPlease try again or contact support.`);
  }

  async openCheckout(options: PaddleCheckoutOptions): Promise<void> {
    if (!this.isInitialized) {
      console.log('Initializing Paddle...');
      await this.initialize();
    }

    if (!window.Paddle) {
      throw new Error('Paddle is not available');
    }

    console.log('Opening Paddle checkout with options:', options);

    try {
      const checkoutOptions = {
        items: options.items,
        customer: options.customer || {},
        customData: options.customData || {},
        settings: {
          displayMode: 'overlay',
          theme: 'light',
          locale: 'en',
          allowLogout: false,
          showAddTaxId: false,
          ...options.settings
        }
      };

      console.log('Final checkout options:', checkoutOptions);
      
      // Open the real Paddle checkout
      window.Paddle.Checkout.open(checkoutOptions);
      
    } catch (error) {
      console.error('Error opening checkout:', error);
      throw new Error(`Failed to open checkout: ${error}`);
    }
  }

  // Create a donation checkout with custom amount
  async createDonationCheckout(amount: number, description: string = 'Donation to Devmint'): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Validate minimum amount
    if (amount < 1) {
      throw new Error('Minimum donation amount is $1.00');
    }

    // For donations, we'll use Paddle's Pay Links API or create a custom product
    // Since we need custom amounts, we'll use the Pay Links approach
    try {
      const payLinkData = {
        items: [{
          price: {
            description: description,
            name: `Donation - $${amount.toFixed(2)}`,
            billing_cycle: null,
            trial_period: null,
            tax_mode: 'account_setting',
            unit_price: {
              amount: Math.round(amount * 100).toString(), // Convert to cents
              currency_code: 'USD'
            }
          },
          quantity: 1
        }],
        custom_data: {
          planType: 'donation',
          amount: amount,
          description: description
        },
        checkout_settings: {
          display_mode: 'overlay',
          theme: 'light',
          locale: 'en'
        }
      };

      // For now, we'll use the standard checkout with a predefined donation product
      // You would need to create a donation product in your Paddle dashboard
      // For testing, let's use a simple approach
      
      await this.openCheckout({
        items: [{ 
          priceId: 'custom_donation', // You'll need to create this in Paddle dashboard
          quantity: 1 
        }],
        customData: {
          planType: 'donation',
          amount: amount,
          description: description
        },
        settings: {
          displayMode: 'overlay'
        }
      });

    } catch (error) {
      console.error('Donation checkout error:', error);
      
      // Fallback: Show a message about creating donation products
      const confirmed = confirm(
        `To process donations, we need to set up a donation product in Paddle.\n\n` +
        `For now, would you like to contact us about your $${amount.toFixed(2)} donation?\n\n` +
        `Click OK to send an email, or Cancel to go back.`
      );
      
      if (confirmed) {
        const subject = encodeURIComponent(`Donation Intent - $${amount.toFixed(2)}`);
        const body = encodeURIComponent(
          `Hi Devmint Team,\n\n` +
          `I would like to make a donation of $${amount.toFixed(2)} to support your work.\n\n` +
          `Please let me know how to proceed with the payment.\n\n` +
          `Thank you!`
        );
        window.open(`mailto:support@devmint.site?subject=${subject}&body=${body}`);
      }
    }
  }

  // Check if Paddle is ready
  isReady(): boolean {
    return this.isInitialized && !!window.Paddle;
  }

  // Get Paddle status
  getStatus(): string {
    if (!this.isInitialized) return 'Not initialized';
    if (!window.Paddle) return 'Paddle not loaded';
    return 'Ready';
  }
}

export const paddle = PaddleService.getInstance();