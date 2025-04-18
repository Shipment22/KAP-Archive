import Database from "bun:sqlite";
import SearchForm from "../components/searchForm";
import AddForm from "../components/addForm";
import ProgramsGrid from '../components/programsGrid';
import { getProgramsNoString } from '../libs/retrievePrograms';

function Page() {
    const programs = getProgramsNoString(12)

    // Load the database as readonly to get the number of programs
    var db = new Database('database.sqlite', {
        readonly: true });
      let programsCount = db.query("SELECT COUNT (*) FROM programs").get()["COUNT (*)"];
      let authorsCount = db.query("SELECT DISTINCT author__id FROM programs").all().length;
      db.close()

    return (
    <main className="Main">
        <h1>KAP Archive</h1>
        <div className="surface">
            <h2>About</h2>
            <p>
                KAP Archive is an archival site that exists to preserve code from hidden/deleted programs and banned users on KACP.
                This project is in no way offiliated with or endoresed by Khan Academy®. 
                For more information check out the <a href="https://github.com/Shipment22/KAP-Archive">Github Repo</a>.
            </p>
            <p>
                We have archived <strong>{programsCount}</strong> programs from <strong>{authorsCount}</strong> authors, so far!
            </p>
        </div>
        <div className="add surface">
            <h2>Add Programs</h2>
            <AddForm />
        </div>
        <div className="surface">
            <h2>Most Voted</h2>
            <ProgramsGrid { programs }/>
            <br />
            <a className="button" style={{width: 100+'%',textAlign:'center',margin:'0'}} href="/browse">Browse Programs</a>
        </div>
    </main>
    );
}

export default Page
