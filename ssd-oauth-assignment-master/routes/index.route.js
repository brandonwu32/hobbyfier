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

const openai = new OpenAI({apiKey: "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"});

async function main(activities) {
  const completion = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct",
    prompt: `Classify each entry in the list of google calendar activities into one of 8 categories: fitness, food, film, creativity, nature, relaxation, social, games. Return the response as a String. The list is ${activities}`,
    max_tokens: 20,
    temperature: 0,
  }
  )

  let textRes = completion['choices'][0]['text']

  let aggregate = textRes.trim("").slice(0, -1).split(', ');
  console.log(aggregate);
  for (let i = 0; i < aggregate.length; i++) {
    map.set(aggregate[i], map.get(aggregate[i]) + 1);
  }
  console.log(map);
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
    res.redirect('/redirect');
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

            main(listOfSums);






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
;



            const data = {
                name: req.session.user.name,
                displayPicture: req.session.user.displayPicture,
                id: req.session.user.id,
                email: req.session.user.email,
                events: events
            }


            res.render('recommendation_page.html', data);
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