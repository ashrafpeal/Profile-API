import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Linkedin = () => {
    const [linkedinUrl, setLinkedinUrl] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    let apiKey = pa_frontend.api_key;
    // let url = config.enrich_person_url;

    console.log(linkedinUrl);
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Before sanitize:", linkedinUrl);

        // 🔹 Clean up LinkedIn URL
        let sanitizedUrl = linkedinUrl.replace("https://www.", "https://").replace(/\/$/, "");

        console.log("After sanitize:", sanitizedUrl);

        let url = pa_frontend.api_url + '/profile-api/v1/person/phone';

        try {
            setLoading(true);
            const response = await axios.post(url, { linkedInUrl: sanitizedUrl });

            console.log(response);
            let data = response?.data;
            // execute if reached search limit
            if (data?.status == 429) {
                setError(data?.message);
                return;
            }
            
            // execute if person not found
            let meta = data?.meta;
            if (meta && meta?.statusCode != 200) {
                setError(meta?.message);
                return;
            }

            // execute if phone found
            setMessage(`✅ Phone Number Found`);
            console.log(data?.data);
            setData(data?.data);
        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="row justify-content-center my-5">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">
                            <h5>Search Phone Number</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}
                                className='d-flex align-items-center gap-2'>
                                <input type="text" placeholder="Enter LinkedIn URL e.g: https://linkedin.com/in/johndoe/" className="form-control" required
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
                        <strong>{
                            error
                        }</strong>
                    </div>
                )
            }
            {/* Results Display */}

            {loading && (
                <div className="text-center">
                    <div className="spinner-border text-danger" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            {message && !loading && (
                <>
                    <div className="alert alert-success" role="alert">
                        {message}
                    </div>
                </>
            )}

            {!loading && data && (
                <div className="row">
                    <div className="col-md-12">
                        <div className="card ">
                            <div className="card-header text-center">
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
                                                    data?.phone
                                                }</td>
                                                <td>{
                                                    data?.type
                                                }</td>
                                                <td>{
                                                    data?.scoreValue
                                                }</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

         </>
    );
}

export default Linkedin;
