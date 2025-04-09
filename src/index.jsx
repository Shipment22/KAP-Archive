import { Elysia } from 'elysia';
import { staticPlugin } from "@elysiajs/static";

import { renderToReadableStream } from "react-dom/server.browser";
import { Database } from "bun:sqlite";
// Import page components
import Header from './components/header';
import Footer from './components/footer';
// Import pages
import ErrorPage from './pages/error';
import Home      from './pages/home';
import Add       from './pages/add';
import Browse    from './pages/browse';
import Search    from './pages/search';
import View      from './pages/view';
import RequestByCode from './pages/request-by-code';
// Import library functions for saving and retrieving
import { saveProgram, savePrograms } from './libs/archivePrograms.jsx';
import { getProgram, getPrograms, getProgramsNoString, queryPrograms, newQueryPrograms } from './libs/retrievePrograms.jsx';
import { stat } from 'fs';

// #region Old, horrendus, rendering code
function checkLoggedin(request) {
    // Check the key cookie's hash and if it's right return true
    if (request.headers.get('cookie') === null || request.headers.get('cookie').match(/key=[^;]+/) === null)
        return null;
    return Bun.hash(request.headers.get('cookie').match(/key=[^;]+/)[0].slice(4)) === 62864701388280 ? "true" : null;
}
async function renderPage(page, request) {
    const loggedIn = checkLoggedin(request);
    return new Response(
    await renderToReadableStream(
    <html lang="en">
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description"
              content={ page.description || `KAP Archive is an archival site that focuses on preserving program's from Khan Academy®'s KACP section;
              This project is in no way offiliated with or endoresed by Khan Academy®.
              The project exists to preserve code from hidden/deleted programs and banned users on KACP.` } />
            <meta name="theme-color" content="#11111A"/>
            <title>{page.title ?? 'KAP Archive'}</title>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="stylesheet" href={page.stylesheet || '/css/index.css'}/>
        </head>
        <body>
            <Header loggedIn={loggedIn} />
            {page.props ? (<page.body {...page.props}/>) : (<page.body />) }
            <Footer />
        </body>
    </html>,
    ), { headers: { "content-type": "text/html; charset=utf-8" } });
}
async function renderError(error, request) {
    const loggedIn = checkLoggedin(request);
    return new Response(
    await renderToReadableStream(
    <html>
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta name="description"
              content={'KAP Archive encountered an error. ' + error.message +
              '  If you think there\'s a problem with the site feel free to make an issue on Github. https://github.com/Shipment22/KAP-Archive'} />
            <meta name="theme-color" content="#11111A"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
            <link rel="manifest" href="/site.webmanifest" />
            <title>{error.message + ' | KAP Archive'}</title>
            <link rel="stylesheet" href='/css/index.css'/>
        </head>
        <body>
            <Header loggedIn={loggedIn} />
            <ErrorPage error={error.message} />
            <Footer />
        </body>
    </html>,
    ), {
        status: error.status,
        headers: { "content-type": "text/html; charset=utf-8" }
    });
}
function serveImage(path) {
    // Sends an image with headers based on the provided path
    return new Response(Bun.file(path), {
        headers: { "content-type": "image/"+path.split('.').reverse()[0] } });
}
// #endregion

// #region Response Helpers (new)
async function newRender({ stylesheet, Main, props, title, description, status=200 }) {
    return new Response(await renderToReadableStream(
        <html>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" /> 
                <meta name="description"
                    content={ description ?? `KAP Archive is an archival site that focuses on preserving program's from Khan Academy®'s KACP section;
                    This project is in no way offiliated with or endoresed by Khan Academy®.
                    The project exists to preserve code from hidden/deleted programs and banned users on KACP.` } />
                <meta name="theme-color" content="#11111A"/>
                <title>{title ?? 'KAP Archive'}</title>
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
                <link rel="manifest" href="/site.webmanifest" />
                <title>{title+" | KAP Archive"}</title>
                <link rel="stylesheet" href={stylesheet}/>
            </head>
            <body>
                <Header />
                <Main {...props} />
                <Footer />
            </body>
        </html>
    ), { headers: { "content-type": "text/html; charset=utf-8" } })
}
async function errorPage({ title, description, status, body }) {
    return new Response(
        await renderToReadableStream(
            <html>
                <head>
                    <meta charSet="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <meta
                        name="description"
                        content={`KAP Archive encountered an error: ${description}`}
                    />
                    <meta name="theme-color" content="#11111A" />
                    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=1" />
                    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=1" />
                    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=1" />
                    <link rel="manifest" href="/site.webmanifest" />
                    <title>{title+" | KAP Archive"}</title>
                    <link rel="stylesheet" href="/css/index.css" />
                </head>
                <body>
                    <Header />
                    {body ?? <ErrorPage error={description} />}
                    <Footer />
                </body>
            </html>
        ),
        {
            status,
            headers: {
                "Content-Type": "text/html; charset=utf-8"
            }
        }
    );
}

function jsonResponse (data, status = 200) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { "content-type": "application/json" }
    });
}
// #endregion

function parseDataURL(url) {
    if (url.indexOf(";base64,") == -1) {
        let parts = url.split(',');
        return new Blob(decodeURIComponent(parts[1]), {type: parts[0].split(':')[1]});
    }
    let parts = url.split(";base64,");
    let raw = atob(parts[1]);
    let uInt8Array = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) {
        uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], {type: parts[0].split(':')[1]})
}



const securityMiddleware = () => new Elysia().onAfterHandle(({ set }) => {
    set.headers = {
        ...set.headers,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'no-referrer',
    };
});

const app = new Elysia();

app.use(staticPlugin())
   .use(securityMiddleware());

app.all("/ping", () => "pong");

const tlAssets = [
    "favicon.ico",
    "android-chrome-512x512.png",
    "android-chrome-192x192.png",
    "apple-touch-icon.png",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "site.webmanifest",
];

tlAssets.forEach(a => {
    app.get(`/${a}`, () => Bun.file(`./assets/${a}`));
});

app.use(staticPlugin({ prefix: "/" }));

// TODO: Fix for WebP
app.get("/thumb/:id/latest.png", req => {
    let db = new Database("database.sqlite", { readonly: true });
    let thumbURI = db.query("SELECT thumbnail FROM programs WHERE id = $id").get({ $id: req.params.id }).thumbnail;
    db.close();
    return new Response(parseDataURL(thumbURI), { headers: { "Content-Type": "image/png" } });
});

app.all("/", async () => {
    return newRender({
        stylesheet: "/css/home.css",
        Main: Home
    });
});

// #region /s/:id & /g/:id
app.all("/s/:id", async req => {
    /**
     * API returns status message within program object. I don't know how I thought this was a good idea.
     * This will NOT be a trend going foreward. In fact I might release a breaking change to fix this.
     */

    if (/[\D]/.test(req.params.id)) return new Response("Invalid ID", { status: 400 })

    let p = await saveProgram(req.params.id);
    if (p.status === 200) return jsonResponse(p);

    console.warn("[SAVE FAIL] Could not save un-reachable program. id:", req.params.id);

    const backup = await getProgram(req.params.id);
    if (backup.status !== 200) {
        console.error("[BACKUP FAIL] Program backup not found. id:", req.params.id);
        return new Response("Error: "+p.message, { status: p.status });
    }

    console.info("[BACKUP FOUND] id:", req.params.id);

    backup.status = 404;
    backup.message = "Program was NOT SAVED. Here is a backup from the database.";
    return jsonResponse(backup, 404);
})
.all("/g/:id", async req => {
    if (/[\D]/.test(req.params.id)) return new Response("Invalid ID", { status: 400 })

    const p = await getProgram(req.params.id);
    if (p.status !== 200) return new Response("Not found", { status: 404 });

    return jsonResponse(p);
});
// #endregion

// #region View/Browse
app.get("/view",
    async req => {
    const id = req.query.p || req.query.id || req.query.program;

    if (!id) {
        return errorPage({ 
            title: "Bad Request",
            description: "No ID provided. Use 'p', 'id' or 'program' query parameter to provide the ID.",
            status: 400
        });
    }

    if (!/^\d+$/.test(id)) {
        return errorPage({ 
            title: "Bad Request",
            description: "Invalid ID. Scratchpad IDs only include digits.", 
            status: 400
        });
    }

    const program = getProgram(id);
    if (!program || (program.status !== 200 && program.severe)) {
        console.info("[NOT FOUND] Program was not found in database. id:",id);
        return errorPage({
            title: "Program Not Found",
            description: "404 Not Found. We couldn't find the program you're looking for.",
            status: 404
        });
    }

    return newRender({
        title: `Viewing Program ${program.title} | KAP Archive`,
        stylesheet: "/css/view.css",
        Main: View,
        props: { program }
    });
});

app.get("/browse", async req => {
    let page = req.query.page || 1;
    return newRender({
        title: "Browse Projects | KAP Archive",
        stylesheet: "/css/home.css",
        Main: Browse,
        props: { page }
    });
});
// #endregion

// #region Add/Search
app.all("/add", async req => {
    const ids = (req.query?.ids || req.query?.id)?.match(/\d{6,}/g) || [];
    if (ids.length === 0) {
        return await newRender({
            title: "Adding Results | KAP Archive",
            stylesheet: "/css/add.css",
            Main: Add,
        });
    }


    const seen = new Set();
    const unique = [];
    const dupes = [];

    for (const id of ids) {
        if (seen.has(id)) {
            dupes.push(id);
            continue;
        }
        seen.add(id);
        unique.push(id);
    }

    let programs;
    try {
        programs = await savePrograms(unique);
        console.log(programs)
        /** 
         * !!!! this is an issue a big one, if the id doens't point to a program it just gives an error page
         * TODO: Instead of programs wither errors saving displaying as regular programs with a different icon
         * TODO: they should display separately as a banner with a drop down revealing info about them. Probably
         * TODO: just the ID, but maybe also the reason it could not be saved. This will usually be that the
         * TODO: program is unreachable, but later on it might be blocked (e.g. for explicit content).
         * TODO: The dropdown format should be something like:
         * TODO: "WARNING: x programs are unavailable. x IDs are invalid. Learn more"
        */
    } catch (e) {
        console.error("Failed to save programs:", e);
        return errorPage({
            title: "Server Error",
            description: "500 Internal Server Error. savePrograms failed.",
            status: 500
        });
    }

    // Map ID to program title for dupes
    const titleMap = new Map(programs.map(p => [p.id, p.title]));

    for (const id of dupes) {
        programs.unshift({
            message: `Duplicate, "${titleMap.get(id) || 'Unknown'}" was added more than once.`,
            id
        });
    }

    return await newRender({
        title: "Adding Results | KAP Archive",
        stylesheet: "/css/add.css",
        Main: Add,
        props: { programs }
    });
});

// !TODO: /search POST endpoint
app.get("/search", async req => {
    const programs = newQueryPrograms(req.query);

    if (req.query.raw) {
        return new Response(JSON.stringify(programs), { headers: { "content-type": "application/json" } });
    }

    return newRender({
        stylesheet: "/css/home.css",
        Main: Search,
        title: "Search Programs | KAP Archive",
        props: { programs }
    })
});
// #endregion

app.all("*", () => {
    return errorPage({
        title: "404 Not found",
        description: "Page not found. Try something else.",
        status: 404
    });
});

app.listen(5000);