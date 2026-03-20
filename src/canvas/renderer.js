/**
 * Canvas Renderer for merging images and frames
 */
export class Renderer {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.size = 1080; // Standard High Res Square Aspect Ratio
        this.canvas.width = this.size;
        this.canvas.height = this.size;
    }

    /**
     * Loads an image from URL/DataURL
     * @param {string} src 
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            // Disable crossOrigin for local data URLs to prevent security errors
            if (!src.startsWith('data:')) {
                img.crossOrigin = 'anonymous'; 
            }
            img.onload = () => resolve(img);
            img.onerror = (e) => reject(new Error('Failed to load image: ' + src));
            img.src = src;
        });
    }

    /**
     * Main render function
     * @param {string} userImageSrc Base64 or URL
     * @param {string} frameOverlaySrc URL to transparent frame
     * @returns {Promise<string>} Data URL of the generated image
     */
    async generate(userImageSrc, frameOverlaySrc) {
        try {
            // Add a cache buster to ensure the latest frame version is loaded
            const frameUrl = frameOverlaySrc + '?t=' + Date.now();
            const [userImg, frameImg] = await Promise.all([
                this.loadImage(userImageSrc),
                this.loadImage(frameUrl)
            ]);

            // 1. Clear canvas
            this.ctx.clearRect(0, 0, this.size, this.size);

            // 2. Draw User Image with Cover scaling strategy
            const scale = Math.max(this.size / userImg.width, this.size / userImg.height);
            const x = (this.size / 2) - (userImg.width / 2) * scale;
            const y = (this.size / 2) - (userImg.height / 2) * scale;
            
            this.ctx.drawImage(userImg, x, y, userImg.width * scale, userImg.height * scale);

            // 3. Overlay the Frame
            this.ctx.drawImage(frameImg, 0, 0, this.size, this.size);

            return this.canvas.toDataURL('image/png', 0.9);
        } catch (error) {
            console.error('Rendering Error:', error);
            throw error;
        }
    }
}

export default new Renderer();
