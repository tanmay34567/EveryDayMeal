import SibApiV3Sdk from '@sendinblue/client';

// Initialize Brevo client
const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = process.env.BREVO_API_KEY || 'YOUR_BREVO_API_KEY';
brevo.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);

/**
 * Send OTP email using Brevo API
 * @param {string} toEmail - Recipient email address
 * @param {string} otp - The OTP to send
 * @returns {Promise<Object>} - Brevo API response
 */
export const sendOtpEmail = async (toEmail, otp) => {
  try {
    const response = await brevo.sendTransacEmail({
      sender: { 
        email: 'everydaymeal80@gmail.com', 
        name: 'EveryDayMeal' 
      },
      to: [{ email: toEmail }],
      subject: 'Your EveryDayMeal OTP',
      textContent: `Your verification code is ${otp}. It will expire in 5 minutes.`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your EveryDayMeal Verification Code</h2>
          <p>Hello,</p>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
          <p>Best regards,<br>The EveryDayMeal Team</p>
        </div>
      `
    });
    
    console.log('✅ Email sent successfully via Brevo API');
    return response;
  } catch (error) {
    console.error('❌ Brevo API Error:', error.response ? error.response.body : error.message);
    throw error;
  }
};

export default { sendOtpEmail };
