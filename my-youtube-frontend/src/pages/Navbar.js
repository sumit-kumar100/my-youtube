import React from 'react';
import Cookie from 'js-cookie';
import axios from 'axios';
import Sidebar from './Sidebar';
import * as Constants from "../Constants";
import SweetAlert from 'react-bootstrap-sweetalert';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UpdateAuthStatus } from '../store/authentication/auth';
import { HiMenu } from 'react-icons/hi';
import { AiOutlineSearch } from 'react-icons/ai';
import { IoIosVideocam, IoIosNotifications } from 'react-icons/io';
import { MdApps } from 'react-icons/md';
import { BiUserCircle } from 'react-icons/bi';
import { ImYoutube2 } from 'react-icons/im';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { NotificationContainer, NotificationManager } from 'react-notifications';



const Header = () => {
    const navigate = useNavigate();

    // Search Items
    const [searchItem, setSearchItem] = useState([]);
    const [show, setShow] = useState(false);

    // User Info From React-Redux
    const is_authenticated = useSelector(state => state.auth.user.is_authenticated);

    // For Updating User Info React-Redux
    const dispatch = useDispatch();

    // Showing SideBar OnClick Event
    const [showNotification, setShowNotification] = useState(false);
 
    // Logout User
    const HandleLogout = () => {
        Cookie.remove('access_key');
        Cookie.remove('userInfo');
        Cookie.remove('HasChannel')
        dispatch(UpdateAuthStatus({ Access: false, userInfo: {}, HasChannel: false }));
        NotificationManager.warning('Logged Out Successfully !');
        navigate('/')
    }

    // handleOnSelect
    const handleOnSelect = (item) => {
        try {
            var modal = document.getElementById("Search-Modal");
            modal.style.display = "none";
        }
        catch (error) {
            console.log(error)
        }
        navigate(`/search?q=${item.title.replace(/\s/g, '+').replace(/[\]']+/g, '')}`)
    }

    // formatResult
    const formatResult = (item) => {
        return (<small className='text-dark'>{item}</small>);
    }

    // HandleOnSearch
    const handleOnSearch = (string, result) => {
        axios.get(
            `${Constants.api}/api/video/?search=${string.replace(/\s/g, '+').replace(/[\]']+/g, '')}`
        )
            .then((response) => {
                setSearchItem(response.data)
            })
            .catch((error) => {
                console.log(error)
            })
        var Suggest = document.getElementsByClassName('sc-bwzfXH bWZouD')
        var IncreaseZindex1 = document.getElementById('IncreaseZindex-1')
        var IncreaseZindex2 = document.getElementById('IncreaseZindex-2')
        if (IncreaseZindex1 !== null && IncreaseZindex2 !== null) {
            if (Suggest.length > 0) {
                IncreaseZindex1.style.zIndex = '-2'
                IncreaseZindex2.style.zIndex = '-2'
            }
            else {
                IncreaseZindex1.style.zIndex = '1'
                IncreaseZindex2.style.zIndex = '1'
            }
            window.onclick = () => {
                IncreaseZindex1.style.zIndex = '1'
                IncreaseZindex2.style.zIndex = '1'
            }
        }
    }

    // handleEnter
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            try {
                var modal = document.getElementById("Search-Modal");
                modal.style.display = "none";
            }
            catch (error) {
                console.log(error)
            }
            let query_text = ""
            let query = document.getElementsByClassName("sc-ifAKCX dQCgGj")[0].getElementsByTagName('input')[0]
            query.value === '' ?
                query_text = document.getElementsByClassName("sc-ifAKCX dQCgGj")[1].getElementsByTagName('input')[0].value
                :
                query_text = query.value

            navigate(`/search/?q=${query_text}`)
        }
    }

    // handleMouseOut
    const handleMouseOut = (e) => {
        var Suggest = document.getElementsByClassName('sc-bwzfXH bWZouD')
        var IncreaseZindex1 = document.getElementById('IncreaseZindex-1')
        var IncreaseZindex2 = document.getElementById('IncreaseZindex-2')
        if (IncreaseZindex1 !== null && IncreaseZindex2 !== null) {
            if (Suggest.length > 0) {
                IncreaseZindex1.style.zIndex = '-2'
                IncreaseZindex2.style.zIndex = '-2'
            }
            else {
                IncreaseZindex1.style.zIndex = '1'
                IncreaseZindex2.style.zIndex = '1'
            }
            window.onclick = () => {
                IncreaseZindex1.style.zIndex = '1'
                IncreaseZindex2.style.zIndex = '1'
            }
        }
    }

    // onConfirm
    const onConfirm = () => {
        setShowNotification(false)
    }

    useEffect(() => {
        var EnterBtn = document.querySelectorAll('[spellcheck=false]');
        for (let i = 0; i < EnterBtn.length; i++) {
            EnterBtn[i].addEventListener("keyup", handleEnter)
            EnterBtn[i].addEventListener("mouseout", handleMouseOut)
        }
    })


    return (
        <>
            <NotificationContainer />
            {
                showNotification ?
                    <SweetAlert
                        title="Uh oh!"
                        onConfirm={onConfirm}
                    >
                        This feature is currently disabled..
                    </SweetAlert>
                    : (
                        ""
                    )
            }

            <div id="Search-Modal" className="Search-Modal" style={{ zIndex: 999 }} onClick={(e) => {
                e.target.id === 'Search-Modal' ? e.target.style.display = 'none' : console.log("Don't Hide Modal")
            }}>
                <div className="Search-Modal-Content">
                    <div className="small__header__search">
                        <div
                            style={{ width: '500px' }}
                            id='search-div'
                        >
                            <ReactSearchAutocomplete
                                items={searchItem || []}
                                onSearch={handleOnSearch}
                                onSelect={handleOnSelect}
                                fuseOptions={{ keys: ["title"] }}
                                resultStringKeyName="title"
                                formatResult={formatResult}
                                styling={{
                                    boxShadow: 'none',
                                    height: '35px',
                                    clearIconMargin: '0px 10px 0 0'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="header">
                <div className="header__left">
                    <i className="material-icons" onClick={() => setShow(show => !show)}>
                        <HiMenu
                            size="20"
                            color="black"
                        />
                    </i>
                    <Link to="/">
                        <i className="material-icons ms-3">
                            <ImYoutube2
                                size="60"
                                color="red"
                            />
                        </i>
                    </Link >
                </div>

                <div
                    className="d-none d-md-block"
                    style={{ width: '550px' }}
                    id='search-div'
                >
                    <ReactSearchAutocomplete
                        items={searchItem}
                        onSearch={handleOnSearch}
                        onSelect={handleOnSelect}
                        fuseOptions={{ keys: ["title"] }}
                        resultStringKeyName="title"
                        formatResult={formatResult}
                        styling={{
                            borderRadius: "0px",
                            boxShadow: 'none',
                            height: '35px',
                            clearIconMargin: '0px 10px 0 0'
                        }}
                    />
                </div>

                <div className="header__icons">
                    <i
                        className="material-icons display-this d-md-none"
                        id='Search-Button'
                        onClick={() => {
                            var modal = document.getElementById("Search-Modal");
                            modal.style.display = "block";
                        }}><AiOutlineSearch size="22" /></i>
                    <i
                        className="material-icons"
                        onClick={() => { setShowNotification(true) }}
                    >
                        <IoIosVideocam size="22" />
                    </i>
                    <i
                        className="material-icons d-none d-md-inline"
                        onClick={() => { setShowNotification(true) }}
                    >
                        <MdApps size="22" />
                    </i>
                    <i
                        className="material-icons"
                        onClick={() => { setShowNotification(true) }}
                    >
                        <IoIosNotifications size="22" />
                    </i>
                    {
                        is_authenticated ?
                            <button
                                className='btn btn-sm btn-outline-primary mx-2'
                                style={{ boxShadow: 'none' }}
                                onClick={() => { HandleLogout() }}
                            >
                                <BiUserCircle size="20" />
                                <small className="fw-bold">SIGN OUT</small>
                            </button>
                            :
                            <Link to="/authorization/credentials/login">
                                <button
                                    className='btn btn-sm btn-outline-primary mx-2'
                                    style={{ boxShadow: 'none' }}
                                >
                                    <BiUserCircle size="20" />
                                    <small className="fw-bold">SIGN IN</small>
                                </button>
                            </Link>
                    }

                </div>
            </div>
            <Sidebar show={show} setShow={() => setShow(setShow)} />
        </>
    )
}

export default Header;