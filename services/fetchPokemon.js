function fetch_pokemon(pokemon_name = null, is_shiny = false) {
    return new Promise((resolve, reject) => {
        let shiny_path = ``;

        if (is_shiny)
            shiny_path = `shiny/`;

        const url = `https://pokeapi.co/api/v2/pokemon/${shiny_path}${pokemon_name}`;
        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(data => {
                resolve(data);
            })
            .catch(err => {
                reject(err);
            });
    });
}

module.exports = fetch_pokemon;