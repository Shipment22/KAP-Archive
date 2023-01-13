/*
 * Name:   relativeDate
 * Input:  A timestamp in milliseconds and outputs
 * Output: Human readable time since the inputted timestamp
*/

function relativeDate (timestamp) {
    const passed = Math.floor(new Date().getTime() / 1000) - Math.floor(timestamp / 1000); // Find how much time has passed in seconds
    // Check how much time has passed and output accordingly
    if (passed < 60) return `${passed} seconds ago`;                            // Less than a minute
    if (passed < 3600) return `${Math.floor(passed / 60)} minutes ago`;         // Less than an hour
    if (passed < 86400) return `${Math.floor(passed / 3600)} hours ago`;        // Less than a day
    if (passed < 2620800) return `${Math.floor(passed / 86400)} days ago`;      // Less than a month
    if (passed < 31449600) return `${Math.floor(passed / 2620800)} months ago`; // Less than a year
    return `${Math.floor(passed / 31449600)} years ago`;                        // More than a year
}

export default relativeDate; // Export relativeDate function