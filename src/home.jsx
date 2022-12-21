import SearchForm from "./search-form"
import AddForm from "./add-form"

function Page() {
  return (
    <main className="Main">
        <h1>Khan Academy Program Archive</h1>
        <div className="search surface">
            <h2>Search Program</h2>
            <SearchForm />
        </div>
        <div className="add surface">
            <h2>Add Programs</h2>
            <AddForm />
        </div>
        <div className="recently-added">
            <h2>Recently Added</h2>
            <div className="programs-grid">
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>      
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>      
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>      
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>
                <div className="program">
                    <div className="program_thumbnail-wrapper">
                        <img src="//unsplash.it/400/400" alt="Program thumbnail" className="program_thumbnail" />
                    </div>
                    <div>
                        <h3 className="program_title">Program Title</h3>
                        <div className="program_author">Author: John Smith</div>
                        <div className="program_created-updated-wrapper">
                            <span className="program_created">Created: Sun July 4 2020</span>
                            <span className="program_updated">Updated: Tue Dec 20 2022</span>
                        </div>
                        <div className="program_votes-spinoffs-wrapper">
                            <span className="program_votes">Votes: 34</span>
                            <span className="program_spinoffs">Spin-Offs: 7</span>
                        </div>
                    </div>
                    <div className="program_view-code-wrapper">
                        <a href="#" className="button">Code</a>
                        <a href="#" className="button">View</a>
                    </div>
                </div>            
            </div>
        </div>
    </main>
  );
}

export default Page
