const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Supabase credentials not configured.' }),
        };
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    try {
        const { name, email, message } = JSON.parse(event.body);

        if (!name || !email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Name and email are required.' }),
            };
        }

        const { data, error } = await supabase
            .from('ternion-waitlist')
            .insert([{ name, email, message }]);

        if (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: error.message }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Successfully added to waitlist!' }),
        };
    } catch (err) {
        console.error('Supabase insertion error:', err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to process your request.' }),
        };
    }
};