import { nav_buttons } from "./variables.js"

// a helper function that looks for the right tittle in nav_buttons
export const getPageTitle = (currentPath: string) => {
    const button = nav_buttons.find(btn => btn.link === currentPath);

    // Default title ("Home") if no match
    if (button) {
        return button.title
    }
    else {
        return "Home"
    }
};