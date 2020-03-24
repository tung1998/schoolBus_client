import './aside.html';
import {
    MeteorCall,
    handleError
} from '../../../../functions'

import {
    _METHODS,
    _SESSION
} from '../../../../variableConst'

Template.aside.onRendered(() => {
    this.trackerModules = Tracker.autorun(() => {
        let modules = Session.get(_SESSION.modules)
        renderAside(modules)
        KTLayout.initAside()
    })
})

Template.aside.onDestroyed(() => {
    this.trackerModules = null
})

function renderAside(data) {
    $("#kt_aside_menu").find('ul.kt-menu__nav').empty()
    if (Array.isArray(data))
        data.forEach(item => {
            if (item.parent) {
                let el = $("#kt_aside_menu").find(`[url="${item.parent}"]`)
                let childrenHtml = `<li class="kt-menu__item" aria-haspopup="true">
                                <a href="${item.route}" class="kt-menu__link ">
                                    <i class="kt-menu__link-icon fa ${item.icon}"></i>
                                    <span class="kt-menu__link-text">${item.name}</span>
                                </a>
                            </li>`
                if (el.attr("parent")) {
                    el.find('.kt-menu__subnav').append(childrenHtml)
                } else {
                    el.find('a').append(`<i class="kt-menu__ver-arrow la la-angle-right"></i>`)
                        .attr('href', "javascript:;")
                        .addClass('kt-menu__toggle')
                    el.attr('data-ktmenu-submenu-toggle', "hover")
                        .attr('parent', true)
                        .addClass('kt-menu__item--submenu')
                        .append(`<div class="kt-menu__submenu ">
                            <span class="kt-menu__arrow"></span>
                            <ul class="kt-menu__subnav">
                                ${childrenHtml}
                            </ul>
                        </div>`)
                }

            } else {
                $("#kt_aside_menu").find('ul.kt-menu__nav').append(`<li class="kt-menu__item" url="${item.route}" aria-haspopup="true">
                                                    <a href="${item.route}" class="kt-menu__link ">
                                                        <i class="kt-menu__link-icon fa ${item.icon}"></i>
                                                        <span class="kt-menu__link-text">${item.name}</span>
                                                    </a>
                                                </li>`)
            }
        });
}