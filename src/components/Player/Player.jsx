import React from 'react'
import './Player.css'

export default function Player(props) {
  const {url} = props
  return (
    <div className='player-wrap'>
        <h3>video title</h3>
        <video className='player' controls src={url ? url : ''}></video>
    </div>
  )
}
