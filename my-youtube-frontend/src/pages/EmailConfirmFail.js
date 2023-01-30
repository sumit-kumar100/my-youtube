import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useNavigate } from 'react-router-dom';

const EmailConfirmFail = () => {
    const navigate = useNavigate();

    const onConfirm = () =>{
        navigate('/')
    }

    return (
        <SweetAlert
            title="Uh oh! Failed"
            onConfirm={onConfirm}
            confirmBtnText="Back to Home"
        >
            Email Verification has been failed ...
        </SweetAlert>
    )

}

export default EmailConfirmFail;
