import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface Slide {
    imageUrl: string;
    title?: string;
    description?: string;
}

interface WelcomeSlidesProps {
    slides?: Slide[];
    onComplete: () => void;
    autoPlayInterval?: number; // milliseconds
}

const defaultSlides: Slide[] = [
    {
        imageUrl: '/slides/slide-1.png',
        title: '환영합니다!',
        description: 'IGC Fitness와 함께 건강한 대학생활을 시작하세요',
    },
    {
        imageUrl: '/slides/slide-2.png',
        title: '맞춤형 운동 가이드',
        description: '개인에게 맞는 운동 루틴과 상세한 가이드를 제공합니다',
    },
    {
        imageUrl: '/slides/slide-3.png',
        title: '함께 성장하세요!',
        description: '대학 친구들과 함께 운동하고 목표를 달성하세요',
    },
];

export function WelcomeSlides({
    slides = defaultSlides,
    onComplete,
    autoPlayInterval = 5000,
}: WelcomeSlidesProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const isLastSlide = currentIndex === slides.length - 1;

    const goToNext = useCallback(() => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex((prev) => prev + 1);
        }
    }, [currentIndex, slides.length]);

    const goToPrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    }, [currentIndex]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Auto-play functionality
    useEffect(() => {
        if (isPaused || isLastSlide) return;

        const timer = setInterval(() => {
            goToNext();
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [isPaused, isLastSlide, autoPlayInterval, goToNext]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                goToPrev();
            } else if (e.key === 'ArrowRight') {
                goToNext();
            } else if (e.key === 'Escape') {
                onComplete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [goToNext, goToPrev, onComplete]);

    const currentSlide = slides[currentIndex];

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Skip button */}
            <button
                onClick={onComplete}
                className="absolute top-4 right-4 text-white/70 hover:text-white flex items-center gap-1 text-sm transition-colors z-10"
            >
                건너뛰기
                <X className="w-5 h-5" />
            </button>

            {/* Main content area */}
            <div className="relative w-full max-w-lg mx-auto px-4 flex flex-col items-center">
                {/* Navigation arrows */}
                <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>

                <button
                    onClick={goToNext}
                    disabled={isLastSlide}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all z-10"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>

                {/* Image */}
                <div className="relative w-full aspect-[9/16] max-h-[60vh] rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={currentSlide.imageUrl}
                        alt={currentSlide.title || `Slide ${currentIndex + 1}`}
                        className="w-full h-full object-cover transition-opacity duration-300"
                    />
                    {/* Gradient overlay for text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>

                {/* Title and description */}
                <div className="mt-6 text-center">
                    {currentSlide.title && (
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {currentSlide.title}
                        </h2>
                    )}
                    {currentSlide.description && (
                        <p className="text-white/80 text-sm md:text-base max-w-md">
                            {currentSlide.description}
                        </p>
                    )}
                </div>

                {/* Indicators */}
                <div className="flex gap-2 mt-6">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-white/40 hover:bg-white/60'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Action button */}
                <Button
                    onClick={isLastSlide ? onComplete : goToNext}
                    className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-full shadow-lg transition-all hover:scale-105"
                >
                    {isLastSlide ? '시작하기' : '다음'}
                </Button>
            </div>

            {/* Auto-play indicator */}
            {!isPaused && !isLastSlide && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="h-1 w-32 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white/60 rounded-full animate-progress"
                            style={{
                                animation: `progress ${autoPlayInterval}ms linear`,
                            }}
                        />
                    </div>
                </div>
            )}

            {/* CSS for progress animation */}
            <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress ${autoPlayInterval}ms linear;
        }
      `}</style>
        </div>
    );
}
