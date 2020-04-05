if('serviceWorker' in navigator){
    navigator.serviceWorker.register('service-worker.js')
        .then((reg) =>console.log("hoa6a",reg))
        .catch((err) => console.log("halo",err));
}