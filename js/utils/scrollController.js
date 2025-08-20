export class ScrollController {
    constructor(app) {
        this.app = app;
        this.sections = document.querySelectorAll('section[data-scene]');
        this.currentSection = 0;
        
        this.init();
    }

    init() {
        this.setupScrollTriggers();
        this.setupSectionObservers();
    }

    setupScrollTriggers() {
        // Register GSAP ScrollTrigger plugins
        gsap.registerPlugin(ScrollTrigger);

        // Create scroll-triggered animations for each section
        this.sections.forEach((section, index) => {
            const sceneName = section.dataset.scene;
            
            // Main scene transition trigger
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => this.app.switchScene(sceneName),
                onEnterBack: () => this.app.switchScene(sceneName),
                //markers: true // Set to true for debugging
            });

            // Content animations
            const content = section.querySelector('.content');
            if (content) {
                gsap.fromTo(content, 
                    {
                        opacity: 1,
                       // y: 50,
                       // x:0
                    },
                    {
                        opacity: 1,
                       // x:550,
                        //y: 0,
                        duration: 1,
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            end: "bottom 20%",
                            scrub: 3
                        }
                    }
                );
            }
        });
        
  

    }

    setupSectionObservers() {
        // Optional: Add intersection observer for additional control
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sceneName = entry.target.dataset.scene;
                        // Additional logic when section comes into view
                    }
                });
            },
            {
                threshold: 0.5
            }
        );

        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
}