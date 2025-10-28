import type { FunctionComponent } from "react";
import "../../style/admin-panel/sidebar.css";
interface SideBarProps {

}

const SideBar: FunctionComponent<SideBarProps> = () => {
    return (
        <>
            <aside className="admin-sidebar">
                <div className="text-p">
                    📚 Book Loop Admin
                </div>
                <nav className="admin-nav">
                    <a href="#admin-dashboard" className="active">Dashboard</a>
                    <a href="#admin-users">Users</a>
                    <a href="#admin-books">Books</a>
                </nav>
            </aside>
        </>
    );
}

export default SideBar;