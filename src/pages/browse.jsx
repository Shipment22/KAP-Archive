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
        <div style={{display: "flex", gap: ".5em", width: "auto", minWidth: "min(400px, 100%)" }}>
            {page > 1 ? <a className="button" style={{width: "100%", margin: 0, textAlign:"center"}} href={lastHref}>Last Page</a>:null}
            <form style={{ display: "flex" }}>
                <input type="number" name="page" defaultValue={page||1} min="1" max={pagesCount||""} title="Page Number" className="input" style={{ width: "80px", marginBlock:0 }} />
                <input type="submit" value="Go" className="button" style={{ marginBlock:0 }}/>
            </form>
            {page < pagesCount ? <a className="button" style={{width: "100%", margin: 0, textAlign:"center"}} href={nextHref}>Next Page</a>:null}
        </div>);
    }
	return (
        <main className="Main">
        	<h1>Browse Programs</h1>
            <div className="surface">
                <div style={{display: "flex", flexWrap: "wrap", gap: "1rem", gridTemplateColumns: "1fr 400px"}}>
                    <h2 style={{margin: 0, marginRight: "auto", padding: 0 }}>Page {page || 1} of {pagesCount || "err"}</h2>
                    <PageSwitcher />
                </div>
                <br />
        	    <ProgramsGrid programs={getProgramsNoString(programsPerPage, (page-1 ?? 0) * programsPerPage)}/>
                <br />
                <PageSwitcher />
                </div>
        </main>)
}

export default Browse;
