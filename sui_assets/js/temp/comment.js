/**
 * Created by liuliu on 2017/9/30.
 */
$.showIndicator = function () {
    if ($('.preloader-indicator-modal')[0]) return;
    $("body").append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
};
$.hideIndicator = function () {
    $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
};
$.closeModal = function () {
    $(".page-group").hide();
}
$.modal = function (params) {
    params = params || {};
    var modalHTML = '';
    var buttonsHTML = '';
    if (params.buttons && params.buttons.length > 0) {
        for (var i = 0; i < params.buttons.length; i++) {
            buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
        }
    }
    var extraClass = params.extraClass || '';
    var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
    var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
    var afterTextHTML = params.afterText ? params.afterText : '';
    var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
    var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
    modalHTML = '<div class="modal ' + extraClass + ' ' + noButtons + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div><div class="modal-buttons ' + verticalButtons + '">' + buttonsHTML + '</div></div>';

    _modalTemplateTempDiv.innerHTML = modalHTML;

    var modal = $(_modalTemplateTempDiv).children();

    $(defaults.modalContainer).append(modal[0]);

    // Add events on buttons
    modal.find('.modal-button').each(function (index, el) {
        $(el).on('click', function (e) {
            if (params.buttons[index].close !== false) $.closeModal(modal);
            if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
            if (params.onClick) params.onClick(modal, index);
        });
    });
    $.openModal(modal);
    return modal[0];
};
$.toast = function (msg, duration, extraclass) {
    var $toast = $('<div class="modal toast ' + (extraclass || '') + '">' + msg + '</div>').appendTo(document.body);
    //$.openModal($toast, function(){
    setTimeout(function () {
        $(".toast").remove();
    }, duration || 2000);
    //});
};
$.popup = function (modal, removeOnClose) {
    if (typeof removeOnClose === 'undefined') removeOnClose = true;
    if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
        var _modal = document.createElement('div');
        _modal.innerHTML = modal.trim();
        if (_modal.childNodes.length > 0) {
            modal = _modal.childNodes[0];
            if (removeOnClose) modal.classList.add('remove-on-close');
            $(defaults.modalContainer).append(modal);
        }
        else return false; //nothing found
    }
    modal = $(modal);
    if (modal.length === 0) return false;
    modal.show();
//    modal.find(".content").scroller("refresh");
//    if (modal.find('.' + defaults.viewClass).length > 0) {
//      $.sizeNavbars(modal.find('.' + defaults.viewClass)[0]);
//    }
//    $.openModal(modal);
    $(".bg-green").hide();
    $(".page-group").show();


    return modal[0];
};

(function ($) {
    //$.fn.jcMarquee = function (options) {
    //    var defaults = {
    //        'marquee': 'x',
    //        'margin_bottom': '0',
    //        'margin_right': '20',
    //        'speed': '10'
    //    };
    //    var options = $.extend(defaults, options);
    //    return this.each(function () {
    //        var $marquee = $(this),
    //            $marquee_scroll = $marquee.children('ul');
    //        $marquee_scroll.append("<li class='clone'>" + "</li>");
    //        $marquee_scroll.find('li').eq(0).children().clone().appendTo('.clone');
    //        var $marquee_left = $marquee_scroll.find('li');
    //        if (options.marquee == 'x') {
    //            var x = 0;
    //            $marquee_scroll.css('width', '1000%');
    //            $marquee_left.find('div').css({'margin-right': options.margin_right});
    //            $marquee_left.css({'margin-right': options.margin_right});
    //            function Marquee_x() {
    //                $marquee.scrollLeft(++x);
    //                _margin = parseInt($marquee_left.find('div').css('margin-right'));
    //                if (x == $marquee_left.width() + _margin) {
    //                    x = 0
    //                }
    //            }
    //
    //            var MyMar = setInterval(Marquee_x, options.speed);
    //        }
    //    });
    //};
    $.fn.Marquee = function (options) {
        var defaults = {
            'marquee': 'x',
            'margin_bottom': '0',
            'margin_right': '0',
            'speed': '10'
        };
        var options = $.extend(defaults, options);
        return this.each(function () {
            var $marquee = $(this),
                $marquee_scroll = $marquee.children('ul');
            $marquee_scroll.append("<li class='clone'>" + "</li>");
            $marquee_scroll.find('li').eq(0).children().clone().appendTo('.clone');
            var $marquee_left = $marquee_scroll.find('li');
            if (options.marquee == 'x') {
                var x = 0;
                $marquee_scroll.css('width', '1000%');
                $marquee_left.find('div').css({'margin-right': options.margin_right});
                $marquee_left.css({'margin-right': options.margin_right});
                function Marquee_x() {
                    $marquee.scrollLeft(++x);
                    _margin = parseInt($marquee_left.find('div').css('margin-right'));
                    if (x == $marquee_left.width() + _margin) {
                        x = 0
                    }
                    ;
                };
                var MyMar = setInterval(Marquee_x, options.speed);
                //$marquee.hover(function () {
                //    clearInterval(MyMar);
                //}, function () {
                //    MyMar = setInterval(Marquee_x, options.speed);
                //});
            }
            if (options.marquee == 'y') {
                var y = 0;
                $marquee_scroll.css('height', '1000%');
                $marquee_left.find('div').css('margin-bottom', options.margin_bottom);
                $marquee_left.css('margin-bottom', options.margin_bottom);
                function Marquee_y() {
                    $marquee.scrollTop(++y);
                    _margin = parseInt($marquee_left.find('div').css('margin-bottom'));
                    if (y == $marquee_left.height() + _margin) {
                        y = 0
                    }
                    ;
                };
                var MyMar = setInterval(Marquee_y, options.speed);
                //$marquee.hover(function () {
                //    clearInterval(MyMar);
                //}, function () {
                //    MyMar = setInterval(Marquee_y, options.speed);
                //});
            }
            ;
        });
    };

})(Zepto);
