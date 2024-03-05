const images = {
	logo: '/assets/logo.svg',
	adminLogin: '/assets/key.svg',
	admin: '/assets/view-private.svg'
}

function Header(props) {
	return (
		<header className="Header">
			<div>
				<a href="/" className="logo-home-link green">
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
						<li><a href="https://github.com/Shipment22/KAP-Archive" target="_blank" className="yellow">Github Repo</a></li>
					</ul>
				</nav>
			</div>
			<div> 
				<a href="/admin" className="header-admin-link blue">
					{props.loggedIn === true ? (
						<span>
							Admin Menu
							<img src={images.admin} alt="Admin menu image" width="48" />
						</span>
					) : (
						<span>
							Admin Login
							<img src={images.adminLogin} alt="Admin login image" width="48" />
						</span>
					)}
				</a>
			</div>
		</header>
	)
}

export default Header
