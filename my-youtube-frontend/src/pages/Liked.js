import React from 'react';
import axios from 'axios';
import Loading from './Loading';
import * as Constants from "../Constants";
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const Liked = () => {
    // User Info From React-Redux
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.user.userInfo);

    // Like Videos State
    const [uploads, setuploads] = useState([]);
    const [showLoading, setShowLoading] = useState(true);


    // UseState
    useEffect(() => {
        axios.get(
            `${Constants.api}/api/video/?like__user__id=${userInfo}`
        )
            .then((response) => {
                response.data.length > 0 ? setuploads(response.data) : setShowLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [userInfo])

    return <>
        {/* Liked Videos Section Starts */}
        <div className="container mt-3 uploads-video-section">
            <h5 className="fw-bold">
                Liked Videos
            </h5>
            <div className="uploads-video-section p-1">
                <div className="upload-container overflow-auto">
                    {uploads.length ?
                        uploads.map((item, i) => {
                            return (
                                <div
                                    className='video-upload-section'
                                    key={item.id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/watch/?v=${item.video_id}`)}
                                    onMouseOver={(e) => {
                                        document.getElementsByClassName('video-upload-section')[i].style.background = '#E8E8E8';
                                    }}
                                    onMouseOut={(e) => {
                                        document.getElementsByClassName('video-upload-section')[i].style.background = '';
                                    }}
                                >
                                    <section className="row p-3">
                                        <div className="col-12 col-md-2 thumbnail">
                                            <img
                                                src={item.thumbnail}
                                                alt=""
                                                style={{ width: '100%', height: 'auto', margin: 'auto' }}
                                            />
                                        </div>
                                        <div className="col-12 col-md-10 content">
                                            <p className="p-2"
                                            >{item.title}
                                                <br />
                                                <span className="badge bg-secondary rounded-0 fw-light">
                                                    {item.channelTitle}
                                                </span>
                                                <br />
                                                <span
                                                    style={{ fontSize: '11px' }}
                                                >
                                                    <span
                                                        id={`related-view-count-${item.id}`}
                                                    >
                                                        {item.view.length}</span> views  &nbsp;&nbsp;
                                                    {(() => {
                                                        const date = new Date(`${item.date}`)
                                                        return Constants.timeAgo.format(date)
                                                    })()}
                                                </span>
                                            </p>
                                        </div>
                                    </section>
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
                </div>
            </div>
        </div>
    </>
}

export default Liked;
