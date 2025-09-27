import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Linkedin = () => {
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [phoneMessage, setPhoneMessage] = useState(null);
    const [email, setEmail] = useState(null);
    const [emailMessage, setEmailMessage] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailMessage(null);
        setPhoneMessage(null);
        setError(null);
        setMessage(null);
        setData(null);
        console.log(linkedinUrl);
        let url = pa_frontend.api_url + '/profile-api/v1/person/linkedin';
        try {
            setLoading(true);
            const response = await axios.post(url, { linkedInUrls: linkedinUrl });
            console.log(response);
            let data = response?.data;
            // execute if reached search limit
            if (data?.status == 429) {
                console.log(data?.status);
                setMessage(null);
                setPhoneMessage(null);
                setError(data?.message);
                const timer = setTimeout(() => {
                    window.location.href = pa_frontend.domain + "/free-trial/";
                }, 2000);

                return () => clearTimeout(timer);
            }

            // execute if person not found
            let meta = data?.data?.meta;
            if (meta && meta?.statusCode != 200) {
                setMessage(null);
                setPhoneMessage(null);
                setError('Person ' + meta?.message);
                return;
            }

            // execute if person found
            setMessage(data?.message + '. Now searching for phone number..');
            let results = data?.results?.data?.results[0];

            if (results?.id) {
                console.log(results);
                setData(results);
                getPhoneNumber(results.id);
            }
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            setMessage(null);
            setPhoneMessage(null);
            setError(error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const getPhoneNumber = async (id) => {
        console.log("getting phone number for id: " + id);
        let url = pa_frontend.api_url + '/profile-api/v1/person/phone';
        try {
            setLoading(true);

            const response = await axios.post(url, { id: id });
            console.log(response);
            let data = response?.data;
            setMessage(null);
            // execute if reached search limit
            if (data?.status == 429) {
                setMessage(null);
                setPhoneMessage(null);
                setError(data?.message);
                getPersonEmail(id);
                return;
            }

            // execute if person not found
            let meta = data?.meta;
            if (meta && meta?.statusCode != 200) {
                setMessage(null);
                setPhoneMessage(null);
                setError(meta?.message);
                let errorPhone = setTimeout(() => {
                    setError(null);
                    getPersonEmail(id);
                }, 1000);
                return () => clearTimeout(errorPhone);
            }

            // execute if phone found
            if (data?.data?.phone) {
                setLoading(false);
                setMessage(null);
                setPhoneMessage(`✅ Phone Number Found.`);
                console.log(data?.data);
                setPhoneNumber(data?.data?.phone);
                getPersonEmail(id);
            }
        } catch (error) {
            console.log(error);
            console.error(error.response ? error.response.data : error.message);
            setMessage(null);
            setPhoneMessage(null);
            setError("Phone Number Not Found");
            let errorPhone = setTimeout(() => {
                setError(null);
                getPersonEmail(id);
            }, 1000);
            return () => clearTimeout(errorPhone);
        } finally {
            setLoading(false);
        }
    }

    const getPersonEmail = async (id) => {
        console.log("getting email for id: " + id);
        setPhoneMessage(null);
        setEmailMessage('Now Looking For Email.');
        let url = pa_frontend.api_url + '/profile-api/v1/person/getEmail';
        try {
            const response = await axios.post(url, { id: id });
            console.log(response);
            let data = response?.data;
            // execute if person not found
            let meta = data?.meta;
            if (meta && meta?.statusCode != 200) {
                setMessage(null);
                setEmailMessage(null);
                setError(meta?.message);
                return;
            }
            // execute if email found
            setMessage(null);
            setPhoneMessage(null);
            setEmailMessage(`✅ Person Email Found.`);
            console.log(data?.data);
            setEmail(data?.data?.email);
            let timer = setTimeout(() => {
                setEmailMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            setMessage(null);
            setPhoneMessage(null);
            setEmailMessage(null);
            setError("Email Not Found");
        }
    }

    // console.log(message);

    return (
        <>
            <div className="row justify-content-center my-5">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5>Search by LinkedIn Profile URL</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}
                                className='d-flex align-items-center gap-2'>
                                <input type="text" placeholder="Enter LinkedIn URL e.g: https://www.linkedin.com/in/johndoe/" className="form-control" required
                                    onChange={
                                        (e) => setLinkedinUrl(e.target.value)
                                    } />
                                <button type="submit" className="btn_orange">Search</button>
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
                emailMessage && !loading && (
                    <>
                        <div className="alert alert-success" role="alert">
                            {emailMessage} </div>
                    </>
                )
            }

            {
                !loading && data && (
                    <div className="row mb-5">
                        <div className="col-md-6 offset-md-3">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between">
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
                                        {
                                            email ? (
                                                <p>
                                                    <strong>Email: </strong>
                                                    {email} </p>
                                            ) : ''
                                        }
                                        <p>
                                            <strong>Full Name: </strong>
                                            {
                                                data?.name ? data?.name : 'N/A'
                                            } </p>
                                        <p>
                                            <strong>First Name: </strong>
                                            {
                                                data?.firstName ? data?.firstName : 'N/A'
                                            } </p>
                                        <p>
                                            <strong>Last Name: </strong>
                                            {
                                                data?.lastName ? data?.lastName : 'N/A'
                                            } </p>
                                        <p>
                                            <strong>Birth Year: </strong>
                                            {
                                                data?.birthYear ? data?.birthYear : 'N/A'
                                            } </p>
                                        <p>
                                            <strong>Country: </strong>
                                            {
                                                data?.worldRegion ? data?.worldRegion : data?.countryCode ? data?.countryCode : 'N/A'
                                            } </p>
                                        <p>
                                            <strong>Photo: </strong>
                                            {
                                                data?.photoUrl ? (
                                                    <img src={
                                                        data?.photoUrl
                                                    }
                                                        alt={
                                                            data?.name
                                                        }
                                                        width="50"
                                                        height="50" />
                                                ) : (
                                                    <span>No Photo</span>
                                                )
                                            } </p>
                                        <p>
                                            <strong>LinkedIn: </strong>
                                            {data?.linkedInUrl ? (
                                                <Link className='btn btn-link'
                                                    to={data?.linkedInUrl}
                                                    target='_blank'
                                                >{data?.linkedInUrl}</Link>
                                            ) : 'N/A'}
                                        </p>
                                        <p>
                                            <strong>Facebook: </strong>
                                            {data?.facebookUrl ? (
                                                <Link className='btn btn-link'
                                                    to={data?.facebookUrl}
                                                    target='_blank'
                                                >{data?.facebookUrl}</Link>
                                            ) : 'N/A'}
                                        </p>
                                        <p>
                                            <strong>Experiences: </strong>
                                            <ul> {
                                                data?.experiences && data?.experiences?.map((item, index) => (
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
                                                                item?.startedAt ? new Date(item.startedAt).toLocaleString('en-US', {
                                                                    weekday: 'long',
                                                                    year: 'numeric',
                                                                    month: 'long',
                                                                    day: 'numeric'
                                                                }) : 'No date available'
                                                            } </p>
                                                        <p>
                                                            <strong>End Date: </strong>
                                                            {
                                                                item?.endedAt ? new Date(item.endedAt).toLocaleString('en-US', {
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
    );
}

export default Linkedin;
