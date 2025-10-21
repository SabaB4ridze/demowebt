// The 'supabase' variable is available globally from the CDN script in index.html
const { createClient } = supabase;

// Initialize Supabase client
const supabaseUrl = 'https://iiazauqlbjlcrcyvndqd.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpYXphdXFsYmpsY3JjeXZuZHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTQ4MTEsImV4cCI6MjA2OTYzMDgxMX0.c3d0CEcG1c0aSLE0TWtZ5B8lzgK_7ryLaQNUK546ElQ';
const supabaseClient = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches menu items from Supabase, with an option to filter by category.
 * @param {string|null} category - The category to filter by. If null or 'all', fetches all items.
 * @returns {Promise<Array>} - A promise that resolves to an array of menu items.
 */
async function fetchMenuItems(category = null) {
    let query = supabaseClient.from('menu_data').select('*');

    // If a specific category is provided (and it's not 'all'), add a filter
    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching menu items:', error);
        return [];
    }
    return data;
}

/**
 * Creates a new reservation in the Supabase database.
 * @param {string} name - Customer's name.
 * @param {string} date - Reservation date.
 * @param {string} time - Reservation time.
 * @param {number} guests - Number of guests.
 * @returns {Promise<Object|null>} - A promise that resolves to the created reservation data or null on error.
 */
async function createReservation(name, date, time, guests) {
    const { data, error } = await supabaseClient
        .from('reservations')
        .insert([{ name, date, time, guests }])
        .select();

    if (error) {
        console.error('Error creating reservation:', error);
        return null;
    }
    return data;
}