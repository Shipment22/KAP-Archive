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
db.run('CREATE TABLE IF NOT EXISTS program_hashes (db__id INTEGER PRIMARY KEY AUTOINCREMENT, hash TEXT)')

async function getProgramThumbnail(id) {
    return await fetch(`https://www.khanacademy.org/computer-programming/_/${id}/latest.png`)
    .then(async response => {return { mime: response.headers.get('content-type'), buffer: await response.arrayBuffer() }})
    .then(data => {
        const base64 = Buffer.from(Array.from(new Uint8Array(data.buffer)).map(c => String.fromCharCode(c)).join(''), 'binary').toString('base64')
        return `data:${data.mime};base64,${base64}`
    })
}
const insertProgram = db.prepare(`INSERT INTO programs (${programColumnsListText}) VALUES (${('?'.repeat(programColumnsListText.split(',').length).split('').join(', '))})`),
      updateProgram = db.prepare(`UPDATE programs SET 
        db__updated = $archiveUpdated,
        updated = $updated, 
        title = $title, 
        code = $code,
        folds = $folds,
        thumbnail = $thumbnail,
        votes = $votes,
        spinoffs = $spinoffs,
        width = $width,
        height = $height,
        user_flagged = $userFlagged,
        hidden_from_hotlist = $hiddenFromHotlist,
        restricted_posting = $restrictedPosting,
        author__nick = $nick,
        author__name = $name,
        author__profile_access = $profileAccess
        WHERE id = $id`)
/*
 * Name:   saveProgram
 * Input:  Program ID
 * Output: A JSON variant of the data it saved
*/
async function saveProgram(id) {
    id = id.replace(/[,\n]/gi,'') // Remove any spaces or newlines
    // Change program URLs to program IDs
    id = id.replace(/http(s|):\/\/[a-z0-9]+\.khanacademy\.org\/(computer-programming|cs)\/[a-z0-9-_]+\//g, '')
    // Make sure the id only has digets if not return
    if (id.match(/[0-9]+/) === null) {
        return { status: 400, message: 'Invalid program ID', id, severe: true }
    }
    // Fetch the program
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
        if (!p) return 404; // If the expected data doesn't exist return 404
        // Return the program data
        return {
            status: 200,
            message: 'Data seems to be good',
            archive: {
                added: Date.now(),
                updated: Date.now()
            },
            created: new Date(p.created).getTime(),
            updated: new Date(p.revision.created).getTime(),
            id: p.id,
            title: p.title,
            code: p.revision.code,
            folds: p.revision.folds,
            thumbnail: await getProgramThumbnail(p.id),
            fork: p.isProjectOrFork,
            key: p.key,
            votes: p.sumVotesIncremented,
            spinoffs: p.spinoffCount,
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
    // Check if the program was found if not return an error message
    if (programData === 404) return { status: 404, message: 'Program not found', id, severe: true }; 
    // Check if the program exists in the database and if it does update it
    const oldData = getProgram(id)
    if (typeof oldData === 'object') {
        (d => {updateProgram.run({
            $archiveUpdated: d.archive.updated,
            $updated: d.updated,
            $title: d.title,
            $code: d.code + '',
            $folds: d.folds + '',
            $thumbnail: d.thumbnail,
            $votes: d.votes,
            $spinoffs: d.spinoffs,
            $width: d.width,
            $height: d.height,
            $userFlagged: d.userFlagged,
            $hiddenFromHotlist: d.hiddenFromHotlist,
            $restrictedPosting: d.restrictedPosting,
            $nick: d.author.nick,
            $name: d.author.name,
            $profileAccess: d.author.profileAccess
        })})(programData)
        programData.archive.added = oldData.archive.added
        return programData
    }
    // Destructure the data, insert it to the database, and return it
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
/*
 * Name:   savePrograms
 * Input:  Array, a list of program IDs
 * Output: Array, the JSON data for each program that it saved
*/
async function savePrograms(ids) {
    let data = new Array(ids.length)                 // Create a new array to hold all the data
    for (let i in ids) {
        const programData = await saveProgram(ids[i])// Get the data for each program
        data[i] = programData                        // Add the program data to the data array
    }
    return data                                      // Output all of the program data
}
function formatOutput(sqliteOut) {
    if (!sqliteOut) return "Error: Recieved no data from the database"
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
        status: 200,
        message: 'Sucessfully formatted the database output',
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
function getProgramsNoString($limit = 50, $offset = 0) {
    if ($limit > 1000) $limit = 1000; // Make sure limit is under 1000
    $limit = Number($limit); $offset = Number($offset); // Make sure the limit and offset are numbers if they aren't return 400
    if ($limit === NaN || $offset === NaN) return 400;
    const archiveData = retrievePrograms.all({ $limit, $offset }); // Get data from archive
    for (let i in archiveData) { archiveData[i] = formatOutput(archiveData[i]); } // Structure the JSON
    return archiveData // Stringify and return the data
}
function getPrograms(limit, offset) {
    return JSON.stringify(getProgramsNoString(limit, offset))
}

export default ({
    getProgramThumbnail,
    insertProgram,
    saveProgram,
    savePrograms,
    formatOutput,
    retrieveById,
    retrievePrograms,
    getProgram,
    getProgramsNoString,
    getPrograms
})