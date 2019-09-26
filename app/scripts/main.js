'use strict';
const isDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isAndroid = /Android/i.test(navigator.userAgent),
    isIos = /iPhone|iPad|iPod/i.test(navigator.userAgent),
    isMobile = $(window).width() < 768,
    mobileWidth = 767,
    deviceWidth = 1024,
    isIE11 = !!(navigator.userAgent.match(/Trident/) && navigator.userAgent.match(/rv[ :]11/));
const FE = {
    global: {
        equalHeightByRow: (obj, notRunMobile) => {
            let widthTarget = 0;
            if ($(obj).length) {
                $(obj).height('auto');
                widthTarget = (notRunMobile === true) ? 768 : 0;
                if ($(window).width() >= widthTarget) {
                    var currentTallest = 0,
                        currentRowStart = 0,
                        rowDivs = [],
                        currentDiv = 0,
                        $el,
                        topPosition = 0;
                    $(obj).each(function() {
                        if ($(this).is(':visible') === true) {
                            $el = $(this);
                            topPosition = $el.offset().top;
                            if (currentRowStart !== topPosition) {
                                for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                                    rowDivs[currentDiv].innerHeight(currentTallest);
                                }
                                rowDivs = [];
                                currentRowStart = topPosition;
                                currentTallest = $el.innerHeight();
                                rowDivs.push($el);
                            } else {
                                rowDivs.push($el);
                                currentTallest = (currentTallest < $el.innerHeight()) ? ($el.innerHeight()) : (currentTallest);
                            }
                            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                                rowDivs[currentDiv].innerHeight(currentTallest);
                            }
                        }
                    });
                }
            }
        },
        selectboxStyle: (name) =>{
            $(name).find('.dropdown-menu li a').on('click', function(){
                $(this).parent().parent().prev().text($(this).text());
            });
        },
        detectDevices: () => {
            let a = isDevice === true ? ' device' : ' pc',
                b = isAndroid === true ? ' android' : ' not-android',
                c = isIos === true ? ' ios' : ' not-ios',
                d = isMobile ? ' mobile' : ' desktop',
                e = isIE11 ? ' ie11' : ' ',
                htmlClass = a + b + c + d + e;
            $('html').addClass(htmlClass);
            if (isDevice) {
                $('body').css('cursor', 'pointer');
            }
        },
        replaceImgToBackground: (img) => {
            $(img).each(function() {
                if ($(this).css('visibility') == 'visible') {
                    $(this).parent().css('background-image', 'url(' + $(this).attr('src') + ')');
                }
            });
        },
        lazyLoad: () => {
            function lazy() {
                $('img.lazy').each(function () {
                    if ($(this).parent().offset().top - $(window).scrollTop() < $(window).height() + 150) {
                        let bgimg = $(this).attr('data-src');
                        var bgDefault = $(this).attr('data-default');
                        if (bgimg.length) {
                            if (isMobile) {
                                if(bgimg.length <= 0){
                                    $(this).attr('src', bgDefault);
                                }else{
                                    $(this).attr('src', bgimg);
                                }
                                $(this).css({
                                    'opacity': '1',
                                    'pointer-events': 'unset'
                                });
                                $(this).parent().css({
                                    'background-image': '',
                                    'background-size': '',
                                    'display': ''
                                });
                            } else {
                                $(this).attr('src', bgDefault);
                                $(this).css({
                                    'opacity': '0',
                                    'pointer-events': 'none'
                                });
                                $(this).parent().css({
                                    'background-image': 'url(' + bgimg + ')',
                                    'background-size': 'cover',
                                    'display': 'block'
                                });
                            }
                        }
                    }
                });
            };
            lazy();
            $(window).scroll(function () {
                setTimeout(() => {
                    lazy();
                }, 200);
            });
            $(window).resize(function () {
                setTimeout(() => {
                    lazy();
                }, 200);
            });
        },
        clickOutside: (method, box, targetElement) => {
            $('html').on("click", 'body', e => {
                var container = $(box);
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    switch (method) {
                        case 'fade':
                            $(targetElement).stop().fadeOut(500);
                            break;
                        case 'slide':
                            $(targetElement).stop().slideUp();
                            break;
                        case 'active':
                            $(targetElement).stop().removeClass('active');
                            break;
                    }
                }
            });
        },
        slider: () => {
            $('.slider .responsive').slick({
                infinite: true,
                arrows: false,
                autoplay: true,
                dots: true,
                slidesToShow: 1,
            });
        },
        heightIframeVideo: (videoContent) =>{
            $(videoContent).css('height', $('.banner-slider').innerHeight());
        },
        tabsMenu: () => {
            $(document).on("click", '.tabs-control .tab-content .header-tab', function (e) {
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active').next().slideUp();
                    let idTabMobile = $(this).next().attr('id');
                    $('.tabs-control .nav-tabs li').each(function () {
                        if ($(this).attr('href') == idTabMobile) {
                            $(this).removeClass('active');
                        }
                    });
                } else {
                    $(this).parent().find('.header-tab').each(function () {
                        $(this).removeClass('active').next().slideUp();
                    });
                    $(this).addClass('active').next().slideDown();
                    $('.tabs-control .nav-tabs li').removeClass('active')
                    let idTabMobile = $(this).next().attr('id');
                    $('.tabs-control .nav-tabs li').each(function () {
                        if ($(this).find('a').attr('href') == '#' + idTabMobile) {
                            $(this).addClass('active');
                        }
                    });
                }
            });
            $(document).on("click", '.tabs-control .nav-tabs li', function (e) {
                e.preventDefault();
                let idTabDesktop = $(this).find('a').attr('href');
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    $(idTabDesktop).slideUp().prev().removeClass('active');
                } else {
                    $('.tabs-control .tab-content .header-tab').removeClass('active').next().slideUp();
                    $('.tabs-control .nav-tabs li').removeClass('active');
                    $(this).addClass('active');
                    $(idTabDesktop).slideDown().prev().addClass('active');
                }
            });
        },
        init: () => {
            // FE.global.equalHeightByRow('.eqh');
            FE.global.selectboxStyle('.style-select');
            FE.global.detectDevices();
            FE.global.tabsMenu();
        },
        loaded: () => {
            // FE.global.equalHeightByRow('.eqh');
            FE.global.slider();
            // FE.global.heightIframeVideo('.banner-slider iframe');
        },
        resize: () => {
            // FE.global.equalHeightByRow('.eqh');
            FE.global.slider();
            // FE.global.heightIframeVideo('.banner-slider iframe');
        },
        scroll: () => {

        }
    },
    pages: {
        home: {
            init: () => {},
            loaded: () => {},
            resize: () => {}
        }
    }
};
