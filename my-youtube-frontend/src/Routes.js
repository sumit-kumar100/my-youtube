import { Routes, Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './pages/Navbar';
import React from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Watch from './pages/Watch';
import Subscription from './pages/Subscription';
import MyChannel from './pages/MyChannel';
import Upload from './pages/Upload';
import Liked from './pages/Liked';
import Search from './pages/Search';
import Channel from './pages/Channel';
import EmailConfirmSuccess from './pages/EmailConfirmSuccess';
import EmailConfirmFail from './pages/EmailConfirmFail';

const Router = () => {
    return (
        <BrowserRouter>
            <div className='flyout'>
                <Navbar />
                <main >
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route exact path='/authorization/credentials/login' element={<Login />} />
                        <Route exact path='/authorization/registration/signup' element={<Registration />} />
                        <Route exact path='/authorization/registration/email_confirm_success' element={<EmailConfirmSuccess />} />
                        <Route exact path='/authorization/registration/email_confirm_fail' element={<EmailConfirmFail />} />
                        <Route exact path='/watch' element={<Watch />} />
                        <Route exact path='/channel-info' element={<Channel />} />
                        <Route exact path='/subscription' element={<Subscription />} />
                        <Route exact path='/my-channel' element={<MyChannel />} />
                        <Route exact path='/uploads' element={<Upload Container={true} />} />
                        <Route exact path='/liked-videos' element={<Liked />} />
                        <Route exact path='/search' element={<Search />} />
                        <Route exact={true} path='*' element={<>Not Found</>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}

export default Router;