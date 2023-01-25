import { renderToReadableStream } from "react-dom/server";
// Import page components
import Header from './components/header';
import Footer from './components/footer';
// Import pages
import ErrorPage from './pages/error';
import Home from './pages/home';
import Add from './pages/add';
import Browse from './pages/browse';
// Import library functions for saving and retrieving
import { saveProgram, savePrograms } from './libs/archivePrograms.jsx';
import { getProgram, getPrograms, getProgramsNoString } from './libs/retrievePrograms.jsx';

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
              content={ page.description || `KAP Archive is a site for archiving programs from Khan's 
                       CS section. The programs on Khan's CS section often get 
                       hidden or deleted even when they follow the Khan Guidelines,
                       that's why KAP Archive is here to save the programs and your time.
                       :)` } />
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
    ),);
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
              '  If you think there\'s a problem with the site feel free to make an issue on Github.'} />
            <meta name="theme-color" content="#11111A"/>
            <title>{error.message + ' | KAP Archive'}</title>
            <link rel="stylesheet" href='/css/index.css'/>
        </head>
        <body>
            <Header loggedIn={loggedIn} />
            <ErrorPage error={error.message} />
            <Footer />
        </body>
    </html>,
    ), { status: error.status });
}
function serveImage(path) {
    // Sends an image with headers based on the provided path
    return new Response(Bun.file(path), { 
        headers: { "content-type": "image/"+path.split('.').reverse()[0] } });
}
export default {
    async fetch(request) {
        // Get Url and method from request.
        const { url, method } = request;
        // Get Pathname form url.
        const { pathname } = new URL(url);
        // /s/id endpoint
        if (pathname.match(/^\/s\/[a-z0-9-_\/:.]+/i)) {
            // Save the program
            const program = await saveProgram(pathname.split('/').reverse()[0]);
            // Handle errors
            if (program.status !== 200) {
                // GUI error page
                if (method === 'GET') return renderError(program, request);
                // Non-GUI error message
                return new Response('Error: ' + program.message, {
                    status: program.status });
            }
            // Send the saved data
            return new Response(JSON.stringify(program), {
                headers: { "content-type": "application/json" }});       
        }
        // /g/id endpoint
        if (pathname.match(/^\/g\/[a-z0-9-_\/:.]+/i)) {
            // Get the program from the database and send it on it's way
            const program = await getProgram(pathname.split('/').reverse()[0]);
            return new Response(JSON.stringify(program), { 
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
        // GET only requests
        if (method === "GET") {
            // Home page
            if (pathname === "/") return renderPage({ title: 'Khan Academy Program Archive', stylesheet: '/css/home.css', body: Home }, request);
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
            // Add page
            if (pathname === "/add") {
                const params = URLSearchParams(url.split('?')[1]) // Get URL parameters
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
                                // console.log(i, j)
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
                const params = URLSearchParams(url.split('?')[1]) // Get URL parameters
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
            // GUI 404 page
            return renderError({ status: 404, message: '404 Not Found' }, request)
        }
        // NON-GUI 404 page
        return new Response('Error: 404 not found', { status: 404})
    },
}