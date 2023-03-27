import {getProgramsNoString} from '../libs/retrievePrograms';
import ProgramsGrid from '../components/programsGrid';
import SearchForm from '../components/searchForm';
function Search(props) {
	const page = Number(props.page);
	// Make sure page isn't negative or NaN
	if (page < 0 || page == NaN) page = 0;
	// Get the next page's href
	const nextHref = "/browse?page=" + ((page || 1) + 1);
  if (props.programs[0] && props.programs[0].noQuery) {
    return (
  <main className="Main">
    <h1>Search Programs</h1>
    {/* The search form with a message at the top asking you to search again */}
		<div className="surface">
			<h2>Search the archive here!</h2>
			<SearchForm/>
		</div>
</main>
    );
  }
	return (
	<main className="Main">
		<h1>Search Programs</h1>
		{/* The search form with a message at the top asking you to search again */}
		<div className="surface">
			<h2>Search again?</h2>
			<SearchForm/>
		</div>
		{/* When props.programs.length is less than 0 display a message telling you that */}
		{props.programs.length > 0 ? (
			// Display any results found
			<div>
				<h2>Results</h2>
				<ProgramsGrid programs={props.programs}/>
			</div>
		) : (
			<div style={{
					paddingBlock: '3rem', 			  /* Padding for visual appeal */
					minHeight: 'calc(100dvh - 72rem)' /* Keep the page at the mostly right height */
				}}>
				{/* No programs found, try again? message */}
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
