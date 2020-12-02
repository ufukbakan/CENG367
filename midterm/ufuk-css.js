window.addEventListener("load",pageLoaded);

function pageLoaded(){
    let sliders = document.getElementsByClassName("slider");
    for (let i = 0; i < sliders.length; i++)
    {
        let tempContent = sliders[i].innerHTML;
        let totalSlides = sliders[i].querySelectorAll("slide").length;
        sliders[i].innerHTML = "";
        let frame = document.createElement("div");
        frame.classList.add("slider-frame");
        let stripe = document.createElement("div");
        stripe.classList.add("slider-stripe");
        stripe.innerHTML = tempContent;
        sliders[i].setAttribute("slide-index",0);
        sliders[i].setAttribute("total-slides",totalSlides);
        sliders[i].style.width = sliders[i].getAttribute("width");

        sliders[i].appendChild(frame);
        frame.appendChild(stripe);

        let indicators = document.createElement("div");
        indicators.classList.add("slide-indicators");
        sliders[i].appendChild(indicators);
        for(let indic=0; indic < totalSlides; indic++)
        {
            let indicator = document.createElement("div");
            indicator.classList.add("slide-indicator");
            indicator.setAttribute("indicator-index",indic);
            indicator.addEventListener("click",indicatorClick);
            indicators.appendChild(indicator);
        }
        indicators.querySelector(".slide-indicator").classList.add("active");

        sliders[i].setAttribute("play","true");
        let sliderTimer = setInterval( () => sliderTick(sliders[i]), 8000 );
    }

    let boxes = document.getElementsByClassName("box");

    for(let i = 0; i < boxes.length; i++)
    {
        if(boxes[i].getAttribute("width") != null)
            boxes[i].style.width = boxes[i].getAttribute("width");
    }
}

function sliderTick(slider){
    if(slider.getAttribute("play") == "true")
    {
        let currentSlide = Number(slider.getAttribute("slide-index"));
        let totalSlides = Number(slider.getAttribute("total-slides"));

        if (currentSlide +1 >= totalSlides)
            currentSlide = 0;
        else
            currentSlide += 1;
        
        sliderGoNth(slider, currentSlide);

    }
}

function sliderGoNth(slider, n){

    slider.setAttribute("slide-index",n);

    let stripe = slider.querySelector(".slider-stripe");
    stripe.style.transform = "translateX(" + (n*(-100))  +  "%)";

    let indicators = slider.querySelectorAll(".slide-indicator");

    for(let i = 0; i < indicators.length; i++)
    {
        if(i != n && indicators[i].classList.contains("active")) 
            indicators[i].classList.remove("active");
    }

    if(!indicators[n].classList.contains("active"))
    !indicators[n].classList.add("active");

}

function getParentSlider(element){
    if(element.classList.contains("slider"))
        return element;
    else
        return getParentSlider(element.parentElement);
}

function indicatorClick(){
    //console.log(this.getAttribute("indicator-index"));
    let parentSlide = getParentSlider(this);
    parentSlide.setAttribute("play","false");
    sliderGoNth(parentSlide,Number(this.getAttribute("indicator-index")));
    setTimeout(function(){ parentSlide.setAttribute("play","true") },4000);

}
