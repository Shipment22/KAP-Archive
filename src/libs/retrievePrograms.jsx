import { Database } from "bun:sqlite"; // Import bun:sqlite
// Retrieve and return the program by id
function getProgram(id) { 
    // Load the database as readonly
    var db = new Database('database.sqlite', {
      readonly: true });
    // Create Queries for getting a program by id and getting multiple by index
    const retrieveById = db.query("SELECT * FROM programs WHERE id = $id");
    const output = formatOutput(retrieveById.get({ $id: id }));
    db.close();
    return output;
}
// Get programs without stringifying the output
function getProgramsNoString($limit = 50, $offset = 0) {
    // Load the database as readonly
    var db = new Database('database.sqlite', {
      readonly: true });
    // Create Queries for getting a program by id and getting multiple by index
    const retrievePrograms = db.query("SELECT * FROM programs ORDER BY archive__added DESC LIMIT $limit OFFSET $offset");
    if ($limit > 1000) $limit = 1000; // Make sure limit is under 1000
    $limit = Number($limit); $offset = Number($offset); // Make sure the limit and offset are numbers if they aren't return 400
    if ($limit === NaN || $offset === NaN) return 400;
    const archiveData = retrievePrograms.all({ $limit, $offset }); // Get data from archive
    for (let i in archiveData) { archiveData[i] = formatOutput(archiveData[i]); } // Structure the JSON
    return archiveData // Stringify and return the data
}
// Get programs stringified
function getPrograms() {
    return JSON.stringify(getProgramsNoString(...arguments))
}
// Query programs database (readonly)
function queryPrograms(params) {
    let data;
    try {
        // Load the database as readonly
        var db = new Database('database.sqlite', {
          readonly: true });

        const p = {
          id           :  params.get('id'),
          title        :  params.get('title'),
          author       :  params.get('author'),
          votes_min    :  params.get('votes_min'),
          votes_max    :  params.get('votes_max'),
          spinoffs_min :  params.get('spinoffs_min'),
          spinoffs_max :  params.get('spinoffs_max')
        };
        
        // Make sure at least one exists
        let oneOrMore = false;
        for (var i in p) {
          if (p[i] && p[i].match(/\S/)) {
            oneOrMore = true;
            console.log(p[i]);
            break;
          }
        }
        if (!oneOrMore) return data = [
          {
            noQuery: true
          }
        ];

        // Get the limit and set the default to 50 then the maximum to 1000
        let limit = params.get('limit');
        if (!limit) limit = 50;
        if (limit > 1000) limit = 1000;
        // Query the database for the data
        const n = 'null';
        data = db.query(`SELECT * FROM programs WHERE ($id = "null" OR id LIKE $id) 
            AND ($title = "%null%" OR title LIKE $title) 
            AND ($author = "%null%" OR author__nick LIKE $author OR author__name LIKE $author)
            AND ($votes_min = "null" OR votes > $votes_min)
            AND ($votes_max = "null" OR votes < $votes_max)
            AND ($spinoffs_min = "null" OR spinoffs > $spinoffs_min)
            AND ($spinoffs_max = "null" OR spinoffs < $spinoffs_max)
            LIMIT $limit`).all({
              $id           : p.id || n,
              $title        : `%${p.title || n}%`,
              $author       : `%${params.get('author') || n}%`,
              $votes_min    : p.votes_min || n,
              $votes_max    : p.votes_min || n,
              $spinoffs_min : p.spinoffs_min || n,
              $spinoffs_max : p.spinoffs_max || n,
              $limit        : limit
        });
        // Close the database when done
        db.close();

        // console.log(data)
        for (let i in data) {
            console.log(data[i].title)
        }
        // console.log(params.entries())

        // Format the JSON
        for (var i in data) {
            data[i] = formatOutput(data[i]);
        }
    } catch (e) {
        // Handle any errors
        const errMsg = 'Error while querying database (queryPrograms): ' + e;
        console.error(errMsg);
        return {
            status: 500,
            message: errMsg
        };
    }
    return data;
}
// function queryPrograms(query, format = true) {
//     let data;
//     try {
//         // Load the database as readonly
//         var db = new Database('database.sqlite', {
//           readonly: true });
//         // Qeury and close out of the database
//         data = db.query(query).all();
//         db.close();
//         if (format) {
//             // Format the JSON
//             for (var i in data) {
//                 data[i] = formatOutput(data[i]);
//             }
//         }
//     } catch (e) {
//         // Handle any errors
//         const errMsg = 'Error while querying database (queryPrograms): ' + e;
//         console.error(errMsg);
//         return {
//             status: 500,
//             message: errMsg
//         };
//     }
//     return data;
// }
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
    let {
        archive__added,
        archive__updated,
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
    } = sqliteOut;
    // Convert the origin sratchpad data back to an object
    if (origin_scratchpad) {
        const origin = origin_scratchpad.split('\n');
        origin_scratchpad = {
            id:       origin[0],
            title:    origin[1],
            deleted:  origin[2],
            official: origin[3]
        }
        // console.log('spinoff of: ' + JSON.stringify(origin_scratchpad))
    }
    // Format and return JSON data
    return {
        status: 200,
        message: 'Sucessfully formatted the database output',
        archive: {
            added: archive__added,
            updated: archive__updated
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

export {
  getProgram,
  getPrograms,
  getProgramsNoString,
  queryPrograms,
  formatOutput as formatProgramFromDatabase
};

export default getProgram;
