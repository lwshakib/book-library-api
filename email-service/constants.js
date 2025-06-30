export const SendMailEnum = {
  VERIFY_EMAIL: "VERIFY_EMAIL",
  RESET_PASSWORD: "RESET_PASSWORD",
  SIGN_UP: "SIGN_UP",
  SIGN_IN: "SIGN_IN",
  VERIFY_EMAIL_SUCCESS: "VERIFY_EMAIL_SUCCESS",
  VERIFY_EMAIL_FAILURE: "VERIFY_EMAIL_FAILURE",
  WELCOME: "WELCOME",
  ACCOUNT_ACTIVATION: "ACCOUNT_ACTIVATION",
  ACCOUNT_DEACTIVATION: "ACCOUNT_DEACTIVATION",
  ACCOUNT_SUSPENSION: "ACCOUNT_SUSPENSION",
  ACCOUNT_REACTIVATION: "ACCOUNT_REACTIVATION",
  PASSWORD_CHANGE_NOTIFICATION: "PASSWORD_CHANGE_NOTIFICATION",
  TWO_FACTOR_AUTHENTICATION: "TWO_FACTOR_AUTHENTICATION",
  NEWSLETTER_SUBSCRIPTION: "NEWSLETTER_SUBSCRIPTION",
  PROMOTIONAL_OFFER: "PROMOTIONAL_OFFER",
    TOO_MANY_FAILED_LOGIN_ATTEMPTS: "TOO_MANY_FAILED_LOGIN_ATTEMPTS",
};

export const commonStyles = `
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f4f4f4; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white; 
      border-radius: 12px; 
      overflow: hidden; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
    }
    .header { 
      background: gray; 
      color: white; 
      padding: 30px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 300; 
    }
    .content { 
      padding: 40px 30px; 
    }
    .greeting { 
      font-size: 20px; 
      margin-bottom: 20px; 
      color: #2c3e50; 
    }
    .code-container { 
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); 
      padding: 25px; 
      border-radius: 12px; 
      text-align: center; 
      margin: 30px 0; 
      box-shadow: 0 4px 15px rgba(240, 147, 251, 0.3); 
    }
    .verification-code { 
      font-size: 32px; 
      font-weight: bold; 
      color: white; 
      letter-spacing: 4px; 
      margin: 10px 0; 
      text-shadow: 0 2px 4px rgba(0,0,0,0.2); 
    }
    .code-label { 
      color: white; 
      font-size: 14px; 
      opacity: 0.9; 
      margin-bottom: 5px; 
    }
    .footer { 
      background: #f8f9fa; 
      padding: 30px; 
      text-align: center; 
      border-top: 1px solid #e9ecef; 
    }
    .footer p { 
      margin: 5px 0; 
      color: #6c757d; 
      font-size: 14px; 
    }
    .brand { 
      color: #667eea; 
      font-weight: 600; 
    }
    .expiry-notice { 
      background: #fff3cd; 
      border: 1px solid #ffeaa7; 
      border-radius: 8px; 
      padding: 15px; 
      margin: 20px 0; 
      color: #856404; 
    }
    .security-notice { 
      background: #d1ecf1; 
      border: 1px solid #bee5eb; 
      border-radius: 8px; 
      padding: 20px; 
      margin: 25px 0; 
      color: #0c5460; 
    }
    .button { 
      display: inline-block; 
      padding: 12px 30px; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
      color: white; 
      text-decoration: none; 
      border-radius: 25px; 
      font-weight: 500; 
      margin: 20px 0; 
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3); 
    }
    @media (max-width: 600px) { 
      .container { margin: 10px; } 
      .header, .content, .footer { padding: 20px; } 
      .verification-code { font-size: 28px; } 
    }
  </style>
`;