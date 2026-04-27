# WebTorrent Setup (P2P Video Streaming)
# https://webtorrent.io/
# npm install webtorrent

## 1. Install Dependencies
npm install webtorrent webtorrent-hybrid

## 2. Custom Player Implementation
# Build your own zero-ad player with full UI control

### Server-side (Node.js/Next.js API route):
const WebTorrent = require('webtorrent')
const client = new WebTorrent()

export default function handler(req, res) {
  const magnetUri = req.query.magnet
  
  const torrent = client.add(magnetUri, { path: '/tmp' })
  
  torrent.on('ready', () => {
    const file = torrent.files.find(f => f.name.endsWith('.mp4'))
    
    # Stream file to response
    file.createReadStream().pipe(res)
  })
}

### Client-side (React component):
import { useEffect, useRef } from 'react'

export default function VideoPlayer({ magnetUri }) {
  const videoRef = useRef(null)
  
  useEffect(() => {
    const client = new WebTorrent()
    
    client.add(magnetUri, (torrent) => {
      const file = torrent.files.find(f => f.name.endsWith('.mp4'))
      file.renderTo(videoRef.current)
    })
    
    return () => client.destroy()
  }, [magnetUri])
  
  return (
    <video 
      ref={videoRef}
      className="w-full aspect-video bg-black"
      controls
      autoPlay
    />
  )
}

## 3. Environment Variables
# Not needed - WebTorrent is peer-to-peer

## 4. Getting Magnet Links
# You'll need to source magnet links from:
# - Manual curation (you add them)
# - Torrent indexer APIs
# - Database of known anime torrents

## 5. Notes
# - Uses WebRTC for peer-to-peer streaming
# - Works in browser with WebRTC support
# - Zero ads - you control everything
# - Users become seeders while watching
# - Consider a tracker for better peer discovery
# - Legal considerations apply