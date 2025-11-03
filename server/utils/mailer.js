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

/**
 * Send approval email to vendor
 * @param {string} toEmail - Vendor email address
 * @param {string} vendorName - Vendor name
 * @returns {Promise<Object>} - Brevo API response
 */
export const sendApprovalEmail = async (toEmail, vendorName) => {
  try {
    const response = await brevo.sendTransacEmail({
      sender: { 
        email: 'everydaymeal80@gmail.com', 
        name: 'EveryDayMeal Admin' 
      },
      to: [{ email: toEmail }],
      subject: '🎉 Your EveryDayMeal Vendor Application Has Been Approved!',
      textContent: `Congratulations ${vendorName}! Your vendor application has been approved. You can now login using your email: ${toEmail} with OTP verification.`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">🎉 Application Approved!</h1>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Congratulations, ${vendorName}!</h2>
            <p style="color: #555; line-height: 1.6;">
              We're excited to inform you that your vendor application for EveryDayMeal has been <strong>approved</strong>! 
              You can now start managing your menu and serving delicious meals to students.
            </p>
            
            <div style="background-color: #f0f8ff; padding: 20px; border-left: 4px solid #4CAF50; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">How to Login:</h3>
              <p style="margin: 10px 0;"><strong>Email:</strong> ${toEmail}</p>
              <p style="margin: 10px 0; color: #555;">
                We use <strong>OTP-based login</strong> for security. When you visit the vendor portal, 
                enter your email and we'll send you a one-time password to login.
              </p>
            </div>

            <p style="color: #555; line-height: 1.6;">
              <strong>Next Steps:</strong>
            </p>
            <ol style="color: #555; line-height: 1.8;">
              <li>Visit the EveryDayMeal vendor portal</li>
              <li>Click on "Vendor Login"</li>
              <li>Enter your email: <strong>${toEmail}</strong></li>
              <li>Request OTP and enter the code sent to your email</li>
              <li>Start managing your menu and serving students!</li>
            </ol>

            <p style="color: #888; font-size: 14px; margin-top: 30px;">
              <strong>Security Note:</strong> You'll receive a new OTP each time you login for maximum security.
            </p>

            <p style="color: #555; margin-top: 30px;">
              If you have any questions or need assistance, feel free to reach out to our support team.
            </p>

            <p style="color: #555;">
              Best regards,<br>
              <strong>The EveryDayMeal Team</strong>
            </p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Approval email sent successfully via Brevo API');
    return response;
  } catch (error) {
    console.error('❌ Brevo API Error (Approval):', error.response ? error.response.body : error.message);
    throw error;
  }
};

/**
 * Send rejection email to vendor
 * @param {string} toEmail - Vendor email address
 * @param {string} vendorName - Vendor name
 * @param {string} reason - Rejection reason (optional)
 * @returns {Promise<Object>} - Brevo API response
 */
export const sendRejectionEmail = async (toEmail, vendorName, reason = '') => {
  try {
    const response = await brevo.sendTransacEmail({
      sender: { 
        email: 'everydaymeal80@gmail.com', 
        name: 'EveryDayMeal Admin' 
      },
      to: [{ email: toEmail }],
      subject: 'Update on Your EveryDayMeal Vendor Application',
      textContent: `Dear ${vendorName}, We regret to inform you that your vendor application has not been approved at this time. ${reason ? 'Reason: ' + reason : ''}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ff6b6b; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">Application Update</h1>
          </div>
          <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Dear ${vendorName},</h2>
            <p style="color: #555; line-height: 1.6;">
              Thank you for your interest in joining EveryDayMeal as a vendor. 
              After careful review, we regret to inform you that we are unable to approve your application at this time.
            </p>
            
            ${reason ? `
            <div style="background-color: #fff3cd; padding: 20px; border-left: 4px solid #ff6b6b; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Reason:</h3>
              <p style="margin: 0; color: #555;">${reason}</p>
            </div>
            ` : ''}

            <p style="color: #555; line-height: 1.6;">
              We encourage you to review our vendor requirements and consider reapplying in the future. 
              If you have any questions or would like more information, please don't hesitate to contact us.
            </p>

            <p style="color: #555; margin-top: 30px;">
              Thank you for your understanding.
            </p>

            <p style="color: #555;">
              Best regards,<br>
              <strong>The EveryDayMeal Team</strong>
            </p>
          </div>
        </div>
      `
    });
    
    console.log('✅ Rejection email sent successfully via Brevo API');
    return response;
  } catch (error) {
    console.error('❌ Brevo API Error (Rejection):', error.response ? error.response.body : error.message);
    throw error;
  }
};

export default { sendOtpEmail, sendApprovalEmail, sendRejectionEmail };
