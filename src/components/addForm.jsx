
const infoIcon = '/assets/info.svg'

function AddForm() {
	return (
		<form action="/add" className="add-form">
			<label htmlFor="ids">Program IDs</label>
			<textarea name="ids" className="input" rows="6" placeholder="IDs and/or URL separeted by commas or new lines" title="IDs and/or URL separeted by commas or new lines"></textarea>
	        <div className="info">
	            <img src={infoIcon} alt="Information Icon" width="22px" height="22px"/>
	            <p>
	                <i>All variants of KACP links should work so old <code>hour-of-code</code> links and abbreviated <code>cs</code> links as well as the usual <code>computer-programming</code> links can be pasted directly.</i>
	            </p>
	        </div>
			<hr />
			<input type="submit" className="button" />
		</form>
	)
}

export default AddForm
