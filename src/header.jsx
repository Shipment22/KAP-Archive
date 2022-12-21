const images = {
	logo: '/assets/logo.svg',
	adminLogin: '/assets/key.svg'
}

function Header() {
	return (
		<header className="Header">
			<div>
				<a href="/" className="green">
					<img src={images.logo} alt="KAP Archive Logo" height="48" />
					KAP Archive
				</a>
			</div>
			<div className="main-nav_wrapper">
				<nav className="main-nav" aria-label="Main navigation">
					<ul>
						<li><a href="/browse" className="rosewater">Browse</a></li>
						<li><a href="/search" className="mauve">Search</a></li>
						<li><a href="/add" className="maroon">Add Programs</a></li>
						<li><a href="/about" className="yellow">About</a></li>
					</ul>
				</nav>
			</div>
			<div>
				<a href="/admin" className="blue">
					Admin Login
					<img src={images.adminLogin} alt="Admin login image" width="48" />
				</a>
			</div>
		</header>
	)
}

export default Header