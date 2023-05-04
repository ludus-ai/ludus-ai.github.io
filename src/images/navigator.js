class navigator_class {
    urls = {
        'index': 'index.html',
        'how_it_works': 'how_it_works.html',
        'create_account': 'create_account.html',
        'dashboard': 'dashboard.html',
        'main': 'main.html'
    }

    goto(page) {
        window.location = this.urls[page];
    }

    open() {
        console.log("opening");
        $('.nav-popup-container')[0].classList.remove('invisible')
    }

    close() {
        $('.nav-popup-container')[0].classList.add('invisible')
    }

    toggle() {
        if ($('.nav-popup-container')[0].classList.contains('invisible')) {
            this.open();
        } else {
            this.close();
        }
    }
}

nav = new navigator_class();