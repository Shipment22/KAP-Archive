/*
 * Name:   renderProgram
 * Input:  Object: props (i.e. program data)
 * Output: Component: Rendered grid program GUI
*/
import relativeDate from '../libs/relativeDate'
function renderProgram(props) {
	// Get the crated and updated dates
	const created = new Date(props.created),
		  updated = new Date(props.updated),
      archiveUpdated = new Date(props.archive.updated);
	// If the status is not good return an error program
	if (props.status !== 200) {
		return (<div className="program">
		<div className="program_thumbnail-wrapper">
			{props.severe ? (<img src="/assets/error.svg" alt="Error image" width="250px" height="250px" className="program_thumbnail" />) : (
				<img src="/assets/warning.svg" alt="Warning image" title="Warning" width="250px" height="250px" className="program_thumbnail" />
			)}
		</div>
		<div>
		    <div className="program_title" title={props.message}>{props.message}</div>
		    Program ID: <b>{props.id}</b>
		</div>
		</div>)
	}
    let pid = "pid-"+props.id;
	// Return grid program
	return (<div className={"program"+(props.archive.sourceDeleted?" program-source-deleted ":' ')+pid}>
	<div className="program_thumbnail-wrapper">
        {
            props.lazy ? <img src={`/thumb/${props.id}/latest.png`} className={"program_thumbnail "+pid} alt="Program thumbnail" width="200px" height="200px" loading="lazy" />
            : <img src={props.thumbnail ?? "/assets/404.png"} className={"program_thumbnail "+pid} alt={"Thumbnail for "+props.title} width="200px" height="200px" />
        }
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
	            <td className="program_created" title={"Program was first created: " + created.toUTCString()}>{relativeDate(Date.parse(created))}</td>
            </tr>
            <tr>
                <th>Updated:</th>
	            <td className="program_updated" title={"Program was last updated*: " + updated.toUTCString()}>{relativeDate(Date.parse(updated))}</td>
            </tr>
            <tr>
                <th>Votes:</th>
	            <td className="program_votes">{props.votes}</td>
            </tr>
            <tr>
                <th>Spin-Offs:</th>
	            <td className="program_spinoffs">{props.spinoffs}</td>
            </tr>
            <tr>
                <th>Archived:</th>
	            <td className="program_archive_updated" title={"Archive data was last updated: " + archiveUpdated.toUTCString()}>{relativeDate(Date.parse(archiveUpdated))}</td>
            </tr>
        </table>
	</div>
	<div className="program_view-code-wrapper">
	    {/* <a href="#" className="button">Launch</a> */}
	    <a href={"/view?p="+props.id} className="button">Details</a>
	</div>
	</div>);
}

export default renderProgram
