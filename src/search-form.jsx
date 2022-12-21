const infoIcon = '/assets/info.svg'

function Form() {
	return (
	<form className="search-form" action="/search">
        <div className="inputs-wrapper">
            <label htmlFor="title">Title</label>
            <input type="text" name="title" className="input" placeholder="The program's title" />
            <label htmlFor="id">ID</label>
            <input type="text" name="id" className="input" placeholder="The program's ID" />
            <label htmlFor="author">Author</label>
            <input type="text" name="author" className="input" placeholder="The program's author" />
            <label htmlFor="votes_min">Minimum Votes</label>
            <input type="number" name="votes_min" className="input" placeholder="Minimum number of votes a program has to have to be shown in the results"  />
            <label htmlFor="votes_max">Maximum Votes</label>
            <input type="number" name="votes_max" className="input" placeholder="Maximum number of votes a program has to have to be shown in the results"  />
            <label htmlFor="spinoffs_min">Minimum Spin-offs</label>
            <input type="number" name="spinoffs_min" className="input" placeholder="Minimum number of Spin-offs a program has to have to be shown in the results"  />
            <label htmlFor="spinoffs_max">Maximum Spin-offs</label>
            <input type="number" name="spinoffs_max" className="input" placeholder="Maximum number of Spin-offs a program has to have to be shown in the results"  />
            <label htmlFor="limit">Limit</label>
            <input type="number" name="limit" className="input" placeholder="Limit of programs to search (Does not effect raw search)"  />
        </div>
        <div className="info">
            <img src={infoIcon} alt="Information Icon" width="24"/>
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
                <input type="button" name="raw" value="Raw Search" className="button" />
            </div>
        </div>
    </form>)
}

export default Form