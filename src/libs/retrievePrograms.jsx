import { Database } from "bun:sqlite"; // Import bun:sqlite
// Load the database as readonly
const db = new Database('database.sqlite', {
  readonly: true
});
// Create Queries for getting a program by id and getting multiple by index
const retrieveById = db.query("SELECT * FROM programs WHERE id = $id"), 
      retrievePrograms = db.query("SELECT * FROM programs ORDER BY db__added DESC LIMIT $limit OFFSET $offset");
// Retrieve and return the program by id
function getProgram(id) { return formatOutput(retrieveById.get({ $id: id })); } 
// Get programs without stringifying the output
function getProgramsNoString($limit = 50, $offset = 0) {
    if ($limit > 1000) $limit = 1000; // Make sure limit is under 1000
    $limit = Number($limit); $offset = Number($offset); // Make sure the limit and offset are numbers if they aren't return 400
    if ($limit === NaN || $offset === NaN) return 400;
    const archiveData = retrievePrograms.all({ $limit, $offset }); // Get data from archive
    for (let i in archiveData) { archiveData[i] = formatOutput(archiveData[i]); } // Structure the JSON
    return archiveData // Stringify and return the data
}
// Get programs stringified
function getPrograms() {
    return JSON.stringify(getProgramsNoString(...args))
}
// Take in the output from the sqlite database and retern a formatted JSON version
function formatOutput(sqliteOut) {
    // Make sure there's an sqlite output
    if (!sqliteOut)  {
      return {
        status: 500,
        severe: true,
        message: "Error: Recieved no data from the database"
      }
    }
    // Get variables from sqlite data
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
    // Format and return JSON data
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

export default {
  getProgram,
  getPrograms,
  getProgramsNoString,
  formatProgramFromDatabase: formatOutput
}
