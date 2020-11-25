
export interface Episode {
    key: string,
    name: string,
    extended: string,
    url: string
}

const episodes: Episode [] = [
    {
        key: 'item-1',
        name: 'MorMor',
        extended: "Don't Cry",
        url: 'https://traffic.omny.fm/d/clips/bad5d079-8dcb-4630-8770-aa090049131d/32b2ac38-5a48-4300-9fa6-aa40002038b5/15f87edf-bdc6-4fa7-8bf6-ac7200333d0b/audio.mp3?utm_source=Podcast&in_playlist=4ac1c451-4315-4096-ab9b-aa40002038c4&t=1605686446'
    },
    {
        key: 'item-2',
        name: 'Loma',
        extended: 'Half Silences',
        url: 'https://traffic.omny.fm/d/clips/bad5d079-8dcb-4630-8770-aa090049131d/32b2ac38-5a48-4300-9fa6-aa40002038b5/0501758c-baa0-45b9-833e-ac7200333d0e/audio.mp3?utm_source=Podcast&in_playlist=4ac1c451-4315-4096-ab9b-aa40002038c4&t=1605513645'
    },
    {
        key: 'item-3',
        name: 'Weep Wave',
        extended: 'Bury the Bones',
        url: 'https://traffic.omny.fm/d/clips/bad5d079-8dcb-4630-8770-aa090049131d/32b2ac38-5a48-4300-9fa6-aa40002038b5/fccf57fa-2df6-476d-888c-ac6a01732a49/audio.mp3?utm_source=Podcast&in_playlist=4ac1c451-4315-4096-ab9b-aa40002038c4&t=1605254483'
    },
    {
        key: 'item-4',
        name: 'Beabadoobee ',
        extended: 'Sorry',
        url: 'https://traffic.omny.fm/d/clips/bad5d079-8dcb-4630-8770-aa090049131d/32b2ac38-5a48-4300-9fa6-aa40002038b5/9155165f-9007-4def-94f1-ac6a01732a4c/audio.mp3?utm_source=Podcast&in_playlist=4ac1c451-4315-4096-ab9b-aa40002038c4&t=1605168072'
    },
    {
        key: 'item-5',
        name: "The Churchhil Garden",
        extended: "birds",
        url: 'https://traffic.omny.fm/d/clips/bad5d079-8dcb-4630-8770-aa090049131d/32b2ac38-5a48-4300-9fa6-aa40002038b5/75f5041b-cd69-446f-b6f8-ac6a01732a4d/audio.mp3?utm_source=Podcast&in_playlist=4ac1c451-4315-4096-ab9b-aa40002038c4&t=1605081655'
    }
]

export const episodesMap: Map<string, Episode> = new Map<string, Episode>();
for(const item of episodes) {
    episodesMap.set(item.key, item);
}