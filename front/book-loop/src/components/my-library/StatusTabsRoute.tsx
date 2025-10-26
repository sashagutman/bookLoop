import type { FunctionComponent } from "react";
import { NavLink } from "react-router-dom";
import { VALID_STATUSES, STATUS_LABEL } from "../../helpers/statuses"
import "../../style/my-library/tabs.css"
interface StatusTabsRouteProps {

}

const StatusTabsRoute: FunctionComponent<StatusTabsRouteProps> = () => {

    return (
        <>
            <nav className="library-tabs" aria-label="Reading status">
                <ul className="tabs-list">
                    {VALID_STATUSES.map((key) => (
                        <li key={key}>
                            <NavLink
                                to={key}
                                className={({ isActive }) =>
                                    "tab-link" + (isActive ? " tab-active" : "")
                                }
                                role="tab"
                            >
                                {STATUS_LABEL[key]}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
}

export default StatusTabsRoute;