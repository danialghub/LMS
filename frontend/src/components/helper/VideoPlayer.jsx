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
            className={`relative group w-full max-w-3xl aspect-video mx-auto rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-black ${className}`}
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
                playsInline
                preload="metadata"
            />

            {/* Controls Overlay */}
            <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent p-2 sm:p-4 transition-opacity duration-300 ${controlsVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
            >
                {/* Progress Bar */}
                <div
                    className="z-20 w-full h-1 sm:h-1.5 bg-gray-600 rounded-full cursor-pointer mb-2 sm:mb-3 relative overflow-hidden"
                    onClick={handleProgressClick}
                    style={{ direction: "ltr" }}
                >
                    <div
                        className="h-full bg-blue-500 rounded-full absolute left-0 top-0"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full shadow-lg"></div>
                    </div>
                </div>

                <div className="flex items-center justify-between text-white z-20 relative">
                    <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <button
                            onClick={togglePlay}
                            className="hover:scale-105 transition-transform shrink-0"
                        >
                            {isPlaying ? <Pause size={18} className="sm:size-6" /> : <Play size={18} className="sm:size-6" />}
                        </button>

                        <div className="hidden sm:flex items-center gap-2">
                            <button onClick={toggleMute} className="shrink-0">
                                {isMuted || volume === 0 ? <VolumeX size={18} className="sm:size-5" /> : <Volume2 size={18} className="sm:size-5" />}
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="w-16 sm:w-20 accent-blue-500"
                            />
                        </div>

                        {/* نمایش ساده صدا در موبایل */}
                        <button onClick={toggleMute} className="sm:hidden shrink-0">
                            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
                        </button>

                        <span className="text-[10px] sm:text-sm font-mono shrink-0">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* دکمه دانلود */}
                        {allowDownload && video.src && (
                            <button
                                onClick={handleDownload}
                                className="hover:scale-105 transition-transform"
                                title="دانلود ویدیو"
                            >
                                <Download size={16} className="sm:size-5" />
                            </button>
                        )}

                        <button
                            onClick={toggleFullscreen}
                            className="hover:scale-105 transition-transform"
                        >
                            {isFullscreen ? <Minimize size={18} className="sm:size-5" /> : <Maximize size={18} className="sm:size-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Big Play Button */}
            {!isPlaying && !hasStartedPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
                    <button
                        onClick={togglePlay}
                        className="bg-blue-600/90 backdrop-blur-sm p-3 sm:p-4 rounded-full text-white hover:bg-blue-500 transition-all hover:scale-110 shadow-2xl"
                    >
                        <Play size={28} className="sm:size-10" />
                    </button>
                </div>
            )}

            {/* Mobile Touch Indicators */}
            <div className="absolute top-1/2 left-4 right-4 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 sm:hidden">
                <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-2 h-2 border-t-2 border-r-2 border-white rotate-45 transform -translate-x-0.5"></div>
                </div>
                <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                    <div className="w-2 h-2 border-t-2 border-l-2 border-white rotate-45 transform translate-x-0.5"></div>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;