import React from 'react';
import axios from 'axios';
import Upload from './Upload';
import Loading from './Loading';
import * as Constants from "../Constants";
import Subscription from './Subscription';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Channel = () => {

    // Router query
    let query = useQuery();
    const channel_jsx_info = query.get('channel_jsx_info')

    // User Info From React-Redux
    const userInfo = useSelector((state) => state.auth.user.userInfo);
    const is_authenticated = useSelector((state) => state.auth.user.is_authenticated);
    const [showLoading, setShowLoading] = useState(true);


    // Channel , Upload and Subscription State
    const [channel, setChannel] = useState([]);

    // UseEffect
    useEffect(() => {
        axios.get(
            `${Constants.api}/api/channel/?id=${channel_jsx_info}`
        )
            .then((response) => {
                response.data.length > 0 ? setChannel(response.data) : setShowLoading(false)
            })
            .catch((error) => {
                console.log(error);
            })
    }, [channel_jsx_info, userInfo, is_authenticated])

    // Change Section i.e, Uploads to Videos etc...
    const HandleChange = (e) => {
        let nodes = e.target.parentNode.childNodes;
        for (let i = 0; i < nodes.length; i++) {
            let child = nodes[i];
            child.className = "px-4 py-1";
        }
        e.target.className = 'flex-nav-active px-4 py-1';
        let sections = document.getElementById('Main-Section').childNodes
        for (let i = 0; i < sections.length; i++) {
            let child = sections[i]
            if (e.target.id === child.id) {
                child.style.display = 'block';
            }
            else {
                child.style.display = 'none';
            }
        }
    }

    return <>
        {channel.length ?
            channel.map((data) => {
                return (
                    <div
                        className='container-fluid'
                        key={data.id}
                    >
                        {/* Channel Section Top */}
                        <div className="top-section d-flex p-4">
                            {
                                data.thumnail ?
                                    <div className="profile-pic">
                                        <label className="-label2" htmlFor="file"></label>
                                        <img
                                            src={data.thumnail}
                                            alt={`channel`}
                                        />
                                    </div>
                                    :
                                    <div className="profile-pic bg-dark rounded-circle">
                                        <label
                                            className="-label2"
                                            htmlFor="file"
                                        ></label>
                                        <div
                                            className="like-img text-white fs-1"
                                            style={{ paddingTop: '25px', paddingLeft: '44.5px' }}
                                        >
                                            {data.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                            }
                            <span className="my-auto px-5">
                                <span className="fw-bold">
                                    {data.name}
                                </span>
                                <br />
                                <span className="fw-light">
                                    {data.subscription.length === 0 ? "no subscriber" : `${data.subscription.length} subscriber`}
                                </span>
                            </span>
                        </div>
                        {/* Channel Section Navbar */}
                        <div className="flex-nav">
                            <ul
                                className="d-flex list-unstyled overflow-scroll"
                                style={{ cursor: 'pointer' }}
                                id='flex-nav-ul'
                            >
                                <li
                                    className="flex-nav-active px-4 py-1"
                                    onClick={(e) => HandleChange(e)}
                                    id="Home-Section"
                                >
                                    Home
                                </li>
                                <li
                                    className="px-4 py-1"
                                    onClick={(e) => HandleChange(e)}
                                    id='Video-Section'
                                >
                                    Videos</li>
                                <li
                                    className="px-4 py-1"
                                    onClick={(e) => HandleChange(e)}
                                    id='Channel-Section'
                                >
                                    Channels</li>
                                <li
                                    className="px-4 py-1"
                                    onClick={(e) => HandleChange(e)}
                                    id='About-Section'
                                >
                                    About</li>
                            </ul>
                        </div>
                        {/* Channel Section Front */}
                        <div
                            className="main-section p-3"
                            id="Main-Section"
                        >
                            <div id="Home-Section">
                                {/* Uploads */}
                                <div
                                    className="uploads-sections overflow-auto"
                                    style={{ height: "250px" }}
                                >
                                    <Upload ChannelId={channel_jsx_info} />
                                </div>
                                {/* Subscription */}
                                <div
                                    className="subscription-sections overflow-auto"
                                    style={{ height: "200px" }}
                                >
                                    <Subscription />
                                </div>
                            </div>
                            {/* Channel Section Videos */}
                            <div
                                id="Video-Section"
                                style={{ display: 'none' }}
                            >
                                <div className="uploads-sections">
                                    <div
                                        className="uploads-sections overflow-auto"
                                        style={{ height: "250px" }}
                                    >
                                        <Upload ChannelId={channel_jsx_info} />
                                    </div>
                                </div>
                            </div>
                            {/* Channel Section Subscription */}
                            <div
                                id="Channel-Section"
                                style={{ display: 'none' }}
                            >
                                <div
                                    className="subscription-sections overflow-auto"
                                    style={{ height: "200px" }}
                                >
                                    <Subscription />
                                </div>
                            </div>
                            {/* Channel Section About */}
                            <div
                                id="About-Section"
                                style={{ display: 'none' }}
                            >
                                <p>
                                    {data.about}
                                </p>
                                <small>
                                    Joined on
                                </small>
                                <span className="ms-2 fw-bold">
                                    Joined {
                                        (() => {
                                            let date = new Date();
                                            let [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
                                            return `${Constants.monthNames[month]} ${day}, ${year}`
                                        })()
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                )
            })
            :
            <>
                {
                    showLoading ?
                        <Loading />
                        :
                        ("")
                }
            </>
        }
    </>

}

export default Channel;
