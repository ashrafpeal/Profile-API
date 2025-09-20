import React, {useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const Id = () => {
    const [id, setId] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log(id);

        let url = pa_frontend.api_url + '/profile-api/v1/person/id';
        try {
            const response = await axios.post(url, {ids: id});

            setData(response.data.data.results[0]);
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    console.log("data", data);
    console.log("error", error);
    console.log("loading", loading);
    console.log("id", id);

    return (
        <>
            <div className="row mb-5">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5>Search by ID</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}
                                className='d-flex align-items-center gap-2'>
                                <input type="text" placeholder="Enter ID e.g: 0198c61c95a57588b0a7d9467fe1bf00" className="form-control" required
                                    onChange={
                                        (e) => setId(e.target.value)
                                    }/>
                                <button type="submit" className="btn_orange"
                                    disabled={loading}>Search</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {
            loading ? (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : data ? (
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>Results</h5>
                            </div>
                            <div className="card-body">
                                <div className='table-responsive'>
                                    <table className='table table-bordered table-striped'>
                                        <thead className='thead-dark'>
                                            <tr>
                                                <th>Full Name</th>
                                                <th>First Name</th>
                                                <th>Last Name</th>
                                                <th>Birth Year</th>
                                                <th>Photo</th>
                                                <th>Country</th>
                                                <th>LinkedIn</th>
                                                <th>Experiences</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td style={
                                                    {placeContent: 'center'}
                                                }>
                                                    {
                                                    data ?. name
                                                }</td>
                                                <td style={
                                                    {placeContent: 'center'}
                                                }>
                                                    {
                                                    data ?. firstName
                                                }</td>
                                                <td style={
                                                    {placeContent: 'center'}
                                                }>
                                                    {
                                                    data ?. lastName
                                                }</td>
                                                <td style={
                                                    {placeContent: 'center'}
                                                }>
                                                    {
                                                    data ?. birthYear
                                                }</td>
                                                <td style={
                                                    {placeContent: 'center'}
                                                }><img src={
                                                            data ?. photoUrl
                                                        }
                                                        alt={
                                                            data ?. name
                                                        }
                                                        width="50"
                                                        height="50"/></td>
                                                <td style={
                                                    {placeContent: 'center'}
                                                }>
                                                    {
                                                    data ?. worldRegion ? data ?. worldRegion : data ?. countryCode
                                                }</td>
                                                <td style={
                                                    {placeContent: 'center'}
                                                }>
                                                    <Link to={
                                                            data ?. linkedInUrl
                                                        }
                                                        target="_blank"
                                                        className='btn_orange btn-sm'>View</Link>
                                                </td>
                                                {
                                                data ?. facebookUrl ? (
                                                    <td style={
                                                        {placeContent: 'center'}
                                                    }>
                                                        <Link to={
                                                                data ?. facebookUrl
                                                            }
                                                            target="_blank"
                                                            className='btn_orange btn-sm'>View</Link>
                                                    </td>
                                                ) : ''
                                            }
                                                <td style={
                                                    {placeContent: 'center'}
                                                }>
                                                    {
                                                    data ?. experiences && data ?. experiences.map((experience, index) => (
                                                        <table key={index}
                                                            className='table table-borderedb-2'>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <strong>Working:
                                                                        </strong>
                                                                        {
                                                                        experience ?. title
                                                                    }</td>
                                                                    <td>
                                                                        <strong>Company:
                                                                        </strong>
                                                                        {
                                                                        experience ?. name
                                                                    }</td>
                                                                    <td>
                                                                        <strong>Website:
                                                                        </strong>
                                                                        {
                                                                        experience ?. domain
                                                                    }</td>
                                                                    <td>
                                                                        <strong>Position:
                                                                        </strong>
                                                                        {
                                                                        experience ?. title
                                                                    }</td>
                                                                    <td>
                                                                        <strong>Seniority:
                                                                        </strong>
                                                                        {
                                                                        experience ?. seniority
                                                                    }</td>
                                                                    <td>
                                                                        <strong>Start At:
                                                                        </strong>
                                                                        {
                                                                        experience ?. startedAt ? new Date(experience.startedAt).toLocaleString('en-US', {
                                                                            weekday: 'long',
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        }) : 'No date available'
                                                                    }</td>
                                                                    <td>
                                                                        <strong>End At:
                                                                        </strong>
                                                                        {
                                                                        experience ?. endedAt ? new Date(experience.endedAt).toLocaleString('en-US', {
                                                                            weekday: 'long',
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric'
                                                                        }) : 'Present'
                                                                    }</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    ))
                                                }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : ''
        }

            {
            error && (
                <div className="alert alert-danger" role="alert">
                    <strong>{
                        error.data.meta.message
                    }</strong>
                </div>
            )
        } 
        </>
    ); // return
}

export default Id;
