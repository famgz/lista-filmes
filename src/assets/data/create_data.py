from famgz_utils import json_


def crop_list(max_items=1000):
    all_films = json_('C:\\asd\\films-data-all.json')

    slugs_to_avoid = [
        '11',
        '15',
        '2720',
        'mindstreams',
        'fantasma-beyond-the-vessel',
        '',
        '',
        '',
        '',
    ]

    chunk = {}
    c = 0
    for slug, data in all_films.items():
        if slug in slugs_to_avoid:
            continue

        if c>=max_items:
            break
        chunk[slug] = data
        c+=1

    json_('C:\\asd\\films-data.json', chunk, indent=2)


def build_films_list_from_api():
    import asyncio
    from fscope.api import async_api_scrape

    def get_api_data():
        data = asyncio.run(async_api_scrape())
        json_(films_raw_path, data)

    films_raw_path = 'C:\\asd\\films-raw.json'
    films_all_path = 'C:\\asd\\films-data-all.json'

    raw_data = json_(films_raw_path) or get_api_data()



    films = {
        slug: {
            "internationalTitle": data["internationalTitle"],
            "originalTitle": data["originalTitle"],
            "countries": data["countries"],
            "year": data["year"],
            "duration": data["duration"],
            "director": data["director"],
            "posterUrl": data["posterUrl"],
            "synopsis": data["synopsis"],
        }
        for slug, data in raw_data.items()
    }

    json_(films_all_path, films)


# build_films_list_from_api()
crop_list()
