function generatePage() {
    var path = window.location.hash.replace('#', '');
    if (path == "/" || path == "") {
        path = "/jsonsite/index.json";
    } else {
        path = "/jsonsite/" + path + ".json"
    }
    console.log(path);
    fetch(path).then(d => {
        var jp = new JsonPage(d, $("#page"));
        jp.generate();
    }).catch(() => {
        fetch('/jsonsite/404Error.json').then(d => {
            var jp = new JsonPage(d, $("#page"));
            jp.generate();
        }).catch((err) => {
            console.error(err);
        })
    })
    window.onhashchange=generatePage;
}

function JsonPage(d, el) {
    this.page = d;
    this.element = el;
    this.generate = async () => {
        this.element.html('');
        this.navbar = await addNavbar();
        this.pageContent = await addPageContent();
        this.footer = await addFooter();
        this.element.append(this.navbar);
        this.element.append(this.pageContent);
        this.element.append(this.footer);
    }
}

function addNavbar() {
    return new Promise((res,req)=>{
    function generateNavbarObject(a) {
        if(a.items!==null&&a.items!==undefined){
            var el=$('<div class="w3-dropdown-hover"></div>');
            el.append('<a class="w3-button" '+(a.link!==undefined?'href="#'+a.link+'"':'')+'>'+a.name+'&nbsp;<i class="fa fa-caret-down"></i></a>');
            var cont=$('<div class="w3-dropdown-content w3-bar-block w3-card-4"></div>');
            for(var i=0;i<a.items.length;i++) {
                cont.append(generateNavbarObject(a.items[i]));
            }
            el.append(cont);
            return el;
        } else {
            var el=$('<a '+(a.link!==undefined?'href="#'+a.link+'"':'')+' class="w3-bar-item w3-button">'+a.name+'</a>');
            return el;
        }
    }
    fetch('/jsonsite/navbar.json').then(e => e.json().then(d => {
        var el=$('<div class="w3-bar w3-light-grey"></div>');
        for(var i=0;i<d.navbar.length;i++) {
            el.append(generateNavbarObject(d.navbar[i]));
        }
        res(el);
    })).catch((err) => {
        req(err);
    });
})
}

function addPageContent() {
    return "No page content";
}

function addFooter() {
    return "No footer";
}
