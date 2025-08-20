export class AnimationManager {
    constructor(app) {
        this.app = app;
        this.activeAnimations = new Map();
        this.animationTimeline = gsap.timeline();
        
        this.init();
    }

    init() {
        this.setupGlobalAnimations();
    }

    setupGlobalAnimations() {
        // Global animation settings
        gsap.config({
            nullTargetWarn: false
        });

        // Default easing functions
        this.easings = {
            smooth: "power2.inOut",
            sharp: "power1.inOut",
            bouncy: "elastic.out(1, 0.5)"
        };
    }

    createScrollAnimation(config) {
        const {
            target,
            trigger,
            start = "top bottom",
            end = "bottom top",
            scrub = true,
            animation,
            duration = 1,
            ease = this.easings.smooth
        } = config;

        return gsap.to(target, {
            ...animation,
            duration,
            ease,
            scrollTrigger: {
                trigger,
                start,
                end,
                scrub,
                markers: false
            }
        });
    }

    createPinnedAnimation(config) {
        const {
            target,
            trigger,
            start = "top top",
            end = "bottom top",
            pin = true,
            pinSpacing = true,
            animation
        } = config;

        return gsap.to(target, {
            ...animation,
            scrollTrigger: {
                trigger,
                start,
                end,
                pin,
                pinSpacing,
                markers: false
            }
        });
    }

    // Performance optimization: throttle animations
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}