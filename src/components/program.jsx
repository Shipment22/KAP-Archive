/*
 * Name:   renderProgram
 * Input:  Object: props (i.e. program data)
 * Output: Component: Rendered grid program GUI
*/
import relativeDate from '../libs/relativeDate'
function renderProgram(props) {
	// Get the crated and updated dates
	const created = new Date(props.created),
		  updated = new Date(props.updated);
	// If the status is not good return an error program
	if (props.status !== 200) {
		return (<div className="program">
		<div className="program_thumbnail-wrapper">
			{props.severe ? (<img src="/assets/error.svg" alt="Error image" width="250px" height="250px" className="program_thumbnail" />) : (
				<img src="/assets/warning.svg" alt="Warning image" width="250px" height="250px" className="program_thumbnail" />
			)}
		</div>
		<div>
		    <div className="program_title">{props.message}</div>
		    Program ID: <b>{props.id}</b>
		</div>
		</div>)
	}
	// Return grid program
	return (<div className="program">
	<div className="program_thumbnail-wrapper">
	    <img src={props.thumbnail} alt="Program thumbnail" width="200px" height="200px" className="program_thumbnail" />
	</div>
	<div>
	    <div className="program_title">{props.title}</div>
	    <div className="program_author">Author: {props.author.nick}</div>
	    <div className="program_created-updated-wrapper">
	        <span className="program_created" title={created.toUTCString()}>Created: {relativeDate(Date.parse(created))}</span>
	        <span className="program_updated" title={updated.toUTCString()}>Updated: {relativeDate(Date.parse(updated))}</span>
	    </div>
	    <div className="program_votes-spinoffs-wrapper">
	        <span className="program_votes">Votes: {props.votes}</span>
	        <span className="program_spinoffs">Spin-Offs: {props.spinoffs}</span>
	    </div>
	</div>
	<div className="program_view-code-wrapper">
	    <a href="#" className="button">Code</a>
	    <a href={"/view?p="+props.id} className="button">View</a>
	</div>
	</div>);
}

export default renderProgram
