import { FormEvent, useEffect, useMemo, useState } from "react"
import carDataCsv from "../Car Data set/Cars Datasets 2025.csv?raw"

type NavItem = { label: string; id: string }

type CarRecord = {
  make: string
  model: string
  engine: string
  capacity: string
  horsepower: string
  topSpeed: string
  zeroToHundred: string
  price: string
  fuel: string
  seats: string
  torque: string
  year: string | null
}

const CSV_DELIMITER = /,(?=(?:[^"]*"[^"]*")*[^"]*$)/

function stripQuotes(value: string) {
  return value.replace(/^"|"$/g, "").trim()
}

function extractYear(model: string) {
  const match = model.match(/(19|20)\d{2}/)
  return match ? match[0] : null
}

function parseCarData(csv: string): CarRecord[] {
  const [headerLine, ...rows] = csv.trim().split(/\r?\n/)
  if (!headerLine) return []

  return rows
    .map((raw) => raw.trim())
    .filter((line) => Boolean(line))
    .map((line) => line.split(CSV_DELIMITER).map(stripQuotes))
    .map((columns) => {
      const [make, model, engine, capacity, horsepower, topSpeed, zeroToHundred, price, fuel, seats, torque] = columns
      return {
        make,
        model,
        engine,
        capacity,
        horsepower,
        topSpeed,
        zeroToHundred,
        price,
        fuel,
        seats,
        torque,
        year: extractYear(model),
      }
    })
    .filter((record) => record.make && record.model)
}

const navItems: NavItem[] = [
  { label: "Overview", id: "overview" },
  { label: "Value", id: "proof" },
  { label: "Compare", id: "comparison" },
  { label: "Process", id: "process" },
  { label: "FAQ", id: "faq" },
  { label: "Contact", id: "contact" },
]

const highlights = [
  "Verified pricing ranges built from Edmonton sources",
  "Negotiation scripts tailored to your scenario",
  "Your details stay private—never resold as leads",
]

const valueProps = [
  {
    title: "Concise, human insight",
    copy: "A two-page briefing that distills current listings, incentives, and trade chatter into clear actions.",
  },
  {
    title: "Always up to date",
    copy: "We refresh data twice per week so you step into negotiations with fresh numbers, not stale averages.",
  },
  {
    title: "Personal follow-through",
    copy: "We join calls, draft emails, and stay available until the deal is signed and the keys are in hand.",
  },
]

const stats = [
  { label: "Average documented savings", value: "$640" },
  { label: "Listings tracked per week", value: "180+" },
  { label: "Client satisfaction", value: "4.9 / 5" },
]

const processSteps = [
  {
    title: "Share your brief",
    detail: "Tell us the vehicle, timeline, and any listings you are considering. We confirm the scope and deliverables within 24 hours.",
  },
  {
    title: "Review your market file",
    detail: "Within two business days you receive pricing ranges, comparable references, lender notes, and next-step suggestions.",
  },
  {
    title: "Act with confidence",
    detail: "We stay on call for counter-offers, inspection decisions, and lender conversations until you feel settled.",
  },
]

const faqItems = [
  {
    question: "Can I use the service for multiple vehicles?",
    answer: "Yes. We can scope a bundle if you are comparing options or planning purchases for family members.",
  },
  {
    question: "Do you take referral fees from dealers?",
    answer: "No. Our only compensation comes from clients, keeping every recommendation objective and transparent.",
  },
  {
    question: "Do you sell or share my request as a lead?",
    answer:
      "Never. The intake form exists to capture your brief so we can assist you directly—your information is not packaged or sold onward.",
  },
  {
    question: "How do you source your data?",
    answer:
      "We manually log dealer inventory, Facebook Marketplace, auction feeds, and trade-in offers. Each briefing includes citations so you can verify the numbers.",
  },
]

const metadataBySection: Record<string, { title: string; description: string }> = {
  overview: {
    title: "Edmonton Car Market Concierge | Transparent Pricing Briefings",
    description:
      "Secure a fair deal on your next vehicle with hyper-local data, negotiation support, and a minimalist lead experience built for Edmonton drivers.",
  },
  proof: {
    title: "Why Edmonton Drivers Trust Our Market Briefings",
    description:
      "Concise, human-reviewed market intelligence that documents savings, comparable listings, and lenders that match your plan.",
  },
  comparison: {
    title: "Compare Edmonton Vehicles by Make, Model, and Year",
    description:
      "Select a make, filter by year, and line up market specs side by side using the verified dataset we curate in-house.",
  },
  process: {
    title: "How the Edmonton Cars Concierge Process Works",
    description:
      "Submit your brief, review a tailored market file, and move forward with advisors who stay on call through every negotiation.",
  },
  faq: {
    title: "Edmonton Car Buying Concierge FAQ | Pricing, Process, Objectivity",
    description:
      "Get answers about multi-vehicle support, referral policies, and how we verify Edmonton market data for your next purchase.",
  },
  contact: {
    title: "Connect With Edmonton Cars Concierge | Reserve Your Briefing Slot",
    description:
      "Reach the team, confirm availability, and secure a personally guided market briefing for your Edmonton vehicle search.",
  },
}

function updateMetadataForSection(id: string) {
  if (typeof document === "undefined") return
  const key = id.replace(/^#/, "") || "overview"
  const metadata = metadataBySection[key] ?? metadataBySection.overview
  document.title = metadata.title
  const descriptionTag = document.querySelector('meta[name="description"]')
  if (descriptionTag) {
    descriptionTag.setAttribute("content", metadata.description)
  }
}

function scrollToId(id: string) {
  const node = document.getElementById(id)
  if (node) {
    node.scrollIntoView({ behavior: "smooth", block: "start" })
  }
  if (typeof window !== "undefined") {
    const newHash = `#${id}`
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash)
    }
  }
  updateMetadataForSection(id)
}

export default function App() {
  const carRecords = useMemo(() => parseCarData(carDataCsv), [])
  const makes = useMemo(() => Array.from(new Set(carRecords.map((car) => car.make))).sort((a, b) => a.localeCompare(b)), [carRecords])

  const [selectedMake, setSelectedMake] = useState("")
  const [selectedYear, setSelectedYear] = useState("all")
  const [selectedModel, setSelectedModel] = useState("")
  const [comparison, setComparison] = useState<CarRecord[]>([])
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    const hash = window.location.hash.replace(/^#/, "") || "overview"
    updateMetadataForSection(hash)
  }, [])

  useEffect(() => {
    if (!makes.length) return
    setSelectedMake((previous) => {
      if (previous && makes.includes(previous)) {
        return previous
      }
      return makes[0]
    })
  }, [makes])

  const modelsForMake = useMemo(() => carRecords.filter((car) => car.make === selectedMake), [carRecords, selectedMake])
  const availableYears = useMemo(() => {
    const years = new Set<string>()
    modelsForMake.forEach((car) => {
      if (car.year) {
        years.add(car.year)
      }
    })
    return Array.from(years).sort((a, b) => Number(a) - Number(b))
  }, [modelsForMake])

  useEffect(() => {
    if (selectedYear === "all") return
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear("all")
    }
  }, [availableYears, selectedYear])

  const filteredModels = useMemo(
    () =>
      modelsForMake.filter((car) => {
        if (selectedYear === "all") return true
        return car.year === selectedYear
      }),
    [modelsForMake, selectedYear],
  )

  useEffect(() => {
    if (!filteredModels.length) {
      setSelectedModel("")
      return
    }
    setSelectedModel((previous) => {
      if (previous && filteredModels.some((car) => car.model === previous)) {
        return previous
      }
      return filteredModels[0]?.model ?? ""
    })
  }, [filteredModels])

  const handleAddToComparison = () => {
    const car = filteredModels.find((item) => item.model === selectedModel)
    if (!car) return
    setComparison((previous) => {
      if (previous.some((entry) => entry.make === car.make && entry.model === car.model)) {
        return previous
      }
      const next = [...previous, car]
      return next.slice(-3)
    })
  }

  const handleRemoveFromComparison = (car: CarRecord) => {
    setComparison((previous) => previous.filter((entry) => !(entry.make === car.make && entry.model === car.model)))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (status === "sending") return
    setErrorMessage(null)
    setStatus("sending")
    const form = event.currentTarget

    const formData = new FormData(form)
    const name = String(formData.get("name") ?? "").trim()
    const email = String(formData.get("email") ?? "").trim()
    const vehicle = String(formData.get("vehicle") ?? "").trim()

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          vehicle,
          leadSource: "edmonton-cars.ca",
          pipelineStage: "new",
        }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || `Request failed (${response.status})`)
      }

      form.reset()
      setStatus("success")
      window.setTimeout(() => setStatus("idle"), 3500)
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unable to send request. Please try again.")
      window.setTimeout(() => setStatus("idle"), 3500)
    }
  }

  return (
    <div className="page">
      <header className="top-bar">
        <div className="container top-bar__inner">
          <a
            className="brand"
            href="#overview"
            onClick={(event) => {
              event.preventDefault()
              scrollToId("overview")
            }}
          >
            Edmonton Cars Concierge
          </a>
          <nav className="nav">
            {navItems.map((item) => (
              <a
                key={item.id}
                className="nav__link"
                href={`#${item.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToId(item.id)
                }}
              >
                {item.label}
              </a>
            ))}
            <button type="button" className="nav__cta" onClick={() => scrollToId("lead-form")}>
              Request briefing
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        <section id="overview" className="section hero">
          <div className="container hero__layout">
            <div className="hero__copy">
              <span className="pill">Edmonton market intelligence</span>
              <h1>
                Minimalist guidance for buyers who want certainty before signing anything.
              </h1>
              <p>
                Forget bloated funnels and scraped listings. We combine disciplined Edmonton research with a hands-on concierge so the next
                vehicle you buy is priced right and backed by people you trust. This site exists solely to capture your brief so our Edmonton concierge team can respond directly—no lead marketplaces, no reselling.
              </p>
              <ul className="hero__highlights">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <aside id="lead-form" className="hero__cta">
              <div className="card">
                <div className="card__header">
                  <h2>Reserve your market briefing</h2>
                  <p>First come, first served. We confirm within one business day.</p>
                </div>
                <form className="lead-form" onSubmit={handleSubmit}>
                  <label className="form-field">
                    <span>Name</span>
                    <input name="name" type="text" placeholder="Alex Taylor" autoComplete="name" required />
                  </label>
                  <label className="form-field">
                    <span>Email</span>
                    <input name="email" type="email" placeholder="you@edmontonmail.ca" autoComplete="email" required />
                  </label>
                  <label className="form-field">
                    <span>Vehicle or goal</span>
                    <input name="vehicle" type="text" placeholder="2023 Tucson Preferred, budget 35k" />
                  </label>
                  <button className="button button--primary" type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Locking in..." : "Send request"}
                  </button>
                  <p className="form-footnote">No automation. A specialist replies personally with availability and next steps.</p>
                  {status === "success" ? <p className="form-success">Thank you. Check your inbox for confirmation.</p> : null}
                  {status === "error" ? <p className="form-success">{errorMessage ?? "Unable to send request. Please try again."}</p> : null}
                </form>
              </div>
            </aside>
          </div>
        </section>

        <section id="proof" className="section section--alt">
          <div className="container">
            <div className="section__header">
              <span className="pill pill--subtle">Why it works</span>
              <h2>Focused tools, transparent math, and advisors who actually pick up the phone.</h2>
              <p>
                Every briefing carries sources, commentary, and a follow-up plan. We trim away everything that is not essential so you can act
                quickly and confidently.
              </p>
            </div>
            <div className="value-cards">
              {valueProps.map((item) => (
                <div key={item.title} className="value-card">
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </div>
              ))}
            </div>
            <div className="stats">
              {stats.map((stat) => (
                <div key={stat.label} className="stat">
                  <span className="stat__value">{stat.value}</span>
                  <span className="stat__label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="comparison" className="section">
          <div className="container">
            <div className="section__header">
              <span className="pill pill--subtle">Vehicle comparison</span>
              <h2>Line up trims before you commit.</h2>
              <p>Select a make, filter by year, and add up to three models to compare using the dataset we maintain in-house.</p>
            </div>
            <div className="comparison">
              <div className="comparison__controls">
                <label className="comparison__field">
                  <span>Make</span>
                  <select value={selectedMake} onChange={(event) => setSelectedMake(event.target.value)}>
                    {makes.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="comparison__field">
                  <span>Year</span>
                  <select value={selectedYear} onChange={(event) => setSelectedYear(event.target.value)} disabled={!filteredModels.length && !availableYears.length}>
                    <option value="all">All years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="comparison__field comparison__field--grow">
                  <span>Model</span>
                  <select
                    value={selectedModel}
                    onChange={(event) => setSelectedModel(event.target.value)}
                    disabled={!filteredModels.length}
                  >
                    {filteredModels.map((car) => (
                      <option key={`${car.make}-${car.model}`} value={car.model}>
                        {car.model}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className="button button--primary comparison__add"
                  type="button"
                  onClick={handleAddToComparison}
                  disabled={!selectedModel}
                >
                  Add to comparison
                </button>
              </div>
              <p className="comparison__note">
                Data points include factory specifications, price ranges, drivetrain, and acceleration metrics sourced from the provided CSV.
              </p>
              <div className="comparison__table">
                {comparison.length ? (
                  <table>
                    <thead>
                      <tr>
                        <th scope="col">Model</th>
                        <th scope="col">Price</th>
                        <th scope="col">Horsepower</th>
                        <th scope="col">0-100 km/h</th>
                        <th scope="col">Top speed</th>
                        <th scope="col">Fuel</th>
                        <th scope="col">Seats</th>
                        <th scope="col">Torque</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((car) => (
                        <tr key={`${car.make}-${car.model}`}>
                          <td>
                            <div className="comparison__model">
                              <span className="comparison__model-name">{car.model}</span>
                              <span className="comparison__model-meta">
                                {car.make}
                                {car.year ? ` · ${car.year}` : ""}
                              </span>
                              <span className="comparison__model-meta">{car.engine}</span>
                              <button
                                type="button"
                                className="comparison__remove"
                                onClick={() => handleRemoveFromComparison(car)}
                              >
                                Remove
                              </button>
                            </div>
                          </td>
                          <td>{car.price || "-"}</td>
                          <td>{car.horsepower || "-"}</td>
                          <td>{car.zeroToHundred || "-"}</td>
                          <td>{car.topSpeed || "-"}</td>
                          <td>{car.fuel || "-"}</td>
                          <td>{car.seats || "-"}</td>
                          <td>{car.torque || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="comparison__empty">
                    Choose a make, optionally narrow by year, and add models to surface a quick side-by-side.
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="section">
          <div className="container">
            <div className="section__header">
              <span className="pill pill--subtle">Process</span>
              <h2>A calm, three-step flow.</h2>
              <p>We keep the cadence tight and communication direct, so you always know what happens next.</p>
            </div>
            <ol className="timeline">
              {processSteps.map((step, index) => (
                <li key={step.title} className="timeline__item">
                  <div className="timeline__index">{String(index + 1).padStart(2, "0")}</div>
                  <div className="timeline__body">
                    <h3>{step.title}</h3>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="faq" className="section section--alt">
          <div className="container faq">
            <div className="section__header">
              <span className="pill pill--subtle">FAQ</span>
              <h2>Answers before you commit.</h2>
              <p>Still unsure? Reply to any email and we will share recent client examples or coordinate a quick call.</p>
            </div>
            <div className="faq__items">
              {faqItems.map((item) => (
                <details key={item.question} className="faq__item">
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container closing">
            <div className="closing__content">
              <h2>We keep capacity limited on purpose.</h2>
              <p>
                Tell us what you are shopping for, and we will confirm if a slot is available this week. Email us directly at
                <a href="mailto:ky.group.solutions@gmail.com"> ky.group.solutions@gmail.com</a> if you prefer.
              </p>
            </div>
            <button className="button button--ghost" type="button" onClick={() => scrollToId("lead-form")}>
              Reserve my spot
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <p>&copy; {new Date().getFullYear()} Edmonton Cars Concierge. Clarity first.</p>
          <a className="footer__link" href="mailto:ky.group.solutions@gmail.com">
            ky.group.solutions@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}
