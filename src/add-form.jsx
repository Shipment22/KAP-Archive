
const infoIcon = '/assets/info.svg'

function AddForm() {
	return (
		<form action="/add" className="add-form">
	        <div className="info">
	            <img src={infoIcon} alt="Information Icon" width="24"/>
	            <p>
	                <i>Put the IDs or URLs of the programs here, each separated by a newline.</i>
	            </p>
	        </div>
			<textarea name="ids" className="input"></textarea>
			<hr />
			<input type="submit" className="button" />
		</form>
	)
}

export default AddForm