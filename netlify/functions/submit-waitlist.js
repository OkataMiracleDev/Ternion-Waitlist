const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
    // These headers are added to all responses.
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allows requests from any origin
        'Access-Control-Allow-Headers': 'Content-Type', // Specifies which headers are allowed
        'Access-Control-Allow-Methods': 'POST, OPTIONS' // Specifies which HTTP methods are allowed
    };

    // Handle the browser's preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204, // 204 means No Content, it's a successful response for a preflight check
            headers
        };
    }
    
    // Ensure the request is a POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Supabase credentials not configured.' }),
        };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    try {
        const { name, email, message } = JSON.parse(event.body);

        if (!name || !email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Name and email are required.' }),
            };
        }

        const { data, error } = await supabase
            .from('ternion-waitlist')
            .insert([{ name, email, message }]);

        if (error) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ message: error.message }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Successfully added to waitlist!' }),
        };
    } catch (err) {
        console.error('Supabase insertion error:', err);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Failed to process your request.' }),
        };
    }
};