import { Button, Input } from 'antd'
import React, { useState } from 'react'
import Player from '../../components/Player/Player'
import Uploader from '../../components/Uploader/Uploader'

export default function Delete (props) {
  const {ffmpeg, fetchFile} = props
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState(null)
  const [originFileUrl, setOriginFileUrl] = useState('')
  const handleClick = async () => {
    if (file) {
      console.log('click', file)
      let start = document.getElementById('deleteStart')
      let end = document.getElementById('deleteEnd')
      console.log('开始结束时间', start.value, end.value)
      let videoArr = document.querySelectorAll("video")
      console.log('videoArr', videoArr)
      console.log('总时长',videoArr[1].duration)
      // 分割视频
      const cmd1 = '-ss 00:00:00 -i ' + file.name + ' -t ' + start.value + ' -c copy 1.mp4'
      const cmd2 = '-ss ' + end.value + ' -i ' + file.name + ' -t ' + videoArr[1].duration + ' -c copy 2.mp4'
      if(!ffmpeg.isLoaded()) {
          alert('请加载视频')
          return
      }
      let args1 = cmd1.split(' ')
      console.log('args1',args1)
      await ffmpeg.run(...args1)
      let args2 = cmd2.split(' ')
      console.log('args2',args2)
      await ffmpeg.run(...args2)
      // mp4转为ts格式后再合并
      const cmd3 = '-i 1.mp4 -vcodec copy -acodec copy -vbsf h264_mp4toannexb 1.ts'
      const cmd4 = '-i 2.mp4 -vcodec copy -acodec copy -vbsf h264_mp4toannexb 2.ts'
      let args3 = cmd3.split(' ')
      console.log('args3',args3)
      await ffmpeg.run(...args3)
      let args4 = cmd4.split(' ')
      console.log('args4',args4)
      await ffmpeg.run(...args4)
      // 合并两个ts文件
      const cmd5 ='-i concat:1.ts|2.ts -c copy output.mp4'
      let args5 = cmd5.split(' ')
      console.log('args5',args5)
      await ffmpeg.run(...args5)
      const data5 = ffmpeg.FS( 'readFile' , 'output.mp4' );
      let u5 = URL.createObjectURL( new Blob( [data5.buffer] , { type: 'video/mp4' } ) );
      setFileUrl(u5)
    }
  }
  // 加载视频
  const loadVideo = async () => {
    console.log('挂载视频')
    ffmpeg.FS('writeFile', file.name, await fetchFile(file));
    const data = ffmpeg.FS('readFile', file.name);
    let originFileUrl = URL.createObjectURL( new Blob( [data.buffer] , { type: 'video/mp4' } ) );
    setOriginFileUrl(originFileUrl)
  }
  return (
    <div>
      <h3>删除视频中的片段</h3>
      <div className="divide-uploader">
        <Uploader setFile={setFile}/>
      </div>
      <div>上传之后点击加载视频</div>
      <Button style={{margin: '10px 0'}} onClick={loadVideo}>加载视频</Button>
      <div style={{width: '800px', display: 'flex'}}>
        <Input id='deleteStart' styles={{width: '400px', height: '500px'}} placeholder="请输入开始时间" />
        <Input id='deleteEnd' styles={{width: '400px', height: '500px'}} placeholder="请输入结束时间" />
        <Button onClick={handleClick}>确认</Button>
      </div>
      <div className='divide-wrap'>
        <Player url={fileUrl}/>
      </div>
      <video style={{display: 'none'}} src={originFileUrl}></video>
    </div>
  )
}
