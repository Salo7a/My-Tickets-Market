import Link from "next/link";

const header = ({currentUser}) => {
    const links = [
        !currentUser && {label: 'Register', href: '/auth/register'},
        !currentUser && {label: 'Login', href: '/auth/login'},
        currentUser && {label: 'Sell Tickets', href: '/tickets/new'},
        currentUser && {label: 'My Orders', href: '/orders'},
        currentUser && {label: 'Logout', href: '/auth/logout'}
    ].filter(linkFilter => linkFilter);
    return <nav className="navbar navbar-expand-lg bg-light">
        <div className="container-fluid">
            <Link className="navbar-brand" href={"/"}>MyTix</Link>

            <div className="collapse navbar-collapse d-flex justify-content-end">

                <ul className="navbar-nav d-flex align-items-center">
                    {currentUser &&
                        <span key={'name'} className="navbar-text">Hi, {currentUser.fullName}</span>
                    }
                    {links.map(({label, href}) => (
                        <li key={label} className={'nav-item'}>
                            <Link href={href} className={'nav-link'}>{label}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </nav>
};
export default header
