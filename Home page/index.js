/*
    fish
 */
var fishAnimation = (function() {
    var _fish1 = false;
    var _fish2 = false;

    var fish1Func = function() {
        $('.fish-1').css({
            'transform': 'rotateZ(0deg)'
        });
        $('.fish-1').animate({
            top: '10%'
        }, 9000, function() {
            return fish1Func_();
        });
    }

    var fish2Func = function() {
        $('.fish-2').css({
            'transform': 'rotateZ(0deg)'
        });
        $('.fish-2').animate({
            top: '13%'
        }, 8000, function() {
            return fish2Func_();
        });
    }

    var fish1Func_ = function() {
        $('.fish-1').css({
            'transform': 'rotateZ(180deg)'
        });
        $('.fish-1').animate({
            top: '85%'
        }, 9000, function() {
            return fish1Func();
        });
    }

    var fish2Func_ = function() {
        $('.fish-2').css({
            'transform': 'rotateZ(180deg)'
        });
        $('.fish-2').animate({
            top: '90%'
        }, 8000, function() {
            return fish2Func();
        });
    }


    fish1Func();
    fish2Func();
})();

/*
    dialog event handler
 */

var dialogAnimation = (function(ele, id, func, cancalFunc) {

    var removeHandler = function(ev, id) {
        if ($(ev.target).hasClass('m-overlay') || ev.which == 27) {
            $('#' + id).removeClass('m-dialog-show');
        }
    }   

    ele.click(function(ev) {
        ev.stopPropagation();
        $('#' + id).addClass('m-dialog-show');
        if (func != undefined && typeof func == 'function') func();
        $(document).off('click', function(ev) {
            removeHandler(ev, id);
        });
        $(document).on('click', function(ev) {
            if ($(ev.target).parents('#' + id).length != 0) return;
            removeHandler(ev, id);
            if (cancalFunc != undefined && typeof cancalFunc == 'function') cancalFunc();
            $(document).off('click');
        });
        // $(document).on('keydown', function(ev) {
        //     removeHandler(ev, id);
        //     if (cancalFunc != undefined && typeof cancalFunc == 'function') cancalFunc();
        //     $(document).off('keydown').off('click');
        // })
    })
});

// control content scroll height
var scrollHeight = function(ele) {
        ele.css({
            height: $(window).height() - ele.prev().height()
        });
        ele.scrollUnique();
    }
    /*
        cloud click
     */
dialogAnimation($('.cloud'), 'cloud', function() {
    scrollHeight($('.cloud-content'));
});

/*
    bug click
 */

dialogAnimation($('.bus'), 'bus', function() {
    scrollHeight($('.bus-content'));
    $('#bus video').get(0).currentTime = 0;
    $('#bus video').get(0).play();
}, function() {
    $('#bus video').get(0).pause();
});

/*
    scott
 */
dialogAnimation($('.scott'), 'scott', function() {
    scrollHeight($('.scott-content'));
});

/*
    dog
 */
dialogAnimation($('.dog'), 'dog', function() {
    scrollHeight($('.dog-content'));
    $('#dog video').get(0).currentTime = 0;
    $('#dog video').get(0).play();
}, function() {
    $('#dog video').get(0).pause();
});

/*
    train
 */
dialogAnimation($('.train'), 'train', function() {
    scrollHeight($('.train-content'));
    var temp = $("iframe[name='train']").get(0);
    temp.src = temp.src;
});

/*
    coffee
 */
dialogAnimation($('.coffee'), 'coffee', function() {

    scrollHeight($('.coffee-content'));
    var temp = $("iframe[name='coffee']").get(0);
    temp.src = temp.src;
});
/*
    oldcollege
 */
dialogAnimation($('.oldcollege'), 'oldcollege', function() {
    scrollHeight($('.oldcollege-content'));
});
/*
    jinian
 */
dialogAnimation($('.jinianting, .jinianta, .jiniantang'), 'jinian', function() {
    $(".jcarousel").jcarousel();
    $('.jcarousel-control-prev')
        .on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        })
        .jcarouselControl({
            target: '-=1'
        });

    $('.jcarousel-control-next')
        .on('jcarouselcontrol:active', function() {
            $(this).removeClass('inactive');
        })
        .on('jcarouselcontrol:inactive', function() {
            $(this).addClass('inactive');
        })
        .jcarouselControl({
            target: '+=1'
        });
    scrollHeight($('.jinian-content'));
});
/*
    castle
 */
dialogAnimation($('.castle'), 'castle', function() {
    scrollHeight($('.castle-content'));
});

/*
    wutai
 */
dialogAnimation($('.wutai'), 'wutai', function() {
    scrollHeight($('.wutai-content'));
});
/*
    church
 */
dialogAnimation($('.church'), 'church', function() {
    scrollHeight($('.church-content'));
});
/*
    holyrood
 */
dialogAnimation($('.holyrood'), 'holyrood', function() {
    scrollHeight($('.holyrood-content'));
});
/*
    museum
 */
dialogAnimation($('.museum'), 'museum', function() {
    scrollHeight($('.museum-content'));
    var temp = $("iframe[name='dolly']").get(0);
    temp.src = temp.src;
});
/*
    sun
 */
dialogAnimation($('.sun'), 'sun', function() {
    scrollHeight($('.sun-content'));
    var temp = $("iframe[name='sun']").get(0);
    temp.src = temp.src;
});
/*
    gallery
 */
dialogAnimation($('.gallery'), 'gallery', function() {
    scrollHeight($('.gallery-content'));
});


/*
    fish
 */
dialogAnimation($('.l-main-right'), 'fish', function() {
    scrollHeight($('.fish-content'));
    var temp = $("iframe[name='fish']").get(0);
    temp.src = temp.src;
});
/*
    quiz
 */
dialogAnimation($('.quiz'), 'quiz', function() {
    $('#quiz').scrollUnique();    
});

/*
    puzzle
 */
dialogAnimation($('.pingtu'), 'puzzle', function() {
    scrollHeight($('.puzzle-content'));
    var temp = $("iframe[name='puzzle']").get(0);
    temp.src = temp.src;
});


/*
    audio
 */
(function() {
    var _audioState = false;
    $('.ren').click(function() {
        if (!_audioState) {
            $(this).children().get(0).play();
            _audioState = true;
        } else {
            $(this).children().get(0).pause();
            _audioState = false;
        }
    })
})();
