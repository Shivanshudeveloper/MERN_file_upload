import React, { Fragment, useState } from 'react';
import axios from "axios";

import Message from "./Message";
import ProgressBar from "./Progress";

const FileUpload = () => {
    const [file, setFile] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);
    }

    const onSubmit = async e => {
        e.preventDefault();
        // File form data from JS not React or Node JS
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                // Progress Event
                onUploadProgress: progressEvent => {
                    setUploadPercentage(parseInt(Math.round(progressEvent.loaded * 100) / progressEvent.total));
                    // Clear the Percentage of Progress Bar
                    setTimeout(() => setUploadPercentage(0), 10000);
                },
            });
            const { fileName, filePath } = res.data;
            // Uploading the file to the directory
            setUploadedFile({ fileName, filePath });
            setMessage('File Successfully Uploaded to Server');
        } catch (err) {
            if (err.response.status === 500) {
                setMessage('There was a problem with the server');
            } else {
                setMessage(err.response.data.msg);
            }
        }
    }


    return (
        <Fragment>
            { message ? <Message msg={message} /> : null }
            <form onSubmit={onSubmit}>
                <div className="custom-file mb-4">
                    <input type="file" className="custom-file-input" id="customFile" onChange={onChange} />
                    <label className="custom-file-label" htmlFor="customFile">
                        {filename}
                    </label>
                </div>
                <ProgressBar percentage={uploadPercentage} />
                <input type="submit" value="Upload" className="btn btn-primary btn-block mt-4" />
            </form>

            { uploadedFile ? (
            <div className="row mt-5">
                <div className="col-md-6 m-auto">
                    <h3 className="text-center">
                        { uploadedFile.fileName }
                    </h3>
                    <img style={{width: '100%'}} src={uploadedFile.filePath} />
                </div>

            </div> ) : null }

        </Fragment>
    )
}

export default FileUpload