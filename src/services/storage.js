const STORAGE_KEY = 'greeting_frames_db';

/**
 * Abstraction layer for data storage
 * Currently using LocalStorage, but designed for easy migration to Firebase/Supabase
 */
const storage = {
    /**
     * Get all greetings
     * @returns {Array}
     */
    getAll: () => {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    },

    /**
     * Get a specific greeting by slug
     * @param {string} slug 
     * @returns {Object|null}
     */
    getBySlug: (slug) => {
        const greetings = storage.getAll();
        // Return the LATEST match to handle repeated names
        return [...greetings].reverse().find(g => g.slug === slug) || null;
    },

    /**
     * Save a new greeting
     * @param {Object} item { from, to, image, frameId, slug, createdAt }
     */
    save: (item) => {
        try {
            const greetings = storage.getAll();
            const newItem = {
                ...item,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            
            // Limit to 5 greetings to save space (images are large)
            if (greetings.length >= 5) {
                greetings.shift();
            }
            
            greetings.push(newItem);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(greetings));
            return newItem;
        } catch (e) {
            console.error('Storage Error:', e);
            // If full, clear everything except the latest one or alert
            if (e.name === 'QuotaExceededError') {
                localStorage.removeItem(STORAGE_KEY);
                alert('Penyimpanan Lokal Penuh! Data lama akan dihapus agar bisa menyimpan yang baru.');
                // Try saving again after clearing
                return storage.save(item);
            }
            throw e;
        }
    },

    /**
     * Delete a greeting
     * @param {string} id 
     */
    delete: (id) => {
        const greetings = storage.getAll();
        const filtered = greetings.filter(g => g.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    },

    /**
     * Save a generic setting
     * @param {string} key 
     * @param {any} value 
     */
    setSetting: (key, value) => {
        localStorage.setItem(`setting_${key}`, JSON.stringify(value));
    },

    /**
     * Get a generic setting
     * @param {string} key 
     * @returns {any}
     */
    getSetting: (key) => {
        const val = localStorage.getItem(`setting_${key}`);
        return val ? JSON.parse(val) : null;
    }
};

export default storage;
