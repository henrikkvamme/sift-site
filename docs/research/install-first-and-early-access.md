# Sift onboarding, accounts, and early access

## Recommendation

Lead with installation on supported desktop browsers. Let people see the calm feed without an account. Ask them to continue with Google when they explicitly claim six months of Sift Pro. Account creation should deliver a concrete benefit: a recoverable offer that follows them across installations and, eventually, devices.

The landing page should say what happens next. “Become an early tester” can work if the adjacent line states that the button opens the Chrome Web Store. “Install Sift free” is more literal. These are copy candidates, not evidence that one phrase will convert better. Do not send an installation-labelled button to a registration form or imply that installing alone reserves an account-level Pro place.

Keep the website screenshot first, followed by the three benefits, a compact roadmap, and the early-access offer. Avoid a full pricing comparison while the future price is undecided. Google sign-in belongs at the point of claiming Pro, not as a large competing button in the hero.

## Evidence and limitations

Sources were checked September 8, 2026. There is no identified controlled experiment establishing install-first versus Google-sign-up-first conversion for Sift or a close replica. The recommendation combines established usability research, current browser-platform guidance, the product's existing architecture, and the stated objective of broad useful adoption. It should be tested against retained users, not treated as a proven growth multiplier.

Nielsen Norman Group's login-wall research recommends exposing value before requiring registration when an account is not fundamental to the task. The article dates to 2014 and discusses several website and app contexts; it does not measure modern Chrome-extension conversion. Its relevance here is the additional interaction cost of asking for personal information before someone knows whether Sift helps.[^1]

Chrome's current Identity API documentation independently says interactive authentication should be initiated by explanatory UI, not launched automatically on an extension's first launch. This is platform-specific guidance supporting a voluntary claim action after installation. It does not prohibit a website from offering sign-up first.[^2]

Comparable products show that a permanent free experience and a paid identity can coexist. Glasp has a useful free plan and Pro expansion; Raindrop offers free bookmarking and Pro capabilities. Their packaging establishes familiar expectations, but published pricing pages do not reveal the comparative performance of their acquisition funnels.[^3][^4]

## The two acquisition paths

| Path | What it optimizes | Main weakness | Fit for Sift |
|---|---|---|---|
| Website → Google sign-in → install → use | Capturing a durable account and assigning a place immediately | Adds a step before value; registered people may never install | Useful for a reservation-only campaign or unsupported devices, not the primary desktop journey |
| Website → install → use → claim Pro with Google | Fastest path to the product's distinctive interface | Installation alone cannot reserve an account-level place; an explicit later claim is necessary | Recommended desktop baseline |
| Website → install → anonymous Pro automatically | Very little friction | Reinstalls, recovery and multiple devices complicate one-person eligibility | Poor fit for a bounded six-month promotion |
| Website → email waitlist | Contactable future interest | Delivers no current product value | Only for a genuinely unavailable platform, with a real subscription service |

Sign-up-first is not inherently bad. It becomes appropriate when the thing being offered is an account-specific reservation, the product cannot function anonymously, or observed abuse makes anonymous access unsustainable. Sift's feed and search do not require an account, so adding one before installation would gate a benefit that already works locally.

A claimed account also is not the same as an active user. The business should separately report installed users, successful first-use sessions, claimed offers, and retained users. A campaign can generate many email addresses while producing little adoption. Conversely, anonymous browsing can provide genuine value without creating a future payer.

For the initial cohort, show the claim action in a small welcome surface and in settings. Do not place a modal over the first feed or automatically open Google consent. A user can close the welcome prompt and claim later while places remain. Returning users should see the actual activation date and expiry in settings, rather than repeatedly encountering an offer banner.

## Website CTA and device treatment

Use one primary action per eligible landing-page state. On a supported desktop browser, the early-tester CTA opens the known Chrome Web Store listing. The surrounding copy explains the six-month offer and the later claim step. Keep the existing screenshot and three benefits visible without registration.

On phones and Safari, make desktop-only availability explicit. A link to the listing can still be useful, but should not imply immediate installation on that device. The stronger eventual alternative is “Notify me about Safari” backed by a working opt-in notification flow. Do not show a fake submit button, pretend to reserve a place in local storage, or label a marketing-email signup as Pro activation.

Do not use screen width alone to decide whether a browser can install an extension. Narrow desktop windows and tablets make that unreliable. Capability and platform detection should only tailor guidance; a visible fallback should always explain the supported desktop route. A small-screen preview of the interface is illustrative and should not be mistaken for a currently shipped mobile product.

For this website revision, the offer is:

> Six months of Sift Pro, free. For our first 1,000 early users. No card required.

The offer copy must say “first 1,000 activations,” rather than implying that downloading the extension reserves a place. Installing alone does not reserve one. This avoids creating an accidental promise to someone who installs and waits weeks before claiming. A reservation period is an alternative, but adds expiring holds and can allocate scarce places to installations that never become active users.

The FAQ should make four facts easy to find: the clock starts on activation; the offer has usage limits; future prices will be announced with at least 30 days to decide; and no automatic payment occurs. Do not publish a price comparison or a fabricated “normally” price. Do not show a remaining-place number unless it comes from the authoritative claim system.

## What Sift already has

The existing Sift API is a Bun service backed by PostgreSQL. It creates anonymous installation credentials, stores a keyed digest of the installation secret, and uses those credentials for entitlements, AI requests and billing. The source includes atomic AI request reservations and signed Stripe subscription events. It does not currently provide Google user accounts or a first-1,000, six-month activation ledger.[^5]

An installation credential answers “which installation is making this request?” It does not reliably answer “is this the same person after reinstalling or moving to another device?” The account layer should complement the installation identity, not throw away its useful separation from YouTube page scripts.

The six-month promise is also a new entitlement type. A fake Stripe subscription or a browser-side flag is not an adequate representation. Existing paying users must retain their paid access independently of a promotional expiry. New promotion logic should not cancel, rewrite or silently replace a real subscription.

The current published extension and existing backend quotas must be reconciled with the new offer before the website claims it is immediately redeemable. A marketing-page change is not proof of working activation. Until the end-to-end claim flow is available, the completed offer page should remain a preview or clearly describe an upcoming offer rather than taking users to a nonexistent activation step.

## Google sign-in

Use Google as the initial sign-in provider because it is familiar to the target audience and avoids a password creation flow. It is still a separate Sift account. Being signed in to YouTube does not grant Sift permission to identify the user, read their subscriptions, or impersonate their YouTube account.

Google documents authentication-only scopes such as `openid`, `email`, and `profile` separately from authorization to additional Google APIs. Request only the identity information needed to establish and recover the Sift account. Do not ask for YouTube API access to enable Pro, and do not scrape the YouTube account menu as authentication.[^6]

Better Auth documents a Google provider and server-side session handling. Its Google setup needs an OAuth client and registered callback URLs; installing the package is not enough. The exact configuration and database schema should be pinned and verified against the selected library release before deployment.[^7]

Use Google's stable provider subject as the external identity, with a stable Sift user ID internally. Do not key entitlements by a display name, channel name or an unverified email string. Google sign-in can reduce casual duplicate claims, but it does not prove one physical person has only one Google account. “One offer per person” remains an eligibility policy supported by reasonable abuse controls, not an absolute technical guarantee.

The first implementation can use Google only for Pro while preserving anonymous free browsing. If meaningful user research shows that Google-only login excludes the intended audience, add an alternative later. A future native iOS application would require a separate review of the then-current App Store login rules. Safari web-extension support is not sufficient reason to promise a particular native-app sign-in experience now.

## Backend and database choice

| Component | Verdict for this workload | Reason | Evidence needed before shipping |
|---|---|---|---|
| Existing Bun backend | Retain | Already owns API and deployment; an auth handler can be mounted alongside existing routes | Real session and callback tests under the deployed Bun version |
| Better Auth | Trial in a focused vertical slice | Documented Google provider and PostgreSQL support; avoids inventing OAuth/session machinery | Sign-in, logout, linking, expiry, wrong-origin and recovery acceptance tests |
| Existing server PostgreSQL | Retain | Already authoritative for quotas and subscriptions; supports transactional claim allocation across processes | Migration rehearsal, backup/restore confidence and concurrency tests |
| PGlite as the production account database | Hold for this change | Introduces a different operational/concurrency model without resolving a current requirement | A demonstrated benefit and recovery/concurrency evidence before reconsidering |
| PGlite for local tools or tests | Assess separately | Embedded PostgreSQL can be useful without becoming production authority | Confirm equivalence for the specific queries and transaction behavior being tested |

Assuming “Postgres lite” means PGlite, it is not simply a smaller configuration switch on the already-running server. PGlite is an embedded WebAssembly PostgreSQL distribution. Its socket documentation says multiple client connections are possible but queries are handled through the underlying single connection, with exclusive access during transactions. This does not make it unsuitable for every production application; it makes a migration unnecessary and harder to justify for this existing shared account service.[^8]

Better Auth's PostgreSQL documentation provides supported adapter paths, and its handler integrations use standard requests and responses. Choose a documented driver path and verify it under Bun rather than adding a new web framework merely because a tutorial uses one. Avoid introducing a second independent source of subscription or Pro state in the authentication library.[^9]

This decision is based on fit and continuity of invariants, not implementation speed. The important requirements are durable grants, safe concurrent claims, recoverable identities, reversible migrations and straightforward operations. A future need for an embedded local database can be evaluated without migrating the hosted source of truth.

## Account-to-extension linking

The browser page, extension service worker and website session are separate trust domains. A logged-in website must not be able to attach an arbitrary installation by supplying its ID. Likewise, a YouTube page must not be able to obtain website cookies or installation bearer secrets.

Recommended protocol:

1. The extension service worker starts a short-lived pairing request authenticated by its existing installation credential.
2. The server issues an unguessable, single-use pairing handle. The handle carries no long-lived bearer token and is bound to the initiating installation.
3. A first-party Sift page opens through an explicit user action. Google sign-in establishes the Sift web session, then the user confirms the link or claim.
4. The server consumes the handle atomically, links the installation to the authenticated account, and grants Pro if the account is eligible and capacity remains.
5. The initiating extension polls or exchanges using its installation credential to learn the result. No website session token is exposed to the YouTube content script.

The exact transport can use a tested browser identity flow or a first-party tab with a server pairing exchange. Chrome documents `launchWebAuthFlow` and extension-specific redirect URLs, but the integration still needs explicit redirect allowlists, state validation and appropriate PKCE behavior. Do not assume the Better Auth Electron integration is a Chrome-extension integration.[^2]

Pairing attempts must expire and resist replay. Logout, account deletion, and explicit unlinking must revoke access predictably. Do not link accounts solely because email addresses match, and do not allow arbitrary redirect destinations or wildcard trusted origins. Keep Google client secrets and session signing secrets on the server.

## The first 1,000 grants

Represent the promotion with a stable campaign identifier, an enrollment capacity, and durable user grants. The database must enforce uniqueness on the campaign/user combination. Allocate a place and create its grant in the same transaction, locking the campaign capacity row or using an equivalent proven atomic allocation. Two simultaneous claims for the last place must produce one success.

Use six calendar months from activation, computed consistently in UTC with documented end-of-month handling. A January 31 activation must not unexpectedly roll into an extra month through naive date arithmetic. Repeated claims, request retries, reinstallations and additional devices must return the existing grant and original expiry, not reset its clock.

A place is used when the authenticated claim succeeds, not when someone clicks a CTA or begins Google consent. If the final place is taken while another person signs in, show a clear outcome and leave the ordinary free product usable. Do not turn the quota race into an error that loses the account or installation.

Once granted, honor the full six months even if enrollment closes or the campaign changes. Deleted accounts raise a separate retention-versus-abuse decision: a non-identifying aggregate counter can preserve the number of awarded places, while any retained personal anti-abuse identifier needs a justified retention policy. Do not silently retain deleted profiles to maintain marketing scarcity.

The claim should not imply unlimited AI. The agreed offer needs published practical limits and budget safeguards. Existing successful results can be reused, failures should not spend completed-use allowances, and ordinary browsing remains available at a limit. Paid subscriptions should remain a separate stronger entitlement where appropriate.

## Roadmap presentation

The roadmap should communicate direction with little text. Three ordered rows are sufficient. Give each a short title, one sentence, and a restrained status label. Avoid percentage-complete bars, quarter labels, fictitious delivery dates, and a grid of large identical promotional cards.

| Roadmap item | Status | Public scope |
|---|---|---|
| Safari on iPhone, iPad and Mac | Up next | Text-first browsing on supported websites in Safari |
| Instagram | Planned | Instagram on the web; detailed feature set still to be validated |
| Facebook | Exploring | Investigating a quieter web experience; not a committed delivery promise |

Apple documents packaging Safari web extensions for distribution through apps and the App Store across its supported platforms. A Safari extension works in Safari's web context. It should not be marketed as changing the native YouTube, Instagram or Facebook applications.[^10]

Keep the roadmap below the working product's benefits. The current reason to install is a quieter YouTube, summaries and questions. Future platforms should expand that story without taking attention away from the value available today. The roadmap can link to support for feedback; no voting or notification UI should appear without a functioning service behind it.

## Validation and experiment

Before release, exercise the full path from the actual website CTA to the actual store listing, installation, first useful session, Google authentication, claim, and visible expiry. Verify that the public store build contains the account entry point. Passing an API test or uploading a ZIP does not establish this user journey.

Required account cases include successful first claim, canceling Google sign-in, an existing claimant returning, two devices, reinstall, expired pairing handles, replay, a wrong website origin, concurrent final-place claims, expired promotional access, and an existing paying subscriber. Validate deletion and logout without disrupting unrelated installations. Use test identities and a test campaign, not production-user grants.

For the website, check the hero, roadmap, FAQ expansion, keyboard focus, in-page navigation, long labels and horizontal overflow at phone, tablet and desktop widths. Make it clear that a phone visitor cannot install the current desktop extension on the phone. The supported-platform disclosure must remain visible near the CTA, not only in terms.

Once the baseline works, compare installation-led and account-led journeys with the same offer and acquisition mix if traffic supports a meaningful experiment. Primary outcome: retained active users after 28 days per eligible visitor. Secondary outcomes: successful installation, first useful session, claimed offers, support requests and service cost. Registration conversion alone would favor the flow that forces registration, making it a misleading success criterion.

Use anonymous or privacy-reviewed aggregate counters. Avoid storing browsing queries, video identifiers, transcripts, or chat content for funnel analytics. Set retention periods for any identifiers needed to connect steps, and keep marketing consent distinct from account creation and the Pro claim.

## Sources

1. Raluca Budiu, Nielsen Norman Group. [Login Walls Stop Users in Their Tracks](https://www.nngroup.com/articles/login-walls/), March 2, 2014. Qualitative usability evidence and scope limitations.
2. Google Chrome for Developers. [chrome.identity](https://developer.chrome.com/docs/extensions/reference/api/identity), live documentation accessed September 8, 2026. User-initiated authentication guidance and redirect API.
3. Glasp. [Pricing](https://glasp.co/pricing), accessed September 8, 2026. Free/Pro packaging precedent, not acquisition performance data.
4. Raindrop.io. [Subscribe to Pro](https://raindrop.io/pro), accessed September 8, 2026. Free/Pro naming precedent.
5. Sift source at `6da4523`: `server/app.ts`, `server/services.ts`, `server/postgres-repository.ts`, `server/config.ts`, and `docs/subscription-architecture.md`. Current installation-based identity and missing account-level promotion; documentation model-routing prose is not treated as more authoritative than current source.
6. Google Identity Services. [How user authorization works](https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works), accessed September 8, 2026. Authentication-only scopes versus access to other APIs.
7. Better Auth. [Google](https://better-auth.com/docs/authentication/google) and [Options](https://better-auth.com/docs/reference/options), accessed September 8, 2026. OAuth configuration and session/auth settings. No library version was installed or pinned as part of this research.
8. PGlite. [What is PGlite](https://pglite.dev/docs/about) and [PGlite Socket](https://pglite.dev/docs/pglite-socket), accessed September 8, 2026. Embedded architecture and connection behavior.
9. Better Auth. [PostgreSQL](https://better-auth.com/docs/adapters/postgresql) and [Installation](https://better-auth.com/docs/installation), accessed September 8, 2026. Supported backend persistence and handler setup.
10. Apple Developer. [Safari Extensions](https://developer.apple.com/safari/extensions/), accessed September 8, 2026. Safari extension distribution and platform scope.

[^1]: [NN/G login-wall research](https://www.nngroup.com/articles/login-walls/).
[^2]: [Chrome Identity API](https://developer.chrome.com/docs/extensions/reference/api/identity).
[^3]: [Glasp pricing](https://glasp.co/pricing).
[^4]: [Raindrop Pro](https://raindrop.io/pro).
[^5]: Local Sift source at `6da4523`, files listed in Sources entry 5.
[^6]: [Google authentication and authorization distinctions](https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works).
[^7]: [Better Auth Google provider](https://better-auth.com/docs/authentication/google).
[^8]: [PGlite Socket documentation](https://pglite.dev/docs/pglite-socket).
[^9]: [Better Auth PostgreSQL adapter](https://better-auth.com/docs/adapters/postgresql).
[^10]: [Apple Safari extensions](https://developer.apple.com/safari/extensions/).
