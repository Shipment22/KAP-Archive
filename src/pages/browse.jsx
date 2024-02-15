import { Database } from "bun:sqlite"; // Import bun:sqlite
import {getProgramsNoString} from '../libs/retrievePrograms';
import ProgramsGrid from '../components/programsGrid';
function Browse(props) {
	let page = Number(props.page);
	// Make sure page isn't negative or NaN
	if (page < 0 || page == NaN) page = 0; 

    const programsPerPage = 24;

    // Load the database as readonly to get the number of programs
    var db = new Database('database.sqlite', {
      readonly: true });
    const programsCount = db.query("SELECT COUNT (*) FROM programs").get()["COUNT (*)"];
    db.close();
    const pagesCount = Math.ceil(programsCount/programsPerPage);

	// Get the last and next page's href
	const lastHref = "/browse?page=" + ((page || 2) - 1);
	const nextHref = "/browse?page=" + ((page || 1) + 1);
    // Page switcher component
    function PageSwitcher() {
        return (
        <div style={{display: "flex", gap: ".5em", width: "100%"}}>
            {page > 1 ? <a className="button" style={{width: "100%", margin: 0, textAlign:"center"}} href={lastHref}>Last Page</a>:null}
            {page < pagesCount ? <a className="button" style={{width: "100%", margin: 0, textAlign:"center"}} href={nextHref}>Next Page</a>:null}
        </div>);
    }
	return (
        <main className="Main">
        	<h1>Browse Programs</h1>
            <div style={{display: "grid", gridTemplateColumns: "1fr 240px"}}>
                <h2 style={{margin: 0, padding: 0}}>Page {page || 1}</h2>
                <PageSwitcher />
            </div>
            <br />
        	<ProgramsGrid programs={getProgramsNoString(programsPerPage, (page-1 ?? 0) * programsPerPage)}/>
            <br />
            <PageSwitcher />
        </main>)
}

export default Browse;
