# Stage 1

## The Problem
Students were losing track of important notifications because too many were coming in at once. I needed a way to always surface the most relevant ones at the top — a Priority Inbox that shows the top 10 notifications based on what actually matters.

## How I Approached It

### Step 1 — Giving each type a weight
Not all notifications are equally important. A placement drive is more urgent than a college event, so I assigned weights manually:

- Placement → 3
- Result → 2
- Event → 1

### Step 2 — Factoring in recency
A week-old placement notification shouldn't outrank something that just came in. So I added a recency score based on how old the notification is:

recency = 1 / (1 + ageInSeconds)

This keeps newer notifications naturally higher without ignoring type importance.

### Step 3 — Final score
score = weight + recency

Simple addition. A Placement will almost always beat a Result, but if two notifications are the same type, the newer one wins.

## Keeping it efficient
I fetch from the API, score everything in memory, sort, and slice the top 10. No database queries, no hardcoded data. As new notifications come in with recent timestamps, they automatically get higher recency scores and rise to the top on the next fetch.
