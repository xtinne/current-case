# CURRENT – Technical challenge

## The problem

EV drivers use our app to find a charger and start charging. Your task is to design and build the part of the app where **a driver looks for a place to charge**.

How you solve it is up to you:

- how the stations are presented (a map, a list, both, or something else)
- which information you show and when
- how the user moves from overview to detail
- which features you think matter most

We deliberately don't give you a feature list. We want to see how you think about the user and what you choose to build.

## Constraints

- **Stack:** Angular, TypeScript and Ionic. Other libraries are your choice.
- **Platform:** it's a mobile app, but it must run in the browser (for example with `ionic serve`) so we can try it easily. Native builds are not needed.
- **Time:** we suggest spending **about 4 hours**. We don't expect a finished product, and we'd rather see good choices than many features.

## Data

- Stations: https://dummyjson.com/c/2e67-6ae1-4c2d-b009
- Station details: https://dummyjson.com/c/8d88-4b00-4935-8528

Notes on the data:

- **Same shape as our real API.** The station list is a light summary. Details such as charge points, status and price are fetched separately per station.
- **The details endpoint is static** and always returns the same station. Treat it as if it returned the station the user selected.
- **The data is fictitious**, and some of it is deliberately imperfect.
- **The dataset is small.** Real users may see thousands of stations, so tell us how your solution handles that (and handle it in code if you have time).

## Tests

Add tests where you think they matter most.

## About AI tools

**You may use AI tools** (Claude Code, Copilot, Cursor, etc.). We use them every day too.

**You are responsible for the code you deliver.** In the technical interview we'll ask you to explain your code and your decisions, and to make a change in it.

## Delivery

Deliver a **Git repository** and keep the commit history; we're interested in how you worked. Share it privately with us, or send it as a zip that includes the `.git` folder.

Include a short README with:

1. **Setup:** how to install and run it.
2. **Users and UX:** which driver and situation you designed for, your assumptions, and the UX choices you made. Mention any alternatives you considered.
3. **Trade-offs:**
   - what you prioritised, what you left out and why
   - how the solution would handle many stations
   - roughly how much time you spent
4. **Next steps:** what you would do with more time, and any edge cases you know are not handled.
5. **AI usage:** briefly, how you used AI tools, what you had to correct, and how you checked the result.

## What we look at

1. **UX and product thinking.** Does the solution help a driver find a place to charge quickly and with confidence?
2. **UI quality**, and good use of Ionic.
3. **Code quality and structure**, and appropriate use of modern Angular.
4. **Prioritisation and reasoning**, as explained in the README and in the interview.
5. **Robustness:** edge cases and performance.

## Technical interview

If we move forward, we'll meet for a technical interview of 1–2 hours. You walk us through your solution, we ask about your choices, and we make a small change to the code together. No extra preparation is needed.
