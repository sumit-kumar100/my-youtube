import React from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player/lazy';
import Loading from './Loading';
import * as Constants from "../Constants";
import SweetAlert from 'react-bootstrap-sweetalert';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { ImCross } from 'react-icons/im';
import { RiShareForwardLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import {
    AiOutlineLike,
    AiFillLike,
    AiOutlineDislike,
    AiFillDislike
} from 'react-icons/ai';
import {
    WhatsappShareButton,
    WhatsappIcon,
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    EmailShareButton,
    EmailIcon,
    LinkedinShareButton,
    LinkedinIcon,
    PinterestShareButton,
    PinterestIcon
} from "react-share";

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Watch = () => {

    // query and navigate
    const navigate = useNavigate();
    let query = useQuery();
    const v = query.get('v');

    // User Information State
    const userInfo = useSelector(state => state.auth.user.userInfo);
    const is_authenticated = useSelector(state => state.auth.user.is_authenticated);

    // InitialMount State
    const [isInitialMount, setisInitialMount] = useState(true);
    const [ShowShareModal, setShowShareModal] = useState(false);

    // Video-Channel and RelatedVideo State
    const [video, setVideo] = useState([]);
    const [channel, setChannel] = useState([]);
    const [related, setRelated] = useState([]);
    const [count, setCount] = useState(0);

    // Initial Like-Dislike and Subscribe State
    const [like, setLike] = useState(
        {
            like_id: '',
            is_liked: false
        }
    );
    const [dislike, setDislike] = useState(
        {
            dislike_id: '',
            is_disliked: false
        }
    );
    const [subscribe, setSubscribe] = useState(
        {
            subscribe_id: '',
            is_subscribed: false
        }
    );

    // Handling Like Event
    const HandleLike = () => {
        // Setting DisLike to False if there is Like
        if (dislike.is_disliked === true) {
            setDislike(prevState => ({
                ...prevState,
                is_disliked: false
            }))
            const x = document.getElementById('dislike-count')
            x.innerText = parseInt(x.innerText) - 1
            axios.delete(
                `${Constants.api}/api/dislike/${dislike.dislike_id}/`
            )
                .then((response) => {
                    setDislike(prevState => ({
                        ...prevState,
                        dislike_id: '',
                        is_disliked: false
                    }))
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        // If Video is not Liked
        if (is_authenticated === true && like.is_liked === false) {
            setLike(prevState => ({
                ...prevState,
                is_liked: true
            }))
            const x = document.getElementById('like-count')
            x.innerText = parseInt(x.innerText) + 1
            axios.post(
                `${Constants.api}/api/like/`,
                {
                    is_liked: true,
                    video: video[0].id,
                    user: userInfo
                }
            )
                .then((response) => {
                    setLike(prevState => ({
                        ...prevState,
                        like_id: response.data.id,
                        is_liked: true
                    }))
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        // If Video is Already Liked
        else if (is_authenticated === true && like.is_liked === true) {
            setLike(prevState => ({
                ...prevState,
                is_liked: false
            }))
            const x = document.getElementById('like-count')
            x.innerText = parseInt(x.innerText) - 1
            axios.delete(
                `${Constants.api}/api/like/${like.like_id}/`
            )
                .then((response) => {
                    setLike(prevState => ({
                        ...prevState,
                        like_id: '',
                        is_liked: false
                    }))
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        else {
            navigate('/authorization/credentials/login')
        }
    }

    // Handling Disike Event
    const HandleDislike = () => {
        // Setting Like to False if there is Like
        if (like.is_liked === true) {
            setLike(prevState => ({
                ...prevState,
                is_liked: false
            }))
            const x = document.getElementById('like-count')
            x.innerText = parseInt(x.innerText) - 1
            axios.delete(
                `${Constants.api}/api/like/${like.like_id}/`
            )
                .then((response) => {
                    setLike(prevState => ({
                        ...prevState,
                        like_id: '',
                        is_liked: false
                    }))
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        // If Video is not Disliked
        if (is_authenticated === true && dislike.is_disliked === false) {
            setDislike(prevState => ({
                ...prevState,
                is_disliked: true
            }))
            const x = document.getElementById('dislike-count')
            x.innerText = parseInt(x.innerText) + 1
            axios.post(
                `${Constants.api}/api/dislike/`,
                {
                    is_disliked: true,
                    video: video[0].id,
                    user: userInfo
                }
            )
                .then((response) => {
                    setDislike(prevState => ({
                        ...prevState,
                        dislike_id: response.data.id,
                        is_disliked: true
                    }))
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        // If Video is Already Disiked
        else if (is_authenticated === true && dislike.is_disliked === true) {
            setDislike(prevState => ({
                ...prevState,
                is_disliked: false
            }))
            const x = document.getElementById('dislike-count')
            x.innerText = parseInt(x.innerText) - 1
            axios.delete(
                `${Constants.api}/api/dislike/${dislike.dislike_id}/`
            )
                .then((response) => {
                    setDislike(prevState => ({
                        ...prevState,
                        dislike_id: '',
                        is_disliked: false
                    }))
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        else {
            navigate('/authorization/credentials/login')
        }
    }

    // Handling Comment
    const HandleCommentSubmit = (e) => {
        if (is_authenticated === true) {
            e.preventDefault();
            var text = document.getElementById('comment-text')
            if (text.value === '') {
                text = document.getElementById('comment-text2')
            }
            axios.post(
                `${Constants.api}/api/comment/`,
                {
                    describe: text.value,
                    video: video[0].id,
                    user: userInfo
                }
            )
                .then((response) => {
                    text.value = ''
                    setisInitialMount(false)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        else {
            navigate('/authorization/credentials/login')
        }
    }

    // HandleSubscribe
    const HandleSubscribe = () => {
        if (is_authenticated) {
            setSubscribe(prevState => ({
                ...prevState,
                is_subscribed: true
            }))
            let ct = document.getElementById('subscriber-count')
            ct.innerText = parseInt(ct.innerText) + 1
            axios.post(
                `${Constants.api}/api/subscription/`,
                {
                    is_subscribed: true,
                    channel: channel[0].id,
                    user: userInfo
                }
            )
                .then((response) => {
                    setSubscribe(prevState => ({
                        ...prevState,
                        subscribe_id: response.data.id,
                        is_subscribed: true
                    }))
                })
                .catch((error) => {
                    setSubscribe(prevState => ({
                        ...prevState,
                        is_subscribed: false
                    }))
                })
        }
        else {
            navigate('/authorization/credentials/login')
        }
    }

    // HandleDisSubscribe
    const HandleDisSubscribe = () => {
        if (is_authenticated) {
            setSubscribe(prevState => ({
                ...prevState,
                is_subscribed: false
            }))
            let ct = document.getElementById('subscriber-count')
            ct.innerText = parseInt(ct.innerText) - 1
            axios.delete(
                `${Constants.api}/api/subscription/${subscribe.subscribe_id}`
            )
                .then((response) => {
                    setSubscribe(prevState => ({
                        ...prevState,
                        subscribe_id: '',
                        is_subscribed: false
                    }))
                })
                .catch((error) => {
                    setSubscribe(prevState => ({
                        ...prevState,
                        is_subscribed: true
                    }))
                })
        }
        else {
            navigate('/authorization/credentials/login')
        }
    }


    // UseEffect which sets video , channel , like , dislike , subscribe etc.
    useEffect(() => {
        if (v != null) {
            axios.get(
                `${Constants.api}/api/video/?video_id=${v}`
            )
                .then((videoResponse) => {
                    setVideo(videoResponse.data)
                    axios.get(
                        `${Constants.api}/api/video/?category__id=${videoResponse.data[0].category}`
                    )
                        .then((relatedResponse) => {
                            setRelated(relatedResponse.data)
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                    axios.get(
                        `${Constants.api}/api/channel/?id=${videoResponse.data[0].channel}`
                    )
                        .then((channelResponse) => {
                            setChannel(channelResponse.data)
                            if (is_authenticated) {
                                axios.get(
                                    `${Constants.api}/api/subscription/?channel__id=${channelResponse.data[0].id}&user__id=${userInfo}`
                                )
                                    .then((subscribeResponse) => {
                                        if (subscribeResponse.data.length) {
                                            setSubscribe(prevState => ({
                                                ...prevState,
                                                subscribe_id: subscribeResponse.data[0].id,
                                                is_subscribed: true
                                            }))
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })
                            }
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                    if (is_authenticated) {
                        axios.get(
                            `${Constants.api}/api/like/?video__id=${videoResponse.data[0].id}&user__id=${userInfo}`
                        )
                            .then((likeResponse) => {
                                if (likeResponse.data.length) {
                                    setLike(prevState => ({
                                        ...prevState,
                                        like_id: likeResponse.data[0].id,
                                        is_liked: true
                                    }))
                                }
                                else {
                                    setLike(prevState => ({
                                        ...prevState,
                                        like_id: '',
                                        is_liked: false
                                    }))
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                        axios.get(
                            `${Constants.api}/api/dislike/?video__id=${videoResponse.data[0].id}&user__id=${userInfo}`
                        )
                            .then((dislikeResponse) => {
                                if (dislikeResponse.data.length) {
                                    setDislike(prevState => ({
                                        ...prevState,
                                        dislike_id: dislikeResponse.data[0].id,
                                        is_disliked: true
                                    }))
                                }
                                else {
                                    setDislike(prevState => ({
                                        ...prevState,
                                        dislike_id: '',
                                        is_disliked: false
                                    }))
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
            setisInitialMount(true);
        }
    }, [v, isInitialMount, is_authenticated, userInfo])

    return <>
        {ShowShareModal ?
            <SweetAlert
                title=""
                showConfirm={false}
                showCloseButton
                onConfirm={() => { return null }}
                closeOnClickOutside={true}
            >
                <div className="title-upper">
                    <span
                        className="float-end"
                        style={
                            {
                                cursor: 'pointer',
                                marginTop: '-17px'
                            }
                        }
                        onClick={() => { setShowShareModal(false) }}
                    >
                        <ImCross color="black" />
                    </span>
                </div>
                <br />
                <div className="d-flex overflow-auto">
                    <div className="mx-3">
                        <WhatsappShareButton
                            url={Constants.website + '/watch?v=' + video[0].video_id}
                        >
                            <WhatsappIcon
                                size={50}
                                round={true}
                            />
                        </WhatsappShareButton>
                    </div>
                    <div className="mx-3">
                        <FacebookShareButton
                            url={Constants.website + '/watch?v=' + video[0].video_id}
                        >
                            <FacebookIcon
                                size={50}
                                round={true}
                            />
                        </FacebookShareButton>
                    </div>
                    <div className="mx-3">
                        <TwitterShareButton
                            url={Constants.website + '/watch?v=' + video[0].video_id}
                        >
                            <TwitterIcon
                                size={50}
                                round={true}
                            />
                        </TwitterShareButton>
                    </div>
                    <div className="mx-3">
                        <EmailShareButton
                            url={Constants.website + '/watch?v=' + video[0].video_id}
                        >
                            <EmailIcon
                                size={50}
                                round={true}
                            />
                        </EmailShareButton>
                    </div>
                    <div className="mx-3">
                        <PinterestShareButton
                            url={Constants.website + '/watch?v=' + video[0].video_id}
                            media={video[0].thumbnail}
                        >
                            <PinterestIcon
                                size={50}
                                round={true}
                            />
                        </PinterestShareButton>
                    </div>
                    <div className="mx-3">
                        <LinkedinShareButton
                            url={Constants.website + '/watch?v=' + video[0].video_id}
                        >
                            <LinkedinIcon
                                size={50}
                                round={true}
                            />
                        </LinkedinShareButton>
                    </div>
                </div>
                <br />
            </SweetAlert>
            : (
                ""
            )
        }

        {/* Video Section */}
        {video.length ?
            video.map((item) => {
                return (<div
                    className="container"
                    key={item.id}
                >
                    <div className="row">
                        <div
                            className="col-12 col-lg-7 border border-0 border-end"
                        >
                            <div
                                className="ratio ratio-16x9 img-thumbnail"
                                id="IncreaseZindex-1"
                            >
                                <ReactPlayer
                                    height="100%"
                                    width="100%"
                                    url={`https://www.youtube.com/watch?v=${v}`}
                                    controls={true}
                                    onProgress={(e) => {
                                        setCount(count + 1)
                                        console.log(count)
                                        if (count === 20) {
                                            axios.get(
                                                'https://geolocation-db.com/json/'
                                            )
                                                .then((res) => {
                                                    axios.post(
                                                        `${Constants.api}/api/view/`,
                                                        {
                                                            is_view: true,
                                                            ip: res.data.IPv4,
                                                            video: video[0].id
                                                        })
                                                        .then((response) => {
                                                            console.log(response)
                                                            const x = document.getElementById('view-count');
                                                            const y = document.getElementById(`related-view-count-${video[0].id}`);
                                                            x.innerText = parseInt(x.innerText) + 1;
                                                            y.innerText = parseInt(y.innerText) + 1;
                                                        })
                                                        .catch((error) => {
                                                            console.log(error)
                                                        })
                                                })
                                        }
                                    }
                                    }
                                />
                            </div>
                            <br />
                            <h5 className='fw-light'>
                                {item.title}
                            </h5>
                            {/* Video Info Section */}
                            <div className="video-info-section d-flex pt-2">
                                <div
                                    className="view-count"
                                    id="watch-view-count"
                                >
                                    <small id='view-count'>
                                        {item.view.length}
                                    </small>
                                    <small className="ms-1">
                                        views
                                    </small>
                                    <small
                                        className='ms-4 d-none d-md-inline'
                                    >
                                        {(() => {
                                            const date = new Date(`${item.date}`)
                                            return Constants.timeAgo.format(date)
                                        })()}
                                    </small>
                                </div>
                                <div
                                    className="other-info-jxa d-flex gap-4"
                                    style={{ width: '35%' }}
                                >
                                    {
                                        is_authenticated && like.is_liked === true ?
                                            <>
                                                <div
                                                    className='d-flex'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={HandleLike}
                                                >
                                                    <div
                                                        className="icon-dic"
                                                    >
                                                        <AiFillLike
                                                            size='25'
                                                            style={{ marginTop: '-10px' }}
                                                            color='royalblue'
                                                        />
                                                    </div>
                                                    <div
                                                        className='px-2 text-primary'
                                                        id='like-count'
                                                    >
                                                        {item.like.length}
                                                    </div>
                                                </div>
                                                <div
                                                    className='d-flex'
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={HandleDislike}
                                                >
                                                    <div
                                                        className="icon-dic"
                                                    >
                                                        <AiOutlineDislike size='25' />
                                                    </div>
                                                    <div
                                                        className='px-2'
                                                        id='dislike-count'
                                                    >
                                                        {item.dislike.length}
                                                    </div>
                                                </div>
                                            </>
                                            : is_authenticated && dislike.is_disliked === true ?
                                                <>
                                                    <div
                                                        className='d-flex'
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={HandleLike}
                                                    >
                                                        <div
                                                            className="icon-dic"
                                                        >
                                                            <AiOutlineLike
                                                                size='25'
                                                                style={{ marginTop: '-10px' }}
                                                            />
                                                        </div>
                                                        <div
                                                            className='px-2'
                                                            id='like-count'
                                                        >
                                                            {item.like.length}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='d-flex'
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={HandleDislike}
                                                    >
                                                        <div className="icon-dic">
                                                            <AiFillDislike
                                                                size='25'
                                                                color="royalblue"
                                                            />
                                                        </div>
                                                        <div
                                                            className='px-2 text-primary'
                                                            id='dislike-count'
                                                        >
                                                            {item.dislike.length}
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <>
                                                    <div
                                                        className='d-flex'
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={HandleLike}
                                                    >
                                                        <div
                                                            className="icon-dic"
                                                        >
                                                            <AiOutlineLike
                                                                size='25'
                                                                style={{ marginTop: '-10px' }}
                                                            />
                                                        </div>
                                                        <div
                                                            className='px-2'
                                                            id='like-count'
                                                        >
                                                            {item.like.length}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='d-flex'
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={HandleDislike}
                                                    >
                                                        <div className="icon-dic">
                                                            <AiOutlineDislike size='25' />
                                                        </div>
                                                        <div
                                                            className='px-2'
                                                            id='dislike-count'
                                                        >
                                                            {item.dislike.length}
                                                        </div>
                                                    </div>
                                                </>
                                    }
                                    <div
                                        className='d-flex'
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => { setShowShareModal(true) }}
                                    >
                                        <div
                                            className="icon-dic"
                                        >
                                            <RiShareForwardLine size='25' />
                                        </div>
                                        <div className='px-2'>
                                            Share
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className='bg-secondary' />
                            {/* Channel Info Section */}
                            <div className="channel-tsx">
                                <div className="author d-inline-flex">
                                    <img
                                        src={`${Constants.api}/media/${item.channelThumbnail}`}
                                        alt=""
                                    />
                                    <span className='text-dark'>
                                        {item.channelTitle}
                                        <br />
                                        {channel.length ?
                                            channel.map((ch) => {
                                                return (
                                                    <span
                                                        key={ch.id}
                                                        className='text-dark'
                                                    >
                                                        <span
                                                            className='text-dark'
                                                            id='subscriber-count'
                                                        >
                                                            {ch.subscription.length}
                                                        </span>
                                                        &nbsp;
                                                        subscriber
                                                    </span>
                                                )
                                            })
                                            :
                                            ("")
                                        }
                                    </span>
                                </div>
                                {
                                    subscribe.is_subscribed === true ?
                                        <button
                                            className='btn btn-sm btn-dark shadow-sm rounded-pill px-3 py-2 float-end'
                                            onClick={HandleDisSubscribe}
                                        >
                                            SUBSCRIBED
                                        </button>
                                        :
                                        <button
                                            className='btn btn-sm btn-danger shadow-sm rounded-pill px-3 py-2 float-end'
                                            onClick={HandleSubscribe}
                                        >
                                            SUBSCRIBE
                                        </button>
                                }
                            </div>
                            <br/>
                            <details className='text-dark'>
                                <summary>
                                    <small className='text-dark fw-bold'>
                                        Description
                                    </small>
                                </summary>
                                <p className='text-dark'>
                                    {item.description}
                                </p>
                            </details>
                            <hr className='bg-dark' />
                            <div className="comment-section d-none d-md-block">
                                <span>
                                    {item.comment.length} Comments
                                </span>
                                <form
                                    action="POST"
                                    onSubmit={HandleCommentSubmit}
                                    className="comment-form-jsx form-floating my-2"
                                >
                                    <input
                                        type="text"
                                        className="form-control shadow-none"
                                        placeholder="Add a comment"
                                        name="add-a-comment"
                                        id='comment-text'
                                        required
                                    />
                                    <label htmlFor="floatingInput">
                                        Add a comment
                                    </label>
                                    <button className='btn btn-sm btn-outline-success outline-0 mt-2 shadow-sm rounded-pill px-2'>
                                        Comment
                                    </button>
                                </form>
                                {/* Comment Section */}
                                <div className="all-comment-bxs p-2">
                                    {item.comment.map((cmt) => {
                                        if (is_authenticated) {
                                            return (
                                                <div
                                                    className='d-flex my-2'
                                                    key={cmt.id}
                                                >
                                                    <div
                                                        className="icon-dic"
                                                    >
                                                        <FaUserCircle
                                                            size='22'
                                                            color="gray"
                                                        />
                                                    </div>
                                                    <div className='px-2'>
                                                        {cmt.describe}
                                                    </div>
                                                    <button
                                                        className='ms-auto btn btn-sm btn-outline-danger px-3 shadow-sm rounded-pill'
                                                        onClick={(e) => {
                                                            axios.delete(`${Constants.api}/api/comment/${cmt.id}`)
                                                                .then((response) => [
                                                                    setisInitialMount(false)
                                                                ])
                                                                .catch((error) => {
                                                                    console.log(error)
                                                                })
                                                        }}
                                                    >
                                                        delete
                                                    </button>
                                                </div>
                                            )
                                        }
                                        else {
                                            return (
                                                <div className='d-flex'>
                                                    <div
                                                        className="icon-dic"
                                                    >
                                                        <FaUserCircle
                                                            size='22'
                                                            color="gray"
                                                        />
                                                    </div>
                                                    <div className='pt-1 px-2'>
                                                        {cmt.describe}
                                                    </div>
                                                </div>
                                            )
                                        }
                                    })
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-5 p-0">
                            <div className="ratio ratio-1x1 overflow-auto">
                                <ul
                                    className="p-md-3 list-unstyled"
                                    id="IncreaseZindex-2"
                                >
                                    {related.length ?
                                        related.map((relate, i) => {
                                            return (
                                                <li
                                                    className="m-1 d-flex p-3 pb-0"
                                                    style={{ cursor: 'pointer' }}
                                                    key={relate.id}
                                                    onMouseOver={(e) => {
                                                        document.getElementsByClassName('m-1 d-flex p-3 pb-0')[i].style.background = '#E8E8E8'
                                                    }}
                                                    onMouseOut={(e) => {
                                                        document.getElementsByClassName('m-1 d-flex p-3 pb-0')[i].style.background = ''
                                                    }}
                                                    onClick={() => {
                                                        navigate(`/watch?v=${relate.video_id}`)
                                                        // HandleLike()
                                                        window.scroll({
                                                            top: 0,
                                                            left: 0,
                                                            behavior: 'smooth'
                                                        });
                                                    }}
                                                >
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
                                                        <span
                                                            className="badge bg-secondary rounded-pill fw-light"
                                                        >
                                                            {relate.channelTitle}
                                                        </span>
                                                        <br />
                                                        <span
                                                            style={{ fontSize: '11px' }}
                                                        >
                                                            <span
                                                                id={`related-view-count-${relate.id}`}
                                                            >
                                                                {relate.view.length}
                                                            </span> Views  &nbsp;&nbsp;•&nbsp;
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
                                        null
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="comment-section d-block d-md-none">
                        <span>
                            {item.comment.length} Comments
                        </span>
                        <form
                            action="POST"
                            onSubmit={HandleCommentSubmit}
                            className="comment-form-jsx form-floating my-2"
                        >
                            <input
                                type="text"
                                className="form-control shadow-none"
                                placeholder="Add a comment"
                                name="add-a-comment"
                                id='comment-text2'
                                required
                            />
                            <label htmlFor="floatingInput">
                                Add a comment
                            </label>
                            <button className='btn btn-sm btn-outline-success outline-0 mt-2 shadow-none'>
                                Comment
                            </button>
                        </form>
                        {/* Comment Section */}
                        <div className="all-comment-bxs p-2">
                            {item.comment.map((cmt) => {
                                if (is_authenticated) {
                                    return (
                                        <div
                                            className='d-flex my-2'
                                            key={cmt.id}
                                        >
                                            <div
                                                className="icon-dic"
                                            >
                                                <FaUserCircle
                                                    size='22'
                                                    color="gray"
                                                />
                                            </div>
                                            <div
                                                className=' pt-1 px-2'
                                            >
                                                {cmt.describe}
                                            </div>
                                            <button
                                                className='ms-auto btn btn-sm btn-outline-danger rounded-0 px-2 shadow-none'
                                                onClick={(e) => {
                                                    axios.delete(`${Constants.api}/api/comment/${cmt.id}`)
                                                        .then((response) => [
                                                            setisInitialMount(false)
                                                        ])
                                                        .catch((error) => {
                                                            console.log(error)
                                                        })
                                                }}>
                                                delete
                                            </button>
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div className='d-flex'>
                                            <div
                                                className="icon-dic"
                                            >
                                                <FaUserCircle
                                                    size='22'
                                                    color="gray"
                                                />
                                            </div>
                                            <div className=' pt-1 px-2'>
                                                {cmt.describe}
                                            </div>
                                        </div>
                                    )
                                }
                            })
                            }
                        </div>
                    </div>
                </div>
                )
            })
            :
            <Loading />
        }
    </>
}

export default Watch;