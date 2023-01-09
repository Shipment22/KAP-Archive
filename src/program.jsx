import relativeDate from './relativeDate'

export default (props) => {
	const created = new Date(props.created),
		  updated = new Date(props.updated),
		  now = new Date();

return (<div className="program">
	<div className="program_thumbnail-wrapper">
	    <img src={props.thumb} alt="Program thumbnail" className="program_thumbnail" />
	</div>
	<div>
	    <h3 className="program_title">{props.title}</h3>
	    <div className="program_author">Author: {props.author}</div>
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
	    <a href="#" className="button">View</a>
	</div>
</div>)}