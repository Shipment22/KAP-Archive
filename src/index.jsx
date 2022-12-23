import { Database } from "bun:sqlite"

let db = new Database('database.sqlite')
db.run(`CREATE TABLE IF NOT EXISTS programs 
    (db__id INTEGER PRIMARY KEY AUTOINCREMENT, 
    db__added INT,
    db__updated INT,
    created INT,
    updated INT, 
    id TEXT, 
    title TEXT, 
    code BLOB,
    folds BLOB,
    fork INT,
    key TEXT,
    upvoted INT,
    votes INT,
    spinoffs INT,
    type TEXT,
    width INT,
    height INT,
    flagged_by TEXT,
    user_flagged INT,
    flags TEXT,
    origin_scratchpad TEXT,
    hidden_from_hotlist INT,
    restricted_posting INT,
    by_child INT,
    author__nick TEXT,
    author__name TEXT,
    author__id TEXT,
    author__profile_access TEXT
    )`)
db.run(`CREATE TABLE IF NOT EXISTS users (db__id INTEGER PRIMARY KEY AUTOINCREMENT,
    db__added INT,
    db__updated INT,
    badge_counts TEXT,
    nick TEXT,
    name TEXT,
    id TEXT,
    bio TEXT,
    child INT,
    joined INT,
    energy_points INT,
    profile_access TEXT,
    videos_complete INT
    )`)

import { renderToReadableStream } from "react-dom/server"

import Header from './header'
import Footer from './footer'
import Home from './home'

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

export default {
    fetch(request) {
        // Get Url and method from request.
        const { url, method } = request;
        // Get Pathname form url.
        const { pathname } = new URL(url);
        // Get archive index html with file method.
        if (method === "GET") {
            if (pathname === "/favicon.ico") {
                return new Response(Bun.file('assets/favicon.ico'))
            } else if (pathname === "/") {
                return renderPage(pages.home, request)
            } else if (pathname.match(/assets\/[a-z0-9-_]+\.(svg|png|jpeg|ico)/i) || pathname.match(/css\/[a-z0-9-_]+\.css/i)) {
                return new Response(Bun.file(pathname.slice(1)))
            }
        }
        return new Response('404 not found', { status: 404})
    },
}