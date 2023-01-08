import SearchForm from "./search-form"
import AddForm from "./add-form"
import Program from './program'
import saveAndRetrieve from './saveAndRetrieve'
const { getProgramsNoString } = saveAndRetrieve

const programs = getProgramsNoString(16)

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

                {programs.map(program => (
                    <Program 
                        key={program.archive.id} 
                        title={program.title}
                        created={program.created}
                        author={program.author.nick}
                        thumb={program.thumbnail}
                        updated={program.updated}
                        votes={program.votes}
                        spinoffs={program.spinoffs}
                    />
                ))}
            </div>
        </div>
    </main>
  );
}

export default Page
