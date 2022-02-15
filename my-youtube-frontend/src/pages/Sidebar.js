import React from 'react';
import axios from 'axios';
import * as Constants from "../Constants";
import Cookie from 'js-cookie';
import { UpdateAuthStatus } from '../store/authentication/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BsFillPlayFill } from 'react-icons/bs';
import { HiFire, HiMenu } from 'react-icons/hi';
import { ImYoutube2, ImCross } from 'react-icons/im';
import { AiFillHome, AiFillLike } from 'react-icons/ai';
import { MdLibraryAddCheck, MdSubscriptions, MdOutlineHistory } from 'react-icons/md';


const Sidebar = () => {
    // routerHistory
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // User & Channel Info From React-Redux
    const is_authenticated = useSelector(state => state.auth.user.is_authenticated);
    const userInfo = useSelector(state => state.auth.user.userInfo);
    const HasChannel = useSelector(state => state.auth.user.HasChannel);

    // Hiding SideBar
    const HandleMenuClick = () => {
        let sidebar = document.getElementById('sidebar-nav')
        sidebar.style.display = 'none';
    }

    // Creating Channel Method
    const HandleCreateChannel = (e) => {
        e.preventDefault();
        let data = {
            name: document.getElementById('channel-name').value,
            user: userInfo
        }
        axios.post(
            `${Constants.api}/api/channel/`, data
        )
            .then((response) => {
                if (response) {
                    let Create_Channel_Modal = document.getElementsByClassName('custom-modal')[0]
                    Create_Channel_Modal.style.display = 'none';
                    Cookie.set('HasChannel', true)
                    dispatch(UpdateAuthStatus({
                        Access: is_authenticated, userInfo: userInfo, HasChannel: true
                    }));
                    navigate('/my-channel/');
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }

    return <>
        {/* Create Channel Model  */}
        <div
            className="custom-modal"
            style={{ display: 'none' }}
        >
            <div className="custom-modal-vertical-center bg-white col-11 col-md-6 h-auto">
                <div className="crosss-btn">
                    <span
                        className="float-end mt-2 me-3"
                        style={{ cursor: 'pointer' }}
                        onClick={(e) => {
                            let Create_Channel_Modal = document.getElementsByClassName('custom-modal')[0]
                            Create_Channel_Modal.style.display = 'none';
                        }}
                    >
                        <ImCross color="gray" />
                    </span>
                </div>
                <div className="image-contianer">
                    <img
                        src="https://www.gstatic.com/youtube/img/channels/madison_channel_illustration.svg"
                        alt='create-channel'
                    />
                </div>
                <div className="create-section overflow-auto m-2 p-3">
                    <h4 className="fw-normal text-center">
                        Create your channel name
                    </h4>
                    <p className="text-muted">
                        You can use your brand's name or another name. A good channel name represents you and your content. You can change your channel name at any time.
                    </p>
                    <form
                        method="post"
                        onSubmit={(e) => HandleCreateChannel(e)}
                    >
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control shadow-none"
                                placeholder="Channel name"
                                name="channel-name"
                                id='channel-name'
                                required
                            />
                            <label htmlFor="floatingPassword">
                                Channel name
                            </label>
                        </div>
                        <div className="form-check d-flex mb-5 ms-2">
                            <input
                                className="form-check-input me-2 shadow-none"
                                type="checkbox"
                                required
                            />
                            <label
                                className="form-check-label"
                                htmlFor="form2Example3"
                            >
                                I agree all statements in <span className="text-decoration-none">Terms of service</span>
                            </label>
                        </div>
                        <div className="button text-center">
                            <span
                                className="btn btn-danger shadow-none mx-2 rounded-0"
                                onClick={(e) => {
                                    let Create_Channel_Modal = document.getElementsByClassName('custom-modal')[0]
                                    Create_Channel_Modal.style.display = 'none';
                                }}
                            >
                                Cancel
                            </span>
                            <button
                                className="btn btn-primary shadow-none mx-2 rounded-0"
                                type="submit"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {/* SideBar Starts */}
        <div className="sidebar" id="sidebar-nav">
            <div className="header__left">
                <i
                    className="material-icons"
                    onClick={HandleMenuClick}
                    style={{ paddingLeft: '22px', marginTop: '-2px', cursor: 'pointer' }}
                >
                    <HiMenu
                        size="20"
                        color="black"
                    />
                </i>
                <span
                    onClick={() => {
                        HandleMenuClick();
                        navigate('/');
                    }}>
                    <i
                        className="material-icons ms-3"
                        style={{ paddingLeft: '14px', cursor: 'pointer' }}
                    >
                        <ImYoutube2
                            size="60"
                            color="red"
                        />
                    </i>
                </span>
            </div>
            <div className="sidebar__categories">
                <span
                    onClick={() => {
                        HandleMenuClick();
                        navigate('/');
                    }}
                    className='link'
                >
                    <div className="sidebar__category">
                        <i className="material-icons">
                            <AiFillHome />
                        </i>
                        <span>
                            Home
                        </span>
                    </div>
                </span>
                <div className="sidebar__category">
                    <i className="material-icons">
                        <HiFire />
                    </i>
                    <span>
                        Trending <small style={{ fontSize: '10px' }}>[ Unavailable ]</small>
                    </span>
                </div>
                <div
                    className="sidebar__category"
                    onClick={() => {
                        HandleMenuClick();
                        is_authenticated ?
                            navigate('/subscription')
                            :
                            navigate('/authorization/credentials/login')
                    }}>
                    <i className="material-icons">
                        <MdSubscriptions />
                    </i>
                    <span>Subcriptions</span>
                </div>
            </div>
            <hr />
            <div className="sidebar__categories">
                {
                    (() => {
                        if (HasChannel === true) {
                            return (
                                <div
                                    className="sidebar__category"
                                    onClick={() => {
                                        HandleMenuClick();
                                        navigate('/my-channel')
                                    }}>
                                    <i className="material-icons">
                                        <MdLibraryAddCheck />
                                    </i>
                                    <span>Your Channel</span>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div
                                    className="sidebar__category"
                                    onClick={(e) => {
                                        HandleMenuClick();
                                        if (is_authenticated === true) {
                                            let Create_Channel_Modal = document.getElementsByClassName('custom-modal')[0]
                                            Create_Channel_Modal.style.display = 'block';
                                            let sidebar = document.getElementById('sidebar-nav')
                                            sidebar.style.display = 'none';
                                        }
                                        else {
                                            navigate('/authorization/credentials/login')
                                        }
                                    }}>
                                    <i className="material-icons">
                                        <MdLibraryAddCheck />
                                    </i>
                                    <span>Create Channel</span>
                                </div>
                            )
                        }
                    })()
                }
                <div
                    className="sidebar__category"
                    onClick={() => {
                        HandleMenuClick();
                        is_authenticated ?
                            navigate('/uploads')
                            :
                            navigate('/authorization/credentials/login')
                    }}>
                    <i className="material-icons">
                        <BsFillPlayFill />
                    </i>
                    <span>
                        Your Videos
                    </span>
                </div>
                <div
                    className="sidebar__category"
                    onClick={() => {
                        HandleMenuClick();
                        is_authenticated ?
                            navigate('/liked-videos')
                            :
                            navigate('/authorization/credentials/login')
                    }}>
                    <i className="material-icons">
                        <AiFillLike />
                    </i>
                    <span>
                        Liked Videos
                    </span>
                </div>
                <div className="sidebar__category">
                    <i className="material-icons">
                        <MdOutlineHistory />
                    </i>
                    <span>
                        History <small style={{ fontSize: '10px' }}>[ Unavailable ]</small>
                    </span>
                </div>
            </div>
            <hr />
        </div>
    </>
}

export default Sidebar
