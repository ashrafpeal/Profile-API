import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";

const Edit = () => {
    let { id } = useParams();
    const [data, setData] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get(`${swr_admin.api_url}/swr/v1/data/${id}`)
            .then((response) => {
                if (response.data.success) {
                    setData(response.data.data);
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, [id]);


    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (data.name === '' || data.email === '' || data.phone === '' || data.address === '') {
            toast.error("All fields are required!");
            return;
        }
        axios.put(`${swr_admin.api_url}/swr/v1/data/${id}`, data)
            .then((response) => {
                console.log("Success:", response.data);
                setData(response.data);
                if (response.data.success) {
                    toast.success("Data updated successfully!");
                }
                toast.error(response.data.message);
            })
            .catch((error) => {
                console.error("Error:", error);
                toast.error("Error updating data!");
            });
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 mt-3 mb-4 d-flex align-items-center">
                    <h4 className="me-3">Edit Item</h4>
                    <Link to="/" className="page-title-action ms-2">Back to List</Link>
                </div>
                <div className="col-md-12">
                    <div className="card p-0 mt-0 mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Edit Item</h5>
                            {loading ? (
                                <p>Loading ....</p>
                            ) : (
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <input type="text" name="name" className="form-control" placeholder="Name" value={data.name} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="email" name="email" className="form-control" placeholder="Email" value={data.email} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="tel" name="phone" className="form-control" placeholder="Phone" value={data.phone} onChange={handleChange} />
                                    </div>
                                    <div className="mb-3">
                                        <input type="text" name="address" className="form-control" placeholder="Address" value={data.address} onChange={handleChange} />
                                    </div>
                                    <button type="submit" className="btn btn-primary">Update Item</button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;
