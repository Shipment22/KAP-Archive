import {getProgramsNoString} from '../libs/retrievePrograms';
import ProgramsGrid from '../components/programsGrid';
function Browse(props) {
	const page = Number(props.page);
	// Make sure page isn't negative or NaN
	if (page < 0 || page == NaN) page = 0;
	// Get the next page's href
	const nextHref = "/browse?page=" + ((page || 1) + 1);
	return (
<main className="Main">
	<h1>Browse Programs</h1>
	<ProgramsGrid programs={getProgramsNoString(24, (page-1 ?? 0) * 24)}/>
    <br />
    <a className="button" style={{width: 100+'%',textAlign:'center',margin:'0'}} href={nextHref}>See more</a>
</main>)
}

export default Browse;