const https = require('https');
const sendEmail = require('./emailService');

/**
 * Send a notification via Telegram Bot API (Truly Free)
 * @param {string} message - Message text
 */
const sendTelegram = (message) => {
  return new Promise((resolve, reject) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return reject(new Error('Telegram credentials not set in .env'));
    }

    const payload = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML',
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) resolve(parsed);
          else reject(new Error(parsed.description || 'Telegram error'));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

/**
 * Send a notification via the best available free channel (Telegram or Email)
 * Formerly sendSMS, renamed internally but kept for compatibility.
 */
const sendNotification = async (message, htmlMessage) => {
  // 1. Try Telegram first (Instant Push Notification)
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    try {
      await sendTelegram(message);
      console.log('✅ Notification sent via Telegram');
      return;
    } catch (err) {
      console.error('⚠️ Telegram failed, falling back to Email:', err.message);
    }
  }

  // 2. Fallback to Email (Always Free)
  try {
    await sendEmail({
      email: process.env.EMAIL_USER, // Send to admin themselves
      subject: 'New Booking Notification - TRI-ANGLE',
      message: message,
      html: htmlMessage,
    });
    console.log('✅ Notification sent via Email');
  } catch (err) {
    console.error('❌ All notification channels failed:', err.message);
    throw err;
  }
};

/**
 * Format and send a booking bill slip notification to admin.
 */
const sendBookingSlipSMS = async (booking, customer, eventType) => {
  const date = new Date(booking.eventDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const balanceDue = (booking.totalAmount || 0) - (booking.advancePaid || 0);

  // Using HTML-friendly formatting for Telegram
  const message =
    `<b>📋 NEW BOOKING - TRI-ANGLE</b>\n` +
    `──────────────────────\n` +
    `<b>ID:</b> #${String(booking._id).slice(-6).toUpperCase()}\n` +
    `<b>Customer:</b> ${customer.name}\n` +
    `<b>Phone:</b> ${customer.phone || booking.contactPhone || 'N/A'}\n` +
    `<b>Event:</b> ${eventType.icon || ''} ${eventType.name}\n` +
    `<b>Date:</b> ${date} ${booking.eventTime}\n` +
    `<b>Venue:</b> ${booking.venueName}, ${booking.city}\n` +
    `<b>Staff:</b> ${booking.numberOfStaff} (${booking.maleStaff || 0}M, ${booking.femaleStaff || 0}F)\n` +
    `<b>Duration:</b> ${booking.duration} hrs\n` +
    `──────────────────────\n` +
    `<b>Total:</b> Rs.${(booking.totalAmount || 0).toLocaleString('en-IN')}\n` +
    `<b>Advance:</b> Rs.${(booking.advancePaid || 0).toLocaleString('en-IN')}\n` +
    `<b>Balance:</b> Rs.${balanceDue.toLocaleString('en-IN')}\n` +
    `──────────────────────\n` +
    `<i>Login to admin panel to confirm.</i>`;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #7b1c2e; padding: 20px; text-align: center; border-bottom: 3px solid #d4a029;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px;">TRI-ANGLE</h1>
        <p style="color: #ecd599; margin: 5px 0 0; font-size: 14px; text-transform: uppercase;">New Booking Alert</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Booking #${String(booking._id).slice(-6).toUpperCase()}</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666; width: 40%;"><strong>Customer:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${customer.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666;"><strong>Phone:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${customer.phone || booking.contactPhone || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666;"><strong>Event Type:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${eventType.icon || ''} ${eventType.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666;"><strong>Date & Time:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${date} at ${booking.eventTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666;"><strong>Venue:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${booking.venueName}, ${booking.city}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666;"><strong>Distance:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${booking.distance || 0} km</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #666;"><strong>Staff Needed:</strong></td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #333;">${booking.numberOfStaff} Total (${booking.maleStaff || 0} Male, ${booking.femaleStaff || 0} Female)</td>
          </tr>
        </table>

        <div style="background-color: #fffdf5; border: 1px solid #f8eed6; padding: 20px; border-radius: 8px; margin-top: 30px;">
          <h3 style="color: #d4a029; margin-top: 0; margin-bottom: 15px; font-size: 16px;">Payment Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr>
              <td style="padding: 5px 0; color: #555;">Total Amount:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #333;">₹${(booking.totalAmount || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #555;">Advance Paid:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold; color: #333;">₹${(booking.advancePaid || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td colspan="2"><hr style="border: none; border-top: 1px dashed #dcdcdc; margin: 10px 0;"></td>
            </tr>
            <tr>
              <td style="padding: 5px 0; color: #d4a029; font-weight: bold; font-size: 16px;">Balance Due:</td>
              <td style="padding: 5px 0; text-align: right; font-weight: bold; font-size: 16px; color: #d4a029;">₹${balanceDue.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/dashboard" style="display: inline-block; background-color: #d4a029; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; letter-spacing: 1px;">VIEW IN DASHBOARD</a>
        </div>
      </div>
      <div style="background-color: #f7f7f7; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #999; font-size: 12px; margin: 0;">This is an automated administrative alert from TRI-ANGLE Catering.</p>
      </div>
    </div>
  `;

  // We call sendNotification which handles the free channels
  await sendNotification(message, htmlMessage);
};

/**
 * Send a professional HTML email to the customer when booking status updates.
 */
const sendCustomerStatusEmail = async (booking, customer, eventType) => {
  if (!customer || !customer.email) return;

  const date = new Date(booking.eventDate).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const message = `Your booking for ${eventType.name} on ${date} has been updated to: ${booking.status.toUpperCase()}`;

  const htmlMessage = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
      <div style="background-color: #7b1c2e; padding: 20px; text-align: center; border-bottom: 3px solid #d4a029;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 2px;">TRI-ANGLE</h1>
        <p style="color: #ecd599; margin: 5px 0 0; font-size: 14px; text-transform: uppercase;">Booking Status Update</p>
      </div>
      <div style="padding: 30px;">
        <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Hello ${customer.name},</h2>
        
        <p style="color: #555; font-size: 16px; line-height: 1.6;">
          Your booking request for <strong>${eventType.name}</strong> on <strong>${date}</strong> has been updated.
        </p>

        <div style="background-color: #f8f9fa; border-left: 4px solid #d4a029; padding: 15px; margin: 25px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">Current Status</p>
          <p style="margin: 5px 0 0; font-size: 20px; font-weight: bold; color: #333; text-transform: uppercase;">${booking.status}</p>
        </div>

        ${booking.adminNotes ? `
        <div style="background-color: #fffdf5; border: 1px solid #f8eed6; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <p style="margin: 0; font-size: 14px; color: #d4a029; font-weight: bold;">Note from our team:</p>
          <p style="margin: 8px 0 0; font-size: 15px; color: #555; font-style: italic;">"${booking.adminNotes}"</p>
        </div>
        ` : ''}

        <div style="margin-top: 30px; text-align: center;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/my-bookings/${booking._id}" style="display: inline-block; background-color: #d4a029; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; letter-spacing: 1px;">VIEW BOOKING DETAILS</a>
        </div>
      </div>
      <div style="background-color: #f7f7f7; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0;">
        <p style="color: #999; font-size: 12px; margin: 0;">TRI-ANGLE Catering Team</p>
      </div>
    </div>
  `;

  try {
    await sendEmail({
      email: customer.email,
      subject: `Booking Update: ${booking.status.toUpperCase()} - TRI-ANGLE`,
      message: message,
      html: htmlMessage,
    });
    console.log(`✅ Status update email sent to customer: ${customer.email}`);
  } catch (err) {
    console.error(`❌ Failed to send status email to customer:`, err.message);
  }
};

// Exporting sendSMS for backward compatibility with bookingController.js
module.exports = { sendSMS: sendNotification, sendBookingSlipSMS, sendCustomerStatusEmail };
