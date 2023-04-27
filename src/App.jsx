import React, { useEffect } from 'react'
import {NavLink, Navigate, Routes, Route} from 'react-router-dom'
import FFmpeg from '@ffmpeg/ffmpeg'
import './App.css'
import Upload from './pages/Upload/Upload';
import Divide from './pages/Divide/Divide';
import Delete from './pages/Delete/Delete'
import Picture from './pages/Picture/Picture';
import Text from './pages/Text/Text';
import Subtitle from './pages/Subtitle/Subtitle';

function App() {
  // 初始化ffmpeg
  const { createFFmpeg, fetchFile } = FFmpeg;
  const ffmpeg = createFFmpeg({
      // corePath: '../../public/ffmpeg-core.js',// 'https://unpkg.com/@ffmpeg/core@0.8.5/dist/ffmpeg-core.js',
      log: true,
      progress: (log) => console.log('ffmpeglog', log)
  });
  useEffect(() => {
    async function initFfmpeg(){
        await ffmpeg.load()
        console.log('ffmpeg初始化完成')
    }
    initFfmpeg()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className="App">
      <div className='slider'>
        <div className="slider-header">MyVideoEditor</div>
          <NavLink className={({isActive}) => isActive ? 'slider-item active' : 'slider-item'} to='/upload'>视频预览</NavLink>
          <NavLink className='slider-item' to='/divide'>视频分割</NavLink>
          <NavLink className='slider-item' to='/delete'>删除片段</NavLink>
          <NavLink className='slider-item' to='/picture'>添加贴图</NavLink>
          <NavLink className='slider-item' to='/text'>文字水印</NavLink>
          <NavLink className='slider-item' to='/subtitle'>添加字幕</NavLink>
      </div>
      <div className="content">
        <Routes>
          <Route path= '/upload' element={<Upload ffmpeg={ffmpeg} fetchFile={fetchFile}/>}></Route>
          <Route  path= '/divide' element= {<Divide ffmpeg={ffmpeg} fetchFile={fetchFile}/>} ></Route>
          <Route  path= '/delete' element= {<Delete ffmpeg={ffmpeg} fetchFile={fetchFile}/>} ></Route>
          <Route  path= '/picture' element= {<Picture ffmpeg={ffmpeg} fetchFile={fetchFile}/>} ></Route>
          <Route  path= '/text' element= {<Text ffmpeg={ffmpeg} fetchFile={fetchFile}/>} ></Route>
          <Route  path= '/subtitle' element= {<Subtitle ffmpeg={ffmpeg} fetchFile={fetchFile}/>} ></Route>
          <Route path= '/' element={<Navigate to='/upload'></Navigate>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
