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
    const currentPage = window.location.pathname
      .split('/')
      .pop()
      .replace('.html', '');

    componentPath = `../components/${htmlName}.html`;
    // console.log(componentPath)

    fetch(componentPath)
      .then((response) => response.text())
      .then((Html) => {
        // Inject the header content into the <body>
        document.body.insertAdjacentHTML(position, Html);
      });
  });
}
