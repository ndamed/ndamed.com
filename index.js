var body;
var hamburgerMenuButton;
var menuContainerMobile;
var mobileNavbar;

var dictionary;
var currentLanguage;
var languageBasedDictionary;
var gallery1;
var gallery2;
var previewContainer;
var preview;
var currentGallery;
var currentPreviewIndex1 = 0;
var currentPreviewIndex2 = 0;

var imageSources1 = [];
var imageSources2 = [];


async function onload() {
    body = document.querySelector("body");
    await loadDictionary();
    await setLanguage();
    await populateSelections();
    hamburgerMenuButton = document.getElementById('hamburger-button');
    menuContainerMobile = document.querySelector('.menu-container-mobile');
    mobileNavbar = document.querySelector(".menu-container-mobile>nav");

    body.style.display = "block";

    mobileNavbar.style.display = "none";
    // try parse gallery1
    gallery1 = document.getElementById("gallery-1");
    gallery2 = document.getElementById("gallery-2");

    if (gallery1) {
        previewContainer = document.getElementById("preview-container");
        preview = document.getElementById("preview");

        for (let i of gallery1.children) {
            imageSources1.push(i.getAttribute("src"));
        }
    }

    if (gallery2) {
        previewContainer = document.getElementById("preview-container");
        preview = document.getElementById("preview");
        for (let i of gallery2.children) {
            imageSources2.push(i.getAttribute("src"));
        }
    }

    body.style.display = "block";
}

function handleHamburger() {
    if (!hamburgerMenuButton.checked) {
        menuContainerMobile.classList.remove("off");
        menuContainerMobile.classList.add("on");
        mobileNavbar.style.transition = "opacity 0.3s"
        mobileNavbar.style.opacity = "1";
        mobileNavbar.style.display = "flex";
    } else {
        menuContainerMobile.classList.remove("on");
        menuContainerMobile.classList.add("off");
        mobileNavbar.style.transition = "opacity 0.3s"
        mobileNavbar.style.opacity = "0";
        mobileNavbar.style.display = "none";
    }
}

//#endregion HAMBURGER//


// SLIDER

function prevSlide(e) {
    handleScroll(-1, e.target);
}

function nextSlide(e) {
    handleScroll(1, e.target);
}

function handleScroll(amount, t) {
    var target = t.id.split('-')[1];

    var gallerySlider = document.getElementById(`gallery-${target}`);
    var gallerySliderWidth = gallerySlider.offsetWidth;
    var galleryChildCount = gallerySlider.children.length;
    if (gallerySlider) {
        gallerySlider.scrollLeft += amount * 2 * (gallerySliderWidth / galleryChildCount);
    }
}

function galleryZoom(e) {
    var img = e.target.getAttribute("src");
    currentGallery = e.target.parentElement.id;
    if (currentGallery === "gallery-1") {
        currentPreviewIndex1 = imageSources1.indexOf(img);
    }
    else {
        currentPreviewIndex2 = imageSources2.indexOf(img);
    }

    previewContainer.style.display = "flex";
    setPreviewSource(img);
}

function setPreviewSource(i) {
    preview.src = i;
}

function exitPreview() {
    preview.src = "";
    previewContainer.style.display = "none";
}

function prevPreview(e) {
    if (currentGallery === "gallery-1") {
        if (currentPreviewIndex1 > 0) {
            currentPreviewIndex1--;
            setPreviewSource(imageSources1[currentPreviewIndex1]);
        }
    }
    else {
        if (currentPreviewIndex2 > 0) {
            currentPreviewIndex2--;
            setPreviewSource(imageSources2[currentPreviewIndex2]);
        }
    }

}

function nextPreview(e) {
    if (currentGallery === "gallery-1") {
        if (currentPreviewIndex1 < imageSources1.length - 1) {
            currentPreviewIndex1++;
            setPreviewSource(imageSources1[currentPreviewIndex1]);
        }
    }
    else {
        if (currentPreviewIndex2 < imageSources2.length - 1) {
            currentPreviewIndex2++;
            setPreviewSource(imageSources2[currentPreviewIndex2]);
        }
    }
}


// TRANSLATION
async function loadDictionary() {
    try {
        const response = await fetch('./dictionary.json');
        if (!response.ok) {
            throw new Error(`Failed to load dictionary.json (HTTP ${response.status})`);
        }
        dictionary = await response.json();

    } catch (error) {
        console.error('Error loading dictionary:', error.message);
    }
}

async function setLanguage() {
    await loadDictionary();

    var cookie = document.cookie;
    if (cookie === undefined || cookie.length === 0) {
        document.cookie = "lang=tr";
        currentLanguage = "tr";
    }
    else {
        currentLanguage = cookie.split('=')[1];
    }

    const languageBasedDictionary = dictionary.texts.map(({ id, [currentLanguage]: langText }) => ({ id, text: langText }));

    let img = document.getElementById("img1");
    let img2 = document.getElementById("img2");
    let img3 = document.getElementById("img3");

    if (currentLanguage === "de" || currentLanguage === "nl") {
        if (img) {
            img.classList.add("img1-alternative");
        }
        if (img2) {
            img2.classList.add("img2-alternative");
        }
        if (img3) {
            img3.classList.add("img3-alternative");
        }
    }
    else {
        if (img) {
            img.classList.remove("img1-alternative");
        }
        if (img2) {
            img2.classList.remove("img2-alternative");
        }
        if (img3) {
            img3.classList.remove("img3-alternative");
        }
    }

    languageBasedDictionary.forEach(element => {
        let htmlElement = document.getElementById(element.id)
        if (htmlElement) {
            htmlElement.innerHTML = element.text;
        }
    });

    var kvkk = document.getElementsByClassName("kvkk-link")[0];
    console.log(kvkk);
    if (kvkk) {
        if (currentLanguage == 'tr') {
            kvkk.style.display = "block";
        }
        else {
            kvkk.style.display = "none";
        }
    }
}

async function populateSelections() {
    var desktopSelect = document.querySelector(".language-selector select");
    var mobileSelect = document.querySelector(".language-selector-mobile select");

    desktopSelect.innerHtml = "";
    mobileSelect.innerHTML = "";

    dictionary.languages.forEach(lang => {
        let option = document.createElement("option");
        let option_mobile = document.createElement("option");
        option.value = lang.short;
        option.textContent = lang.name;

        option_mobile.value = lang.short;
        option_mobile.textContent = lang.name;

        desktopSelect.appendChild(option)
        mobileSelect.appendChild(option_mobile);
    })

    desktopSelect.value = currentLanguage;
    mobileSelect.value = currentLanguage;
}

async function handleLanguageSelector(event) {
    var changedSelect = event.target;

    document.cookie = "lang=" + changedSelect.value;
    await setLanguage();
}


//KVKK POPUP
function toggleOverlay() {
    const overlay = document.querySelector('.kvkk-popup');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
}

function scrollToTop() {
    const text = document.querySelector('.kvkk-popup');
    text.scrollTo({
        top: 0,
        behavior: 'smooth' // Use smooth behavior for smooth scrolling
    });
}