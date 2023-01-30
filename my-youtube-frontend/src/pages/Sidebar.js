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
import { MdLibraryAddCheck, MdSubscriptions } from 'react-icons/md';
import { Drawer, Box, ListItem, ListItemButton, ListItemText, List, ListItemIcon, Divider } from '@mui/material'



const Sidebar = ({ show, setShow }) => {
    // routerHistory
    const navigate = useNavigate();
    const dispatch = useDispatch();


    // User & Channel Info From React-Redux
    const is_authenticated = useSelector(state => state.auth.user.is_authenticated);
    const userInfo = useSelector(state => state.auth.user.userInfo);
    const HasChannel = localStorage.getItem('HasChannel');

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

    const handleChannelClick = () => {
        setShow(() => !show);
        if (HasChannel === true && is_authenticated === true) {
            navigate('/my-channel');
            return;
        }
        if (is_authenticated === true) {
            let Create_Channel_Modal = document.getElementsByClassName('custom-modal')[0]
            Create_Channel_Modal.style.display = 'block';
            let sidebar = document.getElementById('sidebar-nav')
            sidebar.style.display = 'none';
        }
        else {
            navigate('/authorization/credentials/login')
        }
    }

    return (
        <>
            <Drawer open={show} onClose={() => setShow(() => !show)}>
                <Box sx={{ width: 250 }} role="presentation">
                    <List>
                        <ListItem key={"Home"} disablePadding>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                                <ListItemIcon>
                                    <HiMenu style={{ cursor: 'pointer' }} size="20" color="black" onClick={() => setShow(() => !show)} />
                                </ListItemIcon>
                                <ListItemIcon>
                                    <ImYoutube2 size="60" color="red" />
                                </ListItemIcon>
                            </Box>
                        </ListItem>
                        <ListItem
                            key={"Home"}
                            disablePadding
                            onClick={() => {
                                setShow(() => !show)
                                navigate('/');
                            }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AiFillHome />
                                </ListItemIcon>
                                <ListItemText primary={"Home"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            key={"Subcriptions"}
                            disablePadding
                            onClick={() => {
                                setShow(() => !show)
                                is_authenticated ?
                                    navigate('/subscription')
                                    :
                                    navigate('/authorization/credentials/login')
                            }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <MdSubscriptions />
                                </ListItemIcon>
                                <ListItemText primary={"Subcriptions"} />
                            </ListItemButton>
                        </ListItem>
                        <Divider />
                        <ListItem
                            key={HasChannel === true ? "Your Channel" : "Create Channel"}
                            disablePadding
                            onClick={handleChannelClick}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <MdLibraryAddCheck />
                                </ListItemIcon>
                                <ListItemText primary={HasChannel === true ? "Your Channel" : "Create Channel"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            key={"Your Videos"}
                            disablePadding
                            onClick={() => {
                                setShow(() => !show)
                                is_authenticated ?
                                    navigate('/uploads')
                                    :
                                    navigate('/authorization/credentials/login')
                            }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <BsFillPlayFill />
                                </ListItemIcon>
                                <ListItemText primary={"Your Videos"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            key={"Liked Videos"}
                            disablePadding
                            onClick={() => {
                                setShow(() => !show)
                                is_authenticated ?
                                    navigate('/liked-videos')
                                    :
                                    navigate('/authorization/credentials/login')
                            }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AiFillLike />
                                </ListItemIcon>
                                <ListItemText primary={"Liked Videos"} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            key={"Trending"}
                            disablePadding
                            onClick={() => {
                                setShow(() => !show)
                                navigate('/');
                            }}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HiFire />
                                </ListItemIcon>
                                <ListItemText primary={"Trending"} />
                            </ListItemButton>
                        </ListItem>
                    </List>
                </Box>
            </Drawer>
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
                            <div className="button text-center rounded">
                                <span
                                    className="btn btn-danger shadow-none mx-2 px-5 rounded-pill"
                                    onClick={(e) => {
                                        let Create_Channel_Modal = document.getElementsByClassName('custom-modal')[0]
                                        Create_Channel_Modal.style.display = 'none';
                                    }}
                                >
                                    Cancel
                                </span>
                                <button
                                    className="btn btn-primary shadow-none mx-2 px-5 rounded-pill"
                                    type="submit"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Sidebar;