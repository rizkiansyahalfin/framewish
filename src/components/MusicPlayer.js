import { el } from '../utils/dom.js';

/**
 * Global Music Player Component
 * Stays active across route changes
 */
export const MusicPlayer = () => {
    return el('div', { 
        className: 'music-toggle',
        style: {
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: '1000',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            fontSize: '1.5rem',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        onclick: function() {
            let audio = document.getElementById('bg-music');
            if (!audio) {
                audio = el('audio', { 
                    id: 'bg-music', 
                    loop: true,
                    src: '/src/assets/audio/takbiran.mp3'
                });
                
                const fallbackUrl = 'https://archive.org/download/TakbiranIdulFitri/Takbiran%20Idul%20Fitri.mp3';
                
                audio.onerror = () => {
                    if (audio.src !== fallbackUrl) {
                        console.warn('Local Takbiran not found, using Archive.org fallback...');
                        audio.src = fallbackUrl;
                        audio.play().catch(err => console.error('Playback failed:', err));
                    }
                };
                
                document.body.appendChild(audio);
            }

            if (audio.paused) {
                audio.play().catch(err => {
                    console.error('Audio playback failed:', err);
                    alert('Gagal memutar musik. Pastikan file tersedia di /src/assets/audio/takbiran.mp3');
                });
                this.style.background = '#25D366';
                this.style.transform = 'scale(1.1)';
                this.innerHTML = '🎵';
            } else {
                audio.pause();
                this.style.background = 'rgba(255, 255, 255, 0.1)';
                this.style.transform = 'scale(1)';
                this.innerHTML = '🔇';
            }
        }
    }, '🎵');
};
