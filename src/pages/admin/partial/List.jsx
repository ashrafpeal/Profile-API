import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Table = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [search]);

    const fetchData = (page = 1, searchTerm = "") => {
        setLoading(true);
        axios.get(`${swr_admin.api_url}/swr/v1/data?page=${page}&search=${searchTerm}`)
            .then((response) => {
                const respData = response.data;
                setData(respData.data || []);
                setCurrentPage(respData.current_page || 1);
                setLastPage(respData.last_page || 1);
                setLoading(false);
                setSelected([]);
                setSelectAll(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchData(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this item?")) {
            axios.delete(`${swr_admin.api_url}/swr/v1/data/${id}`)
                .then(() => {
                    toast.success("Data deleted successfully!");
                    fetchData(currentPage, debouncedSearch);
                })
                .catch(() => toast.error("Error deleting data!"));
        }
    };

    const handleSelectAll = (e) => {
        setSelectAll(e.target.checked);
        if (e.target.checked) {
            setSelected(data.map(item => item.id));
        } else {
            setSelected([]);
        }
    };

    const handleSelectItem = (e, id) => {
        if (e.target.checked) {
            setSelected(prev => [...prev, id]);
        } else {
            setSelected(prev => prev.filter(item => item !== id));
            setSelectAll(false);
        }
    };

    const handleBulkDelete = () => {
        if (selected.length === 0) {
            toast.warning("No items selected!");
            return;
        }
        if (confirm(`Are you sure you want to delete ${selected.length} items?`)) {
            Promise.all(selected.map(id => axios.delete(`${swr_admin.api_url}/swr/v1/data/${id}`)))
                .then(() => {
                    toast.success("Selected items deleted!");
                    fetchData(currentPage, debouncedSearch);
                })
                .catch(() => toast.error("Error deleting selected items!"));
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12 d-flex align-items-center mt-3 mb-4">
                    <h4 className="me-2">Data List</h4>
                    <Link to="/add" className="page-title-action">Add New</Link>

                </div>

                <div className="col-md-12 mb-3">
                    <div className="row">
                        <div className="col-md-9">
                            {selected.length > 0 && (
                                <Link className="page-title-action text-danger border-danger" onClick={handleBulkDelete}>
                                    Delete Selected ({selected.length})
                                </Link>
                            )}
                        </div>
                        <div className="col-md-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="col-md-12">
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th style={{ width: '30px' }}>
                                    <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center">Loading...</td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">No data found</td>
                                </tr>
                            ) : (
                                data.map(item => (
                                    <tr key={item.id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(item.id)}
                                                onChange={(e) => handleSelectItem(e, item.id)}
                                            />
                                        </td>
                                        <td>
                                            {item.name}
                                            <div className="d-flex align-items-center">
                                                <Link
                                                    style={{ fontSize: '10px' }}
                                                    className="text-danger me-2"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Delete
                                                </Link>
                                                <Link
                                                    style={{ fontSize: '10px' }}
                                                    className="text-primary me-2"
                                                    to={`/edit/${item.id}`}
                                                >
                                                    Edit
                                                </Link>
                                                <Link
                                                    style={{ fontSize: '10px' }}
                                                    className="text-dark"
                                                    to={`/view/${item.id}`}
                                                >
                                                    View
                                                </Link>
                                            </div>
                                        </td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.address}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div className="mt-3 d-flex justify-content-end align-items-center">
                        <button
                            className="page-title-action me-2"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>

                        <span className="align-self-center me-2">Page {currentPage} of {lastPage}</span>

                        <button
                            className="page-title-action"
                            disabled={currentPage >= lastPage}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Table;
