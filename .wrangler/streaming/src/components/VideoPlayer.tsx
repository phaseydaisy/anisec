"use client";

import { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  initialTime?: number;
  autoPlay?: boolean;
}

const VideoPlayer = ({
  src,
  poster,
  title,
  onEnded,
  onTimeUpdate,
  initialTime = 0,
  autoPlay = false,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(videoElement, {
        controls: true,
        autoplay: autoPlay,
        responsive: true,
        fluid: true,
        poster: poster,
        sources: [
          {
            src: src,
            type: "application/x-mpegURL", // HLS
          },
        ],
        html5: {
          vhs: {
            overrideNative: true,
          },
        },
        playbackRates: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        userActions: {
          hotkeys: true,
        },
      }));

      player.on("ready", () => {
        setIsReady(true);
        if (initialTime > 0) {
          player.currentTime(initialTime);
        }
      });

      player.on("ended", () => {
        onEnded?.();
      });

      player.on("timeupdate", () => {
        onTimeUpdate?.(player.currentTime() || 0);
      });
    } else {
      // You can update player in the else block here if needed
      const player = playerRef.current;
      player.src({ src, type: "application/x-mpegURL" });
      if (poster) player.poster(poster);
    }
  }, [src, poster, autoPlay, initialTime, onEnded, onTimeUpdate]);

  // Dispose player on unmount
  useEffect(() => {
    const player = playerRef.current;
    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div data-vjs-player className="w-full">
      <div ref={videoRef} className="video-js-container" />
      {title && isReady && (
        <div className="mt-2 text-white text-lg font-semibold">{title}</div>
      )}
    </div>
  );
};

export default VideoPlayer;