const infoIcon = '/assets/info.svg'

function Form() {
	return (
	<form className="search-form" action="/search">
        <div className="inputs-wrapper">
            <div className="inputs-inner-wrapper">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" className="input" placeholder="Program title" title="Title of the program (Not fuzzy yet, however it will match the beginning, middle or end of the title)" />
                <label htmlFor="author">Author</label>
                <input type="text" name="author" className="input" placeholder="Program author's user or nick name" title="The nickname or username of the program author/creator (Not fuzzy yet, however it will match the beginning, middle or end of the name)" />
                <label htmlFor="id">ID</label>
                <input type="text" name="id" className="input" placeholder="Program ID" title="ID of the program" />
            </div>
            <div className="inputs-inner-wrapper search-form-expanded">
                <h3>Votes</h3>
                <label htmlFor="votes_min">Minimum Votes</label>
                <input type="number" name="votes_min" className="input" placeholder="Minimum number of votes" title="Minimum number of votes a program needs to be listed"/>
                <label htmlFor="votes_max">Maximum Votes</label>
                <input type="number" name="votes_max" className="input" placeholder="Maximum number of votes" title="Maximum number of votes a program needs to be listed" />
            </div>
            <div className="inputs-inner-wrapper search-form-expanded">
                <h3>Spin-offs</h3>
                <label htmlFor="spinoffs_min">Minimum Spin-offs</label>
                <input type="number" name="spinoffs_min" className="input" placeholder="Minimum number of Spin-offs" title="Minimum number of spin-offs a program needs to be listed" />
                <label htmlFor="spinoffs_max">Maximum Spin-offs</label>
                <input type="number" name="spinoffs_max" className="input" placeholder="Maximum number of Spin-offs" title="Maximum number of spin-offs a program needs to be listed" />
            </div>
            <div className="inputs-inner-wrapper search-form-expanded">
                <h3>Other Data</h3>
                <label htmlFor="limit">Limit</label>
                <input type="number" name="limit" className="input" placeholder="Maximum results allowed (default: 50)" title="Maximum number of results allowed; Default is 50; Will not effect raw search" />
            </div>
        </div>
        <button className="button search-form-expander-button">Show Less</button>
        <div className="info">
            <img src={infoIcon} alt="Information Icon" width="22px" height="22px" />
            <p>
                <i>Only one field needs to be filled to search</i>
            </p>
        </div>
        <hr/>
        <div className="search_search-raw-search_wrapper">
            <div className="left">
                <input type="submit" name="search" value="Search" className="button" />
            </div>
            <div className="right">
                <input type="submit" name="raw" value="Raw Search" className="button" />
            </div>
        </div>
        <script src="/js/searchForm.js"></script>
    </form>)
}

export default Form
