export default (props) => { 
return (<div className="program">
	<div className="program_thumbnail-wrapper">
	    <img src={props.thumb} alt="Program thumbnail" className="program_thumbnail" />
	</div>
	<div>
	    <h3 className="program_title">{props.title}</h3>
	    <div className="program_author">Author: {props.author}</div>
	    <div className="program_created-updated-wrapper">
	        <span className="program_created">Created: {new Date(props.created).toDateString()}</span>
	        {/*<span className="program_updated">Updated: {new Date(props.updated).toDateString()}</span>*/}
	        <span className="program_updated">Updated: Unknown</span>
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