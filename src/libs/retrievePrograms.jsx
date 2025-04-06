import { Database } from "bun:sqlite"; // Import bun:sqlite
// Retrieve and return the program by id
function getProgram(id) { 
	// Load the database as readonly
	var db = new Database('database.sqlite', { readonly: true });
	// Create Queries for getting a program by id and getting multiple by index
	const retrieveById = db.query("SELECT * FROM programs WHERE id = $id");
	const output = formatOutput(retrieveById.get({ $id: id }));
	db.close();
	return output;
}
// Get programs without stringifying the output
function getProgramsNoString($limit = 50, $offset = 0) {
	// Load the database as readonly
	var db = new Database('database.sqlite', { readonly: true });
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
function newQueryPrograms({ limit, id, title, author, votes_min, votes_max, spinoffs_min, spinoffs_max, created_min, created_max, updated_min, updated_max, archive_added_min, archive_added_max, archive_updated_min, archive_updated_max }) {
    const db = new Database("database.sqlite", { readonly: true });

    limit = Math.min(Math.max(parseInt(limit ?? 50), 1), 1000);

    //console.log(...arguments)

    // !! NOT FINISHED

    // !TODO: Proper fuzzy search
    // !TODO: Input sanitization
    // !TODO: Search without all inputs filled (forum auto-fills with nulls)
    // !TODO: Only request some outputs
    // !TODO: Sort by options
    
    // First create an object to pass to db.query with only necessary keys.
    //  ^ Validate the data in this step.
    // Then create a query string based on Object.keys of that object.
    // Store sort by and max length separate, then add them to the query string.
    //

    let data = db.query(`SELECT * FROM programs WHERE 
        ($id = 0 OR $id LIKE id) AND
        (title LIKE $title) AND
        (author__nick LIKE $author OR author__name LIKE $author) AND
        (votes BETWEEN $votes_min AND $votes_max) AND
        (spinoffs BETWEEN $spinoffs_min AND $spinoffs_max) AND
        (created BETWEEN $created_min AND $created_max) AND
		    (updated BETWEEN $updated_min AND $updated_max) AND
		    (archive__added BETWEEN $archive_added_min AND $archive_added_max) AND
		    (archive__updated BETWEEN $archive_updated_min AND $archive_updated_max)
        `)
        .all({
            $id: id || 0,
            $title: "%"+title?.split("").join("%")+"%",
            $author: "%"+author?.split("").join("%")+"%",
            $votes_min: +votes_min ?? 0,
            $votes_max: +votes_max || Infinity,
            $spinoffs_min: +spinoffs_min ?? 0,
            $spinoffs_max: parseInt(spinoffs_max) !== 0 ? (+spinoffs_max || Infinity) : 0, // Special treatment becuast of negative spin-off glitch
            $created_min: Date.parse(created_min) || 0,
            $created_max: Date.parse(created_max) || Infinity,
            $updated_min: Date.parse(updated_min) || 0,
            $updated_max: Date.parse(updated_max) || Infinity,
            $archive_added_min: Date.parse(archive_added_min) || 0,
            $archive_added_max: Date.parse(archive_added_max) || Infinity,
            $archive_updated_min: Date.parse(archive_updated_min) || 0,
            $archive_updated_max: Date.parse(archive_updated_max) || Infinity,
        });

    
	// Restruecture before returning
	for (let i in data) data[i] = formatOutput(data[i]);

    //console.log("data",data)

    return data;
}
// Query programs database (readonly)
function queryPrograms(params) {
	let data;
	try {
		// Load the database as readonly
		var db = new Database('database.sqlite', { readonly: true });
		
		// Make sure there is at least one query parameter, excluding the one to differentiate between normal and raw search
		if (Array.from(params.values()).slice(0,-1).join('').length < 1) return data = [{ noQuery: true } ];

		// Defualt limit to 50 and max it at 1000
		let limit = params.get('limit') || 50;
		if (limit > 1000) limit = 1000;

		function parseDate(d) {
			return typeof d === "number" ? d : Date.parse(d);
		}

		data = db.query(`SELECT * FROM programs 
			WHERE ($id = "null" OR id LIKE $id) 
			AND (title LIKE $title) 
			AND (author__nick LIKE $author OR author__name LIKE $author)
			AND (votes BETWEEN $votes_min AND $votes_max)
			AND (spinoffs BETWEEN $spinoffs_min AND $spinoffs_max)
			
			AND (created BETWEEN $created_min AND $created_max)
			AND (updated BETWEEN $updated_min AND $updated_max)
			AND (archive__added BETWEEN $archive_added_min AND $archive_added_max)
			AND (archive__updated BETWEEN $archive_updated_min AND $archive_updated_max)

			LIMIT $limit`).all({
				$id           : params.get('id') || "null",
				$title        : "%"+params.get('title').split("").join("%")+"%",
				$author       : "%"+params.get('author').split("").join("%")+"%",
				$votes_min    : params.get('votes_min') || 0,
				$votes_max    : params.get('votes_max') || Infinity,
				$spinoffs_min : params.get('spinoffs_min') || 0,
				$spinoffs_max : params.get('spinoffs_max') || Infinity,
				$created_min : parseDate(params.get('created_min')) || 0,
				$created_max : parseDate(params.get('created_max')) || Infinity,
				$updated_min : parseDate(params.get('updated_min')) || 0,
				$updated_max : parseDate(params.get('updated_max')) || Infinity,
				$archive_added_min : parseDate(params.get('archive_added_min')) || 0,
				$archive_added_max : parseDate(params.get('archive_added_max')) || Infinity,
				$archive_updated_min : parseDate(params.get('archive_updated_min')) || 0,
				$archive_updated_max : parseDate(params.get('archive_updated_max')) || Infinity,
				$limit        : limit
		});
		// Close the database when done
		db.close();

		// Format the JSON
		for (var i in data) data[i] = formatOutput(data[i]);
	} catch (e) {
		// Handle any errors
		const errMsg = 'Error while querying database (queryPrograms): ' + e;
		console.error(errMsg);
		return { status: 500, message: errMsg };
	}
	return data;
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
	let {
		archive__added,
		archive__updated,
		archive__source_deleted,
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
			updated: archive__updated,
			sourceDeleted: !!archive__source_deleted
		},
		id,
		created,
		updated,
		title,
		code,
		folds,
		thumbnail,
		fork: !!fork,
		key,
		votes,
		spinoffs,
		type,
		width,
		height,
		userFlagged: !!user_flagged,
		originScratchpad: origin_scratchpad,
		hiddenFromHotlist: !!hidden_from_hotlist,
		restrictedPosting: !!restricted_posting,
		byChild: !!by_child,
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
  newQueryPrograms,
  formatOutput as formatProgramFromDatabase
};

export default getProgram;
