/**
 * Converts strings to URL-friendly slugs
 * @param {string} text 
 * @returns {string}
 */
export const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')    // Remove all non-word chars
        .replace(/--+/g, '-')       // Replace multiple - with single -
        .replace(/^-+/, '')         // Trim - from start of text
        .replace(/-+$/, '');        // Trim - from end of text
};

/**
 * Generates a combined slug for the greeting route
 * @param {string} sender 
 * @param {string} receiver 
 * @returns {string}
 */
export const generateGreetingSlug = (sender, receiver) => {
    const s = slugify(sender) || 'seseorang';
    const r = slugify(receiver) || 'sahabat';
    return `${s}-untuk-${r}`;
};
