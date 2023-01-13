/*
 * Name:   Add
 * For:    Main tag in the /add endpoint
*/
import AddForm from '../components/addForm';
import Program from '../components/program';
function Add(props) {
	return (
<main className="Main">
	<h1>Program Adding Results</h1>
	<div className="surface">
		{props.programs?(
			<div className="programs-grid">
				{props.programs.map(program => (<Program key={program.id} {...program}/>))}
			</div>
		):(<AddForm />)}
	</div>
</main>)
}

export default Add;