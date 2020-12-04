window.addEventListener("load",pageLoaded);
window.addEventListener("scroll",scrollListener);
window.addEventListener("resize",ifSwitchDesktop);

/* not necessary anymore tricked in css
window.addEventListener("resize",() => setTabPageSizes(null));
*/

function pageLoaded(){
    setTimeout(function(){ document.querySelector("#loading-bar").style.transform = "translateX(100%)";},700);
    setTimeout(function(){ document.body.style.overflow = "auto"; document.getElementById("loading-modal").classList.remove("open"); },1400);

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

    let modalclosers = document.getElementsByClassName("close-modal");
    for(let i = 0; i<  modalclosers.length; i++)
    {
        modalclosers[i].addEventListener("click",closeParentModal);
    }

    try{
        document.getElementById("search-button").addEventListener("click",function(){
            document.getElementById("search-modal").classList.add("open");
            document.body.style.overflow = "hidden";
            if(window.innerWidth <= 1260)
            {
                toggleMobileMenu();
            }

        })
    }
    catch{
        console.log("Could'nt found search button or search modal");
    }

    /* not necessary anymore tricked in css
    setTabPageSizes();
    */

    let tabHeaders = document.getElementsByClassName("tab-header");

    for(let i = 0; i < tabHeaders.length; i++){
        tabHeaders[i].addEventListener("click",tabClick);
    }

    document.querySelector("#mobile-menu").addEventListener("click",toggleMobileMenu);

    let dropDownOwners = document.getElementsByClassName("has-dropdown");

    for(let i = 0; i < dropDownOwners.length; i++)
    {
        dropDownOwners[i].addEventListener("click",mobileNavbarClickHandle);
        //dropDownOwners[i].addEventListener("touchend",mobileNavbarClickHandle);
    }
}

function mobileNavbarClickHandle(e)
{
    if(document.elementFromPoint(e.clientX,e.clientY).classList.contains("has-dropdown"))
        this.classList.toggle("mobile-click");
}

/* not necessary anymore tricked in css
function setTabPageSizes(tab=null){
    if(tab == null)
    {
        let tabs = document.getElementsByClassName("tabs");

        for(let i = 0; i < tabs.length; i++)
        {
            let maxh = 0;
            let tabcontents = tabs[i].querySelectorAll(".tab-content.display");
            for(let j = 0; j < tabcontents.length; j++)
            {
                if(tabcontents[j].clientHeight > maxh)
                    maxh = tabcontents[j].clientHeight;
            }
            tabs[i].style.heightt = maxh + tabs[i].querySelector(".tab-headers").clientHeight + "px";
        }
    }
    else{

    }
}*/

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
    let totalSlides = slider.getAttribute("total-slides");

    let stripe = slider.querySelector(".slider-stripe");
    stripe.style.transformOrigin = (2*n+1)*(100/totalSlides/2) + "% 50%";
    //stripe.style.transform = "rotate(" +n*360+ "deg)" + "translateX(" + (n*(-100))  +  "%)" ;
    //alternative rotating algorythm with sin function:
    stripe.style.transform = "rotate(" + Math.sin(n*(Math.PI/2))*360 + "deg)" + "translateX(" + (n*(-100))  +  "%)" ;

    let indicators = slider.querySelectorAll(".slide-indicator");

    for(let i = 0; i < indicators.length; i++)
    {
        if(i != n && indicators[i].classList.contains("active")) 
            indicators[i].classList.remove("active");
    }

    if(!indicators[n].classList.contains("active"))
    !indicators[n].classList.add("active");

}

function getParentWithClass(element,classname){
    if(element.classList.contains(classname))
        return element;
    else
        return getParentWithClass(element.parentElement,classname);
}

function indicatorClick(){
    //console.log(this.getAttribute("indicator-index"));
    let parentSlide = getParentWithClass(this,"slider");
    parentSlide.setAttribute("play","false");
    sliderGoNth(parentSlide,Number(this.getAttribute("indicator-index")));
    setTimeout(function(){ parentSlide.setAttribute("play","true") },4000);

}

function closeParentModal(){
    let parentModal = getParentWithClass(this,"modal");
    parentModal.classList.remove("open");
    document.body.style.overflow = "auto";
}

function tabClick(){
    setTabActive(this);
}

function setTabActive(sender)
{
    let tabswrapper = getParentWithClass(sender,"tabs");
    let activeTabHeaders = tabswrapper.querySelectorAll(".tab-header.active");
    let currentTabs = tabswrapper.querySelectorAll(".tab-content.display");

    for(let i = 0; i < activeTabHeaders.length; i++)
    {
        activeTabHeaders[i].classList.remove("active");
    }
    for(let i = 0; i < currentTabs.length; i++)
    {
        currentTabs[i].classList.remove("display");
    }

    let tabindex = Number(sender.getAttribute("tab"));
    //console.log("sender: " + sender.getAttribute("tab"));
    sender.classList.add("active");
    tabswrapper.querySelectorAll(".tab-content")[tabindex].classList.add("display");
}

function scrollListener(){
    let menu = document.querySelector(".menu");
    if(menu.getBoundingClientRect().top == 0 && !menu.classList.contains("dark"))
    {
        menu.classList.add("dark");
    }
    else if(menu.getBoundingClientRect().top != 0 && menu.classList.contains("dark"))
    {
        menu.classList.remove("dark");
    }
}

function toggleMobileMenu(){
    if(window.innerWidth <= 1260){
        document.querySelector(".menu").classList.toggle("mobile-open");
        document.querySelector("#mobile-menu").classList.toggle("mobile-open");
        if(document.querySelector("#mobile-menu").classList.contains("mobile-open"))
        {
            document.body.style.overflow = "hidden";
        }
        else{
            document.body.style.overflow = "auto";
        }
    }
}

function closeMobileMenu(){
    document.querySelector(".menu").classList.remove("mobile-open");
    if(document.querySelector("#mobile-menu").classList.contains("mobile-open"))
    {
        document.querySelector("#mobile-menu").classList.remove("mobile-open")
        document.body.style.overflow = "auto";
    }
}

function ifSwitchDesktop(){
    if(window.innerWidth > 1260)
    {
        closeMobileMenu();
    }
}