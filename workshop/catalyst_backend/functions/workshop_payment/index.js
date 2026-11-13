/**
 * Zoho Catalyst Advanced I/O Function: workshop_payment
 * Generates ₹10 UPI-only payment sessions via Zoho Payments API
 * with Origin validation and rate limiting protection.
 *
 * Rules followed:
 * - All variables, functions, and identifiers in Sanskrit (Devanagari script)
 * - User-facing text / response messages in English
 */

const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// 1. Allowed origins (Strict CORS & Bot Filtering)
const मान्य_उत्पत्तयः = [
    'https://pivotvlsi.in',
    'https://www.pivotvlsi.in',
    'http://localhost',
    'http://127.0.0.1'
];

// In-memory rate limiting store: IP -> { गणना, आरम्भसमयः }
const अनुरोध_सञ्चयः = new Map();
const अधिकतम_अनुरोधाः = 5; // max 5 requests
const समयसीमा_मिलिसेकण्ड् = 15 * 60 * 1000; // 15 minutes window

// CORS and Security Middleware
app.use((याचना, प्रत्युत्तरम्, अग्रिमम्) => {
    const उद्भवः = याचना.headers.origin || याचना.headers.referer || '';
    
    // Check if origin matches allowed domains
    const मान्य_अस्ति = मान्य_उत्पत्तयः.some(प्रतिरूपम् => उद्भवः.startsWith(प्रतिरूपम्));

    if (याचना.method === 'OPTIONS') {
        if (मान्य_अस्ति || !उद्भवः) {
            प्रत्युत्तरम्.header('Access-Control-Allow-Origin', उद्भवः || '*');
            प्रत्युत्तरम्.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Workshop-Token');
            प्रत्युत्तरम्.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
            return प्रत्युत्तरम्.sendStatus(200);
        }
        return प्रत्युत्तरम्.status(403).json({ success: false, error: 'Forbidden origin' });
    }

    if (उद्भवः && मान्य_अस्ति) {
        प्रत्युत्तरम्.header('Access-Control-Allow-Origin', उद्भवः);
    }

    // Rate Limiting by Client IP
    const ग्राहक_सङ्केतः = याचना.headers['x-forwarded-for'] || याचना.socket.remoteAddress || 'unknown';
    const वर्तमान_कालः = Date.now();
    const अभिलेखः = अनुरोध_सञ्चयः.get(ग्राहक_सङ्केतः);

    if (!अभिलेखः || (वर्तमान_कालः - अभिलेखः.आरम्भसमयः) > समयसीमा_मिलिसेकण्ड्) {
        अनुरोध_सञ्चयः.set(ग्राहक_सङ्केतः, { गणना: 1, आरम्भसमयः: वर्तमान_कालः });
    } else {
        if (अभिलेखः. गणना >= अधिकतम_अनुरोधाः) {
            return प्रत्युत्तरम्.status(429).json({
                success: false,
                error: 'Too many payment requests from this network. Please try again after 15 minutes.'
            });
        }
        अभिलेखः.गणना += 1;
    }

    // Clean up old entries periodically
    if (अनुरोध_सञ्चयः.size > 1000) {
        for (const [कुञ्जी, विवरणम्] of अनुरोध_सञ्चयः.entries()) {
            if (वर्तमान_कालः - विवरणम्.आरम्भसमयः > समयसीमा_मिलिसेकण्ड्) {
                अनुरोध_सञ्चयः.delete(कुञ्जी);
            }
        }
    }

    अग्रिमम्();
});

// Helper: Refresh Zoho OAuth Access Token
async function अभिगम_चिह्नम्_प्राप्नोतु() {
    const प्राचलाः = new URLSearchParams();
    प्राचलाः.append('refresh_token', process.env.ZOHO_PAYMENTS_REFRESH_TOKEN);
    प्राचलाः.append('client_id', process.env.ZOHO_PAYMENTS_CLIENT_ID);
    प्राचलाः.append('client_secret', process.env.ZOHO_PAYMENTS_CLIENT_SECRET);
    प्राचलाः.append('grant_type', 'refresh_token');

    const प्रमाणीकरण_प्रत्युत्तरम् = await axios.post('https://accounts.zoho.in/oauth/v2/token', प्राचलाः);
    return प्रमाणीकरण_प्रत्युत्तरम्.data.access_token;
}

// Health check endpoint
app.get('/health', (याचना, प्रत्युत्तरम्) => {
    प्रत्युत्तरम्.status(200).json({ status: 'ok', service: 'workshop_payment' });
});

// Primary Endpoint: Create Session for ₹10 UPI Payment
app.post('/create-session', async (याचना, प्रत्युत्तरम्) => {
    try {
        const { firstName, lastName, email } = याचना.body;
        const पूर्णनाम = `${firstName || ''} ${lastName || ''}`.trim();

        if (!email) {
            return प्रत्युत्तरम्.status(400).json({ success: false, error: 'Email is required' });
        }

        // Shared request token check for additional layer of security
        const अनुरोध_चिह्नम् = याचना.headers['x-workshop-token'];
        if (अनुरोध_चिह्नम् !== 'pivotvlsi-workshop-auth-2026') {
            return प्रत्युत्तरम्.status(403).json({ success: false, error: 'Unauthorized reservation source' });
        }

        const अभिगम_चिह्नम् = await अभिगम_चिह्नम्_प्राप्नोतु();

        // Hardcoded, tamper-proof payment specification (₹10, INR, UPI only)
        const याचना_भारः = {
            amount: 10.00,
            currency: 'INR',
            description: 'Jane Street Workshop Spot Reservation (100% Refundable)',
            customer: {
                name: पूर्णनाम || 'Participant',
                email: email
            },
            configurations: {
                allowed_payment_methods: ['upi'],
                payment_method_options: {
                    upi: {
                        allowed_payment_channels: ['intent', 'qr']
                    }
                }
            }
        };

        const सत्र_प्रत्युत्तरम् = await axios.post(
            'https://payments.zoho.in/api/v1/payment_sessions',
            याचना_भारः,
            {
                headers: {
                    'Authorization': `Zoho-oauthtoken ${अभिगम_चिह्नम्}`,
                    'X-Com-Zoho-Payments-Account-Id': process.env.ZOHO_PAYMENTS_ACCOUNT_ID,
                    'Content-Type': 'application/json'
                }
            }
        );

        प्रत्युत्तरम्.status(200).json({
            success: true,
            sessionId: सत्र_प्रत्युत्तरम्.data.payment_session_id,
            accountId: process.env.ZOHO_PAYMENTS_ACCOUNT_ID
        });

    } catch (दोषः) {
        console.error('Session creation error:', दोषः.response ? दोषः.response.data : दोषः.message);
        प्रत्युत्तरम्.status(500).json({
            success: false,
            error: दोषः.response ? दोषः.response.data : 'Internal server error while creating payment session'
        });
    }
});

module.exports = app;
