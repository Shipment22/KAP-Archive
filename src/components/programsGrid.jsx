import Program from '../components/program';

function Header(props) {
	return (
	<div className="programs-grid">
        {props.programs.map(program => (
            <Program key={program.id} {...program}/>
        ))}
	</div>
	)
}

export default Header