$(() => {
    FE.global.init();
    FE.pages.home.init();
});

$(window).load(() => {
    FE.global.loaded();
    FE.pages.home.loaded();
});

// Window resize
var width = $(window).width();
var resize = 0;
$(window).resize(() => {
    var _self = $(this);
    resize++;
    setTimeout(() => {
        resize--;
        if (resize === 0) {
            // Done resize ...
            if (_self.width() !== width) {
                width = _self.width();
                // Done resize width ...
                FE.global.resize();
                FE.pages.home.resize();
            }
        }
    }, 100);
});

$(window).scroll(() => {
    FE.global.scroll();
});
