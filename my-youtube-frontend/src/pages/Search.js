import React from 'react';
import axios from 'axios';
import Loading from './Loading';
import * as Constants from "../Constants";
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}


const Search = () => {

    // Router query
    const navigate = useNavigate();
    const [showLoading, setShowLoading] = useState(true);
    let query = useQuery();
    const q = query.get('q')

    // videos 
    const [videos, setVideos] = useState([]);

    // useEffect
    useEffect(() => {
        var natural = require('natural');
        var stemmer = natural.PorterStemmer
        var stem = stemmer.tokenizeAndStem(q);
        axios.get(`${Constants.api}/api/video/?search=${stem}`)
            .then((response) => {
                response.data.length > 0 ? setVideos(response.data) : setShowLoading(false)
            })
            .catch((error) => {
                console.log("SUmit")
                console.log("SUmit")
                console.log(error)
            })

    }, [q])


    return (
        <>
            {/* Search Results */}
            <div className="container mt-3 uploads-video-section">
                <h5 className="fw-bold">
                    Search Results
                </h5>
                <div className="uploads-video-section">
                    <div className="upload-container overflow-auto">
                        <ul className="p-md-3 list-unstyled">
                            {videos.length ?
                                videos.map((relate, i) => {
                                    return (
                                        <li
                                            className="m-1 d-flex p-2 pb-0"
                                            style={{ cursor: 'pointer' }}
                                            key={relate.id} onClick={() => navigate(`/watch?v=${relate.video_id}`)}
                                            onMouseOver={(e) => {
                                                let x = document.getElementsByClassName('m-1 d-flex p-2 pb-0')[i];
                                                x.style.background = '#E8E8E8';
                                            }}
                                            onMouseOut={(e) => {
                                                let x = document.getElementsByClassName('m-1 d-flex p-2 pb-0')[i];
                                                x.style.background = '';
                                            }}>
                                            <div>
                                                <img
                                                    src={`${relate.thumbnail}`}
                                                    height="68"
                                                    width="113"
                                                    alt=""
                                                />
                                            </div>
                                            <p
                                                className="p-2 text-truncate"
                                                style={{ fontSize: '12px' }}
                                            >
                                                {relate.title}
                                                <br />
                                                <span className="badge bg-danger rounded-0 fw-light">
                                                    {relate.channelTitle}
                                                </span>
                                                <br />
                                                <span style={{ fontSize: '11px' }}>
                                                    <span id={`related-view-count-${relate.id}`}>
                                                        {relate.view.length}</span> Views  &nbsp;&nbsp;•&nbsp;
                                                    {(() => {
                                                        const date = new Date(`${relate.date}`)
                                                        return Constants.timeAgo.format(date)
                                                    })()}
                                                </span>
                                            </p>
                                        </li>
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
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Search;
