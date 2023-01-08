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
    thumbnail BLOB,
    fork INT,
    "key" TEXT,
    votes INT,
    spinoffs INT,
    type TEXT,
    width INT,
    height INT,
    user_flagged INT,
    origin_scratchpad TEXT,
    hidden_from_hotlist INT,
    restricted_posting INT,
    by_child INT,
    author__nick TEXT,
    author__name TEXT,
    author__id TEXT,
    author__profile_access TEXT
    )`)
let programColumnsListText = 'db__added, db__updated, created, updated, id, title, code, folds, thumbnail, fork, "key", votes, spinoffs, type, width, height, user_flagged, origin_scratchpad, hidden_from_hotlist, restricted_posting, by_child, author__nick, author__name, author__id, author__profile_access'
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
import ErrorPage from './error'
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
async function getProgramThumbnail(id) {
    return await fetch(`https://www.khanacademy.org/computer-programming/_/${id}/latest.png`)
    .then(async response => {return { mime: response.headers.get('content-type'), buffer: await response.arrayBuffer() }})
    .then(data => {
        const base64 = Buffer.from(Array.from(new Uint8Array(data.buffer)).map(c => String.fromCharCode(c)).join(''), 'binary').toString('base64')
        return `data:${data.mime};base64,${base64}`
    })
}
const insertProgram = db.prepare(`INSERT INTO programs (${programColumnsListText}) VALUES (${('?'.repeat(programColumnsListText.split(',').length).split('').join(', '))})`)
async function saveProgram(id) {
    if (id.match(/[0-9]+/) === null) {
        return 'Invalid ID'
    }
    const programData = await fetch("https://www.khanacademy.org/api/internal/graphql/programQuery?lang=en", {
        "credentials": "include",
        "headers": {
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "content-type": "application/json",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "Sec-GPC": "1"
        },
        "referrer": "https://www.khanacademy.org/computer-programming/i/"+id,
        "body": "{\"operationName\":\"programQuery\",\"query\":\"query programQuery($programId: String!) {\\n  programById(id: $programId) {\\n    byChild\\n    category\\n    created\\n    creatorProfile: author {\\n      id\\n      nickname\\n      profileRoot\\n      profile {\\n        accessLevel\\n        __typename\\n      }\\n      __typename\\n    }\\n    deleted\\n    description\\n    spinoffCount: displayableSpinoffCount\\n    docsUrlPath\\n    flags\\n    flaggedBy: flaggedByKaids\\n    flaggedByUser: isFlaggedByCurrentUser\\n    height\\n    hideFromHotlist\\n    id\\n    imagePath\\n    isProjectOrFork: originIsProject\\n    isOwner\\n    kaid: authorKaid\\n    key\\n    newUrlPath\\n    originScratchpad: originProgram {\\n      deleted\\n      translatedTitle\\n      url\\n      __typename\\n    }\\n    restrictPosting\\n    revision: latestRevision {\\n      id\\n      code\\n      configVersion\\n      created\\n      editorType\\n      folds\\n      __typename\\n    }\\n    slug\\n    sumVotesIncremented\\n    title\\n    topic: parentCurationNode {\\n      id\\n      nodeSlug: slug\\n      relativeUrl\\n      slug\\n      translatedTitle\\n      __typename\\n    }\\n    translatedTitle\\n    url\\n    userAuthoredContentType\\n    upVoted\\n    width\\n    __typename\\n  }\\n}\\n\",\"variables\":{\"programId\":\""+id+"\"}}",
        "method": "POST",
        "mode": "cors"
    }).then(res => res.json())
    .then(json => json.data.programById)
    .then(async p => {
        return {
            archive: {
                added: Date.now(), // needs to be fixed for when archives can be updated 
                updated: Date.now()
            },
            created: new Date(p.created).getTime(),
            updated: 404,
            id: p.id,
            title: p.title,
            code: p.revision.code,
            folds: p.revision.folds,
            thumbnail: await getProgramThumbnail(p.id),
            fork: p.isProjectOrFork,
            key: p.key,
            votes: p.sumVotesIncremented,
            spinoffs: p.spinOffCount,
            type: p.userAuthoredContentType,
            width: p.width,
            height: p.height,
            userFlagged: p.flaggedByUser,
            originScratchpad: p.originScratchpad,
            hiddenFromHotlist: p.hideFromHotlist,
            restrictedPosting: p.restrictPosting,
            byChild: p.byChild,
            author: {
                nick: p.creatorProfile.nickname,
                name: p.creatorProfile.profileRoot.split('/').reverse()[1],
                id: p.creatorProfile.kaid,
                profileAccess: p.creatorProfile.profile.accessLevel,
            }
        }
    });
    (d => {insertProgram.run([
        d.archive.added,
        d.archive.updated,
        d.created,
        d.updated,
        d.id,
        d.title,
        d.code + '',
        d.folds + '',
        d.thumbnail,
        d.fork,
        d.key,
        d.votes,
        d.spinoffs,
        d.type,
        d.width,
        d.height,
        d.userFlagged,
        d.originScratchpad,
        d.hiddenFromHotlist,
        d.restrictedPosting,
        d.byChild,
        d.author.nick,
        d.author.name,
        d.author.id,
        d.author.profileAccess
    ])})(programData)
    return programData
}
function formatOutput(sqliteOut) {
    const {
        db__id,
        db__added,
        db__updated,
        id,
        created,
        updated,
        title,
        code,
        folds,
        thumbnail,
        fork,
        key,
        votes,
        spinoffs,
        type,
        width,
        height,
        user_flagged,
        origin_scratchpad,
        hidden_from_hotlist,
        restricted_posting,
        by_child,
        author__nick,
        author__name,
        author__id,
        author__profile_access
    } = sqliteOut
    return {
        archive: {
            id: db__id,
            added: db__added,
            updated: db__updated
        },
        id,
        created,
        updated,
        title,
        code,
        folds,
        thumbnail,
        fork: fork === 1,
        key,
        votes,
        spinoffs,
        type,
        width,
        height,
        userFlagged: user_flagged === 1,
        originScratchpad: origin_scratchpad,
        hiddenFromHotlist: hidden_from_hotlist === 1,
        restrictedPosting: restricted_posting === 1,
        byChild: by_child === 1,
        author: {
            nick: author__nick,
            name: author__name,
            id: author__id,
            profileAccess: author__profile_access
        }
    };
}
// Create Queries for getting a program by id and getting multiple by index
const retrieveById = db.query("SELECT * FROM programs WHERE id = $id"), 
      retrievePrograms = db.query("SELECT * FROM programs LIMIT $limit OFFSET $offset");
function getProgram(id) { return formatOutput(retrieveById.get({ $id: id })); } // Retrieve and return the program by id
function getPrograms($limit, $offset = 0) {
    $limit = Number($limit); $offset = Number($offset); // Make sure the limit and offset are numbers if they aren't return 400
    if ($limit === NaN || $offset === NaN) return 400;
    const archiveData = retrievePrograms.all({ $limit, $offset }); // Get data from archive
    for (let i in archiveData) { archiveData[i] = formatOutput(archiveData[i]); } // Structure the JSON
    return JSON.stringify(archiveData); // Stringify and return the data
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
            return new Response(JSON.stringify(await saveProgram(pathname.split('/').reverse()[0])), {
                headers: { "content-type": "application/json" }
            })
        } if (pathname.match(/^\/g\/[0-9]+/i)) {
            return new Response(JSON.stringify(await getProgram(pathname.split('/').reverse()[0])), {
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
        } else if (pathname.match(/\/programs\/[0-9]+(\/|([0-9]+|))(\/|)/i)) {
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