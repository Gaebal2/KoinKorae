# BattleFeed Technical PRD v1.0

## 1. Product Overview

### Product Name

BattleFeed (Working Title)

### Platform

- Progressive Web App (PWA)
- Mobile-first design
- Global service

### Core Vision

BattleFeed is a social platform where content visibility is determined by community participation rather than hidden recommendation algorithms.

Users can spend Battle Points (BP) to participate in a battle for content exposure by playing randomly assigned mini-games.

Every post is associated with a supporting cryptocurrency, allowing communities to openly compete for visibility and influence.

---

# 2. MVP Scope

## Included

### HOME

- User authentication
- Create post
- View posts
- Comments
- Reposts
- Battle system
- User Feed
- Coin Feed

### MAP

- Create pin
- Edit pin
- Delete pin
- Browse pins

### CHECK-IN

- Daily check-in
- Rewarded ads
- BP rewards

### PROFILE

- User profile
- User posts
- User reposts
- Activity summary

---

## Excluded

- Wallets
- Crypto transfers
- Payments
- Escrow
- Token swaps
- NFT features
- On-chain transactions
- Blockchain integration
- Real-time chat

---

# 3. Navigation Structure

Bottom Navigation:

```text
HOME | MAP | CHECK-IN | PROFILE
```

---

# 4. Core Concepts

## 4.1 Supporting Coin

Every post must be associated with exactly one cryptocurrency.

Examples:

- BTC
- ETH
- SOL
- XRP
- SL

The selected coin is displayed on the top-right corner of the post card.

---

## 4.2 Battle

Instead of Likes, users interact with content through Battle.

Battle Flow:

```text
Tap Battle

↓

Choose:
Support
or
Oppose

↓

Server assigns random mini-game

↓

User plays game

↓

Score submitted

↓

Exposure updated
```

---

## 4.3 Exposure

Exposure determines post ranking.

Formula:

```text
Exposure = Support Score - Oppose Score
```

Example:

```text
Support = 100
Oppose = 10

Exposure = 90
```

---

## 4.4 Controversy

Used for "Most Controversial" ranking.

Formula:

```text
Controversy = Support Score + Oppose Score
```

Example:

```text
Support = 100
Oppose = 10

Controversy = 110
```

---

# 5. Feed System

## 5.1 User Feed

Global ranking across all posts.

Coin selection does not affect grouping.

Posts are ranked according to selected category.

---

### Categories

#### Exposure Rankings

- Today
- Month
- Year
- All Time

#### Activity Rankings

- Most Controversial
- Rising
- Recently Posted

#### Social Rankings

- Following

---

## 5.2 Coin Feed

Posts are grouped by supporting coin.

Each coin section is collapsible.

Example:

```text
BTC ▼

#1 Post A
#2 Post B
#3 Post C

----------------

ETH ▶
```

---

### Coin Ranking Formula

Coin Exposure:

```text
Coin Exposure

=

SUM(Post Exposure)
```

Example:

BTC

```text
1500
1000
10

=

2510
```

ETH

```text
2000
200
100

=

2300
```

BTC ranks above ETH.

---

# 6. Post Structure

## Required Fields

- Author
- Supporting Coin
- Content

---

## Optional Fields

- Images

---

## Post Card Layout

```text
Profile Image

Username

Coin Icon

Content

Support: 100

Oppose: 10

Exposure: 90

[ Battle ]
```

---

# 7. Repost System

## Rules

Reposts appear only on the user's profile page.

Reposts do NOT appear in global feed rankings.

---

## Battle Contribution

If a repost receives battle activity:

```text
Repost Exposure += Score

Original Post Exposure += Score
```

Both repost and original post receive the same contribution.

---

# 8. Mini-Game System

## Objective

Prevent optimization of a single game.

Encourage fairness and variety.

---

## Rules

Users cannot choose the game.

Server randomly assigns one mini-game.

Examples:

- Flappy Bird style
- Tap timing
- Endless runner
- Jump game
- Obstacle avoidance

---

# 9. Anti-Cheat System

## Layer 1

Server-side validation.

All battle results must be verified on the server.

---

## Layer 2

Statistical analysis.

Monitor:

- Average score
- Median score
- Variance
- Outliers

---

## Layer 3

Input validation.

Examples:

- Impossible tap frequency
- Impossible reaction times

---

## Layer 4

Behavior analysis.

Examples:

- 24-hour continuous activity
- Identical score patterns
- Suspicious consistency

---

# 10. Battle Point System

## Definition

BP (Battle Point) is the platform utility resource.

BP is required to perform actions.

---

## Current BP

Spendable BP.

Used for:

- Battle participation
- Creating map pins
- Future premium actions

---

## Lifetime Earned BP

Total BP earned by the user throughout account history.

Used for:

- Reputation
- Pin limits
- User progression

---

# 11. BP Sources

## Daily Check-In

Primary source.

Example reward:

```text
+10 BP
```

Value configurable.

---

## Rewarded Ads

Secondary source.

Example:

```text
Watch Ad

↓

+20 BP
```

Value configurable.

---

## Future Sources

- Missions
- Community participation
- Events

---

# 12. Battle Cost

Initial MVP Rule:

```text
1 Battle

=

1 BP
```

Configurable.

---

# 13. MAP System

## Purpose

Discover:

- Products
- Services
- Businesses
- Community opportunities

No transactions occur inside the platform.

---

## Map Pin Types

### Product for Sale

Example:

- Laptop
- Phone
- Equipment

---

### Wanted Item

Example:

- Looking to buy bicycle

---

### Service Offer

Example:

- Web development
- Design
- Translation
- Education

---

### Business

Example:

- Cafe
- Restaurant
- Store

---

## Pin Appearance

Map pin icon uses supporting coin image.

Examples:

- BTC pin
- ETH pin
- SOL pin
- SL pin

---

## Pin Fields

- Title
- Description
- Coin
- Latitude
- Longitude
- Category
- Creator

---

# 14. Pin Limits

Anti-spam mechanism.

---

## Bronze

Lifetime BP:

```text
0 - 999
```

Maximum Pins:

```text
1
```

---

## Silver

Lifetime BP:

```text
1000 - 9999
```

Maximum Pins:

```text
2
```

---

## Gold

Lifetime BP:

```text
10000+
```

Maximum Pins:

```text
3
```

Thresholds configurable.

---

# 15. User Progression

Progression is based on participation, not spending.

Users unlock privileges through Lifetime Earned BP.

Examples:

- Additional pin slots
- Future badges
- Future profile upgrades

---

# 16. Ranking Windows

All battle events are stored using UTC timestamps.

Rankings are calculated using the user's local timezone.

Supported windows:

- Today
- Month
- Year
- All Time

---

# 17. Database Schema

## users

```sql
id UUID PRIMARY KEY

username VARCHAR

profile_image TEXT

current_bp INTEGER

lifetime_bp INTEGER

created_at TIMESTAMP
```

---

## coins

```sql
id UUID PRIMARY KEY

symbol VARCHAR

name VARCHAR

icon_url TEXT
```

---

## posts

```sql
id UUID PRIMARY KEY

user_id UUID

coin_id UUID

content TEXT

support_score INTEGER

oppose_score INTEGER

exposure_score INTEGER

created_at TIMESTAMP
```

---

## reposts

```sql
id UUID PRIMARY KEY

user_id UUID

post_id UUID

created_at TIMESTAMP
```

---

## map_pins

```sql
id UUID PRIMARY KEY

user_id UUID

coin_id UUID

title VARCHAR

description TEXT

latitude DECIMAL

longitude DECIMAL

created_at TIMESTAMP
```

---

## battle_events

```sql
id UUID PRIMARY KEY

user_id UUID

post_id UUID

game_id UUID

battle_type VARCHAR

score INTEGER

created_at TIMESTAMP
```

---

## checkins

```sql
id UUID PRIMARY KEY

user_id UUID

reward_bp INTEGER

created_at TIMESTAMP
```

---

# 18. API Endpoints

## Authentication

```http
POST /auth/register

POST /auth/login

GET /me
```

---

## Posts

```http
GET /posts

POST /posts

GET /posts/{id}

DELETE /posts/{id}
```

---

## Battle

```http
POST /battle/start

POST /battle/finish
```

---

## Coins

```http
GET /coins

GET /coins/{id}/posts
```

---

## Map

```http
GET /pins

POST /pins

PATCH /pins/{id}

DELETE /pins/{id}
```

---

## Check-In

```http
POST /checkin
```

---

# 19. Development Roadmap

## Phase 1

Authentication

Profile

Post creation

Coin selection

---

## Phase 2

Battle system

BP system

Random mini-games

Exposure calculation

---

## Phase 3

User Feed

Coin Feed

Ranking categories

---

## Phase 4

Map system

Pin creation

Pin limits

---

## Phase 5

Check-in

Rewarded ads

BP economy balancing

---

# 20. MVP Success Metrics

The MVP should validate the following hypotheses:

### H1

Users are willing to battle for content exposure.

### H2

Crypto communities actively support content related to their preferred coin.

### H3

The BP economy (Check-In + Rewarded Ads + Battles) is sustainable.

### H4

Coin Feed and Map features increase community engagement beyond traditional social networks.

### H5

Transparent exposure rankings create stronger user participation than conventional like-based systems.