/**
 * Simple client-side router
 */
export class Router {
    constructor(routes, rootElement) {
        this.routes = routes;
        this.rootElement = rootElement;
        this.init();
    }

    init() {
        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Intercept clicks on links for SPA behavior
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            const href = link?.getAttribute('href');
            if (link && href && href.startsWith('/') && !href.startsWith('//')) {
                e.preventDefault();
                this.navigate(href);
            }
        });

        // Handle initial route
        this.handleRoute();
    }

    navigate(path) {
        window.location.hash = path;
    }

    handleRoute() {
        // Get path from hash, default to '/'
        let path = window.location.hash.slice(1) || '/';
        
        // Ensure path starts with /
        if (!path.startsWith('/')) path = '/' + path;

        // Match static routes first
        let route = this.routes.find(r => r.path === path);
        let params = {};

        // If no direct match, check for dynamic routes (e.g., /ucapan/:slug)
        if (!route) {
            for (const r of this.routes) {
                if (r.path.includes(':')) {
                    const regexPath = r.path.replace(/:[^\s/]+/g, '([^/]+)');
                    const match = path.match(new RegExp(`^${regexPath}$`));
                    if (match) {
                        route = r;
                        const paramNames = (r.path.match(/:[^\s/]+/g) || []).map(p => p.slice(1));
                        params = paramNames.reduce((acc, name, i) => {
                            acc[name] = match[i + 1];
                            return acc;
                        }, {});
                        break;
                    }
                }
            }
        }

        // Fallback to home or 404
        if (!route) {
            route = this.routes.find(r => r.path === '/') || { component: () => document.createTextNode('404 Not Found') };
        }

        // Render the component
        const component = route.component(params);
        this.rootElement.innerHTML = '';
        this.rootElement.appendChild(component);
        
        // Scroll to top on navigation
        window.scrollTo(0, 0);
    }
}
