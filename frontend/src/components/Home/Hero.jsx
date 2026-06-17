import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, GraduationCap, BarChart3, Users, Play, Star } from 'lucide-react';
import { Link } from 'react-router';

const Hero = () => {
    const canvasRef = useRef(null);

    // افکت پس‌زمینه داینامیک با Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        let particles = [];
        let animationFrameId;

        const setCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor(x, y, size, speedX, speedY) {
                this.x = x;
                this.y = y;
                this.size = size;
                this.speedX = speedX;
                this.speedY = speedY;
                this.opacity = Math.random() * 0.5 + 0.2;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > canvas.width) this.x = 0;
                if (this.x < 0) this.x = canvas.width;
                if (this.y > canvas.height) this.y = 0;
                if (this.y < 0) this.y = canvas.height;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles = [];
            const particleCount = Math.min(100, Math.floor(window.innerWidth * window.innerHeight / 15000));

            for (let i = 0; i < particleCount; i++) {
                const size = Math.random() * 2 + 1;
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const speedX = (Math.random() - 0.5) * 0.8;
                const speedY = (Math.random() - 0.5) * 0.8;
                particles.push(new Particle(x, y, size, speedX, speedY));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // گرادیانت پس‌زمینه
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(1, '#1e1b4b');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        setCanvasSize();
        initParticles();
        animate();

        window.addEventListener('resize', () => {
            setCanvasSize();
            initParticles();
        });

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', setCanvasSize);
        };
    }, []);



    return (
        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* کانواس برای افکت ذرات */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

            {/* گرادیانت اورلی */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            {/* محتوای اصلی */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* سمت راست - متن‌ها */}
                    <div className="text-center lg:text-right">
                        {/* نشان ویژه */}
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-indigo-500/30">
                            <Sparkles className="w-5 h-5 text-indigo-400" />
                            <span className="text-indigo-300 text-sm font-medium">پلتفرم پیشرو آموزش آنلاین ایران</span>
                        </div>

                        {/* تیتر اصلی */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                آینده یادگیری
                            </span>
                            <br />
                            <span className="text-white">از همین امروز شروع کن</span>
                        </h1>

                        {/* توضیحات */}
                        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl lg:mx-0 mx-auto">
                            به بزرگ‌ترین پلتفرم آموزش آنلاین ایران بپیوندید. با  دوره های تخصصی،
                            یادگیری عملی و مدرسان مجرب، مهارت‌های خود را به سطح بعدی برسانید.
                        </p>
                        <button className='flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 text-white text-lg  transition-all duration-300 hover:scale-105 font-semibold'>

                            <Link
                                to='/courses'
                            >
                                مشاهده دوره‌ها

                            </Link>

                            <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" />

                        </button>
                       
                    </div>

                   
                    <div className="relative hidden lg:block">
                        <div className="relative">
                            {/* دایره‌های دکوراتیو */}
                            <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
                            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />

                            <img src="/hero-laptop.webp" alt="" />

                        </div>
                    </div>

                </div>
            </div>

            {/* موج پایین صفحه */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                    <path fill="rgba(255,255,255,0.05)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
                </svg>
            </div>

            <style jsx>{`
        @keyframes slide {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide {
          animation: slide 1s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
        </div>
    );
};

export default Hero;