import { Router } from './utils/router.js';
import { Home } from './pages/Home.js';
import { Greeting } from './pages/Greeting.js';
import { MusicPlayer } from './components/MusicPlayer.js';
import { mount } from './utils/dom.js';


/**
 * App Entry Point
 */
const init = () => {
    const appRoot = document.getElementById('app');
    
    // Define Routes
    const routes = [
        { path: '/', component: Home },
        { path: '/ucapan/:slug', component: Greeting }
    ];

    // Initialize Global Router
    window.router = new Router(routes, appRoot);

    // Initialize Global Music Player
    document.body.appendChild(MusicPlayer());
};

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
