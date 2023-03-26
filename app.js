const {createBot, createProvider, createFlow, addKeyword} = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

// my imports
const fetch_pokemon = require('./services/fetchPokemon')


const flowBuscarPokemonShiny = addKeyword(['shiny'])
    .addAnswer('Shiny?', null, async (ctx, {flowDynamic}) => {

    })

const flowBuscarPokemon = addKeyword(['buscar'])
    .addAnswer(`👀 Cual pokemon deseas buscar? (*SALIR*)`, {capture: true, sensitive: true}, async (ctx, {
        flowDynamic,
        fallBack
    }) => {
        const pokemon_name = ctx.body.toLowerCase();

        // si el user escribe salir, se sale del flow
        if (pokemon_name === 'salir') return;

        flowDynamic([{
            body: `🔎 Buscando pokemon *${pokemon_name}*...`,
        }])

        try {
            const pokemon = await fetch_pokemon(pokemon_name)

            return flowDynamic([
                {
                    body: `*${pokemon.name}* salvaje aparecio!`,
                    media: pokemon.sprites.other["official-artwork"].front_default,
                }
            ]);
        } catch (error) {
            return fallBack();
        }
    });

const flowMain = addKeyword(['hola'])
    .addAnswer('🙌 Hola, bienvenido a la *Bokedex*')
    .addAnswer('🤖 Soy un bot que te ayudara a encontrar tus pokemones')
    .addAnswer([
        '🔎 Para buscar un pokemon, escribe *buscar*',
        '👋 Para salir de cualquier situacion, escribe *salir*'
    ])
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowMain, flowBuscarPokemon, flowBuscarPokemonShiny])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
