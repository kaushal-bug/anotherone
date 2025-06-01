// Google Calendar Configuration
const GOOGLE_CALENDAR_CONFIG = {
    CLIENT_ID: '156817395162-v210e3ijqqliplrhflppk6mg0v14unj4.apps.googleusercontent.com',
    API_KEY: '', // Add your API key here
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
    SCOPES: 'https://www.googleapis.com/auth/calendar.readonly'
};

let calendarApi = {
    tokenClient: null,
    gapiInited: false,
    gisInited: false,

    // Initialize the API
    async initialize() {
        await this.loadGapiClient();
        await this.loadGisClient();
    },

    // Load the Google API client
    loadGapiClient() {
        return new Promise((resolve, reject) => {
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        apiKey: GOOGLE_CALENDAR_CONFIG.API_KEY,
                        discoveryDocs: [GOOGLE_CALENDAR_CONFIG.DISCOVERY_DOC],
                    });
                    this.gapiInited = true;
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    },

    // Load the Google Identity Services client
    loadGisClient() {
        return new Promise((resolve) => {
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CALENDAR_CONFIG.CLIENT_ID,
                scope: GOOGLE_CALENDAR_CONFIG.SCOPES,
                callback: '', // defined later
            });
            this.gisInited = true;
            resolve();
        });
    },

    // Get calendar events
    async getEvents(timeMin, timeMax) {
        try {
            const response = await gapi.client.calendar.events.list({
                'calendarId': 'primary',
                'timeMin': timeMin.toISOString(),
                'timeMax': timeMax.toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 50,
                'orderBy': 'startTime'
            });

            return response.result.items;
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            throw error;
        }
    },

    // Create a new event
    async createEvent(eventData) {
        try {
            const event = {
                'summary': eventData.title,
                'description': eventData.description,
                'start': {
                    'dateTime': eventData.start,
                    'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                'end': {
                    'dateTime': eventData.end,
                    'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                'attendees': eventData.attendees.map(email => ({ 'email': email })),
                'reminders': {
                    'useDefault': true
                }
            };

            const response = await gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event
            });

            return response.result;
        } catch (error) {
            console.error('Error creating calendar event:', error);
            throw error;
        }
    },

    // Update an existing event
    async updateEvent(eventId, eventData) {
        try {
            const event = {
                'summary': eventData.title,
                'description': eventData.description,
                'start': {
                    'dateTime': eventData.start,
                    'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                'end': {
                    'dateTime': eventData.end,
                    'timeZone': Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                'attendees': eventData.attendees.map(email => ({ 'email': email }))
            };

            const response = await gapi.client.calendar.events.update({
                'calendarId': 'primary',
                'eventId': eventId,
                'resource': event
            });

            return response.result;
        } catch (error) {
            console.error('Error updating calendar event:', error);
            throw error;
        }
    },

    // Delete an event
    async deleteEvent(eventId) {
        try {
            await gapi.client.calendar.events.delete({
                'calendarId': 'primary',
                'eventId': eventId
            });
        } catch (error) {
            console.error('Error deleting calendar event:', error);
            throw error;
        }
    }
};

// Export for global use
window.calendarApi = calendarApi; 