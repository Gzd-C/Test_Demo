import { Button, Input } from 'antd'
import React, { useState } from 'react'
import Player from '../../components/Player/Player'
import Uploader from '../../components/Uploader/Uploader'
import './index.css'

export default function Picture(props) {
    const {ffmpeg, fetchFile} = props
    const [imgFile, setImgFile] = useState(null)
    const [file, setFile] = useState(null)
    const [fileUrl, setFileUrl] = useState(null)
    // 加载视频
    const loadVideo = async () => {
        console.log('挂载视频')
        ffmpeg.FS('writeFile', file.name, await fetchFile(file));
        const data = ffmpeg.FS('readFile', file.name);
        let originFileUrl = URL.createObjectURL( new Blob( [data.buffer] , { type: 'video/mp4' } ) );
        setFileUrl(originFileUrl)
    }
    // 添加贴图
    const handleClick = async () => {
        if (file && imgFile) {
            console.log('click', file ,imgFile)
            let start = document.getElementById('picStart')
            let end = document.getElementById('picEnd')
            let xPos = document.getElementById('xPos')
            let yPos = document.getElementById('yPos')
            let deg = document.getElementById('deg')
            console.log('开始结束时间', start.value, end.value)
            ffmpeg.FS('writeFile', imgFile.name, await fetchFile(imgFile));
            const filterCmd = '[1:v]format=rgba,rotate=' + `'${deg.value}:c=0x00000000:ow=hypot(iw,ih):oh=ow'` + `[out];[0:v][out]overlay=x=${xPos.value}:y=${yPos.value}:enable=` + `'between(t,${start.value},${end.value})'`
            const cmd= '-i '+ file.name + ' -i '+ imgFile.name + ' -filter_complex '+ filterCmd +' 1.mp4'

            if(!ffmpeg.isLoaded()) {
                alert('请加载视频')
                return
            }
            let args1 = cmd.split(' ')
            console.log('args1',args1)
            await ffmpeg.run(...args1)
            const data = ffmpeg.FS( 'readFile' , '1.mp4' );
            let u1 = URL.createObjectURL( new Blob( [data.buffer] , { type: 'video/mp4' } ) );
            setFileUrl(u1)

        }
    }
    return (
        <div>
            <h3>为视频添加贴图,参数必须全部输入,时间输入应为秒数,角度格式为PI/X</h3>
            <div className="divide-uploader">
                <Uploader buttonText='上传图片' acceptImg={true} setFile={setImgFile}/>
                <Uploader setFile={setFile}/>
            </div>
            <Button style={{margin: '10px 0'}} onClick={loadVideo}>加载视频</Button>
            <div className='picture-input'>
                <Input id='picStart' placeholder='输入开始时间'/>
                <Input id='picEnd' placeholder='输入结束时间'/>
                <Input id='xPos' placeholder='输入X坐标'/>
                <Input id='yPos' placeholder='输入Y坐标'/>
                <Input id='deg' placeholder='输入旋转角度'/>
            </div>
            <Button style={{margin: '10px 0'}} onClick={handleClick}>添加贴图</Button>
            <div className='divide-wrap'>
                <Player url={fileUrl}/>
            </div>
        </div>
    )
}
