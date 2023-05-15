const basicSliders = document.querySelectorAll('.basicSlider');
const basicSliderArr = Array.from(basicSliders);

basicSliderArr.forEach(slider => {
    const frame = slider.querySelector('.basicSliderFrame');
    const sliderFull = slider.querySelector('.basicSliderFull');
    const bSlide = slider.querySelectorAll('.b-slide');
    const bSlideArr = Array.from(bSlide);
    const progressBar = slider.querySelector('.prog-bar-inner');
    const leftBtn = slider.querySelector('.basicSlider-LeftBtn');
    const rightBtn = slider.querySelector('.basicSlider-RightBtn');

    const positions = [0];
    let step;
    let sliderGrabbed = false;

    if(window.innerWidth < 768) {
        const margin = (window.innerWidth - 300) / 2;
        step = margin * 2 + 300;
        bSlideArr.forEach(bs => {
            bs.style.marginLeft = margin + 'px';
            bs.style.marginRight = margin + 'px';
            sliderFull.style.width = step * 10 + 'px'; 
        });
    } else {
        const computedStyle = getComputedStyle(bSlideArr[0]);
        step = bSlideArr[0].offsetWidth + parseFloat(computedStyle.marginLeft) + parseFloat(computedStyle.marginRight);   
    }

    for(let i = 1; i < 9; i++) {
        positions.push(positions[i - 1] + step);
    }
    console.log(positions);

    frame.addEventListener('scroll', (e) => {
        progressBar.style.width  = getScrollPercentage() + '%';
        console.log(frame.scrollLeft);
    })

    sliderFull.addEventListener('mousedown', (e) => {
        sliderGrabbed = true;
        sliderFull.style.cursor = 'grabbing';
    })

    sliderFull.addEventListener('mouseup', (e) => {
        sliderGrabbed = false;
        sliderFull.style.cursor = 'grab';
    })

    sliderFull.addEventListener('mouseleave', (e) => {
        sliderGrabbed = false;
        sliderFull.style.cursor = 'grab';
    })

    sliderFull.addEventListener('mousemove', (e) => {
        if(sliderGrabbed){
            frame.scrollLeft -= e.movementX;
        }
    })

    sliderFull.addEventListener('wheel', (e) =>{
        e.preventDefault()
        frame.scrollLeft += e.deltaY;
    })

    leftBtn.addEventListener('click', () => {
        console.log('levo')
        slideAnimation(positions[currentSlide(frame.scrollLeft - 1)]);
    })

    rightBtn.addEventListener('click', () => {
        console.log('nije levo')
        slideAnimation(positions[currentSlide(frame.scrollLeft + 1) + 1]);
    })

    function getScrollPercentage(){
        return ((frame.scrollLeft / (frame.scrollWidth - frame.clientWidth) ) * 100);
    }
    
    function slideAnimation(position) {
        const startPosition = frame.scrollLeft;
        const distance = position - startPosition;
        let duration;
        if(window.innerWidth > 1000) {
            duration = 500;
        } else {
            duration = 300;
        }
        let start = null;
      
        function step(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          let ease;

          if (window.innerWidth > 1000) {
            ease = (progress / duration) ** 2; //ease-in-out
          } else {
            ease = (progress / duration); //linear
          }

          const scrollLeft = startPosition + distance * ease;

          if ((distance > 0 && scrollLeft >= position) || (distance < 0 && scrollLeft <= position)) {
            frame.scrollLeft = position;
            return;
          }

          frame.scrollLeft = scrollLeft;
          if (progress < duration) {
            window.requestAnimationFrame(step);
          }
        }
      
        window.requestAnimationFrame(step);
    }

    function currentSlide (scrollLeft) {
        let test = positions.filter(postion => scrollLeft >= postion);
        return test.length - 1;
    }
});