import React, { useState, useRef, useEffect } from "react";
import {
    Play,
    Pause,
    Maximize,
    Minimize,
    Volume2,
    VolumeX,
    Download,
} from "lucide-react";

const VideoPlayer = ({ video, className, allowDownload = true }) => {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [hasStartedPlaying, setHasStartedPlaying] = useState(false);

    let hideControlsTimeout;

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            setCurrentTime(video.currentTime);
            const progressPercent = (video.currentTime / video.duration) * 100;
            setProgress(progressPercent);
        };

        video.addEventListener("timeupdate", updateProgress);
        video.addEventListener("loadedmetadata", () => setDuration(video.duration));

        video.addEventListener("play", () => {
            setIsPlaying(true);
            setHasStartedPlaying(true);
        });

        video.addEventListener("pause", () => {
            setIsPlaying(false);
        });

        return () => {
            video.removeEventListener("timeupdate", updateProgress);
        };
    }, []);

    const togglePlay = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
        showControlsTemporarily();
    };

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = x / width;
        const newTime = percentage * duration;
        videoRef.current.currentTime = newTime;
        setProgress(percentage * 100);
        showControlsTemporarily();
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (seconds) => {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? "0" + secs : secs}`;
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (isMuted) {
            video.volume = volume;
            setIsMuted(false);
        } else {
            video.volume = 0;
            setIsMuted(true);
        }
        showControlsTemporarily();
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
        showControlsTemporarily();
    };

    const handleDownload = async () => {
        try {
            // روش اول: دانلود مستقیم از طریق لینک
            const link = document.createElement('a');
            link.href = video.src;
            link.download = video.downloadName || `video_${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const showControlsTemporarily = () => {
        setControlsVisible(true);
        clearTimeout(hideControlsTimeout);
        if (!isPlaying) return;
        hideControlsTimeout = setTimeout(() => {
            setControlsVisible(false);
        }, 2000);
    };

    useEffect(() => {
        const handleMouseMove = () => showControlsTemporarily();
        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
        }
        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, [isPlaying]);

    // استخراج نام فایل از src
    const getDownloadFileName = () => {
        if (video.downloadName) return video.downloadName;
        if (video.src) {
            const urlParts = video.src.split('/');
            const fileName = urlParts[urlParts.length - 1];
            return fileName || 'video.mp4';
        }
        return 'video.mp4';
    };

    return (
        <div
            ref={containerRef}
            className={`relative group w-full max-w-3xl aspect-video mx-auto rounded-2xl overflow-hidden shadow-2xl bg-black ${className}`}
            onMouseEnter={showControlsTemporarily}
            dir="ltr"
        >
            <video
                ref={videoRef}
                src={video.src}
                poster={video.thumbnail}
                className="w-full h-full object-contain"
                controlslist="nodownload"
                onClick={togglePlay}
            />

            {/* Controls Overlay */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent p-4 transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Progress Bar */}
                <div
                    className=" z-20 w-full h-1.5 bg-gray-600 rounded-full cursor-pointer mb-3 relative overflow-hidden"
                    onClick={handleProgressClick}
                    style={{ direction: "ltr" }}
                >
                    <div
                        className="h-full bg-blue-500 rounded-full absolute left-0 top-0"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-400 rounded-full shadow-lg"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-white z-20 relative">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={togglePlay}
                            className="hover:scale-105 transition-transform"
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>

                        <div className="flex items-center gap-2">
                            <button onClick={toggleMute}>
                                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-20 accent-blue-500"
                            />
                        </div>

                        <span className="text-sm font-mono">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* دکمه دانلود */}
                        {allowDownload && video.src && (
                            <button
                                onClick={handleDownload}
                                className="hover:scale-105 transition-transform"
                                title="دانلود ویدیو"
                            >
                                <Download size={20} />
                            </button>
                        )}

                        <button
                            onClick={toggleFullscreen}
                            className="hover:scale-105 transition-transform"
                        >
                            {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Big Play Button */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                    <button
                        onClick={togglePlay}
                        className="bg-blue-600/90 backdrop-blur-sm p-6 rounded-full text-white hover:bg-blue-500 transition-all hover:scale-110 shadow-2xl"
                    >
                        <Play size={56} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;