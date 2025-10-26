import type { FunctionComponent } from "react";
import "../../style/my-library/my-library.css"
import { Outlet } from "react-router-dom";
import StatusTabsRoute from "./StatusTabsRoute";
interface MyLibraryProps {

}

const MyLibrary: FunctionComponent<MyLibraryProps> = () => {
    return (
        <>
            <section className="my-library">
                <div className="container">
                    <div className="my-library-inner">
                        <div className="my-library-header">
                            <h2 className="title-h">My Library</h2>
                            <p className="text-p">Organize your books by reading status</p>
                        </div>
                            <StatusTabsRoute />
                        <div className="library-content">
                             <Outlet />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default MyLibrary;