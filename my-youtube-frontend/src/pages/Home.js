import axios from 'axios';
import * as Constants from "../Constants";
import PlaceholderLoading from 'react-placeholder-loading'
import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react';



const Home = () => {

    // Videos State
    const [videos, setVideos] = useState([]);
    const [isVideoFetched, setIsVideoFetched] = useState(false);
    const [category, setCategory] = useState(Array.from({ length: 10 }));
    const [iscategoryFetched, setIscategoryFetched] = useState(false)
    const [loadcontent, setLoadContent] = useState(8);
    const skeleton = Array.from({ length: 8 })


    // UseEffect
    useEffect(() => {
        axios.get(
            `${Constants.api}/api/video/`
        )
            .then((response) => {
                let array = response.data
                for (var i = array.length - 1; i > 0; i--) {
                    // Generate random number
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                setVideos(array)
                setIsVideoFetched(true)
            })
            .catch((error) => {
                console.log(error)
            })
        axios.get(
            `${Constants.api}/api/category/`
        )
            .then((response) => {
                let array = response.data
                for (var i = array.length - 1; i > 0; i--) {
                    // Generate random number
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                setCategory(array)
                setIscategoryFetched(true)
            })

    }, [])

    const getCategoryVideo = (e) => {
        setIsVideoFetched(false)
        setIscategoryFetched(true)
        let child = e.target.parentNode.childNodes
        for (let i = 0; i < child.length; i++) {
            child[i].style.background = '#eee';
            child[i].style.color = '#000';
        }
        e.target.style.background = 'royalblue';
        e.target.style.color = 'white';

        axios.get(
            `${Constants.api}/api/video/?category__id=${e.target.id}`
        )
            .then((response) => {
                setVideos(response.data)
                setIsVideoFetched(true)
                setIscategoryFetched(true)
            })
            .catch((error) => {
                console.log(error)
            })
    }


    return <div className='container-fluid'>
        <div className="categories px-0">
            <div className="flex-container">
                <div
                    id={``}
                    className='item'
                    style={{ background: 'royalblue', color: 'white' }}
                    onClick={getCategoryVideo}
                >
                    All
                </div>
                {
                    category.map((item, i) => {
                        return (
                            <React.Fragment key={i}>
                                {
                                    iscategoryFetched ?
                                        <div
                                            id={`${item.id}`}
                                            className='item'
                                            onClick={getCategoryVideo}
                                        >
                                            {item.title}
                                        </div>
                                        :
                                        <div className='item' style={{ width: '120px', color: '#eee', border: 'none' }}>
                                            null
                                        </div>
                                }

                            </React.Fragment>
                        )
                    })

                }
            </div>
        </div>
        <div className="videos">
            <div className="row g-4">
                {
                    videos.length ?
                        videos.map((video, i) => {
                            if (i < loadcontent) {
                                return (
                                    <div
                                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                                        key={i}>

                                        <Link
                                            to={`watch/?v=${video.video_id}`}
                                            className='link'>
                                            <div className="video__thumbnail">
                                                <img
                                                    style={{ width: '100%', backgroundColor: '#eee',height:170 }}
                                                    src={video.thumbnail}
                                                />
                                            </div>
                                            <div className="video__details">
                                                {
                                                    video.channelThumbnail ?
                                                        <div className="author">
                                                            <img
                                                                src={`${Constants.api}/media/${video.channelThumbnail}`}
                                                                alt=""
                                                            />
                                                        </div>
                                                        :
                                                        <div className="author">
                                                            <img
                                                                src={`https://i.pinimg.com/originals/41/8e/1a/418e1a67a6ff452f43a39a4d913dc540.jpg`}
                                                                alt=""
                                                            />
                                                        </div>
                                                }

                                                <div className="title">
                                                    <h3>
                                                        {video.title}
                                                    </h3>
                                                    <span>
                                                        {video.channelTitle}
                                                    </span>
                                                    <span
                                                        style={{ fontSize: '12.5px' }}
                                                    >
                                                        {video.view.length} Views  &nbsp;&nbsp;•&nbsp;
                                                        {(() => {
                                                            const date = new Date(`${video.date}`)
                                                            return Constants.timeAgo.format(date)
                                                        })()}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>

                                    </div>
                                )
                            }
                        })
                        :
                        (<></>)
                }
                {
                    !isVideoFetched ?
                        <>
                            {
                                skeleton.map((placeholder) => {
                                    return (
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                                            <div>
                                                <PlaceholderLoading shape="rect" width={'100%'} height={170} />
                                            </div>
                                            <div style={{ marginTop: 10 }}>
                                                <PlaceholderLoading shape='rect' height={'15'} width={'90%'} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </>
                        :
                        (<></>)
                }
            </div>
            {
                loadcontent < videos.length ?
                    <div id="loadMore">
                        <span onClick={() => {
                            setIsVideoFetched(false)
                            setTimeout(() => {
                                { setLoadContent(loadcontent + 8) }
                                setIsVideoFetched(true)
                            }, 1000)
                        }}>Load More</span>
                    </div>
                    :
                    (<></>)
            }
        </div>
    </div>
}

export default Home;
