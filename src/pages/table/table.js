// Table.js
import React, { useState, useEffect } from "react";
import "./table.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

function Table() {
    const { REACT_APP_API_URL } = process.env
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState([])
    const [foundUsers, setFoundUsers] = useState(data);
    const [userProfile, setUserProfile] = useState({});
    const [userPosts, setUserPosts] = useState([]);
    const [showProfile, setShowProfile] = useState(true)
    const [initials, setInitials] = useState('')


    const getUsers = async () => {
        try {
            const request = new Request(`${REACT_APP_API_URL}/users`, {
                headers: new Headers({ 'Content-Type': 'application/json' }),
            });
            let resp = await fetch(request)
            let body = await resp.json()
            setIsLoaded(true);
            setData(body)
            setFoundUsers(body)
        }
        catch (e) {
            console.error(e)
            setIsLoaded(true);
            setError(error);
        }

    }

    useEffect(() => {
        getUsers()
    }, [])



    const generateInitials = (name) => {
        let rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

        let initials = [...name.matchAll(rgx)] || [];

        initials = (
            (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
        ).toUpperCase();

        setInitials({ initials: initials, name: name })


    }

    const setProfileData = (row) => {
        if (userProfile?.name !== row?.name) {
            generateInitials(row.name)
            setUserProfile({ name: row.name, username: row.username, email: row.email, address: `${row.address.suite + ", " + row.address.street + ", " + row.address.city + ", " + row.address.zipcode}`, phone: row.phone, website: row.website, company: row.company.name })
        }
        setShowProfile(true)
    }

    const fetchUserPosts = async (row, id) => {
        if (userPosts?.userId !== id) {
            try {
                console.log(`${REACT_APP_API_URL}/posts?userId=${row.id}`)
                setShowProfile(false)
                generateInitials(row.name)
                const request = new Request(`${REACT_APP_API_URL}/posts?userId=${row.id}`, {
                    headers: new Headers({ 'Content-Type': 'application/json' }),
                });
                let resp = await fetch(request)
                let body = await resp.json()
                console.log(body)
                setUserPosts(body)
            }
            catch (e) {
                console.error(e)
                setIsLoaded(true);
                setError(error);
            }
        }
        else{
            setShowProfile(false)
        }
    }


    const profileFormatter = (cell, row, rowIndex, formatExtraData) => {
        const rowId = row.id;
        return (<label for="menu-opener" tabindex="0" onClick={() => { setProfileData(row) }} aria-haspopup="true" role="button" aria-controls="menu" class="OpenMenuButton" id="openmenu">View Profile</label>)
    }

    const postFormatter = (cell, row, rowIndex, formatExtraData) => {
        const rowId = row.id;
        return (<label for="menu-opener" tabindex="0" onClick={() => { fetchUserPosts(row, row.id) }} aria-haspopup="true" role="button" aria-controls="menu" class="OpenMenuButton" id="openmenu">View Posts</label>)
    }

    const columns = [
        { dataField: "name", text: "Name", sort: true },
        { dataField: "username", text: "User Name", sort: true },
        { dataField: "email", text: "Email", sort: true },
        { dataField: "phone", text: "Phone", sort: true },
        { dataField: "website", text: "Website", sort: true },
        {
            dataField: "", text: "Profile", sort: false,
            formatter: profileFormatter

        },
        {
            dataField: "", text: "Posts", sort: false,
            formatter: postFormatter

        }
    ];

    const defaultSorted = [
        {
            dataField: "name",
            order: "desc"
        }
    ];

    const sizePerPageRenderer = ({
        options,
        currSizePerPage,
        onSizePerPageChange
    }) => (
        <div className="btn-group" role="group">
            <div className="records-per-page">
                Records per page
            </div>
            {

                options.map(option => (
                    <button

                        type="button"
                        onClick={() => onSizePerPageChange(option.page)}
                        className={`btn ${currSizePerPage === `${option.page}` ? 'btn-secondary' : 'btn-warning'}`}
                    >
                        {option.text}
                    </button>
                ))
            }
        </div>
    );


    const pagination = paginationFactory({
        page: 1,
        sizePerPage: 5,
        lastPageText: ">>",
        firstPageText: "<<",
        nextPageText: ">",
        prePageText: "<",
        showTotal: true,
        alwaysShowAllBtns: true,
        sizePerPageList: [{ text: 5, value: 5 }, { text: 10, value: 10 }, { text: 20, value: 20 }],
        onPageChange: function (page, sizePerPage) {
            console.log("page", page);
            console.log("sizePerPage", sizePerPage);
        },
        onSizePerPageChange: function (page, sizePerPage) {
            console.log("page", page);
            console.log("sizePerPage", sizePerPage);
        },
        sizePerPageRenderer: sizePerPageRenderer
    });

    const filter = (e) => {

        clearTimeout(filterTimeout)
        var filterTimeout = setTimeout(() => {
            const keyword = e.target.value;

            if (keyword.trim() !== '' && keyword.length > 2) {
                const results = data.filter((user) => {
                    return user.name.toLowerCase().includes(keyword.toLowerCase()) || user.email.toLowerCase().includes(keyword.toLowerCase());
                });
                setFoundUsers(results);
            } else {
                setFoundUsers(data);
            }
        }, 500)

    };





    if (error) {
        return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
        return <div>Loading...</div>;
    } else {
        return (
            <div className="table">

                <div className="container">
                    <input className="nosubmit" type="search" onChange={filter} placeholder="Search" />
                </div>

                <BootstrapTable
                    bootstrap4
                    keyField="id"
                    data={foundUsers}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    pagination={pagination}
                />

                <input type="checkbox" data-menu id="menu-opener" hidden />
                <aside class="DrawerMenu" role="menu" id="menu" aria-labelledby="openmenu">
                    <nav class="Menu">

                        {showProfile ?
                            <>
                                <div className="profile-header-section">
                                    <h3>Profile</h3>
                                </div>
                                <div className="profile-section">
                                    <div className="profile-desc-section">
                                        <div className="profile-initials">{initials.initials}</div>
                                        <div className="profile-header">{userProfile.name}</div>
                                        <div className="profile-subheader">{userProfile.username}</div>
                                    </div>
                                    <div className={'profile-info-field-container'}>

                                        <label className={'text-field-label'}>Email</label>
                                        <input type="text" id="email" name="email" className={'profile-info-fields'} value={userProfile.email} /><br />
                                        <label className={'text-field-label'}>Address</label>
                                        <input type="text" id="address" name="address" className={'profile-info-fields'} value={userProfile.address} /><br />
                                        <label className={'text-field-label'}>Phone</label>
                                        <input type="text" id="phone" name="phone" className={'profile-info-fields'} value={userProfile.phone} /><br />
                                        <label className={'text-field-label'}>Website</label>
                                        <input type="text" id="website" name="website" className={'profile-info-fields'} value={userProfile.website} /><br />
                                        <label className={'text-field-label'}>Company name</label>
                                        <input type="text" id="company" name="company" className={'profile-info-fields'} value={userProfile.company} /><br />

                                    </div>
                                </div>
                            </>
                            :
                            <div className="profile-initials-post">
                                <div className="profile-post-header">Post</div>
                                <div>
                                    <div className="profile-header-section">
                                        <span className="profile-initials">{initials.initials}</span>
                                        <span className="post-subheader">{initials.name}</span>
                                    </div>
                                    {userPosts.length > 0 ?
                                        userPosts.map((item) =>
                                            <div className="posts-card">
                                                <div className="day-text">2 days ago</div>
                                                <h3>{item.title}</h3>
                                                <h6>{item.body}</h6>
                                            </div>)
                                        : <></>
                                    }

                                </div>
                            </div>
                        }
                    </nav>
                    <label for="menu-opener" class="MenuOverlay"></label>
                </aside>
            </div>
        );
    }
}

export default Table;
