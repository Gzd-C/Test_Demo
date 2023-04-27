import { Button, Form, Input, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import Player from '../../components/Player/Player';
import Uploader from '../../components/Uploader/Uploader';
import './index.css';

export default function Text (props) {
    const {ffmpeg, fetchFile} = props
    const [url, setUrl] = useState('')
    const [imgFile, setImgFile] = useState(null)
    const [file, setFile] = useState(null)
    const loadVideo = async () => {
        console.log('挂载视频')
        ffmpeg.FS('writeFile', file.name, await fetchFile(file));
        const data = ffmpeg.FS('readFile', file.name);
        let originFileUrl = URL.createObjectURL( new Blob( [data.buffer] , { type: 'video/mp4' } ) );
        setUrl(originFileUrl)
    }
    useEffect(() => {
        if (file) {
            loadVideo()
        }
        // 加载视频
    }, [file])
    // 添加贴图
    const addText = async (values) => {
        if (file && imgFile) {
            console.log('click', file ,imgFile)
            console.log('开始结束时间', values.picStart, values.picEnd)
            ffmpeg.FS('writeFile', imgFile.name, await fetchFile(imgFile));
            const filterCmd = '[1:v]format=rgba,rotate=' + `'${values.deg}:c=0x00000000:ow=hypot(iw,ih):oh=ow'` + `[out];[0:v][out]overlay=x=${values.xPos}:y=${values.yPos}:enable=` + `'between(t,${values.picStart},${values.picEnd})'`
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
            setUrl(u1)
        }
    }
    const onFinished = (values) => {
        let canvas = document.getElementById('canvas')
        const ctx = canvas.getContext('2d');
        ctx.textAlign = 'center' //文字居中
        ctx.textBaseline = 'middle'
        if (values.background) {
            ctx.rect(0,0,150,100);
            ctx.fillStyle = values.background
            ctx.fill()
        }
        ctx.font = values.font //文字样式：加粗 16像素 字体Arial
        ctx.fillStyle = values.color //字体颜色
        if (values.art === 1) {
            var gradient=ctx.createLinearGradient(0,0,canvas.width,0);
            gradient.addColorStop("0","magenta");
            gradient.addColorStop("0.5","blue");
            gradient.addColorStop("1.0","red");
            // 用渐变填色
            ctx.strokeStyle=gradient;
            ctx.strokeText(values.text,75,38);
            let artUrl = canvas.toDataURL()
            setImgFile(base64ToFile(artUrl))
            return
        }
        ctx.fillText(values.text, 75, 38) //fillText里面的可填写的值(文本内容, x坐标, y坐标, 文本最大宽度)
        let textUrl = canvas.toDataURL()
        console.log('textUrl', textUrl, base64ToFile(textUrl))
        setImgFile(base64ToFile(textUrl))
    }
    //将base64转换为blob
    const dataURLtoBlob = (dataurl) => { 
        let arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    //将blob转换为file
    const blobToFile = (theBlob, fileName) => {
        theBlob.lastModifiedDate = new Date();
        theBlob.name = fileName;
        return theBlob;
    }
    // base64转file
    const base64ToFile = (base64Url) => {
        let blob = dataURLtoBlob(base64Url)
        let file = blobToFile(blob, 'textImg.png')
        console.log('fff', file)
        return file
    }

    return (
        <div className='text-wrap'>
            <h3>文字效果预览</h3>
            <div className='canvas-video-wrap'>
                <div className='canvas-wrap'>
                    <canvas style={{width:'300px'}} id='canvas'></canvas>
                    <Form
                        className='items'
                        onFinish={onFinished}
                    >
                        <Form.Item
                            label='文字内容'
                            name='text'
                        >
                            <Input id='text' placeholder='输入文字内容'/>
                        </Form.Item>
                        <Form.Item
                            label='字体样式'
                            name='font'
                        >
                            <Input id='font' placeholder='输入字体样式'/>
                        </Form.Item>
                        <Form.Item
                            label='字体颜色'
                            name='color'
                        >
                            <Input id='color' placeholder='输入字体颜色'/>
                        </Form.Item>
                        <Form.Item
                            label='背景颜色'
                            name='background'
                        >
                            <Input id='background' placeholder='输入背景颜色'/>
                        </Form.Item>
                        <Form.Item
                            label='是否使用艺术字'
                            name='art'
                        >
                             <Radio.Group>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Button style={{width: '100px'}} htmlType='submit'>预览</Button>

                    </Form>
                    <br></br>
                    <Uploader setFile={setFile}/>
                    <Form
                        className='items'
                        onFinish={addText}
                    >
                        <Form.Item
                            label='开始时间'
                            name='picStart'
                        >
                            <Input id='picStart' placeholder='输入开始时间'/>
                        </Form.Item>
                        <Form.Item
                            label='结束时间'
                            name='picEnd'
                        >
                            <Input id='picEnd' placeholder='输入结束时间'/>
                        </Form.Item>
                        <Form.Item
                            label='X坐标'
                            name='xPos'
                        >
                            <Input id='xPos' placeholder='输入X坐标'/>
                        </Form.Item>
                        <Form.Item
                            label='Y坐标'
                            name='yPos'
                        >
                            <Input id='yPos' placeholder='输入Y坐标'/>
                        </Form.Item>
                        <Form.Item
                            label='旋转角度'
                            name='deg'
                        >
                            <Input id='deg' placeholder='输入旋转角度'/>
                        </Form.Item>
                        <Button style={{width: '100px'}} htmlType='submit'>添加文字</Button>
                    </Form>

                </div>
                
                <Player url={url}/>
            </div>
        </div>
    )
}
