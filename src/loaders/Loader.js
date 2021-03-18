export default class Loader {
    constructor(link) {
        this._link = `${link}`;
    }
    _loadJson() {
        return fetch(this._link)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
          return data;
        });
    }
    getData() {
        return this._loadJson();
    }
}