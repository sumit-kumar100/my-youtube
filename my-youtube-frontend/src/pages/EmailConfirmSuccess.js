import React from 'react';
import SweetAlert from 'react-bootstrap-sweetalert';
import { useNavigate } from 'react-router-dom';

const EmailConfirmSuccess = () => {
    const navigate = useNavigate();

    const onConfirm = () => {
        navigate('/authorization/credentials/login')
    }

    return (
        <SweetAlert
            title="Congrat! Success"
            onConfirm={onConfirm}
            confirmBtnText="Continue to Login"
        >
            Email Verification has been done successfully ...
        </SweetAlert>
    )

}

export default EmailConfirmSuccess;
