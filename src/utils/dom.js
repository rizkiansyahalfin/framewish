/**
 * DOM Utility helpers
 */

/**
 * Helper to create an element with attributes and children
 * @param {string} tag 
 * @param {Object} attrs 
 * @param {Array|string} children 
 * @returns {HTMLElement}
 */
export const el = (tag, attrs = {}, children = []) => {
    const element = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attrs)) {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            const event = key.substring(2).toLowerCase();
            element.addEventListener(event, value);
        } else {
            element.setAttribute(key, value);
        }
    }

    if (Array.isArray(children)) {
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof HTMLElement) {
                element.appendChild(child);
            }
        });
    } else if (typeof children === 'string') {
        element.textContent = children;
    } else if (children instanceof HTMLElement) {
        element.appendChild(children);
    }

    return element;
};

/**
 * Clear an element's children
 * @param {HTMLElement} element 
 */
export const clear = (element) => {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

/**
 * Mount a component to a target
 * @param {HTMLElement} target 
 * @param {HTMLElement} component 
 */
export const mount = (target, component) => {
    clear(target);
    target.appendChild(component);
};
