import { Elysia } from 'elysia';

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

// #region New Render
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
                <title>Home | KAP Archive</title>
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
async function errorPage(args) {
    let { title, description, status = 0, body } = args;
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
                    <title>{title} | KAP Archive</title>
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
// #endregion New Render

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

new Elysia()
    .use(securityMiddleware())
    .all("/ping", () => "pong")
    .all(
        "/",
        async () => {
            return newRender({
                stylesheet: "/css/home.css",
                Main: Home
            })
        }
    )
    .all(
        "/s/:id",
        async req => {
            if (req.params.id.search(/[\D]/) !== -1) return new Response("Invalid ID", { status: 400 })
            let p = await saveProgram(req.params.id);

            if (p.status !== 200) {
                console.warn("Could not save un-reachable program. id:",req.params.id);
                const backup = await getProgram(req.params.id);
                if (backup.status !== 200) {
                    console.error("Program backup not found. id:",req.params.id);
                    return new Response("Error: "+p.message, { status: p.status });
                }
                backup.status = 404;
                backup.message = "Program was NOT SAVED. Here is a backup from the database.";
                return new Response(JSON.stringify(backup), { status: 404, headers: { "content-type": "application/json" }});
            }

            return new Response(JSON.stringify(p), { status: 200, headers: { "content-type": "application/json" } });
        }
    )
    .all(
        "/g/:id",
        async req => {
            if (req.params.id.search(/[\D]/) !== -1) return new Response("Invalid ID", { status: 400 })
            const p = await getProgram(req.params.id);
            if (p.status !== 200) return new Response("Not found", { status: 404 });
            return new Response(JSON.stringify(p), { status: p.status, headers: { "content-type": "application/json" } });
        }
    )
    .get(
        "/view",
        async req => {
            const id = req.query.p || req.query.id || req.query.program;

            if (!id) {
                return errorPage({ 
                    title: "Bad Request",
                    description: "No ID provided. Use 'p', 'id' or 'program' query parameter to provide the ID.",
                    status: 400
                });
            }

            if (id.search(/[\D]/) !== -1) {
                return errorPage({ 
                    title: "Bad Request",
                    description: "Invalid ID. Scratchpad IDs only include digits.", 
                    status: 400
                });
            }

            const program = getProgram(req.query.p);
            console.log(program)
            return newRender({
                title: "Viewing Program \""+program.title+"\" | KAP Archive",
                stylesheet: "/css/view.css",
                Main: View,
                props: { program }
            });
        }
    )
    .get(
        "/browse",
        async req => {
            let page = req.query.page || 1;
            return newRender({
                title: "Browse Projects | KAP Archive",
                stylesheet: "/css/home.css",
                Main: Browse,
                props: { page }
            });
        }
    )
    .all(
        "/add",
        async req => {
            const ids = (req.query?.ids || req.query?.id)?.match(/\d{6,}/g) || [];
            if (ids.length === 0) {
                return errorPage({
                    title: "Bad Request",
                    description: "400 Bad Request. No proper program IDs found.",
                    status: 400
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
            } catch (e) {
                console.error("Failed to save programs:", e);
                return errorPage({
                    title: "Bad Request",
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
        }
    )
    // !TODO: /search POST endpoint
    .get(
        "/search",
        async req => {
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
        }
    )
    .get(
        "/thumb/:id/latest.png", 
        req => {
            let db = new Database("database.sqlite", { readonly: true });
            let thumbURI = db.query("SELECT thumbnail FROM programs WHERE id = $id").get({ $id: req.params.id }).thumbnail;
            db.close();
            return new Response(parseDataURL(thumbURI), {headers: {"Content-Type": "image/png"}});
        }
    )
    .get("/js/:file", req => Bun.file("./js/"+req.params.file))
    .get("/css/:file", req => Bun.file("./css/"+req.params.file))
    .get("/scss/:file", req => Bun.file("./scss/"+req.params.file))
    .get("/assets/:file", req => Bun.file("./assets/"+req.params.file))
    .get("/favicon.ico", () => Bun.file("./assets/favicon.ico"))
    .get("/android-chrome-512x512.png", () => Bun.file("./assets/android-chrome-512x512.png"))
    .get("/android-chrome-192x192.png",() => Bun.file("./assets/android-chrome-192x192.png"))
    .get("/apple-touch-icon.png",() => Bun.file("./assets/apple-touch-icon.png"))
    .get("/favicon-16x16.png",() => Bun.file("./assets/favicon-16x16.png"))
    .get("/favicon-32x32.png",() => Bun.file("./assets/favicon-32x32.png"))
    .get("/site.webmanifest",() => Bun.file("./assets/site.webmanifest"))
    .all("*", () => {
        return errorPage({
            title: "404 Not found",
            description: "Page not found. Try something else.",
            status: 404
        });
    })
    .listen(5000);

export default {
    async fetch(request) {
        // Get Url and method from request.
        const { url, method } = request;
        // Get Url parameters
        const params = new URLSearchParams(url.split('?')[1]);
        // Get Pathname form url.
        const { pathname } = new URL(url);
        // /s/id endpoint
        if (pathname.match(/^\/s\/[a-z0-9-_\/:.]+/i)) {
            // Save the program
            let program = await saveProgram(pathname.split('/').reverse()[0]);
            // Handle errors
            if (program.status !== 200) {
                if (program.status === 404) {
                    program = await getProgram(pathname.split('/').reverse()[0]);
                    if (program.status === 200) {
                        program.status = 404;
                        program.message = "Program was NOT SAVED. This what we have in the database";
                        return new Response(JSON.stringify(program), {
                            status: 404, headers: { "content-type": "application/json" }})
                    }
                }
                // GUI error page
                if (method === 'GET') return renderError(program, request);
                // Non-GUI error message
                return new Response('Error: ' + program.message, {
                    status: program.status });
            }
            // Send the saved data
            return new Response(JSON.stringify(program), {
                status: 200,
                headers: { "content-type": "application/json" }});
        }
        // /g/id endpoint
        if (pathname.match(/^\/g\/[a-z0-9-_\/:.]+/i)) {
            // Get the program from the database and send it on it's way
            const program = await getProgram(pathname.split('/').reverse()[0]);
            return new Response(JSON.stringify(program), {
                status: program.status,
                headers: { "content-type": "application/json" }});
        }
        // /s/id and /g/id invalid ID catching endpoint
        if (pathname.match(/^\/(s|g)\/.+/i)) {
            // GUI error page
            if (method === 'GET') return renderError({ status: 400, message: 'Invalid Program ID' }, request);
            // Non-GUI error message
            return new Response('Error: Invalid program id', {
                status: 400 });
        }
        // /programs/limit/*offset endpoint
        if (pathname.match(/^\/programs\/[0-9]+(\/|([0-9]+|))(\/|)/i)) {
            // Split the pathname to get the limit and offset
            let splitPath = pathname.split('/')
            if (splitPath[splitPath.length-1] === '') splitPath.splice(-1, 1);
            // Get and send the programs
            return new Response(getPrograms(splitPath[2], Number(splitPath[3]) !== NaN ? splitPath[3] : 0), {
                headers: { "content-type": "application/json" }});
        }
        // /search?[title,author,created,etc.]
        if (pathname === "/search") {
            const data = queryPrograms(params);
            // Render and send the search page
            if (method === "GET" && !params.get('raw'))  return renderPage({
                    body: Search,
                    title: 'search Projects | KAP Archive',
                    stylesheet: '/css/home.css',
                    props: { programs: data }
                }, request);
            else return new Response(JSON.stringify(data), {
                headers: { "content-type": "application/json" }});
        }
        // GET only requests
        if (method === "GET") {
            // Program Thumbs
            if (pathname.match(/\/(thumb)\/\d+\/latest\.png/)) {
                var db = new Database('database.sqlite', { readonly: true });
                let $id = pathname.split("/")[2];
                let thumbURI = db.query("SELECT thumbnail FROM programs WHERE id = $id").get({$id}).thumbnail;
                db.close();
                console.log("Getting thumb BLOB from", $id);

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

                return new Response(parseDataURL(thumbURI), {headers: {"Content-Type": "image/png"}});
            }
            // Home page
            if (pathname === "/") return renderPage({
                    stylesheet: '/css/home.css',
                    body: Home
                }, request);
            // Any image in the assets folder
            if (pathname.match(/assets\/[a-z0-9-_]+\.(svg|png|jpeg|ico)/i) || pathname.match(/css\/[a-z0-9-_]+\.css/i)) {
                return new Response(Bun.file(pathname.slice(1)));
            }
            // Favicons
            if (pathname === "/favicon.ico")                return serveImage('assets/favicon.ico');
            if (pathname === "/android-chrome-512x512.png") return serveImage('assets/android-chrome-512x512.png');
            if (pathname === "/android-chrome-192x192.png") return serveImage('assets/android-chrome-192x192.png');
            if (pathname === "/apple-touch-icon.png")       return serveImage('assets/apple-touch-icon.png');
            if (pathname === "/favicon-16x16.png")          return serveImage('assets/favicon-16x16.png');
            if (pathname === "/favicon-32x32.png")          return serveImage('assets/favicon-32x32.png');
            if (pathname === "/site.webmanifest")           return new Response(Bun.file('assets/site.webmanifest'));
            // Javascript
            if (pathname === "/js/view-page.js")            return new Response(Bun.file("js/view-page.js"),{ headers: { "content-type": "application/javascript" }});
            if (pathname === "/js/searchForm.js")            return new Response(Bun.file("js/searchForm.js"),{ headers: { "content-type": "application/javascript" }});
            // Add page
            if (pathname === "/add") {
                return (async (params, request) => {
                    let props = {}; // Will be passed as props to the Add component
                    // Check if the program has either an id or ids URL parameter
                    if (params.has('ids') || params.has('id')) {
                        let ids;
                        // Get the program IDs from either the id or ids URL param
                        ids = params.get('ids');
                        if (!params.has('ids')) ids = params.get('id');
                        // Make sure there's actually program ids if not return an error page
                        if (!ids || ids.length === 0) return renderError({ status: 400, message: 'No program IDs given' }, request);
                        ids = ids.replace(/\r\n/g, '\n'); // Fix DOS new-lines
                        // Split any urls into IDs separated by a comma
                        // (so people can just drag a ton of urls in and not have to worry about separating them)
                        ids = ids.replace(/(http(s))(:)(\/\/)khanacademy.org\/[^\/]+\/[^\/]+\//gi, ',');
                        ids = ids.match(/[^,\n]+/gi); // Get array of IDs by splitting the string by commas and new-lines
                        // Remove duplicates
                        let duplicates = [], unique = []
                        for (var i = ids.length - 1; i >= 0; i--) {
                            for (var j = i - 1; j >= 0; j--) {
                                // console.log(i, j)Attempting to work, probably wont get Attempting to work, probably wont get messages. Ping me to try to get mAttempting to work, probably wont get messages. Ping me to try to get mmessages. Ping me to try to get m
                                if (ids[i] === ids[j]) {
                                    duplicates.push(ids[j]);
                                    ids.splice(j, 1);
                                }
                            }
                        }
                        // Save programs
                        const programs = await savePrograms(ids);
                        // Add duplicates back as error programs
                        for (let i in duplicates) {
                            let dupeText = '';
                            for (let j in programs) {
                                if (programs[j].id === duplicates[i]) {
                                    dupeText =` "${programs[j].title}" was input more than once.` ;
                                }
                            }
                            programs.unshift({
                                status: 400,
                                message: 'This is a duplicate' + dupeText,
                                id: duplicates[i]
                            });
                            ids.unshift(duplicates[i]);
                        }
                        // Sort programs so errors go first and add programs to props
                        programs.sort((a,b) => b.status - (a.status + b.message.length));
                        props.programs = programs;
                    }
                    // Render and return the add page
                    return await renderPage({ title: 'Results | KAP Archive', stylesheet: '/css/add.css', body: Add, props }, request);
                })(params, request)
            }
            // Browse page
            if (pathname === "/browse") {
                // Get the page number
                let page = 1;
                if (params.has('page')) page = params.get('page') || 1;
                // Render and send the browse page
                return renderPage({
                    body: Browse,
                    title: 'Browse Projects | KAP Archive',
                    stylesheet: '/css/home.css',
                    props: { page }
                }, request);
            }
            // View page
            if (pathname === "/view") {
                if (!params.has('p')) return renderError({ status: 500, message: "500 the url param p was given" }, request);
                const program = getProgram(params.get('p'));
                return renderPage({
                    body: View,
                    stylesheet: '/css/view.css',
                    title: "Viewing Program \""+program.title+'" | KAP Archive',
                    props: { program }
                }, request);
            }
            // GUI 404 page
            return renderError({ status: 404, message: '404 Not Found' }, request)
        }
        // NON-GUI 404 page
        return new Response('Error: 404 not found', { status: 404})
    },
}
