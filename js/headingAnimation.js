{
    const effects = [
        // Effect 1
        {
            options: {
                shapeColors: ['#111']
            },
            hide: {
                shapesAnimationOpts: {
                    duration: 200,
                    delay: (t,i) => i*20,
                    easing: 'easeOutExpo',
                    translateX: t => t.dataset.tx,
                    translateY: t => t.dataset.ty - anime.random(400,800),
                    scale: t => t.dataset.s,
                    rotate: 0,
                    opacity: {
                        value: 0, 
                        duration: 200, 
                        easing: 'linear'
                    }
                }
            },
            show: {
                lettersAnimationOpts: {
                    duration: 500,
                    delay: (t,i) => i*60,
                    easing: 'easeOutExpo',
                    opacity: {
                        value: [0,1], 
                        duration: 50,
                        delay: (t,i) => i*60,
                        easing: 'linear'
                    },
                    translateY: (t,i) => i%2 ? [anime.random(-350,-300),0] : [anime.random(300,350),0]
                },
                shapesAnimationOpts: {
                    duration: () => anime.random(1000,4000),
                    delay: (t,i) => i*20,
                    easing: [0.2,1,0.3,1],
                    translateX: t => {
                        const tx = anime.random(-200,200);
                        t.dataset.tx = tx;
                        return [0,tx];
                    },
                    translateY: t => {
                        const ty = anime.random(-300,300);
                        t.dataset.ty = ty;
                        return [0,ty];
                    },
                    scale: t => {
                        const s = randomBetween(0.2,0.6);
                        t.dataset.s = s;
                        return [s,s];
                    },  
                    rotate: () => anime.random(-90,90),
                    opacity: {
                        value: 0.6, 
                        duration: 1000, 
                        easing: 'linear'
                    }
                }
            }
        }
    ];

    class Slideshow {
        constructor(el) {
            this.DOM = {};
            this.DOM.el = el;
            this.DOM.slides = Array.from(this.DOM.el.querySelectorAll('.slide'));
            this.DOM.bgs = Array.from(this.DOM.el.querySelectorAll('.slide__bg'));
            this.DOM.words = Array.from(this.DOM.el.querySelectorAll('.word'));
            this.slidesTotal = this.DOM.slides.length;
            this.current = 0;
            this.words = [];
            this.DOM.words.forEach((word, pos) => {
                this.words.push(new Word(word, effects[pos].options));
            });
            
            this.isAnimating = true;
            this.words[this.current].show(effects[this.current].show).then(() => this.isAnimating = false);
        }
        show(direction) {
            if ( this.isAnimating ) return;
            this.isAnimating = true;
            
            let newPos;
            let currentPos = this.current;
            if ( direction === 'next' ) {
                newPos = currentPos < this.slidesTotal - 1 ? currentPos+1 : 0;
            }
            else if ( direction === 'prev' ) {
                newPos = currentPos > 0 ? currentPos-1 : this.slidesTotal - 1;
            }

            this.DOM.slides[newPos].style.opacity = 1;
            this.DOM.bgs[newPos].style.transform = 'none';
            anime({
                targets: this.DOM.bgs[currentPos],
                duration: 600,
                easing: [0.2,1,0.3,1],
                translateY: ['0%', direction === 'next' ? '-100%' : '100%'],
                complete: () => {
                    this.DOM.slides[currentPos].classList.remove('slide--current');
                    this.DOM.slides[currentPos].style.opacity = 0;
                    this.DOM.slides[newPos].classList.add('slide--current');
                    this.words[newPos].show(effects[newPos].show).then(() => this.isAnimating = false);
                }
            });

            this.words[newPos].hide();
            this.words[this.current].hide(effects[currentPos].hide).then(() => {
                
                this.current = newPos;
            });
        }
    }

    const slideshow = new Slideshow(document.querySelector('.slideshow'));
    document.querySelector('.slidenav__item--prev').addEventListener('click', () => slideshow.show('prev') );
    document.querySelector('.slidenav__item--next').addEventListener('click', () => slideshow.show('next') );
    document.addEventListener('keydown', (ev) => {
        const keyCode = ev.keyCode || ev.which;
        if ( keyCode === 37 ) {
            slideshow.show('prev');
        }
        else if ( keyCode === 39 ) {
            slideshow.show('next');
        }
    });
}