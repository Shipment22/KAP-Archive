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
	<h1>Program Adding Results</h1>
	<div className="surface">
		{props.programs?(
			<ProgramsGrid programs={props.programs}/>
		):(<AddForm />)}
	</div>
</main>)
}

export default Add;