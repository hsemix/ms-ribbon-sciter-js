import * as sys from "@sys";
import { encode, decode } from "@sciter";

const view = Window.this;

export class Tab extends Element
{
    constructor()
    {
        super();
    }

    static validateID(id, index)
    {
        // create id if not set
        if (id == "")
            return `tab-${index}`;

        return id;
    }

    /**
     * 
     */
    componentDidMount()
    {
        const src = this.attributes["src"] || null;

        // check if id set if not generate one
        this.setAttribute("id", Tab.validateID(this.id, this.elementIndex + 1));

        let html = "";

        if (!src)
            html = this.innerHTML;
        /*
        else
        if (!sys.fs.$lstat(src))
            console.error(`tab src does not exist ${src}`);
        */
        else
            // include source
            html = `<include src="` + src + `"/>`;

        const expanded = (this.attributes["selected"] == "") ? true : false;

        // if tab is selected, show it (event doesn't trigger at this point)
        if (expanded)
            this.classList.add("block");
        
        // create tab
        const tab = (
            <li class=""><a href="#">{this.attributes["title"]}</a></li>
            // <section class="content-holder tab" id={this.id} state-expanded={expanded} state-html={html} />
        );

        // view.modal(<info>tab loaded</info>);
        this.content(tab);

        // TODO get all STYLE tags
        // TODO see how to process includes

        // load SCRIPT tag from loaded element
        let styleEl = this.$("style");

        if (styleEl) {
            // get its content
            let style = styleEl.innerHTML;

            // get pagecontrol id
            const id = this.getPageControl().id;

            // set styleset name
            let stylesetname = `${id}-` + this.id;

            // create styleset in order to inject tab style
            let styleset = `@set ${stylesetname} { ${style} }`;

            // inject styleset in head
            document.head.insertAdjacentHTML("beforeend", `<style> ${styleset} </style>`);

            // set styleset name for component
            stylesetname = `#${stylesetname}`;

            let div = this.$("section.tab");
            div.attributes.styleset = stylesetname;

            //console.warn("----- styleset - " + s.attributes.styleset);

            // remove style tag to avoid interfearing
            styleEl.parentElement.removeChild(styleEl);
        }

        // TODO get all SCRIPT tags
        // TODO see how to process includes

        // get SCRIPT tag
        let scriptEl = this.$("script");

        if (scriptEl) {
            // load script
            this.loadTabScript(scriptEl.innerHTML, src);

            // remove script tag to avoid interfearing
            scriptEl.parentElement.removeChild(scriptEl);
        }

        // view.modal(<info>{src}</info>);
    }
}

export class RibbonControl extends Element 
{
    constructor()
    {
        super();
    }

    static validateID(id, index)
    {
        // create id if not set
        if (id == "" || id == undefined)
            return `tab-${index}`;

        return id;
    }
    
    /**
     * 
     */
    componentDidMount()
    {
        let allTabs = this.$$(">tab");
        var selected = this.$(">tab[selected]") || this.$(">tab:first-child");

        // if (selected.classList.contains("static"))
        //     selected = 

        var title = selected.attributes["title"];

        // find section we need to show by default 
        var section = selected.innerHTML;

        var minimizeRibbon = `
            <li class="minimize-ribbon">
                <span id="minimize-ribbon-menu" tooltip="<b>Minimize the Ribbon (Ctrl+F1)</b>
                    <br />Show only the tab names on the Ribbon.">
                    <i class="fg-gray fas fa-angle-up"></i>
                </span>
                <span id="ribbon-menu-help" tooltip="<b>Help</b>
                    <br />Get Help&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;">
                    <i class="fg-darkBlue fas fa-question-circle"></i>
                </span>
            </li>
        `;

        var tabsHtml = `<ul class="tabs-holder">`;

        var tabContainer = `<section class="content-holder">`;

        for (var i = 0; i < allTabs.length; i++) {
            let currentTitle = allTabs[i].attributes["title"];
            let classes = "";
            let activeSection = "";

            const source = allTabs[i].attributes.src || undefined;

            // check if id set if not generate one
            var tabID = RibbonControl.validateID(allTabs[i].attributes.id, i + 1);
    
            let html = "";
    
            html = !source ? allTabs[i].innerHTML : "<include src=\"" + source + "\"/>";

            if (allTabs[i].attributes["class"] != "" && allTabs[i].attributes["class"] != undefined) {
                classes += allTabs[i].attributes["class"];
            }

            if (title == currentTitle) {
                classes += " active";
                activeSection = "active";
            }

            tabsHtml += `
                <li class="${classes}" id="${tabID}">
                    <a>${allTabs[i].attributes["title"]}</a>
                </li>
            `;

            tabContainer += `
                <section class="section ${activeSection}" caption="${allTabs[i].attributes["title"]}" id="section-${tabID}">
                    ${html}
                </section>
            `;
            // list.push(<li class=""><a href="#">{allTabs[i].attributes["title"]}</a></li>);
        }
        tabsHtml += `${minimizeRibbon}</ul>`;

        tabContainer += "</section>";

        var tabCollection = `
            <toolbar role="ribbonmenu">
                ${tabsHtml}
                ${tabContainer}
            </toolbar>
        `;

        this.content(tabCollection);
        
    }

    /**
     * Tab header click event
     * @param {Event} event
     * @param {Element} element
     */
    ["on click at ul > li > a"](event, link) {
        var currentTab = link.$p("li");

        let allTabs = link.$p("ul");
        let tab = link.attributes["href"];

        let tabContainer = this.$$(".content-holder > .section");
        let activeTabContainer = document.querySelector(`#section-${currentTab.attributes['id']}`);

        if (!link.$p("li").classList.contains("static")) {
            let tabs = allTabs.querySelectorAll("li");
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove("active");
            }

            link.$p("li").classList.add("active");

            for (let j = 0; j < tabContainer.length; j++) {
                tabContainer[j].classList.remove("active");
                tabContainer[j].attributes["style"] = "display: none;";
            }
            
            activeTabContainer.attributes["style"] = undefined;
            activeTabContainer.classList.add("active");
        }
    }

    ["on click at .ribbon-split.dropdown-toggle, .ribbon-icon-button.dropdown-toggle, .ribbon-button.dropdown-toggle, .ribbon-tool-button.dropdown-toggle"](event, button) {
        
        var dropdownParent = button.$p("div");

        var dropdown = dropdownParent.$(".ribbon-dropdown");
        
        if (button.classList.contains("active")) {
            button.classList.remove("active");
            dropdown.attributes["style"] = "display: none;";
        } else {
            button.classList.add("active");
            dropdown.attributes["style"] = "display: block;";
        }
    }

    ["on blur at .ribbon-split.dropdown-toggle, .ribbon-icon-button.dropdown-toggle, .ribbon-button.dropdown-toggle, .ribbon-tool-button.dropdown-toggle"](event, button) {
        var dropdownParent = button.$p("div");

        var dropdown = dropdownParent.$(".ribbon-dropdown");
        
        if (button.classList.contains("active")) {
            button.classList.remove("active");
            dropdown.attributes["style"] = "display: none;";
        }
    }

    ["on click at body"](event, button) {
        view.modal(<info>Testing </info>)
    }

    ["on click at #minimize-ribbon-menu"](event, button) {
        let allTabs = button.$p("ul");
        let tabContainer = this.$$(".content-holder > .section");
        if (!button.$p("li").classList.contains("static")) {
            let tabs = allTabs.querySelectorAll("li");
            for (let i = 0; i < tabs.length; i++) {
                tabs[i].classList.remove("active");
            }

            for (let j = 0; j < tabContainer.length; j++) {
                tabContainer[j].classList.remove("active");
                tabContainer[j].attributes["style"] = "display: none;";
            }
        }
    }

    ["on click at #ribbon-menu-help"](event, button) {
        view.modal(<info>Ribbon Menu Help.</info>);
    }

    ["on keydown"](event) { 
        if(!this.state.focus)
            return false;

        var currentLabel = this.$(">strip>label:current");
        view.modal(<info>keydown {event.code}</info>);
    }
}