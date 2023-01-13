export default function(props) {
	return (
	    <main style={{
	        display: 'grid',
	        justifyContent: 'center',
	        alignItems: 'center',
	        minHeight: 80 + 'vh'
	    }}>
	        <div className="main_inner-wrapper">
	            <h1>{props.error}</h1>
	            <p>If you think something is wrong with KAP Archive make an <a href="https://github.com/shipment22/kap-archive/issues">issue on Github.</a></p>
	        </div>
	      </main>
	)
}