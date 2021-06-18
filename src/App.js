import React, {useEffect, useState} from 'react'
import {Container, Card, Form, Button, ProgressBar} from 'react-bootstrap'
import axios from 'axios'

function App() {

    const [uploadedFileIndex, setUploadedFileIndex] = useState(0)
    const [uploadedFiles, setUploadedFiles] = useState([])

    useEffect(() => {
        const uploadFile = (file) => {
            if (!file) {
                return;
            }
            const formData = new FormData()
            formData.append('file', file, file.name)
            axios.put(`http://localhost:3001/upload/${file.type.match(/(image\/)/)
                ? 'image'
                : 'video'}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: function (progressEvent) {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    uploadedFiles[uploadedFileIndex].uploadProgress = percentCompleted
                }
            }).then(() => {
                uploadedFiles[uploadedFileIndex].uploadStatus = true
                setUploadedFileIndex(uploadedFileIndex + 1)
            }).catch(() => {
                uploadedFiles[uploadedFileIndex].uploadStatus = false
                setUploadedFileIndex(uploadedFileIndex + 1)
            })
        }
        const waitingUpload = uploadedFiles
            .filter(item => item.uploadStatus == null)
            .length
        if (waitingUpload > 0) {
            uploadFile(uploadedFiles[uploadedFileIndex])
        }
    }, [uploadedFiles, uploadedFileIndex])

    const onSubmit = () => {
        const images = document.getElementById('image-files')
        const videos = document.getElementById('video-files')
        if (images.files || videos.files) {
            const files = [
                ...images.files,
                ...videos.files
            ].map(items => {
                items.uploadStatus = null;
                items.uploadProgress = 0;
                return items
            })
            setUploadedFiles(files)

            // reset inputs
            images.value = '';
            videos.value = '';
        }
    }

    return (
        <Container className="mt-5 mb-5">
            <Card>
                <Card.Header>Upload Multimedia</Card.Header>
                <Card.Body>
                    <Form.Group controlId="image-files">
                        <Form.Label>Images</Form.Label>
                        <Form.File
                            id="image-files"
                            name="images[]"
                            label="Select Images"
                            custom
                            accept="image/*"
                            multiple/>
                    </Form.Group>

                    <Form.Group controlId="video-files">
                        <Form.Label>Videos</Form.Label>
                        <Form.File
                            id="video-files"
                            name="videos[]"
                            label="Select Videos"
                            custom
                            accept="video/*"
                            multiple/>
                    </Form.Group>
                </Card.Body>
                <Card.Footer>
                    <Button variant="primary" type="button" onClick={onSubmit}>
                        Submit
                    </Button>
                </Card.Footer>
            </Card>
            <div className="mt-4">
                {uploadedFiles.map((item, i) => {
                    return (
                        <Card key={i} className="mt-4">
                            <Card.Header>{item.name}</Card.Header>
                            <Card.Body>
                                <label>
                                    <strong>{item.uploadProgress < 100 ? `${item.uploadProgress}%` : 'Completed'}</strong>
                                </label>
                                <ProgressBar
                                    variant={item.uploadStatus === null && item.uploadProgress < 100
                                    ? 'primary'
                                    : (item.uploadStatus === true
                                        ? 'success'
                                        : 'danger')}
                                    now={item.uploadProgress}
                                    animated={item.uploadStatus === null && item.uploadProgress < 100}
                                    label={`${item.uploadProgress}%`}
                                    srOnly/>
                            </Card.Body>
                        </Card>
                    )
                })}
            </div>
        </Container>
    );
}

export default App;
