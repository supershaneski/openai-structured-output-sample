export function mockApiCall(name, args) {

    let data = {...args}

    if(name === 'get_weather') {

        data.status = 'success'

        const forecast_list = ['sunny', 'cloudy', 'rainy', 'windy']
        const chance = Math.floor((forecast_list.length - 1) * Math.random())

        let images = []
        images['sunny'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Airliner_%289755807322%29.jpg/640px-Airliner_%289755807322%29.jpg'
        images['cloudy'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/A_Normal_day_with_a_normal_life.jpg/640px-A_Normal_day_with_a_normal_life.jpg'
        images['rainy'] = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/2023_in_Amsterdam_city_-_people_arer_standing_or_walking_under_a_roof_hoo_of_Central_Station_facade._It_ia_a_grey_rainy_day._The_pavement_of_the_square_has_many_tram_tracks._Free_download_street_photography_by_Fons_Heijnsbroek%2C_CCO.tif/lossy-page1-640px-thumbnail.tif.jpg'
        images['windy'] = 'https://upload.wikimedia.org/wikipedia/commons/1/11/Bundesarchiv_Bild_183-1990-0206-324%2C_Berlin%2C_Passanten_im_Wind.jpg'
        
        data.forecast = forecast_list[chance]
        data.temperature = 15 + (Math.round(150 * Math.random())/10)
        data.unit = 'celsius'
        data.image_data = {
            url: images[forecast_list[chance]], //`https://example.com/weather/${encodeURIComponent(args.location)}/media/${Date.now()}_1080.jpg`,
            alt: `${args.location} - Live Camera`
        }

    } else if(name === 'get_events') {

        data.status = 'success'
        data.events = []

        const events = [
            { name: "Tech Conference 2024", venue: "International Conference Hall", time: "10:00AM - 5:00PM" },
            { name: "Music Festival", venue: "Echo Sound Park", time: "1:30PM - 9:00PM", image_data: {url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/SOS4.8_2015_Murcia_SRN.jpg/640px-SOS4.8_2015_Murcia_SRN.jpg", alt: "Rock Band"}},
            { name: "Art Exhibition", venue: "Modern Art Museum", time: "9:00AM - 3:00PM", poster: {url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/AL-NITAQ-Poster-2017-2.jpg/543px-AL-NITAQ-Poster-2017-2.jpg", alt: "Art Fest"} },
            { name: "Startup Pitch Night", venue: "Citizen Hall", time: "7:00PM - 9:30PM" },
            { name: "Food Truck Fiesta", venue: "Seaside Park", time: "10:30AM - 7:30PM" }
        ]

        events.forEach((event) => {
            const chance = Math.floor(10 * Math.random())
            if(chance > 4) {
                data.events.push(event)
            }
        })

    } else {
        data.status = 'error',
        data.message = `tool ${name} not found`
    }

    return new Promise((resolve, reject) => {
        const delay = Math.floor(1000 * Math.random()) // simulate delay
        setTimeout(() => {
        const success = true
        if (success) {
          resolve({ data })
        } else {
          reject(new Error('Mock API call failed'))
        }
      }, delay)
    })
  }