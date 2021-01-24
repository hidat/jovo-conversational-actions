// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

/**
 * Copy this into your project.js, putting in your PROJECT_ID and enter any information you want in the localizedSettings
 */
module.exports = {
    googleAction: {
        projectId: '${PROJECT_ID}',
        manifest: {
            settings: {
                category: 'MUSIC_AND_AUDIO',
                defaultLocale: 'en',
                localizedSettings: {
                    en: {
                        //developerEmail: '',
                        //developerName: '',
                        displayName: 'Jovo Conversational Actions Learning',
                        fullDescription: 'See how to use the Jovo cross development library to build Google Conversational Actions.',
                        //privacyPolicyUrl: '',
                        pronunciation: 'craig learning scenes',
                        sampleInvocations: [
                            'Talk to craig learning scenes'
                        ],
                        shortDescription: 'An audio and display learning action',
                        //smallLogoImage: '',
                        //termsOfServiceUrl: ''
                    }
                }
            }
        }
    },
    endpoint: '${JOVO_WEBHOOK_URL}',
};
