import { base } from "$app/paths";

export const handle = async ({ event, resolve }) => {
    const response = await resolve(event, {
        transformPageChunk: ({ html }) => {
            // This section will modify the HTML
            // before being returned to the client
            let currentTheme = event.cookies.get("theme");

            // Make sure the cookie was found, if not, set it to dark
            if (!currentTheme) {
                currentTheme = "dark";
                const one_year = 60 * 60 * 24 * 365;

                event.cookies.set("theme", currentTheme, {
                    path: "/",
                    maxAge: one_year,
                    httpOnly: false,
                });
            }

            return html.replace(
                `data-theme=""`,
                `data-theme="${currentTheme}"`,
            );
        },
    });

    return response;
};
