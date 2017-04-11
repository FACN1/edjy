# week7-SPN
Brace yourselves for Saucy Psychic Ninjas' Dinner Blog(!!!).

## Outline
Our site will be a blog about what was cooked for dinner at the guesthouse (or elsewhere). Users can submit new posts about meals, read about specific meals, and ultimately comment on posts and maybe search/filter posts.

## Aims
- Heroku
- Use Joi validation


## User Stories
#### WEEK 7 USER STORIES
**As a bored internet browser who navigates to the home page:**
> I want to see a list of posts about different dinners which were cooked

> So that I can see if there are any I would like to read more about

**As a confused user who has navigated to the site erroneously:**
> I want to be confronted by a home page which is visually appealing

> So that even though I choose to leave the site, I leave with a positive impression of both the site, and the Saucy Psychic Ninjas

**As a proud chef who has recently masterminded a fantastic dinner:**
> I want to be able to write a painstakingly detailed post about the entire process

> So that I can re-read the post with my friends at various points in the future and laugh and be merry

#### WEEK 8 USER STORY

**As a member of Founders and Coders, who wants to learn about the dinners being cooked up at the guesthouse**

> I want to log in with my Github account

> So that I can securely and privately access secret dinner activities occurring within the FaCN1 community.

** Acceptance Criteria**

- [ ]  I can click on a button, which allows me to log in via my Github account

- [ ] The look of the button should make it obvious that it is this form of login

- [ ] Once I'm logged in, I should see a list of blog posts

- [ ] I shouldn't be left with a blank loading screen for too long during the authorisation process, otherwise I will lose confidence in your website and leave.

**As any user who is logged in to the Guesthouse Dinners Blog**

> I want to see my username & Github profile picture on the homepage

> So that I benefit from logging in with Github OAuth, and don't have to do any profile setup on your site.

**Acceptance criteria**

- [ ]  I can see my username & profile picture on each page that I visit


## Local install instructions
- In your command line run:

```bash
git clone https://github.com/FACN1/week8-edjy.git

cd week7-SPN

npm i

atom config.env

```

- SAVE the config.env file

- Ask us for the DATABASE_URL (on gitter)

- Enter DATABASE_URL within config.env in your text editor.


## Database Schema:
### Posts
Column      |     Type    |    Modifiers   | More info           
--- | --- | --- | ---
id               | integer                     | not null default | serial primary key
dish             | character varying(255)      | not null |
description      | text                        |          |
chef_name        | character varying(255)      | not null |
background_color | character varying(25)       | not null |
date_published   | timestamp without time zone | not null default now() |

## Stretch Goals
