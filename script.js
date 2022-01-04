'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

// NOTE-: whenever we click on a link, the default behaviour of the "<a></a>"  is to move the page to the top, and open Account(btnsOpneModal) is <a>, that's why e.preventDefault() is used in openModal function..
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Smooth Scrolling-:

btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords);

  // console.log('current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'height width viewport:',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // Scrolling-:
  // old way of doing scrolling
  // window.scrollTo(s1coords.left, s1coords.top + window.pageYOffset); //s1coords.left will always be 0, so it will scroll to "0, s1coords.top", but the problem is top is the distance from the viewport as we scroll down viewport changes and top also changes and thus, window.scrollTo() doesn't work properly. Now, we can add the amount of distance we have scrolled down to s1coords.top

  // window.scrollTo({
  //   left: s1coords.left,
  //   top: s1coords.s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // }); // we pass an object to add smooth behaviour

  // new way of doing scrolling, downside is that it is supported in new browsers only. So, check browser support before using this
  section1.scrollIntoView({ behavior: 'smooth' });
});

/* NOTE-: 1-: getBoundClientRect()-: it reruns the coordinates of the element according to the viewport. ex-: in s1coords(coordinates of btnScrollTo element) has "top and y" property which gives distance of the element from the top of viewport, not from the initial top of the page.
          2-: window.pageX/Yoffset()-: it gives the amount of distance(in pixels) we have scrolled from the upper left corner of the window, horizontally and vertically.  
          3-: document.documentElement.clientWidth/Height-: it returns the height and width of the viewport
 */

///////////////////////////////
// Page navigation-:

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault(); // to avoid the scrolling and changing of url(url contains the address in href).

//     const id = el.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// NOTE-: The problem with the above approach is-: we are attaching event listener to all 3 elements usinf for loop, in case we have 500 or 1000 elements than attaching event listeners to all those elements will be like making 500 or 1000 copies of a same handler function.

// (v.v.v.v.imp.) Event Delegation-: we attach event listener to a common parent and than tell the parent on which element(target) actually event was triggered.

// 1-: Add Event listener to common parent element
// 2-: Determine what element originated the event, and than use event listener on that event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching Strategy-: to determine where that click event happened
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
// NOTE-: event delegation becomes more important when we want to add something to DOM at runtime using event listeners, because without event delegation we cannot add something to DOM which doesn't even exist(at runtime), using event delegation we can define the common parent(even at runtime we know that where the new element would get added in DOM) and than add that new element around that parent.

// Tabbed component-:
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); // if we have not used closest parent than clicking on the text would select the span(which has text in it) as a target and we want the button element to be selected as a target to work on it.

  // Guard clause-: it is required, cause in case someone clicked on the information section than "clicked variable" would give null, so if the actual button is not pressed we will exit the handler.
  if (!clicked) return;

  // Remove active classes-:
  tabs.forEach(btn => btn.classList.remove('operations__tab--active'));
  tabsContent.forEach(cont =>
    cont.classList.remove('operations__content--active')
  );

  // Activate Tab-:
  clicked.classList.add('operations__tab--active');

  // Activate Content area-:
  document
    .querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`)
    .classList.add('operations__content--active');
});
// NOTE-: a good example of tabbed component is chrome new tab option "+"
// NOTE-: while making components like this(tabbed component) we just add and remove classes.

// Menu fade animation-:
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// The "mouseover" event fires when the user moves the mouse onto an element. The "mouseout" event fires when the user moves the mouse out of an element

nav.addEventListener('mouseover', handleHover.bind(0.5)); // here we have set the this keyword to the opacity value wanted. since, handleHover is now the callback function for event Listener and it will event object(e) inside it, so we don't pass a event argument here as we have already passed the event in the handleHover's definition.
nav.addEventListener('mouseout', handleHover.bind(1)); // Generally this keyWord of a event listener's callback function is the e.currentTarget, but here we have set the "this keyword manually" so, e.currentTarget reamins same but this keyword changes.

// // Sticky navigation-:
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function () {
//   if (window.scrollY >= initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Intersection API-:
// Sticky navigation using Intersection Observer API-: when we were using event listener with event "scroll", the code was executed every time we scroll that will definitely decrease the performance, that' why we have used this API.
const navHeight = nav.getBoundingClientRect().height;
// height of the navbar remains constant.

const header = document.querySelector('header');
const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
}); // this constructor will accepet a callback and execute that callback whenever the threshold is crossed by the target(header) and returns an object.
headerObserver.observe(header);

/* 1-: Threshold is the percentage visisbility of the target element.
   2-: The first argument(in callback) is known as entries and is an array of IntersectionObserverEntry objects.
   3-: Each such object represents information about a given target's intersection with the root(in this case it is viewport, cause root: null is for viewport).
   4-:(v.v.v.imp.)-: The targets that line up in the entries array are those elements whose intersection ratio has gone greater than (or equal to) a threshold value or whose intersection ratio has gone lesser than a threshold value. 
   5-: (v.v.v.imp.)-: We see an entry even when interSection ratio < threshold, because entries array is returned by observer.observe() method as a argument to the callback even before the target object in entries array has a intersection ratio <= threshold. The important thing is-: we want callback to perform certain action after target reaches threshold(in this case, but generally depends on the req. ,wether we want to perform a action earlier or after target reaches threshold), so use property isIntersecting in entry, it gets set to true when target reaches the threshold.   
   6-: rootMargin is the distance between the threshold in pixels. 
   7-: new IntersectionObserver() constructor's returns a object so, we have methods on that object and observe() is used beacuse it returns an entries array which is req. in callback.
   NOTE-: if you want to know more about IntersectionObserver API-: https://www.codeguage.com/courses/advanced-js/intersection-observer-entries#:~:text=By%20far%20the%20most%20useful,know%20the%20whole%20observer's%20API.*/

// Reveal Sections-:
const sections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');

  observer.unobserve(entry.target); // ex-: when we scroll down and all sections are revealed and than go up the Observer will stil be observing the target(all sections) when they inteersect the root at threshold.
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

sections.forEach(section => {
  section.classList.add('section--hidden'); // we are adding scetion-hidden class here not in HTML because people sometimes choose the hide JavaScript option, than in that case our JS code won't be able to remove the section--hidden class.
  sectionObserver.observe(section);
}); // we are actually observing multiple targets

// Lazy loading images-:

// (v.v.imp.) NOTE-: when it comes to website's performance images is the major factor as they are bigger in size, so we can create a feature lazy loading images using Intersection Observer API.
// we have first first set the link of image of low quality in the "src" so, that our page gets loaded faster and than replacing "src" link with data-src link which is of high quality
const lazyImages = document.querySelectorAll('img[data-src]');

const lazyLoad = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry.target);

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(lazyLoad, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

lazyImages.forEach(img => imgObserver.observe(img));

/* (v.v.imp.) NOTE-:  whenever we scroll our website page and than reload it, some of the functions in the code doesn't work properly. ex=> if you reload the page after 
                      scrolling to the lazy image section than sometimes some of the lazy images  doesn't gets loaded. To resolve this issue we can move the page to 
                      the top after reload, but Question is why this is happening in my website only not in other website, other website's functions gets reloaded fine
                       even if we reload after some scrolling ? 

                       To move the page to the top-: window.onbeforeunload = function () {
                                                          window.scrollTo(0, 0);
                                                        }
*/

// Slider component-:
(function () {
  // (v.v.imp.) (tip) NOTE-:  Before working on complicated components like this, arrange the elements inside that component so that you can check and observe every effect like i have first used the code below(slider variable) to see how slides are moving
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.3) translateX(-800px)';
  // slider.style.overflow = 'visible';

  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let currSlide = 0;
  const maxSlide = slides.length;

  // Functions-:
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
      // when we were using 'afterbegin' than dot elements were getting placed above the previous one that's why we console.log(dotContainer) were showing dots having data-slide attribute in order 3 2 1 0
    });
  };

  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`) // selecting elments on the basis of class and in that class we have specified a attribute(data-set = 1,2,3,4)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const init = function () {
    goToSlide(0); // this is used to arrange all slides initially, that's why slide argument is 0.
    createDots();
    activeDot(0); // this is beacuse when we reload the page the active dot is removed and it should be at the 1st slide in the starting.
  };
  init();

  // Event Listeners-:

  // Next slide-:
  const nextSlide = function () {
    if (currSlide === maxSlide - 1) currSlide = 0;
    else {
      currSlide++;
    }

    goToSlide(currSlide);
    activeDot(currSlide);
  };
  btnRight.addEventListener('click', nextSlide);

  // Previous slide-:
  const prevSlide = function () {
    if (currSlide === 0) currSlide = maxSlide - 1;
    else {
      currSlide--;
    }

    goToSlide(currSlide);
    activeDot(currSlide);
  };
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // keyBoard events are listened on the document by event listeners.
    if (e.key === 'ArrowRight') nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  // using Event delegation-:
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset; // we can do it by simply declaring a variable, but we have used Object destructuring beacuse data-slide is a object. check-: console.log(typeof e.target.dataset);
      goToSlide(slide);
      activeDot(slide);
    }
  });
})(); //  wrapped the sliding component's code into an IIFE to avoid polluting the global space.

// (v.v.v.imp) NOTE-: Look how beautifully data-slide attribute is used in dot elements, we are accessing the currSlide(while calling goToSlide function in dotContainer event listener) using data-slide attribute.

///////////////////////
//////////////////////

/////// LECTURES //////////
// // Selecting elements-:

// // (v.v.v.imp.) NOTE-:  watch vid.182 once to know about DOM and level of inheritance and in that video Element is hypothetical which further have HTML element(<html> tag which has all the html code inside it), than further HTML Element has html tags(button,  div, input, img, etc.)
// // NOTE-: document(in document.querySelector and other DOM methods) is the "HTML document's object" which gets loaded inside window object and documentElement is the root element of the document. ex-: for HTML document root = <html> tag.
// console.log(document.documentElement);
// console.log(document.body);
// console.log(document.head);

// const header = document.querySelector('.header');

/*(v.imp) NOTE-: 1-:  NodeLists behave differently depending on how you access them. ex=>  if you access nodeLists using querySelectorAll() it will return a static
                      nodeList while using .childNodes nodeList returned is live.
                  2-: see difference B/W nodeLists and HTMLCollections -: https://www.stefanjudis.com/blog/accessing-the-dom-is-not-equal-accessing-the-dom/    */

// // NOTE-: a Node is any DOM object(ex-: comment node, text node, document node, etc.), but an element is one specific type of node.
// /* NOTE-: Difference B/W a nodeList and HTMLCollection is-: 1-: a nodeList can contain any node type. HTMLCollection is supposed to contain only element nodes(an element is one specific type of node).
//                                                             2-: a HTMLCollection is collection of elements, node does not have live elements(live means as the DOM changes the HTMLCollection also gets updated).*/

// console.log(document.getElementById('section-1'));

// const allSections = document.querySelectorAll('.section');
// console.log(allSections);

// const allBtns = document.getElementsByTagName('button'); // methods like-: getElementsByClassName getElementsByTagName returns a HTML collection.
// console.log(allBtns);
// console.log(document.getElementsByClassName('btn'));

// // Creating and Inserting Elements-:

// // allSections[0].insertAdjacentHTML;
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // till now we have created a html element, to insert it in DOM-:

// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// /* NOTE-: 1-: .prepend() is used to add message as a first child of header element.
//           2-: .append() is used to add message as a last child of header element, but append here will override the prepend, cause message is a live DOM element and it cannot exist at 2 places simultaneously. and using appned just after prepend basically means moving the message as the last child from being the first child of header element.
//           3-: we can use "prepend and append" to move HTML elements inside DOM.
//           4-: header.append(message.cloneNode(true)); // appned(message.cloneNode()) will copy the message element and using cloneNode() in append(message) we are actually appneding the copy of message element. so, using thiss technique we can place a element in DOM at multiple places.
//           5-: header.before(message); , header.after(message); are same as "prepend and append", the only diff. is that they add elements as a sibling not as a child.
//           */

// // Deleting Elements-:
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove();
//     // Before remove()-: it was done like in next line
//     message.parentElement.removeChild(message);
//   });

// // Styles-:
// message.style.backgroundColor = '#37383d'; // camel casing is used for property name
// message.style.width = '120%'; // using .style.property will set the property in "inline style css".

// console.log(message.style.color); // output  = nothing, cause .style property is unable to read "any style other than inline style".
// console.log(message.style.width);

// console.log(getComputedStyle(message).color); // to access the css in external stylesheets
// console.log(getComputedStyle(message).height); // returns a string.

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px'; // to set the external style css property
// console.log(getComputedStyle(message).height);

// console.log(document.documentElement);
// document.documentElement.style.setProperty('--color-primary', 'orangered'); // document.documentElement will select the <html></html>(root of the document) and document.documentElement.style will select all the applied css styles(wether inline or external) in the document and setProperty will change the mentioned property's(1st parameter)(if exist) value to 2nd parameter.

// // Attributes-:
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo'; // we can also set attributes.

// // Non-Standard-: usually when we create a attribute on a html element JS creates a property on that html elment object in DOM, but this doesn't happen for non-standard attributes(watch example below).
// console.log(logo.designer); // output = undefined(as designer is not a standard property.)
// console.log(logo.getAttribute('designer')); // we can still access a non-standard attribute.
// logo.setAttribute('company', 'Bankist');

// console.log(logo.src); // this is absolute URL-: URL including the host address and root folder address
// console.log(logo.getAttribute('src')); // this is Relative URL-: only root folder address.

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href); // absolute URL
// console.log(link.getAttribute('href')); // relative URL

// // data Attributes-: are used to display Data on the UI(ex-: some user data fetched from an API), these are non-standards attributes..
// console.log(logo.dataset.versionNumber); // use camel casing to access the name.

// // Classes
// logo.classList.add('c', 'h');
// logo.classList.remove('c', 'h');
// logo.classList.toggle('c');
// logo.classList.contains('c');

// // Don't use-:
// logo.className = 'parth'; // this will override the existing classes, it also forces us to put only one class on any element.

// Event Propagation in practice-:

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min) + 1) + min;
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', e => {
//   // as we are using arrow function here we cannot use this.style.backgroundColor
//   e.currentTarget.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click', e => {
//   e.currentTarget.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener(
//   'click',
//   e => {
//     e.currentTarget.style.backgroundColor = randomColor();
//     console.log('NAV', e.target, e.currentTarget);
//   },
//   true
// );

/* (v.v.imp) NOTE-: 1-: most of the events have a capturing, target and bubbling phase, but some events only has a target phase.
                    2-: we can attach or call multiple event listeners on a single target event. watch example in the link below.
                    3-: capturing = when looking for target element from ancestors till the target, Bubbling  = going back from target to the top passing all the 
                        ancestors. So, when we define 3rd parameter in addEventListener() = true than event is attched to the target in capturing phase and vice-versa
                        for bubbling phase. watch the example in event propagation in practice above.   
                    4-: Look at only the example of capturing and bubbling phase.
                    5-: "this" keyword in a addEventListener() === event.currentTarget. 
                    6-: e.target = element(or node in DOM) on which event(ex=> click) is triggered and e.currentTarget = element(or node in DOM) on which 
                        addEventListener() is attached.
                      */

// DOM  Traversing-: mostly used to access a element in DOM based on (or using) another element.

// const h1 = document.querySelector('h1');

// // Going Downwards-: child
// console.log(h1.querySelectorAll('.highlight'));
// // element.querySelectorAll()-:  1-: we can use querySelectorAll() on elements too. 2-: when using it on elements it returns all the childs of specified selector in querySelectorAll(). 3-: in the above line child returned with .highlight class were direct children of "h1" but it doesn't matter wether children's are direct or indirect it returns all the child's with specified selector
// console.log(h1.childNodes); // returns a nodeList with all the nodes inside the element(h1 = parent).
// console.log(h1.children); // returns only element nodes inside a HTML Collection. and it works for only direct children.

// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'orangered';

// // Going upwards-: parent
// console.log(h1.parentNode); // they both rerurn direct parent, but parentNode rerurns any direct parent node and parentElement returns only direct parent elment node.
// console.log(h1.parentElement);

// h1.closest('.header').style.background = 'var(--gradient-secondary)'; // Sometimes we need a closest parent not the direct parent. h1.closest('.header') will return the closest parent to h1 with class header.
// h1.closest('h1').style.background = 'var(--gradient-primary)'; // since, there is no "parent h1" for "h1"(this is h1 in h1.closest()) h1 itself gets selected.

// // .closest() can be understood as opposite of querySelectorAll()

// // Going Sideways-: Siblings
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling); // they both returns previous & next sibling element node

// console.log(h1.previousSibling); // they both returns previous & next sibling nodes of all type.
// console.log(h1.nextSibling);

// // to get all the siblings-: select the direct parent and than select all the children element(it will also include the h1(h1 in ))
// console.log(h1.parentElement.children);

// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// Life Cycle DOM Events-:

// NOTE-: as soon as all the HTML is parsed and converted into the DOM tree, document fires a "DOMContentLoaded" event but document doesn't wait for images and external files(like- fonts libraries and link) to be loaded before firing this event. This doesn't means that we should wrap up all our JS code into a Event listeber and wait for this event to be happen, beacuse we have used(or linked) script tag(<script>) in the last of the HTML document, so our JS code is executed once all HTML is  parsed to JS engine in browser.
// you can check how much time does it take to load all HTML and JS-: inspect-network-set the network to fast 3G or slow 3G to really observre the time to load content- than check in the bottom DOMContentLoaded, and you can also check how much time does it take to load all the content(including images and ext. files)

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML Parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('page fully loaded! ', e);
});

// prompt(
//   'find the reason why some of the lazy images were not loading properly after i reload the page after scolling down to the lazy image section'
// );

// whenever the user is about to leave the page(ex-:when someone hits close tab button on chrome, hits reload button) beforeunload event is fired.
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); // not necessary in chrome, but it is req. in some browsers.
//   console.log(e);
//   e.returnValue = ''; // this step is necessary(no logic behind it), to show a pop up whenever the user is hits close tab button.
//   // this feature can be used when a user tries to leave the site in B/W filling a form and in many more things.
// });
