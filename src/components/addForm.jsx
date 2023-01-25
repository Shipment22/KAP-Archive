
const infoIcon = '/assets/info.svg'

function AddForm() {
	return (
		<form action="/add" className="add-form">
			<label htmlFor="ids">Program IDs</label>
			<textarea name="ids" className="input" rows="6"></textarea>
	        <div className="info">
	            <img src={infoIcon} alt="Information Icon" width="22px" height="22px"/>
	            <p>
	                <i>Put the IDs or URLs of the programs here, each separated by a newline.</i>
	            </p>
	        </div>
			<hr />
			<input type="submit" className="button" />
		</form>
	)
}

export default AddForm