import {getProgramsNoString} from '../libs/retrievePrograms';
import ProgramsGrid from '../components/programsGrid';
import SearchForm from '../components/searchForm';
function Search(props) {
	const page = Number(props.page);
	// Make sure page isn't negative or NaN
	if (page < 0 || page == NaN) page = 0;
	// Get the next page's href
	const nextHref = "/browse?page=" + ((page || 1) + 1);
	return (
	<main className="Main">
		<h1>Search Programs</h1>
		<div className="surface">
			<h2>Search again?</h2>
			<SearchForm/>
		</div>
		{props.programs.length > 0 ? (
			<div>
				<h2>Results</h2>
				<ProgramsGrid programs={props.programs}/>
			</div>
		) : (
			<div style={{paddingBlock: '3rem', minHeight: 'calc(100dvh - 72rem)'}}>
				<h2 className="red">No Programs Found</h2>
				<p>
					Maybe try searching again? Or if you think there's a problem with the KAP Archive you can report an <a href="https://github.com/shipment22/kap-archive/issues">issue on Github</a>.
				</p>
			</div>
		)}
		
	</main>
	);
}

export default Search;