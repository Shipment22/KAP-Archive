import { Database } from "bun:sqlite";
import { getProgram } from "./retrievePrograms";

let db = new Database('database.sqlite');

const 
insertProgram = db.prepare(`INSERT INTO programs VALUES (?${',?'.repeat(24)})`),
programColumnsListText = 'archive__added, archive__updated, created, updated, id, title, code, folds, thumbnail, fork, "key", votes, spinoffs, type, width, height, user_flagged, origin_scratchpad, hidden_from_hotlist, restricted_posting, by_child, author__nick, author__name, author__id, author__profile_access',
// insertProgram = db.prepare(`INSERT INTO programs (${programColumnsListText}) VALUES (${('?'.repeat(programColumnsListText.split(',').length).split('').join(', '))})`),
updateProgram = db.prepare(`UPDATE programs SET 
archive__updated = $archive__updated,
updated = $updated, 
title = $title, 
code = $code,
folds = $folds,
thumbnail = $thumbnail,
votes = $votes,
spinoffs = $spinoffs,
width = $width,
height = $height,
user_flagged = $user_flagged,
hidden_from_hotlist = $hidden_from_hotlist,
restricted_posting = $restricted_posting,
author__nick = $author__nick,
author__name = $author__name,
author__profile_access = $author__profile_access
WHERE id = $id`)
const getProgramThumbnail = async id => {
	// Fetch thumbnail turn it into base64 and return it
	return await fetch("https://www.khanacademy.org/computer-programming/_/" + id + "/latest.png")
	.then(async response => {return { mime: response.headers.get('content-type'), buffer: await response.arrayBuffer() }})
    .then(data => {
        const base64 = Buffer.from(Array.from(new Uint8Array(data.buffer)).map(c => String.fromCharCode(c)).join(''), 'binary').toString('base64')
        return `data:${data.mime};base64,${base64}`
    });
};
const saveProgram = async id => {
	id = id.replace(/[\s,"[\]{}]/g,''); // Remove any whitespace, commas, quotation marks, and brackets
	// Remove anything from a URL that's not the id
	console.log(id)
	id = id.replace(/http(s|):\/\/([a-z0-9]+\.|)khanacademy\.org\/[^\/]+\/[^\/]+\//gi, '');
	id = id.replace(/\/[^/]+\.png/gi, ''); 		// For things like /latest.png
	id = id.replace(/\?.+/gi, ''); 	// For URL params
	if (id.match(/\D/g)) {
		// If the ID contains anything other than digit return an invalid program error
		return {
			status: 400,
			message: 'Invalid program ID',
			id, severe: true
		};
	}
	// Fetch the program data from Khan Academy
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
    	if (!p) {
    		// If no data was recieved return an error message
    		return {
    			status: 404,
    			message: 'Program not found',
    			id, severe: true
    		};
    	}
		// Return the program data
		return {
			status: 200,
			message: 'Data retrieved from Khan',
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
    // If there's an error return
    if (programData.status >= 300) return programData;
    // Check if the program exists in the database already
    const oldData = await getProgram(id);
    if (oldData.status < 300) {
    	try {
	    	// The timeout is to avoid calling update and qeury on the table at the same time
	        setTimeout(() => {
	    		// If it does exist update it
	        	const d = programData;
	        	updateProgram.run({
		            $archive__updated: d.archive.updated, $updated: d.updated,
		            $title: d.title, $code: String(d.code), $folds: String(d.folds),
		            $thumbnail: d.thumbnail, $votes: d.votes, $spinoffs: d.spinoffs,
		            $width: d.width, $height: d.height, $user_flagged: d.userFlagged,
		            $hidden_from_hotlist: d.hiddenFromHotlist,
		            $restricted_posting: d.restrictedPosting,
		            $author__nick: d.author.nick, $author__name: d.author.name,
		            $author__profile_access: d.author.profileAccess
	        	})
	        }, 10);
    	} catch(e) {
    		// Catch any errors
    		return {
    			status: 500,
    			message: 'Error while updating program. ' + e,
    			id, severe: true
    		}
    	}
    } else {
	    try {
	    	// Destructure and insert the data into the database
		    (d => {
		    	insertProgram.run([ 
		    		d.archive.added, d.archive.updated, d.created, d.updated, d.id, 
		    		d.title, String(d.code), String(d.folds), d.thumbnail, d.fork, 
		    		d.key, d.votes, d.spinoffs, d.type, d.width, d.height, 
		    		d.userFlagged, d.originScratchpad, d.hiddenFromHotlist, 
		    		d.restrictedPosting, d.byChild, d.author.nick, d.author.name,
			        d.author.id, d.author.profileAccess
		    	]);
		    })(programData);
    	} catch(e) {
    		// Catch any errors
    		return {
    			status: 500,
    			message: 'Error while saving program. ' + e,
    			id, severe: true
    		}
    	}
    }
    return programData; // Return the saved data
};
const savePrograms = async ids => {
	// Create an array to hold the data, loop through the ids and add the data to the array
	const data = new Array(ids.length);
	for (let i in ids) data[i] = await saveProgram(ids[i]);
	return data;
};
export {
	saveProgram,
	savePrograms
};
export default saveProgram;