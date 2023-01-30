import React from 'react';
import axios from 'axios';
import Loading from './Loading';
import * as Constants from "../Constants";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


const Subscription = () => {

    // User Info From React-Redux
    const navigate = useNavigate();
    const userInfo = useSelector(state => state.auth.user.userInfo);
    const is_authenticated = useSelector(state => state.auth.user.is_authenticated);

    // Subscription State
    const [subscription, setSubscription] = useState([]);
    const [showLoading, setShowLoading] = useState(true);

    // UseEffect
    useEffect(() => {
        axios.get(
            `${Constants.api}/api/subscription/?user__id=${userInfo}`
        )
            .then((response) => {
                response.data.length > 0 ? setSubscription(response.data) : setShowLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [userInfo, is_authenticated])

    return (
        <div className="container subscription-sections">
            {/* Subscription Section Starts */}
            <h5 className="fw-bold">
                Subscriptions
            </h5>
            <div className="subscription-video-section p-1">
                {subscription.length ?
                    subscription.map((item) => {
                        return (
                            <div
                                className="author d-flex p-2"
                                key={item.id}
                            >
                                <img
                                    src={`${Constants.api}/media/${item.channelThumbnail}`}
                                    alt=""
                                />
                                <span className='text-dark'>
                                    {item.channelTitle}
                                    <br />
                                    Joined {
                                        (() => {
                                            let date = new Date();
                                            let [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
                                            return `${Constants.monthNames[month]} ${day}, ${year}`
                                        })()
                                    }
                                    <span
                                        className="float-end d-block ms-3 text-primary text-decoration-underline"
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <small onClick={() => {
                                            if (is_authenticated) {
                                                axios.get(`${Constants.api}/api/channel/?id=&user__id=${userInfo}`)
                                                    .then((response) => {
                                                        if (response.data.length) {
                                                            if (response.data[0].id === item.channel) {
                                                                navigate('/my-channel');
                                                            }
                                                            else {
                                                                navigate(`/channel-info/?channel_jsx_info=${item.channel}`);
                                                            }
                                                        }
                                                        else {
                                                            navigate(`/channel-info/?channel_jsx_info=${item.channel}`);
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                    })
                                            }
                                            else {
                                                navigate('/authorization/credentials/login');
                                            }
                                        }}>visit channel ?</small></span>
                                </span>
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
    )
}

export default Subscription;
