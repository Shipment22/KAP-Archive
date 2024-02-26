import SearchForm from "../components/searchForm";
import AddForm from "../components/addForm";
import ProgramsGrid from '../components/programsGrid';
import { getProgramsNoString } from '../libs/retrievePrograms';

function Page() {
    const programs = getProgramsNoString(12)
    return (
    <main className="Main">
        <h1>KAP Archive</h1>
        <div className="search surface">
            <h2>Search Programs</h2>
            <SearchForm />
        </div>
        <div className="add surface">
            <h2>Add Programs</h2>
            <AddForm />
        </div>
        <div className="recently-added">
            <h2>Recently Added</h2>
            <ProgramsGrid {programs}/>
            <br />
            <a className="button" style={{width: 100+'%',textAlign:'center',margin:'0'}} href="/browse">Browse Programs</a>
        </div>
    </main>
    );
}

export default Page
