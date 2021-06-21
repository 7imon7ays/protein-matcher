# Protein Matcher

Demo web app to match a strand of DNA to a protein that it helps encode.

## See it live

The tip of master is running at [protein-matcher.herokuapp.com](https://protein-matcher.herokuapp.com/)

## Local development

### Starting the server

```bash
git clone https://github.com/7imon7ays/protein-matcher
cd protein-matcher
make
```

This launches the containerized web app components: the web server, the database, the frontend build server, and the background worker. Make sure you don't have another process, such as another PostgreSQL server, listening on any of ports 3000, 8000, or 5432.

### Running the test suite

From the project root and with all the app components running in another tab.

`make test`


## Tested on

	- Mac Chrome, iOS Chrome, iOS Safari

## How it works

	- Explain protein matching strategy.
		- Point to matcher/management/commands/accn_ids.py script.
		- Note that in prod you'd periodically refresh the mapping in case it changed.
	- No login, every visitor just gets a cookie
	- Bugs: no animation on mobile, autofocus but no keyboard on mobile safari.
	- Note that to see if a search failed permanently you have to check the corresponding background job

## Known issues and possible improvements

- Rate limiting
- Input validation in server and client
- FASTA file support
- Overflow not working in Firefox.
- Unit tests, especially for server code.