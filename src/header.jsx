const images = {
	logo: '/assets/logo.svg',
	adminLogin: '/assets/key.svg'
}

function Header() {
	return (
		<header className="Header">
			<div>
				<a href="/">
					<img src={images.logo} alt="KAP Archive Logo" height="48" />
					KAP Archive
				</a>
			</div>
			<div className="main-nav_container">
				<nav className="main-nav" aria-label="Main navigation">
					<ul>
						<li><a href="/browse">Browse</a></li>
						<li><a href="/search">Search</a></li>
						<li><a href="/add">Add Programs</a></li>
						<li><a href="/about">About</a></li>
					</ul>
				</nav>
			</div>
			<div>
				<a href="/admin">
					Admin Login
					<img src={images.adminLogin} alt="Admin login image" width="48" />
				</a>
			</div>
		</header>
	)
}

export default Header