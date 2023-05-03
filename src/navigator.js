class navigator_class {
    urls = {
        'index': 'index.html',
        'how_it_works': 'how_it_works.html',
        'create_account': 'create_account.html',
        'dashboard': 'dashboard.html',
    }

    goto(page) {
        window.location = this.urls[page];
    }
}

nav = new navigator_class();