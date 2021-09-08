const view = Window.this;

export class Ribbon extends Element
{
    componentDidMount() {
        
        document.querySelectorAll(".tabs-holder > li")[1].classList.add("active");
        document.querySelectorAll(".content-holder > .section")[0].classList.add("active");
        // view.modal(<info>Hello worldxxx!</info>);
        document.on("click", ".ribbon-split.dropdown-toggle, .ribbon-icon-button.dropdown-toggle, .ribbon-button.dropdown-toggle", this.dropdownMenuClick);
    }  

    ["on click at button"](evt, button) {
        view.modal(<info>clicked me!</info>);
    }

    ["on click at .tabs-holder > li a"](evt, link) {
        let allTabs = link.$p("ul");
        let tab = link.attributes["href"];

        let tabContainer = document.querySelectorAll(".content-holder > .section");
        let activeTabContainer = document.querySelector(tab);

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

    dropdownMenuClick(evt, button) {
        var dropdownParent = button.$p("div");
        var dropdown = dropdownParent.querySelector(".ribbon-dropdown");
        if (this.classList.contains("active")) {
            this.classList.remove("active");
            dropdown.attributes["style"] = "display: none;";
        } else {
            this.classList.add("active");
            dropdown.attributes["style"] = "display: block;";
        }
        $(".ribbon-split-button").click();
    }
}