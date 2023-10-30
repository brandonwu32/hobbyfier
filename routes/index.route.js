const express = require('express');
const { google } = require('googleapis');
const googleUtil = require('../utils/google-util');
const googleCalenderService =require('../services/google-calendar.service');
const OpenAI = require("openai");

const router = express.Router();

const map = new Map();
map.set("fitness", 0);
map.set("film", 0);
map.set("creativity", 0);
map.set("food", 0);
map.set("nature", 0);
map.set("relaxation", 0);
map.set("social", 0);
map.set("games", 0);

const openai = new OpenAI({apiKey:`${process.env.OPEN_API_KEY}`});

async function main(activities, schedule) {
  const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `Return a json file of EXACTLY 4 (FOUR AND NO MORE THAN FOUR AND NO LESS THAN FOUR) specific fun, non work-related hobby activities that the user might enjoy based on their availability given by ${schedule} and their google calendar events given by ${activities} . For each suggested activity, include a title, start time, end time, brief description, and extended description (including tips or suggestions) of the activity. The events should fall under fitness, film, creativity, food, nature, relaxation, social, or games. The activities should not be location-specific. The json file should contain a list of "activities", and each activity should contain the "title", "start_time" (MM/DD HH:MM AM/PM), "end_time" (MM/DD HH:MM AM/PM), "description", and "extended_description" fields.`,
    max_tokens: 1000,
    temperature: 0.4,
  }
  )
  console.log(completion);
  let textRes = completion['choices'][0]['text'];
  let parsedTextRes = JSON.parse(textRes);

  return parsedTextRes;


}


// default landing route
router.get('/', (req, res) => {
    res.render('landing_page.html', {'title': 'Application Home'});
});

// redirect to authentication uri
router.get('/login', (req, res) => {
    res.redirect(googleUtil.urlGoogle());
});

// middleware to check and save session cookie
const setCookie = async (req, res, next) => {
    googleUtil.getGoogleAccountFromCode(req.query.code, (err, res) => {
        if (err) {
            res.redirect('/login');
        } else {
            req.session.user = res;
        }
        next();
    });
}

// redirect uri
router.get('/auth/success',  setCookie, (req, res) => {
    res.redirect('/home');
})

// directing page
/* before landing to dashboard session cookie needs to be checked
 * but cookie will not save unless a view is rendered to the user
 * this will render a simple view to save cookie in the front end (browser)
 */
router.get('/redirect', (req, res) => {
    res.render('redirect.html');
});

// dashboard
router.get('/home', (req, res) => {

    // check for valid session
    if (req.session.user) {

        // get oauth2 client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: req.session.user.accessToken
        });

        // get calendar events by passing oauth2 client
        googleCalenderService.listEvents(oauth2Client, (events) => {

            var listOfSums = [];
            for (let i = 0; i < events.length; i++) {
                listOfSums.push(events[i]['summary']);
            }

            let eventsList = [];
            eventsList.push(events[0])
            for (let i = 1; i < events.length; i++){
                if(new Date(events[i-1]['start']['dateTime']).getDate() != new Date(events[i]['start']['dateTime']).getDate()){
                    eventsList.push({
                        'start': { 'dateTime': new Date(2023, new Date(events[i-1]['start']['dateTime']).getMonth(), new Date(events[i-1]['start']['dateTime']).getDate(), 22), },
                        'end': { 'dateTime': new Date(2023, new Date(events[i]['start']['dateTime']).getMonth(), new Date(events[i]['start']['dateTime']).getDate(), 8), }
                    })
                }
                eventsList.push(events[i])
            }

            // console.log(rl);

            let freeBlocks = []
            for(let i = 0; i < eventsList.length - 1; i++){

                let endDate = new Date(eventsList[i+1]['start']['dateTime']);
                let endString = endDate.toString();


                let startDate = new Date(eventsList[i]['end']['dateTime']);

                let startString = startDate.toString();

                newEvent =  {
                    kind: 'calendar#event',
                    etag: '',
                    id: '',
                    status: '',
                    htmlLink: '',
                    created: '',
                    updated: '',
                    summary: '',
                    description: '',
                    location: '',
                    creator: {},
                    organizer: {},
                    start: {
                      dateTime: startString,
                      timeZone: 'America/Los_Angeles'
                    },
                    end: {
                      dateTime: endString,
                      timeZone: 'America/Los_Angeles'
                    },
                    recurringEventId: '',
                    originalStartTime: {
                      dateTime: startString,
                      timeZone: 'America/Los_Angeles'
                    },
                    iCalUID: '',
                    sequence: 0,
                    attendees: [
                    ],
                    guestsCanModify: true,
                    reminders: { useDefault: false, overrides: [Array] },
                    eventType: 'default'
                  }
                freeBlocks.push(newEvent);
            }

            let freeBlocksFormatted = []
            for(let i=0; i<freeBlocks.length; i++){
                freeBlocksFormatted.push("Free block from " + freeBlocks[i].start.dateTime + " to " + freeBlocks[i].end.dateTime)
            }
;

        (async() => {
            suggestions = await main(listOfSums, freeBlocksFormatted);

            console.log(suggestions);

            events_formatted = []
            for(let i=0; i<events.length; i++){
                events_formatted.push({"summary": events[i].summary, "start_time": new Date(events[i]['start']['dateTime']).toUTCString()})
            }

            const data = {
                name: req.session.user.name,
                displayPicture: req.session.user.displayPicture,
                id: req.session.user.id,
                email: req.session.user.email,
                events: events,
                events_formatted: events_formatted,
                suggestions: suggestions
            }


            res.render('recommendation_page.html', data);
        })();




        });

    } else {
        res.redirect('/login')
    }
});

// delete session and logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.redirect('/home');
        }
        res.clearCookie('sid');
        res.redirect('/');
    });
})

module.exports = router;