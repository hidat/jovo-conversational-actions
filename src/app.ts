import {App, Jovo} from 'jovo-framework';

import {Entry, EntryDisplay, GoogleAssistant, ListItem, Slot} from 'jovo-platform-googleassistantconv';
import {JovoDebugger} from 'jovo-plugin-debugger';
import {FileDb} from 'jovo-db-filedb';
import {Episode, episodesMap} from "./episodes";
import console from "console";

//process.env.JOVO_LOG_LEVEL = 'VERBOSE';

const ASSISTANT_LOGO_IMAGE = {
    url: 'https://developers.google.com/assistant/assistant_96.png',
    alt: 'Google Assistant logo',
};

const app = new App();

/*
app.hook('request', (error: any, host:any, jovo:any) => {
	console.log('***** Request hook *****')
	if (error) {
		console.error(error);
	}
	if (host) {
		console.info(host.$request)
	}
})
*/

app.use(new GoogleAssistant(), new JovoDebugger(), new FileDb());

app.setHandler({
    LAUNCH() {
        this.ask(`What would you like to listen to today.`);
    },

    SayHelloIntent() {
        return this.ask("Why hello there, what would you like to do?")
    },

    PlayIntent() {
        const scene = this.$googleAction!.$scene!;
        console.log('Play Intent: ', scene?.name);
        if (scene?.name != 'PlayEpisodeScene') {
            this.$googleAction!.setNextScene("PlayEpisodeScene");
            return
        }

        return this.toIntent('ON_SCENE');
    },

    ShowListIntent() {
        const scene = this.$googleAction!.$scene!;
        console.log('Play Intent: ', scene?.name);
        // The intent is global, so it gets called first before we are in the scene.
        // It will then get called again by the scene (but
        if (scene?.name != 'ListEpisodesScene') {
            this.$googleAction!.setNextScene("ListEpisodesScene");
            return
        }

        return this.toIntent('ON_SCENE');

    },

    ON_SCENE() {
        console.log('In Scene: ', this.$googleAction!.$scene)
        const scene = this.$googleAction!.$scene!;
        const sceneName = scene.name;
        const slots = scene.slots as Record<string, Slot>;

        if (sceneName === 'ListEpisodesScene') {
            if (scene.isSlotFillingCollecting()) {
                // @TODO: Can we put this into the OnEnter of the scene?
                const entries: Entry[] = [];
                const listItems: ListItem [] = [];

                let index = 1;
                for (const item of episodesMap.values()) {
                    // Create the entries.  These will be inserted into the NLU definition and used to display the information
                    const is = index.toString();
                    const key = 'item-' + is;
                    // @LEARNING: Need to have all elements, or it freaks out the device.
                    const mixInfo: EntryDisplay = {
                        title: item.name,
                        description: item.extended ?? '',
                        image: ASSISTANT_LOGO_IMAGE
                    }
                    const entry: Entry = {
                        name: key,
                        synonyms: ['number ' + is, 'item ' + is],
                        display: mixInfo
                    }

                    entries.push(entry);

                    // Create the list item - this connects the entry to the list
                    const li: ListItem = {
                        key: key,
                    }
                    listItems.push(li);
                    index++;
                }

                this.$googleAction!.addTypeOverrides([{
                    name: 'episodeItem',
                    mode: 'TYPE_REPLACE',
                    synonym: {
                        entries: entries
                    }
                }]);

                this.$googleAction!.addList({
                    title: 'Choose Episode',
                    items: listItems
                })
                return this.ask("Here's a list.");
            } else if (scene.isSlotFillingFinal()) {
                const episode = episodesMap.get(slots.episodeItem.value);
                if (episode) {
                    playEpisode(this, episode);
                } else {
                    return this.tell("While $hit, we couldn't find that episode");
                }
            }

        } else if (sceneName === 'PlayEpisodeScene') {
            console.log('In Play Episode Scene');
            if (scene.isSlotFillingCollecting()) {
                console.log('Filling Slots')
                if (!slots.episodeItem?.value) {
                    return this.ask("Who would you like to listen to?")
                }
            } else if (scene.isSlotFillingFinal()) {
                console.log('Starting Playback')
                const episode = episodesMap.get(slots.episodeItem.value);
                if (episode) {
                    playEpisode(this, episode);
                }
            }

        }
    },

    NO_MATCH() {
        this.tell('No match! Goodbye!');
    },

    NO_INPUT() {
        this.tell("You need to say something!  Goodbye.")
    },

    CANCEL() {
        this.tell("Ok, goodbye!")
    },

    Unhandled() {
        console.log('Unhandled.')
        this.ask("Unhandled, please try again.");
    },

    ON_ERROR() {
        console.log('ERROR encountered');
        this.ask("While that didn't work. Please try again.");
    },

    AUDIOPLAYER: {
        'GoogleAction.Paused'() {
            const progress = this.$googleAction!.$audioPlayer!.getProgress();
            console.log('Playback paused at ', progress);
            this.$googleAction!.prompt({
                content: {
                    media: {
                        mediaType: "MEDIA_STATUS_ACK",
                        mediaObjects: []
                    }
                }
            })
        },
        'GoogleAction.Stopped'() {
            const progress = this.$googleAction!.$audioPlayer!.getProgress();
            console.log('Playback stopped at ', progress)
        },
        'GoogleAction.Finished'() {
            this.ask('Track finished, what would you like to listen to next?');
        },
        'GoogleAction.Failed'() {
            this.ask('Unable to start track, is there something else you would like to listen to?');
        },
        Unhandled() {
            console.log('Unhandled in AudioPlayer.')
        },
    },

    END() {
        console.log('End encountered.');
        this.tell('OK then, goodbye!');
    },
});

function playEpisode(handler: Jovo, episode: Episode) {
    console.log('Starting Playback')
    if (episode) {
        let res = false;
        const mediaUrl = episode.url;
        if (mediaUrl) {
            const startPoint = 0;
            const meta = {
                name: episode.name,
                description: episode.extended,
                url: mediaUrl,
                image: {
                    large: ASSISTANT_LOGO_IMAGE
                }
            };
            handler.$speech.addText('Starting ' + episode.extended + ' by ' + episode.name);
            console.debug('Playing: ', mediaUrl, meta);

            // Make sure to include the 's' on the start point, or google will fail with cryptic message:
            //  "Invalid response from webhook: Failed to translate JSON to ExecuteHttpResponse.."
            handler.$googleAction!.$audioPlayer?.playAudio([meta], startPoint.toString() + 's', ['PAUSED', 'STOPPED']);
            handler.$googleAction!.setNextScene('MainLoop');
            handler.$googleAction!.ask(handler.$speech, "Enjoy!");
        }
    }

}

export {app};
