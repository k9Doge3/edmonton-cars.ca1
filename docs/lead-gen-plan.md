# Edmonton Cars Concierge Buyer Conversion Plan

This plan keeps every deliverable from the earlier draft, but the language leans into plain, natural conversation. Think of it as the script your marketing and product teams can rally around when we talk about how Edmonton Cars wins trust, matches prices, and delivers the right solution for each buyer.

## Competitive Positioning vs GoAuto.ca

GoAuto plays the volume game. They overwhelm shoppers with inventory, incentives, and quick trade calculators, yet their follow-up often feels robotic. Our space is the opposite: we prove that buyers in Edmonton can move just as fast—without the pressure and the paperwork drag—and we back every recommendation with verified pricing and price matching. The moments to highlight are the ones people brag about later: the concierge who lined up a 72-hour handover, the driveway trade pickup, the “we already locked your delivery window and matched your best quote” phone call.

Make sure every touchpoint reminds prospects that Edmonton Cars feels human from the first click. Lead with stories, emphasize the 10-minute hand-off to a real advisor, underline that we surface the best-fit vehicle plan (even if it means suggesting an alternative), and highlight that our credit concierge respects CASL while delivering guaranteed response windows.

## Conversion Expansion Objectives

1. **Lead Velocity:** Gather budget, timeline, trade status, and delivery preferences up front so the concierge can act within hours, not days.
2. **Rate Assurance:** Capture banking relationships, comfort zone for APR, and the best outside offer so we can lock in the lowest verified rate through our lender network.
3. **Solution Match:** Present the best-fit vehicle plan, including side-by-side alternatives, while promising to match any legitimate Edmonton quote.
4. **Appointment Commitment:** Give visitors a firm next step—Calendly slots and SMS confirmations instead of the vague “we’ll be in touch soon.”
5. **Buyer Proof:** Keep Edmonton success stories, rate wins, price-match moments, and transparent comparisons in view so shoppers feel confident saying yes.
6. **Retention Hooks:** Offer follow-up touchpoints like inventory alerts, lender updates, driveway delivery promos, and price-drop notices to stay top-of-mind when buyers need more time.

## 1. Landing Page Structure (React / Vite)

1. **Hero and Comparison Layer**
   - Headline: “Buy Your Next Vehicle with Concierge-Level Speed.” Subcopy focuses on skipping the dealership runaround and getting the best solution at a price we verify and match.
   - Primary CTA ribbon: “Book My Test Drive Appointment” opens the scheduling modal with same-week availability; secondary CTA “Start My Buyer Concierge” scrolls to the form, while “Compare GoAuto vs. Edmonton Cars Concierge” jumps to the comparison matrix.
   - A “Bank Partner Portal” badge that promises live access to big-bank and credit-union rate sheets so shoppers know we will surface the lowest verified APR they qualify for.
   - Social proof rail with testimonials about 72-hour deliveries, driveway trade pickups, and rate victories, plus stat tiles (10-minute response SLA, 4.9/5 buyer rating).
   - Sidebar blocks out concierge hours, a direct phone line, and a friendly SMS opt-in reminder.

2. **Progressive Lead Capture Funnel**
   - Step one covers vehicle category, usage style, and optional needs (commute, towing, EV rebates) so we can steer buyers toward the right solution quickly.
   - Step two asks for payment comfort range, purchase timeline, meeting preference (video, showroom, phone), optional calendar slot, and any extra priorities that affect incentives or price matching—including preferred bank relationships or credit union loyalty so we can negotiate the best APR on their behalf.
   - Step three collects credit comfort, trade-in status, preferred follow-up channel, and accessory must-haves to tailor financing and protections.
   - The final step confirms personal details, CASL consent, SMS preferences, and then triggers a concierge hand-off.

3. **Buyer Proof Stack**
   - Pricing transparency cards that show our payment breakdowns beside GoAuto’s advertised prices and call out real price-match results.
   - A “Buyer Wins” carousel that spotlights quick allocations, driveway appraisals, and after-hours pickups.
   - Event block promoting the Buyer Fast Track Clinic and other warm-touch events.

4. **Automation and Appointment Strip**
   - Persistent mobile bar that says “Edmonton Cars Concierge replies in under 10 minutes · Book your test drive this week · Price-match guaranteed,” anchored to the form.
   - Desktop widget showing real-time appointment slots (same-day video, evening showroom, Saturday driveway consult, on-site test drive) plus an SMS opt-in.

5. **Footer**
   - Clear CASL/GDPR language, privacy policy, physical location, buyer guarantees, and unsubscribe management.

## 2. Component Breakdown

- `HeroSection`: Gradient hero with proof rail, refreshed CTAs, SLA messaging, and availability chip.
- `CompetitiveComparison`: Table comparing GoAuto and Edmonton Cars on response speed, pricing clarity, trade logistics, and delivery certainty.
- `LeadWizard`: Multi-step form (managed with `useReducer`) capturing vehicle type, usage profile, payment band, timeline, meeting preference, trade status, add-on needs, price-match claims, and consent.
- `TrustBadges`: Visual verification of market pricing, concierge financing desk, and delivery SLAs.
- `RateMatchPortal`: Embedded lender comparison widget that shows the three best APR matches from partner banks and credit unions once the buyer shares their ideal payment band.
- `ReviewRail`: Rotating testimonials pointing to 72-hour deliveries and stronger trade valuations.
- `BuyerShowcase`: Cards showing real buyer wins—allocations secured in hours, driveway pickups, confirmed price matches, and weekend deliveries.
- `EventSignupBanner`: CTA for the Buyer Fast Track Clinic with perks like delivery slots, on-the-spot valuations, and lender boosts.
- `AutomationTimeline`: Snapshot of the concierge automation—instant email, 15-minute SMS, 30-minute calendar lock, one-hour payment preview, day-two and day-five follow-ups.
- `ConciergeAvailability`: Highlights the SLA, direct line, SMS number, and 30-minute calendar guarantee.
- `StickyCTA`: Persistent bottom bar summarizing the SLA with a glowing “Book My Test Drive Appointment” button plus a secondary link to start the concierge.
- `Footer`: Legal copy, privacy links, buyer guarantees, unsubscribe options, and CASL/GDPR compliance reminders.

## 3. State and Data Flow

- **Local state:** `LeadWizard` stores answers such as vehicle focus, usageProfile, appointmentPreference, calendarSlot, accessoryPriorities, priceMatchSource, bankPreference, aprFloor, and smsOptIn in `sessionStorage` so visitors can resume later and so summary cards stay up to date.
- **Global context:** `LeadContext` shares normalized buyer data with the summary modules, comparison CTA, sticky CTA, and appointment widget to keep messaging consistent—including any price-match requests or bank portal matches that need reinforcing.
- **Hooks:** `useLeadSubmit` posts to `/api/leads`, shows optimistic toasts, normalizes appointment and buyer metadata, and captures any price-match proof for concierge review; `useAppointmentSlots` fetches concierge availability (mocked locally today, ready for Calendly or Cal.com integration) and flags peak times for price-match callbacks; `useRatePortal` polls our lender network (major banks, credit unions, and alternative platforms) for the best available APR tiers based on fresh buyer inputs; `useBuyerStories` hydrates showcase cards from JSON or CMS content while syncing with the marketing site.

## 4. CRM and Automation Integration

### Immediate v1 (Serverless on Vercel)

1. **Endpoint:** `POST /api/leads`
   - Validates payload, captures UTM parameters, saves price-match source details, preferred lenders, and APR expectations, and writes the record to the CRM (HubSpot, Close, or Supabase table).
2. **Email automation:**
   - Sends a transactional email through Resend, SendGrid, or AWS SES, personalized with lead answers, price-match next steps, a summary of the top three partner-bank offers, and a Calendly link.
3. **CRM enrichment:**
   - Adds context like form version, device, price-match status, and page path, then pushes a task to the “New Edmonton Lead” stage with a reminder to confirm price comparisons during the first call.

### Future enhancements

- Webhook listener for CRM status changes that updates the Supabase analytics row and notifies marketing when price matches are verified.
- Two-way sync so booked calls update the on-site dashboard in real time, including whether a price-match guarantee was triggered.
- Direct rate-lock flow that pushes chosen APR terms back to the bank or credit union portal and confirms the hold window inside the concierge workspace.

## 5. Automated Follow-Up Flow

1. **T+0 minutes:** Welcome email (“Your Edmonton Cars Concierge Buyer Plan”) confirming the assigned advocate, sharing shortlists, outlining price-match steps, and highlighting delivery expectations.
2. **T+15 minutes:** SMS (Twilio or MessageBird) with quick replies to confirm a call, upload trade photos, submit competing quotes for price matching, or lock a test drive time.
3. **T+30 minutes:** Automatically send a Calendly invite for the chosen slot, surface solution options (virtual vs showroom vs in-person test drive), and create a follow-up task inside the CRM.
4. **T+1 hour:** Email from the concierge with a payment preview, lender comparisons, accessory pricing, GoAuto benchmarks, and any ongoing price-match confirmations.
5. **Day 2:** Spotlight email featuring a recent buyer win plus an invite to the Buyer Fast Track Clinic, including a note about how we secured the best price.
6. **Day 5:** Re-engagement email sharing price changes, fresh inventory, and limited-time delivery or price-match incentives.

## 6. Deployment and Ops

- **Hosting:** Deploy on Vercel with production and preview environments linked to the Git repo.
- **Environment variables:** `CRM_API_KEY`, `RESEND_API_KEY`, `TWILIO_AUTH`, `OPENAI_API_KEY`, `CALENDLY_ACCESS_TOKEN`.
- **Edge middleware:** Capture UTM parameters and store them as cookies for the serverless function.
- **Monitoring:** Use Vercel Analytics for funnel insights and forward logs to Datadog or Axiom for API visibility.
- **Testing:** Run Playwright end-to-end tests on the multi-step form and Vitest on `useLeadSubmit`.

## 7. Bank Partner Network

- **Preferred lenders:** Maintain live relationships with major banks (BMO, TD, RBC), regional credit unions (Servus, ATB, Connect First), and alternative platforms (CarsFast, LoanConnect, Dealerhop) so the concierge can quote the lowest legitimate APR in minutes.
- **Rate sheet sync:** Refresh partner rate sheets daily, store them in a secure cache, and expose just enough data in the `RateMatchPortal` component to build trust without disclosing proprietary lender details.
- **Escalation lane:** Assign a concierge lead to negotiate exceptions (payment deferrals, loyalty discounts, refinance options) directly with bank reps when a buyer presents a competing offer.
- **Compliance guardrails:** Log every rate quote with lender, timestamp, and expiry window, then surface reminders inside the CRM whenever a lock window is about to lapse.

## 8. Data Privacy and Compliance

- Include a CASL-compliant consent checkbox for email updates.
- Link to unsubscribe options and data usage statements in the footer and every email.
- Store consent timestamps with every lead payload so compliance audits are simple.

## 9. Concierge Add-On Services

- **Finance Advisor Warmline:** Invite visitors to connect with our licensed finance advisors when they need guidance on budgets, refinancing, or lender negotiations so they always feel supported before committing.
- **Remote Starter Specialists:** Offer a direct line to our vetted remote starter installers who can prep vehicles for Edmonton winters and coordinate installation alongside delivery.
- **Audio Concierge Subscription:** Promote our car audio upgrade concierge—sign up for alerts on the latest head units, speaker bundles, and in-dash tech so buyers stay current on the best car information in Edmonton.
