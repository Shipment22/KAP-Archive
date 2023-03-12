import Program from '../components/program';

function Header(props) {
	return props.programs.length > 0 ? (
	<div className="programs-grid">
        {props.programs.map(program => (
            <Program key={program.id} {...program}/>
        ))}
	</div>
	) : (
	<p>
		<h2 className="red">No programs to display</h2>
		<code>props.programs.length</code>
		<br/> is less than 0
	</p>
    )
}

export default Header