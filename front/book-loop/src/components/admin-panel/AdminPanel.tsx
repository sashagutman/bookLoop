import type { FunctionComponent } from "react";
import "../../style/admin-panel/admin.css";

import Sidebar from "./SideBar";
import Topbar from "./TopBar";
import Overview from "./Overview";
import UsersTable from "./UserTable";
import BooksTable from "./BooksTable";

const AdminPanel: FunctionComponent = () => {
  return (
    <section className="admin-panel section-bg section-bg">
      <div className="container">
        <div className="admin-layout">
          <Sidebar />
          <div className="admin-main">
            <Topbar />
            <Overview />
            <UsersTable />
            <BooksTable />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPanel;
