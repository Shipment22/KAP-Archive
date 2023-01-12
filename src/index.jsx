

import { renderToReadableStream } from "react-dom/server"

import Header from './header'
import Footer from './footer'
import ErrorPage from './error'
import Home from './home'
import Add from './add'

import saveAndRetrieve from './saveAndRetrieve.jsx'
const {
    getProgramThumbnail,
    insertProgram,
    saveProgram,
    savePrograms,
    formatOutput,
    retrieveById,
    retrievePrograms,
    getProgram,
    getPrograms
} = saveAndRetrieve


function checkLoggedin(request) {
    if (request.headers.get('cookie') === null || request.headers.get('cookie').match(/key=[^;]+/) === null) {
        return null
    }
    return (Bun.hash(request.headers.get('cookie').match(/key=[^;]+/)[0].slice(4)) === 62864701388280) ? "true" : null
}

async function renderPage(page, request) {
    const loggedIn = checkLoggedin(request)
    return new Response(
    await renderToReadableStream(
    <html>
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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
    ),
    );
}
async function renderError(error, request) {
    const loggedIn = checkLoggedin(request)
    return new Response(
    await renderToReadableStream(
    <html>
        <head>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{error + ' | KAP Archive'}</title>
            <link rel="stylesheet" href='/css/index.css'/>
        </head>
        <body>
            <Header loggedIn={loggedIn} />
            <ErrorPage error={error} />
            <Footer />
        </body>
    </html>,
    ),
    );
}
// Input a path and outputs a response with image headers
function serveImage(path) {
    return new Response(Bun.file(path), { headers: { "content-type": "image/"+path.split('.').reverse()[0] } });
}
export default {
    async fetch(request) {
        // Get Url and method from request.
        const { url, method } = request;
        // Get Pathname form url.
        const { pathname } = new URL(url);
        if (pathname.match(/^\/s\/[0-9]+/i)) {
            const program = await saveProgram(pathname.split('/').reverse()[0]);
            if (typeof program !== 'object') {
                if (method === 'GET') {
                    return renderError(program, request)
                } else {
                    return new Response('Error: ' + program, {
                        status: 404
                    })
                }
            }
            return new Response(JSON.stringify(program), {
                headers: { "content-type": "application/json" }
            })        } if (pathname.match(/^\/g\/[0-9]+/i)) {
            const program = await getProgram(pathname.split('/').reverse()[0])
            return new Response(JSON.stringify(program), {
                headers: { "content-type": "application/json" }
            })
        } else if (pathname.match(/^\/(s|g)\/[^\/]+/i)) {
            if (method === 'GET') {
                return renderError('Invalid Program ID', request)
            } else {
                return new Response('Error: Invalid program id', {
                    status: 400
                })
            }
        } else if (pathname.match(/^\/programs\/[0-9]+(\/|([0-9]+|))(\/|)/i)) {
            let splitPath = pathname.split('/')
            if (splitPath[splitPath.length-1] === '') {
                splitPath.splice(-1, 1)
            }
            console.log(splitPath)
            return new Response(getPrograms(splitPath[2], Number(splitPath[3]) !== NaN ? splitPath[3] : 0), {
                headers: { "content-type": "application/json" }
            })
        } else if (method === "GET") {
            if (pathname === "/favicon.ico") {
                return serveImage('assets/favicon.ico')
            } else if (pathname === "/android-chrome-512x512.png") {
                return serveImage('assets/android-chrome-512x512.png');
            } else if (pathname === "/android-chrome-192x192.png") {
                return serveImage('assets/android-chrome-192x192.png');
            } else if (pathname === "/apple-touch-icon.png") {
                return serveImage('assets/apple-touch-icon.png');
            } else if (pathname === "/favicon-16x16.png") {
                return serveImage('assets/favicon-16x16.png')
            } else if (pathname === "/favicon-32x32.png") {
                return serveImage('assets/favicon-32x32.png')
            } else if (pathname === "/site.webmanifest") {
                return new Response(Bun.file('assets/site.webmanifest'))
            } else if (pathname === "/add") {
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
                        if (!ids || ids.length === 0) return renderError('No program IDs given', request);
                        ids = ids.replace(/\r\n/g, '\n'); // Fix DOS new-lines
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
            } else if (pathname === "/") {
                return renderPage({ title: 'Khan Academy Program Archive', stylesheet: '/css/home.css', body: Home }, request)
            } else if (pathname.match(/assets\/[a-z0-9-_]+\.(svg|png|jpeg|ico)/i) || pathname.match(/css\/[a-z0-9-_]+\.css/i)) {
                return new Response(Bun.file(pathname.slice(1)))
            }
            return renderError('404 Not Found', request)
        }
        return new Response('Error: 404 not found', { status: 404})
    },
}