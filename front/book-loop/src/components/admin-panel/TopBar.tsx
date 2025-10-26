import type { FunctionComponent } from "react";

interface TopBarProps {

}

const TopBar: FunctionComponent<TopBarProps> = () => {
    return (
        <>
            <div className="admin-topbar">
                <div className="topbar-left">
                    <h1 className="admin-title">Admin Panel</h1>
                </div>
            </div>
        </>
    );
}

export default TopBar;