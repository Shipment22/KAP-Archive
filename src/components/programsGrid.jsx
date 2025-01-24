import Program from '../components/program';

function Header(props) {
	return props.programs.length > 0 ? (
	<div className="programs-grid">
        {props.programs.map(p => {
            if (props.programs.indexOf(p) >= 12) p.lazy = "true";
            return (<Program key={p.id} {...p}/>);
        })}
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
