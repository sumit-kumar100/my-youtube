import ReactLoading from 'react-loading';
import axios from 'axios';
import React from 'react';
import * as Constants from "../Constants";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ImYoutube2 } from 'react-icons/im';
import { NotificationManager } from 'react-notifications';

const Registration = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password1: '',
        password2: ''
    });

    const { first_name, last_name, email, password1, password2 } = formData;

    const UpdateInput = e => { setFormData({ ...formData, [e.target.name]: e.target.value }) };

    const SubmitForm = (e) => {
        e.preventDefault();

        if (password1 === password2) {
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify(formData);

            let loading = document.getElementsByClassName('custom-modal')[1]
            loading.style.display = 'block';

            axios.post(`${Constants.api}/rest-auth/registration/`, body, config)
                .then((response) => {
                    navigate('/')
                    NotificationManager.info('An Email Verification Has Send To Your Mail..');
                })
                .catch((error) => {
                    loading.style.display = 'none';
                    let form_error = document.getElementsByClassName('form-errors')[0];
                    if (error.response.data.password1) {
                        form_error.innerText = error.response.data.password1[0];
                    }
                    else {
                        form_error.innerText = error.response.data.email;
                    }
                    form_error.style.display = 'block';
                })
        }
        else {
            let form_error = document.getElementsByClassName('form-errors')[0];
            form_error.innerText = "Password didn't match.";
            form_error.style.display = 'block';
        }

    }


    return <>
        <div className="custom-modal">
            <div className="custom-modal-vertical-center">
                <ReactLoading type={'spin'} />
            </div>
        </div>
        <div style={{ height: '100%' }}>
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
                        <div className="card border-0 shadow rounded-3 my-2" >
                            <div className="card-body p-3 p-sm-5">
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
                                            type="text"
                                            className="form-control shadow-none"
                                            placeholder="First name"
                                            value={first_name}
                                            name="first_name"
                                            onChange={e => UpdateInput(e)}
                                            required
                                        />
                                        <label htmlFor="floatingInput">First name</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="text"
                                            className="form-control shadow-none"
                                            placeholder="Last name"
                                            value={last_name}
                                            name="last_name"
                                            onChange={e => UpdateInput(e)}
                                            required
                                        />
                                        <label htmlFor="floatingInput">Last name</label>
                                    </div>
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
                                            value={password1}
                                            name="password1"
                                            onChange={e => UpdateInput(e)}
                                            required
                                        />
                                        <label htmlFor="floatingPassword">Password</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input
                                            type="password"
                                            className="form-control shadow-none"
                                            placeholder="Re-Password"
                                            value={password2}
                                            name="password2"
                                            onChange={e => UpdateInput(e)}
                                            required
                                        />
                                        <label htmlFor="floatingPassword">Re-Password</label>
                                    </div>
                                    <small className="form-errors">
                                    </small>
                                    <div className="d-grid">
                                        <button className="btn btn-outline-primary fw-bold shadow-none" type="submit">Sign
                                            up</button>
                                    </div>
                                </form>
                                <div className='text-center my-2'>
                                    <span>
                                        Already have an account ? <Link to="/authorization/credentials/login">Login here</Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Registration;
