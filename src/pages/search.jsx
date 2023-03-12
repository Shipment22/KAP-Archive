import {getProgramsNoString} from '../libs/retrievePrograms';
import ProgramsGrid from '../components/programsGrid';
function Search(props) {
	const page = Number(props.page);
	// Make sure page isn't negative or NaN
	if (page < 0 || page == NaN) page = 0;
	// Get the next page's href
	const nextHref = "/browse?page=" + ((page || 1) + 1);
	return (
	<main className="Main">
		<h1>Search Programs</h1>
		<ProgramsGrid programs={props.programs}/>
	</main>
	);
}

export default Search;