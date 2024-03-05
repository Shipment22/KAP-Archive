function Footer() {
	return (
		<footer className="Footer">
			<div className="footer_inner-wrapper main-width">
				<ul>
				    <h2>Pages</h2>
					<li><a href="/">Home</a></li>
					<li><a href="/browse" className="rosewater">Browse</a></li>
					<li><a href="/search" className="mauve">Search</a></li>
					<li><a href="/add" className="maroon">Add</a></li>
				</ul>
                <ul>
                    <h2>Resources</h2>
					<li><a href="/request_by_code" className="mauve">Request Hidden/Deleted Program</a></li>
					<li><a href="/report" className="red">Report a Program</a></li>
					<li><a href="https://github.com/Shipment22/KAP-Archive" className="sapphire">Github Repo</a></li>
                </ul>
                <ul>
                    <h2>Cool Projects</h2>
					<li><a href="https://vxsacademy.org/computer-programming/browse" style={{ color: '#45ed84' }}>Vexcess Academy</a></li>
					<li><a href="https://khanalytics.bhavjit.com/" style={{ color: '#41f0c0' }}>Khanalytics</a></li>
					<li><a href="https://willard.fun/" className="sapphire">Willard.fun</a></li>
					<li><a href="https://search.kestron.software/" className="sapphire">Kestrogle</a></li>
				</ul>
				<ul>
				    <h2>Credits</h2>
                    <li>
                        <a href="https://pixabay.com/vectors/leaf-blue-green-stylized-gradients-1821763/">Leaf in the Favicon</a> (<a href="https://pixabay.com/users/ptra-359668/" className="sapphire">Author</a>)
                    </li>
                    <li>
                        <a href="https://github.com/microsoft/fluentui-system-icons/tree/master/assets/Building%20Bank/SVG">Building in the Favicon</a> (<a href="https://github.com/microsoft/fluentui-system-icons/tree/master" className="sapphire">Fluent UI System Icons</a>)
                    </li>
					<li>
                        <a href="https://iconarchive.com/show/flatastic-1-icons-by-custom-icon-design/information-icon.html">Info Icon</a> (<a href="http://www.customicondesign.com/" className="sapphire">by Custom Icon Design</a>)</li>
					<li>
						<a href="https://iconarchive.com/show/small-n-flat-icons-by-paomedia/sign-error-icon.html">Error Icon</a>
					</li>
					<li>
						<a href="https://iconarchive.com/show/small-n-flat-icons-by-paomedia/sign-warning-icon.html">Warning Icon</a>
					</li>
					<li>
						<a href="https://iconarchive.com/show/small-n-flat-icons-by-paomedia/key-icon.html">Key Icon</a> (<a href="http://www.paomedia.com/" className="sapphire">paomedia</a>, <a href="https://github.com/paomedia" className="sapphire">Github</a>)
				    </li>
				    <li>
						<a href="https://iconarchive.com/show/papirus-status-icons-by-papirus-team/view-private-icon.html">View private Icon</a> (<a href="https://github.com/PapirusDevelopmentTeam" className="sapphire">Papirus Development Team</a>)
                    </li>
				</ul>
			</div>
		</footer>
	)
}

export default Footer
