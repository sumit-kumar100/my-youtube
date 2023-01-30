import React from 'react';
import GoogleLogin from 'react-google-login';
import ReactLoading from 'react-loading';
import axios from 'axios';
import Cookie from 'js-cookie';
import * as Constants from "../Constants";
import { ImYoutube2 } from 'react-icons/im';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { UpdateAuthStatus } from '../store/authentication/auth';
import { NotificationManager } from 'react-notifications';


const Login = () => {

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const googleLogin = (response) => {
        axios.post(
            `${Constants.api}/rest-auth/google/`,
            {
                access_token: response.accessToken,
            }
        )
            .then((Successresponse) => {
                Cookie.set('access_key', Successresponse.data.key);
                axios.get(
                    `${Constants.api}/rest-auth/user/`,
                    {
                        headers: {
                            'Authorization': `Token ${Successresponse.data.key}`
                        }
                    }
                )
                    .then((userResponse) => {
                        Cookie.set('userInfo', JSON.stringify(userResponse.data.pk))
                        axios.get(
                            `${Constants.api}/api/channel/?user__id=${userResponse.data.pk}`
                        )
                            .then((channelResponse) => {
                                if (channelResponse.data.length) {
                                    Cookie.set('HasChannel', true)
                                    dispatch(UpdateAuthStatus({
                                        Access: true,
                                        userInfo: String(userResponse.data.pk),
                                        HasChannel: true
                                    }));
                                    localStorage.setItem('HasChannel', true)
                                }
                                else {
                                    Cookie.set('HasChannel', false)
                                    dispatch(UpdateAuthStatus({
                                        Access: true,
                                        userInfo: String(userResponse.data.pk),
                                        HasChannel: false
                                    }));
                                    localStorage.setItem('HasChannel', false)
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                navigate('/')
                NotificationManager.info('Logged in Successfully !');
            })
            .catch((error) => {
                console.log(error)
            })
    };

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const UpdateInput = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const SubmitForm = (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const body = JSON.stringify(formData);

        let loading = document.getElementsByClassName('custom-modal')[1]
        loading.style.display = 'block';

        axios.post(
            `${Constants.api}/rest-auth/login/`, body, config
        )
            .then((response) => {
                Cookie.set('access_key', response.data.key);
                axios.get(
                    `${Constants.api}/rest-auth/user/`,
                    {
                        headers: {
                            'Authorization': `Token ${response.data.key}`
                        }
                    }
                )
                    .then((userResponse) => {
                        Cookie.set('userInfo', JSON.stringify(userResponse.data.pk))
                        axios.get(
                            `${Constants.api}/api/channel/?user__id=${userResponse.data.pk}`
                        )
                            .then((channelResponse) => {
                                if (channelResponse.data.length) {
                                    Cookie.set('HasChannel', true)
                                    dispatch(UpdateAuthStatus({
                                        Access: true,
                                        userInfo: String(userResponse.data.pk),
                                        HasChannel: true
                                    }));
                                }
                                else {
                                    Cookie.set('HasChannel', false)
                                    dispatch(UpdateAuthStatus({
                                        Access: true,
                                        userInfo: String(userResponse.data.pk),
                                        HasChannel: false
                                    }));
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
                loading.style.display = 'none';
                NotificationManager.success('Logged in Successfully');
                console.log('THis is me sumit of class')
                navigate('/')
            })
            .catch((error) => {
                console.log(error)
                loading.style.display = 'none';
                let form_error = document.getElementsByClassName('form-errors')[0];
                if (error.response === undefined) {
                    form_error.innerText = 'Oh uh !Something Went Wrong'
                }
                else {
                    form_error.innerText = error.response.data.non_field_errors;
                }
                form_error.style.display = 'block';
            })
    }

    return <>
        <div className='custom-modal'>
            <div className="custom-modal-vertical-center">
                <ReactLoading type={'spin'} />
            </div>
        </div>
        <div style={{ height: '100vh' }} >
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-5">
                            <div className="card-body p-4 p-sm-5">
                                <i
                                    className="material-icons d-block text-center"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate("/")}
                                >
                                    <ImYoutube2
                                        size="60"
                                        color="red"
                                    />
                                </i>
                                <form
                                    method="POST"
                                    onSubmit={(e) => SubmitForm(e)}
                                    autoComplete="off"
                                >
                                    <div className="form-floating mb-3">
                                        <input
                                            type="email"
                                            className="form-control shadow-none"
                                            placeholder="Email address"
                                            value={email}
                                            name="email"
                                            onChange={e => UpdateInput(e)}
                                            required
                                        />
                                        <label htmlFor="floatingInput">Email address</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control shadow-none"
                                            placeholder="Password"
                                            value={password}
                                            name="password"
                                            onChange={e => UpdateInput(e)}
                                            required
                                        />
                                        <label htmlFor="floatingPassword">
                                            Password
                                        </label>
                                    </div>
                                    <small className="form-errors">
                                    </small>
                                    <div className="d-grid">
                                        <button className="btn btn-outline-primary fw-bold shadow-none" type="submit">Sign
                                            in</button>
                                    </div>
                                    <div className="d-grid my-3">
                                        <GoogleLogin
                                            className="justify-content-center"
                                            clientId="215358239782-hoj81lt3i6128kgctrk33ln9opftf431.apps.googleusercontent.com"
                                            buttonText="CONTINUE WITH GOOGLE"
                                            onSuccess={googleLogin}
                                            onFailure={googleLogin}
                                        />
                                    </div>
                                </form>
                                <div className='text-center'>
                                    <span>
                                        Need an account ? <Link to='/authorization/registration/signup'>Register here</Link>
                                    </span>
                                </div>
                                <br />
                                <div className="note">
                                    <span
                                        className='d-block'
                                        style={{ fontSize: '12px' }}
                                    >
                                        Note : Test Account For Login if Not Want to Register
                                    </span>

                                    <small
                                        className='d-block'
                                        style={{ fontSize: '12px' }}
                                    >
                                        Email : summysumit100@gmail.com <br /> password : Sumit123#
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Login;
