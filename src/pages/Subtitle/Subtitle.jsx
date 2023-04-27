import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import Uploader from '../../components/Uploader/Uploader'
import './index.css'

export default function Subtitle (props) {
    const {ffmpeg, fetchFile} = props
    const [videoFile, setVideoFile] = useState(null)
    const [subtitleFile, setSubtitleFile] = useState(null)
    const [url, setUrl] = useState('')

    useEffect(() => {
        if (videoFile) {
            loadVideo()
        }
    }, [videoFile])
    // 加载视频
    const loadVideo = async () => {
        console.log('挂载视频')
        ffmpeg.FS('writeFile', videoFile.name, await fetchFile(videoFile));
        const data = ffmpeg.FS('readFile', videoFile.name);
        let originFileUrl = URL.createObjectURL( new Blob( [data.buffer] , { type: 'video/mp4' } ) );
        setUrl(originFileUrl)
    }
    const addSubTitle = async () => {
        if (subtitleFile && videoFile) {
            console.log('要加载的文件', subtitleFile, videoFile)
            ffmpeg.FS('writeFile', subtitleFile.name, await fetchFile(subtitleFile));
            // -vf subtitles=test_1280x720_3.srt
            const cmd= '-i '+ videoFile.name + ` -vf subtitles=${subtitleFile.name}` + ' 1.mp4'
            if(!ffmpeg.isLoaded()) {
                alert('请加载视频')
                return
            }
            let args1 = cmd.split(' ')
            console.log('args1',args1)
            await ffmpeg.run(...args1)
            const data = ffmpeg.FS( 'readFile' , '1.mp4' );
            let u1 = URL.createObjectURL( new Blob( [data.buffer] , { type: 'video/mp4' } ) );
            setUrl(u1)
        }
    }
    return (
        <div className='subtitle-wrap'>
            <div className="upload-file">
                <Uploader setFile={setVideoFile}/>
                <br/>
                <br/>
                <Uploader acceptImg={true} acceptFile={true} setFile={setSubtitleFile} buttonText='上传字幕文件'/>
                <br/>
                <br/>
                <Button style={{width: '100px'}} onClick={addSubTitle}>添加字幕</Button>

            </div>
            <video src={url} controls></video>
        </div>
    )
}
