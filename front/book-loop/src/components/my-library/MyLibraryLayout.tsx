import type { FunctionComponent } from "react";
import MyLibraryIntro from "./MyLibraryIntro";
import ReadingStats from "./ReadingStats";
import MyLibrary from "./MyLibrary";

interface MyLibraryLayoutProps {
    
}
 
const MyLibraryLayout: FunctionComponent<MyLibraryLayoutProps> = () => {
    return ( 
        <>
            <MyLibraryIntro />
            <ReadingStats />
            <MyLibrary />
        </>
     );
}
 
export default MyLibraryLayout;