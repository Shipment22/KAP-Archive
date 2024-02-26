/*
 * Name:   Add
 * For:    Main tag in the /add endpoint
*/
import AddForm from '../components/addForm';
import ProgramsGrid from '../components/programsGrid';
import Program from '../components/program';
function Add(props) {
	return (
<main className="Main">
	{props.programs?(
	    <div className="surface">
	        <h1>Program Adding Results</h1>
			<ProgramsGrid programs={props.programs}/>
	    </div>
	):(
	    <div className="surface">
	        <h1>Add Programs</h1>
            <AddForm />
	    </div>
    )}
</main>)
}

export default Add;
