import React from "react";
import './home.css'

const Home = () => {
    const URL = `${window?.location?.protocol}//${window.location.hostname}:${window.location.port}/display-users`
    return (
        <div>
            <div className="home-table-header"><h3>Table</h3></div>
            <div className="iframe-container">
                <iframe
                    name="my_iframe"
                    title="admin-table-frame"
                    src={URL}
                    height={'700px'}
                    width="100%"
                ></iframe>
            </div>
        </div>
    )
};
export default Home;