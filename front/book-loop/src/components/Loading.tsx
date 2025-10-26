import type { FunctionComponent } from "react";
import "../style/loading.css"
interface LoadingProps {

}

const Loading: FunctionComponent<LoadingProps> = () => {
    return (
        <>
            <div className="loader">
                <div className="dot dot-1"></div>
                <div className="dot dot-2"></div>
                <div className="dot dot-3"></div>
                <div className="dot dot-4"></div>
                <div className="dot dot-5"></div>
            </div>
        </>
    );
}

export default Loading;