function req(method, path, body) {
    let url = 'http://132.232.48.58:3000' + path;
    return fetch(url, {
        method,
        body: JSON.stringify(body) || undefined,
        credentials: 'include',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"   
        }
    }).then((res) => {
        return res.json();
    })
}
export default req;
