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

        let url = pa_frontend.api_url + '/profile-api/v1/phone/id';
        try {
            const response = await axios.post(url, {id: id});

            setData(response.data.data);
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
    // my id: 0198c61c95a57588b0a7d9467fe1bf00
    // craig id: 019819d787bb7ad5ab8172202cd1a5a8
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
                                <input type="text" placeholder="Enter ID e.g: 019819d787bb7ad5ab8172202cd1a5a8" className="form-control" required
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
            ) : data === undefined ? (
                <div className="alert alert-danger text-center">
                    <strong>No phone number found!</strong>
                </div>
            ) : (data && data.phone ? (
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
                                            <tr className='text-center'>
                                                <th>Phone Number</th>
                                                <th>Type</th>
                                                <th>Score</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{
                                                    data ?. phone
                                                }</td>
                                                <td>{
                                                    data ?. type
                                                }</td>
                                                <td>{
                                                    data ?. scoreValue
                                                }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : '')
        }


            {
            error && (
                <div className="alert alert-danger" role="alert">
                    <strong>{
                        error.message
                    }</strong>
                </div>
            )
        } </>
    ); // return
}

export default Id;
