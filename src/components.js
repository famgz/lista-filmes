function loadComponent(htmlName, position) {
    /*
    positions:
    - beforebegin
    - afterbegin
    - beforeend
    - afterend
    */

    document.addEventListener('DOMContentLoaded', function () {
        // Determine the current page
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');

        // Fetch the header content
        fetch(`/components/${htmlName}.html`)
            .then(response => response.text())
            .then(headerHtml => {
                // Inject the header content into the <body>
                document.body.insertAdjacentHTML(position, headerHtml);
            });
    });
}
