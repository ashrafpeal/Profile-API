import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
// cklein@salesnexus.com
const Email = () => {
    const [email, setEmail] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [phoneMessage, setPhoneMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);
        setData(null);
        console.log(pa_frontend);
        // cklein@salesnexus.com
        try {
            let url = pa_frontend.api_url + '/profile-api/v1/person/email';
            const response = await axios.post(url, {email: email});
            console.log(response);
            let data = response ?. data;
            // execute if reached search limit
            if (data ?. status == 429) {
                console.log(data ?. status);
                setMessage(null);
                setPhoneMessage(null);
                setError(data ?. message);
                const timer = setTimeout(() => {
                    window.location.href = pa_frontend.domain + "/free-trial/";
                }, 2000);

                return() => clearTimeout(timer);
            }

            // execute if person not found
            let meta = data ?. data ?. meta;
            console.log(data);
            if (meta && meta ?. statusCode != 200) {
                setMessage(null);
                setPhoneMessage(null);
                setError(meta ?. message);
                return;
            }

            // execute if person found
            setMessage("✅ Contact Found! Gathering more information, please wait a few seconds…");
            let id = data ?. data ?. data ?. id;
            if (id) {
                console.log('1 id: ', id);
                getPersonDetails(id, e);
            }

        } catch (err) { // Set the error with detailed information
            if (err.response) { // Server responded with an error status (4xx, 5xx)
                setMessage(null);
                setPhoneMessage(null);
                setError({message: err.message, status: err.response.status, statusText: err.response.statusText, data: err.response.data});
            } else if (err.request) { // Request was made but no response received
                console.log(err.message);
                setMessage(null);
                setPhoneMessage(null);
                setError("No response received from server");
            } else { // Something else happened
                console.log(err.message);
                setMessage(null);
                setPhoneMessage(null);
                setError("Error setting up request");
            }
        } finally {
            setLoading(false);
        }
    };

    const getPersonDetails = async (id, e) => {
        e.preventDefault();
        console.log('2nd', id);
        let url = pa_frontend.api_url + '/profile-api/v1/person/id';
        try {
            const response = await axios.post(url, {
                ids: id
            },);

            console.log(response ?. data);
            console.log(response ?. data ?. data ?. data.results[0]);
            let data = response ?. data ?. data ?. data ?. results[0];

            if (data ?. id) {
                setData(data);
                setMessage("✅ Person Found! Now searching for phone number..");

                getPhoneNumber(data ?. id);
            }

        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            setMessage(null);
            setPhoneMessage(null);
            setError("Person Not Found");
        }
    }

    const getPhoneNumber = async (id) => {
        console.log("getting phone number for id: " + id);
        let url = pa_frontend.api_url + '/profile-api/v1/person/phone';
        try {
            const response = await axios.post(url, {id: id});
            console.log(response);
            let data = response ?. data;

            // execute if reached search limit
            if (data ?. status == 429) {
                console.log(data ?. message);
                setMessage(null);
                setPhoneMessage(null);
                setError(data ?. message);
                // window.location.href = pa_frontend.domain + "/free-trial/";
                return;
            }

            // execute if person not found
            let meta = data ?. meta;
            if (meta && meta ?. statusCode != 200) {
                setMessage(null);
                setPhoneMessage(null);
                setError(meta ?. message);
                return;
            }

            // execute if phone found
            setMessage(null);
            setPhoneMessage(`✅ Phone Number Found.`);
            console.log(data ?. data);
            setPhoneNumber(data ?. data ?. phone);
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            setMessage(null);
            setPhoneMessage(null);
            setError("Phone Number Not Found");
        }
    }




    return (
        <>

            <div className="row justify-content-center my-5">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5>Search by Email Address</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}
                                className='d-flex align-items-center gap-2'>
                                <input type="email"
                                    value={email}
                                    onChange={
                                        (e) => setEmail(e.target.value)
                                    }
                                    placeholder="Email e.g: john@example.com"
                                    required
                                    className="form-control"/>
                                <button type="submit" className="btn_orange"
                                    disabled={loading}>
                                    {
                                    loading ? 'Searching...' : 'Search'
                                } </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


            {/* Error Display */}
            {
            error && (
                <div className="alert alert-danger" role="alert">
                    <strong>{error}</strong>
                </div>
            )
        }
            {/* Results Display */}

            {
            loading && (
                <div className="text-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )
        }

            {
            message && !loading && (
                <>
                    <div className="alert alert-success" role="alert">
                        {message} </div>
                </>
            )
        }
            {
            phoneMessage && !loading && (
                <>
                    <div className="alert alert-success" role="alert">
                        {phoneMessage} </div>
                </>
            )
        }
            {
            !loading && data && (
                <div className="row mb-5">
                    <div className="col-md-6 offset-md-3">
                        <div className="card">
                            <div className="card-header">
                                <h5>Results</h5>
                            </div>
                            <div className="card-body">
                                <div className='result'>
                                    {
                                    phoneNumber && (
                                        <p>
                                            <strong>Phone: </strong>
                                            {phoneNumber} </p>
                                    )
                                }
                                    <p>
                                        <strong>Full Name: </strong>
                                        {
                                        data ?. name ? data ?. name : 'N/A'
                                    } </p>
                                    <p>
                                        <strong>First Name: </strong>
                                        {
                                        data ?. firstName ? data ?. firstName : 'N/A'
                                    } </p>
                                    <p>
                                        <strong>Last Name: </strong>
                                        {
                                        data ?. lastName ? data ?. lastName : 'N/A'
                                    } </p>
                                    <p>
                                        <strong>Birth Year: </strong>
                                        {
                                        data ?. birthYear ? data ?. birthYear : 'N/A'
                                    } </p>
                                    <p>
                                        <strong>Country: </strong>
                                        {
                                        data ?. worldRegion ? data ?. worldRegion : data ?. countryCode ? data ?. countryCode : 'N/A'
                                    } </p>
                                    <p>
                                        <strong>Photo: </strong>
                                        {
                                        data ?. photoUrl ? (
                                            <img src={
                                                    data ?. photoUrl
                                                }
                                                alt={
                                                    data ?. name
                                                }
                                                width="50"
                                                height="50"/>
                                        ) : (
                                            <span>No Photo</span>
                                        )
                                    } </p>
                                    <p>
                                        <strong>LinkedIn: </strong>
                                        {data ?. linkedInUrl ? (
                                            <Link className='btn btn-link'
                                                    to={data?.linkedInUrl}
                                                    target='_blank'
                                                    >{data?.linkedInUrl}</Link>
                                        ) : 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Facebook: </strong>
                                        {data ?. facebookUrl ? (
                                            <Link className='btn btn-link'
                                                    to={data?.facebookUrl}
                                                    target='_blank'
                                                    >{data?.facebookUrl}</Link>
                                        ) : 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Experiences: </strong>
                                        <ul> {
                                            data ?. experiences && data ?. experiences ?. map((item, index) => (
                                                <li key={index}>
                                                    <p>
                                                        <strong>Company: </strong>
                                                        {item?.name ? item?.name : 'N/A'}    
                                                    </p>
                                                    <p>
                                                        <strong>Website: </strong>
                                                        {
                                                        item?.domain ? <Link className='btn btn-link'
                                                            to={item?.domain}
                                                            target='_blank'
                                                            >{item?.domain}</Link> : 'N/A'
                                                    } </p>
                                                    <p>
                                                        <strong>Position: </strong>
                                                        {
                                                        item?.title ? item?.title : 'N/A'} </p>
                                                    <p>
                                                        <strong>Start Date: </strong>
                                                        {
                                                        item ?. startedAt ? new Date(item.startedAt).toLocaleString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'No date available'
                                                    } </p>
                                                    <p>
                                                        <strong>End Date: </strong>
                                                        {
                                                        item ?. endedAt ? new Date(item.endedAt).toLocaleString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) : 'Present'
                                                    } </p>
                                                    <p>
                                                        <strong>Working: </strong>
                                                        {
                                                        item?.title ? item?.title : 'N/A'
                                                    } </p>
                                                    <p>
                                                        <strong>Seniority: </strong>
                                                        {
                                                        item?.seniority ? item?.seniority : 'N/A'
                                                    } </p>
                                                </li>
                                            ))
                                        } </ul>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } </>
    )
};

export default Email;
