import React, { useState } from 'react'
import Player from '../../components/Player/Player'
import Draguploader from '../../components/Draguploader/DragUploader'
import './Upload.css'

export default function Upload(props) {
    const {ffmpeg, fetchFile} = props
    const [url, setUrl] = useState('')
    return (
        <div className='upload-wrap'>
            <div className='uploader'>
                <Draguploader ffmpeg={ffmpeg} fetchFile={fetchFile} setUrl={setUrl}/>
            </div>
            <Player url={url}/>
        </div>
    )
    }
