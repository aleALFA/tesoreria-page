if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/core-tesoreria-page/sw.js', { scope: '/core-tesoreria-page/' })})}