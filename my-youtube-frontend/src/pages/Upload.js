import React from 'react';
import axios from 'axios';
import Loading from './Loading';
import * as Constants from "../Constants";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Upload = (props) => {
    // User Info From React-Redux
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.user.userInfo);

    // Upload Videos State
    const [showLoading, setShowLoading] = useState(true);
    const [uploads, setuploads] = useState([]);

    // UseEffect
    useEffect(() => {
        axios.get(
            `${Constants.api}/api/channel/?user__id=${userInfo}`
        )
            .then((response) => {
                if (response.data.length) {
                    axios.get(
                        `${Constants.api}/api/video/?channel__id=${props.ChannelId ? props.ChannelId : response.data[0].id}`
                    )
                        .then((videoResponse) => {
                            if (videoResponse.data.length) {
                                setuploads(videoResponse.data)
                            }
                            else {
                                setShowLoading(false)
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                }
                else {
                    setShowLoading(false)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }, [userInfo, props.ChannelId])

    return <div
        className={`${props.Container ? 'container ' : ''} uploads-video-section`}
    >
        <h5 className="fw-bold">
            Uploads
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
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                                margin: 'auto'
                                            }} />
                                    </div>
                                    <div className="col-12 col-md-10 content">
                                        <p className="p-2"
                                        >{item.title}
                                            <br />
                                            <span className="badge bg-secondary rounded-0 fw-light">
                                                {item.channelTitle}
                                            </span>
                                            <br />
                                            <span style={{ fontSize: '11px' }}>
                                                <span id={`related-view-count-${item.id}`}>
                                                    {item.view.length}</span> Views  &nbsp;&nbsp;•&nbsp;
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
    </div >
}

export default Upload;
