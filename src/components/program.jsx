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
	    <h3 className="program_title" title={props.title}>{props.title}</h3>
        <table>
            <tr>
                <th>Author:</th>
                <td className="program_author" title={"@"+props.author.name}>{props.author.nick}</td>
            </tr>
            <tr>
                <th>Created:</th>
	            <td className="program_created" title={created.toUTCString()}>{relativeDate(Date.parse(created))}</td>
            </tr>
            <tr>
                <th>Updated:</th>
	            <td className="program_updated" title={updated.toUTCString()}>{relativeDate(Date.parse(updated))}</td>
            </tr>
            <tr>
                <th>Votes:</th>
	            <td className="program_votes">{props.votes}</td>
            </tr>
            <tr>
                <th>Spin-Offs:</th>
	            <td className="program_spinoffs">{props.spinoffs}</td>
            </tr>
        </table>
	</div>
	<div className="program_view-code-wrapper">
	    <a href="#" className="button">Launch</a>
	    <a href={"/view?p="+props.id} className="button">Details</a>
	</div>
	</div>);
}

export default renderProgram
