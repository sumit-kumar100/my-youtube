import axios from 'axios';
import React from 'react';
import Loading from './Loading';
import * as Constants from "../Constants";
import Upload from './Upload';
import Subscription from './Subscription';
import Cookie from 'js-cookie';
import ReactLoading from 'react-loading';
import { UpdateAuthStatus } from '../store/authentication/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaUpload } from 'react-icons/fa';


const MyChannel = () => {

    const dispatch = useDispatch();


    // User Info From React-Redux
    const navigate = useNavigate();
    const is_authenticated = useSelector((state) => state.auth.user.is_authenticated);
    const userInfo = useSelector((state) => state.auth.user.userInfo);

    // Channel , Upload and Subscription State
    const [channel, setChannel] = useState([]);
    const [category, setCategory] = useState([]);
    const [showLoading, setShowLoading] = useState(true);


    // InitialMount State
    const [isInitialMount, setisInitialMount] = useState(true);

    // Initial Video Upload State
    const [video, setVideo] = useState({
        "title": "",
        "video_id": "",
        "description": "",
        "category": ""
    })

    // UseEffect
    useEffect(() => {
        axios.get(
            `${Constants.api}/api/channel/?user__id=${userInfo}`
        )
            .then((response) => {
                response.data.length > 0 ? setChannel(response.data) : setShowLoading(false)
            })
            .catch((error) => {
                console.log(error);
            })
        axios.get(
            `${Constants.api}/api/category/`
        )
            .then((response) => {
                setCategory(response.data)
            })
        setisInitialMount(true);
    }, [userInfo, is_authenticated, isInitialMount])

    // Change Section i.e, Uploads to Videos etc...
    const HandleChange = (e) => {
        let nodes = e.target.parentNode.childNodes;
        for (let i = 0; i < nodes.length; i++) {
            let child = nodes[i]
            child.className = "px-4 py-1";
        }
        e.target.className = 'flex-nav-active px-4 py-1';
        let sections = document.getElementById('Main-Section').childNodes
        for (let i = 0; i < sections.length; i++) {
            let child = sections[i]
            if (e.target.id === child.id) {
                child.style.display = 'block'
            }
            else {
                child.style.display = 'none'
            }
        }
    }

    // Update Initial Video Upload State
    const UpdateInput = (e) => {
        setVideo({ ...video, [e.target.name]: e.target.value });
    }

    // Handle Video Upload to Backedn
    const HandleUploadVideo = (e) => {
        e.preventDefault();
        let loading = document.getElementsByClassName('custom-modal')[2]
        loading.style.display = 'block';
        // Creating FormData Object
        const data = new FormData();
        data.append('title', video.title);
        data.append('thumbnail', document.getElementsByName('thumbnail')[0].files[0]);
        data.append('video_id', video.video_id);
        data.append('description', video.description);
        data.append('category', video.category);
        data.append('channel', channel[0].id);
        axios.post(`${Constants.api}/api/video/`, data)
            .then((response) => {
                loading.style.display = 'none';
                document.getElementsByClassName('custom-modal')[1].style.display = 'none'
                document.getElementById('form-for-video-post').reset()
                NotificationManager.success('Video Uploaded Successfully');
                setisInitialMount(false);
                navigate('/uploads');
            })
            .catch((error) => {
                console.log(error);
            })
    }

    const DeleteChannel = () => {
        let decision = window.confirm("Are you sure you want to delete channel")
        if (decision) {
            axios.delete(
                `${Constants.api}/api/channel/${channel[0].id}`
            )
                .then((response) => {
                    if (response) {
                        Cookie.set('HasChannel', false)
                        dispatch(UpdateAuthStatus({
                            Access: is_authenticated,
                            userInfo: userInfo,
                            HasChannel: false
                        }));
                        navigate('/');
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    return <>
        {/* Video Upload Modal Default Display None */}
        <div className="custom-modal">
            <div
                className="custom-modal-vertical-center bg-white col-11 col-md-6 h-auto"
            >
                <div className="create-section overflow-auto m-2 p-3">
                    <h4 className="fw-normal text-center mb-3 fw-bold">
                        Upload Video
                    </h4>
                    <form
                        method="post"
                        id='form-for-video-post'
                        onSubmit={(e) => HandleUploadVideo(e)}
                        autoComplete="off"
                    >
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control shadow-none"
                                placeholder="title"
                                name="title"
                                value={video.title}
                                onChange={e => UpdateInput(e)}
                                required
                            />
                            <label htmlFor="title" >
                                Title
                            </label>
                        </div>
                        <label
                            htmlFor="thumbnail"
                            className="p-1 fw-bold">
                            Thubnail Image
                        </label>
                        <div className="form-floating mb-3">
                            <input
                                type="file"
                                className="form-control p-3 shadow-none"
                                placeholder="thumbnail"
                                name="thumbnail"
                                required
                            />
                        </div>
                        <div className="form-floating mb-3">
                            <input
                                type="text"
                                className="form-control shadow-none"
                                placeholder="video_id"
                                name="video_id"
                                value={video.video_id}
                                onChange={e => UpdateInput(e)}
                                required
                            />
                            <label htmlFor="video_id">
                                Youtube Video Id
                            </label>
                        </div>
                        <div className="form-floating mb-3">
                            <textarea
                                name="description"
                                className="form-control shadow-none"
                                style={{ height: '100px' }}
                                placeholder="description"
                                value={video.description}
                                onChange={e => UpdateInput(e)}
                                required id=""
                                cols="30"
                                rows="10"
                            ></textarea>
                            <label htmlFor="description">
                                Description
                            </label>
                        </div>
                        <div className="mb-3">
                            <select
                                className="form-select shadow-none"
                                aria-label="Default select example"
                                name="category"
                                onChange={e => UpdateInput(e)}
                                required>
                                <option >Select Category</option>
                                {
                                    category.length ?
                                        category.map((cat) => {
                                            return (
                                                <option value={`${cat.id}`} key={cat.id}>{cat.title}</option>
                                            )
                                        })
                                        :
                                        null
                                }
                            </select>
                        </div>
                        <div className="button text-center">
                            <span
                                className="btn btn-danger shadow-none mx-2 rounded-0"
                                onClick={(e) => {
                                    let Create_Video_Modal = document.getElementsByClassName('custom-modal')[1]
                                    console.log(Create_Video_Modal)
                                    Create_Video_Modal.style.display = 'none';
                                }}>
                                Cancel
                            </span>
                            <button
                                className="btn btn-primary shadow-none mx-2 rounded-0"
                                type="submit"
                            >
                                Upload
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div className='custom-modal'>
            <div className="custom-modal-vertical-center">
                <ReactLoading type={'spin'} />
            </div>
        </div>
        {channel.length ?
            channel.map((data) => {
                return (
                    <div
                        className='container-fluid'
                        key={data.id}
                    >
                        {/* Channel Section Top */}
                        <div className="top-section d-flex p-4">
                            {data.thumnail ?
                                <div className="profile-pic">
                                    <label
                                        className="-label"
                                        htmlFor="file"
                                    >
                                        <small className="glyphicon glyphicon-camera"></small>
                                        <small>
                                            Change Image
                                        </small>
                                    </label>
                                    <input
                                        id="file"
                                        type="file"
                                        onChange={(e) => {
                                            const file = new FormData();
                                            file.append('id', data.id);
                                            file.append('thumnail', e.target.files[0]);
                                            axios.patch(`${Constants.api}/api/channel/${data.id}/`, data = file)
                                                .then((response) => {
                                                    setisInitialMount(false);
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                })
                                        }} />
                                    <img
                                        src={data.thumnail}
                                        alt=""
                                        id="output"
                                    />
                                </div>
                                :
                                <div className="profile-pic bg-dark rounded-circle">
                                    <label
                                        className="-label"
                                        htmlFor="file"
                                    >
                                        <small className="glyphicon glyphicon-camera"></small>
                                        <small>
                                            Change Image
                                        </small>
                                    </label>
                                    <input
                                        id="file"
                                        type="file"
                                        onChange={(e) => {
                                            const image = e.target.files[0];
                                            const file = new FormData();
                                            file.append('id', data.id);
                                            file.append('thumnail', image);
                                            axios.patch(`${Constants.api}/api/channel/${data.id}/`, data = file)
                                                .then((response) => {
                                                    setisInitialMount(false);
                                                })
                                                .catch((error) => {
                                                    console.log(error);
                                                })
                                        }} />
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
                        <div className="container flex-nav">
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
                                    Videos
                                </li>
                                <li
                                    className="px-4 py-1"
                                    onClick={(e) => HandleChange(e)}
                                    id='Channel-Section'
                                >
                                    Channels
                                </li>
                                <li
                                    className="px-4 py-1"
                                    onClick={(e) => HandleChange(e)}
                                    id='About-Section'
                                >
                                    About
                                </li>
                            </ul>
                        </div>
                        {/* Channel Section Front */}
                        <div
                            className="container main-section p-3"
                            id="Main-Section"
                        >
                            <div id="Home-Section">
                                {/* Uploads */}
                                <div
                                    className="uploads-sections overflow-auto"
                                    style={{ height: "250px" }}
                                >
                                    <Upload />
                                </div>
                                <br />
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
                                className='container'
                                style={{ display: 'none' }}
                            >
                                <div className="uploads-sections">
                                    <button
                                        className="btn btn-sm btn-outline-danger shadow-none mb-2"
                                        onClick={(e) => {
                                            is_authenticated ?
                                                document.getElementsByClassName('custom-modal')[1].style.display = 'block'
                                                :
                                                navigate('/authorization/credentials/login/')
                                        }}>
                                        Upload <span className="ms-2">
                                            <FaUpload />
                                        </span>
                                    </button>
                                    <div
                                        className="uploads-sections overflow-auto"
                                        style={{ height: "250px" }}
                                    >
                                        <Upload />
                                    </div>
                                </div>
                            </div>
                            {/* Channel Section Subscription */}
                            <div
                                id="Channel-Section"
                                className='container'
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
                                className='container'
                                style={{ display: 'none' }}
                            >
                                <p>
                                    {data.about}
                                </p>
                                <span>
                                    Joined on {
                                        (() => {
                                            let date = new Date();
                                            let [month, day, year] = [date.getMonth(), date.getDate(), date.getFullYear()];
                                            return `${Constants.monthNames[month]} ${day}, ${year}`
                                        })()
                                    }
                                </span>
                                <br /><br />
                                <button
                                    className='btn btn-sm btn-danger rounded-0 shadow-none'
                                    onClick={DeleteChannel}>
                                    Delete Channel
                                </button>
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

export default MyChannel;
