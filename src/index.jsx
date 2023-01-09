

import { renderToReadableStream } from "react-dom/server"

import Header from './header'
import Footer from './footer'
import ErrorPage from './error'
import Home from './home'

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

const pages = {
    home: { title: 'Khan Academy Program Archive', stylesheet: '/css/home.css', body: Home }
}
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
            <page.body />
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
            console.log(program)
            if (typeof program !== 'object') {
                if (method === 'GET') {
                    return renderError('Program not found', request)
                } else {
                    return new Response('Error: Program not found', {
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
                const params = URLSearchParams(url.split('?')[1])
                return (async params => {
                    return new Response(JSON.stringify(await savePrograms(params.get('ids').match(/[0-9]+(\n|,|)/gi))), {
                        headers: { 'content-type': 'application/json' }
                    })
                })(params)
            } else if (pathname === "/") {
                return renderPage(pages.home, request)
            } else if (pathname.match(/assets\/[a-z0-9-_]+\.(svg|png|jpeg|ico)/i) || pathname.match(/css\/[a-z0-9-_]+\.css/i)) {
                return new Response(Bun.file(pathname.slice(1)))
            }
            return renderError('404 Not Found', request)
        }
        return new Response('Error: 404 not found', { status: 404})
    },
}