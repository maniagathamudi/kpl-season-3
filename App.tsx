
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";

type Page =
  | "Home"
  | "Teams"
  | "Auction"
  | "Fixtures"
  | "Standings"
  | "KPL History";

type Team = {
  id: number;
  name: string;
  short: string;
  color: string;
  owner: string;
  titles: number;
};

type Match = {
  id: number;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "UPCOMING" | "COMPLETED";
};

const initialTeams: Team[] = [
  {
    id: 1,
    name: "Lab Titans",
    short: "LT",
    color: "#efbd49",
    owner: "Lokesh",
    titles: 1,
  },
  {
    id: 2,
    name: "Colony Super Kings",
    short: "CSK",
    color: "#55c7a5",
    owner: "Ravi Kumar",
    titles: 1,
  },
  {
    id: 3,
    name: "KTB Royal Kings",
    short: "KRK",
    color: "#a58bff",
    owner: "Nagaraju",
    titles: 0,
  },
  {
    id: 4,
    name: "Budwisers",
    short: "BW",
    color: "#ff796b",
    owner: "Sai",
    titles: 0,
  },
  {
    id: 5,
    name: "KTB Hitters",
    short: "KH",
    color: "#75b8ff",
    owner: "Mohan",
    titles: 0,
  },
];

const initialMatches: Match[] = [];

const pages: Page[] = [
  "Home",
  "Teams",
  "Auction",
  "Fixtures",
  "Standings",
  "KPL History",
];

function App() {
  const [activePage, setActivePage] = useState<Page>("Home");

  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [matches, setMatches] = useState<Match[]>(initialMatches);

  const [adminOpen, setAdminOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [selectedTeam, setSelectedTeam] = useState("Lab Titans");
  const [ownerName, setOwnerName] = useState("");

  const [newHome, setNewHome] = useState("Lab Titans");
  const [newAway, setNewAway] = useState("Colony Super Kings");

  const [selectedMatch, setSelectedMatch] = useState<number | "">("");

  const [homeScore, setHomeScore] = useState("");
  const [awayScore, setAwayScore] = useState("");

  const [message, setMessage] = useState("");

  // Alphabetical team sorting for Home and Teams pages.
  const sortedTeams = [...teams].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const navigate = (page: Page) => {
    setActivePage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Update franchise owner.
  const updateOwner = () => {
    if (!ownerName.trim()) {
      setMessage("Please enter the franchise owner's name.");
      return;
    }

    setTeams((current) =>
      current.map((team) =>
        team.name === selectedTeam
          ? { ...team, owner: ownerName.trim() }
          : team
      )
    );

    setOwnerName("");
    setMessage("Franchise owner updated.");
  };

  // Add new fixture.
  const addFixture = () => {
    if (!newHome || !newAway || newHome === newAway) {
      setMessage("Please select two different teams.");
      return;
    }

    const nextId =
      matches.length > 0
        ? Math.max(...matches.map((match) => match.id)) + 1
        : 1;

    const newMatch: Match = {
      id: nextId,
      home: newHome,
      away: newAway,
      homeScore: null,
      awayScore: null,
      status: "UPCOMING",
    };

    setMatches((current) => [...current, newMatch]);

    setSelectedMatch(nextId);
    setMessage("Fixture added and published.");
  };

  // Update match result.
  const updateResult = () => {
    if (selectedMatch === "") {
      setMessage("Please add a fixture first.");
      return;
    }

    if (
      homeScore.trim() === "" ||
      awayScore.trim() === "" ||
      !Number.isFinite(Number(homeScore)) ||
      !Number.isFinite(Number(awayScore)) ||
      Number(homeScore) < 0 ||
      Number(awayScore) < 0
    ) {
      setMessage("Enter valid scores for both teams.");
      return;
    }

    setMatches((current) =>
      current.map((match) =>
        match.id === selectedMatch
          ? {
              ...match,
              homeScore: Number(homeScore),
              awayScore: Number(awayScore),
              status: "COMPLETED",
            }
          : match
      )
    );

    setHomeScore("");
    setAwayScore("");

    setMessage("Match result updated.");
  };

  // Common section heading.
  const sectionTitle = (
    eyebrow: string,
    title: string,
    description: string
  ) => (
    <div className="section-heading">
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );

  // Team card.
  const teamCard = (team: Team) => (
    <article className="team-card" key={team.id}>
      <div className="team-top">
        <span className="team-number">
          TEAM {String(team.id).padStart(2, "0")}
        </span>

        <span
          className="team-crest"
          style={{ "--team": team.color } as CSSProperties}
        >
          {team.short}
        </span>
      </div>

      <h3>
        {team.name}

        {team.titles > 0 && (
          <span
            title="KPL title winner"
            style={{
              color: "#efbd49",
              marginLeft: 8,
            }}
          >
            ★
          </span>
        )}
      </h3>

      <p>{team.owner}</p>

      <div className="team-card-bottom">
        <span>
          TITLES <b>{team.titles}</b>
        </span>

        <span>
          STATUS{" "}
          <b>{team.titles > 0 ? "CHAMPION" : "CONTENDER"}</b>
        </span>
      </div>
    </article>
  );

  // Match card.
  const matchCard = (match: Match) => (
    <article className="match-card" key={match.id}>
      <div className="match-meta">
        <span className="match-round">
          MATCH {String(match.id).padStart(2, "0")} · GROUP STAGE
        </span>

        <span className="match-status">{match.status}</span>
      </div>

      <div className="match-body">
        <div className="match-team">
          <strong>{match.home}</strong>
        </div>

        <div className="match-score">
          {match.status === "COMPLETED" ? (
            <strong>
              {match.homeScore} - {match.awayScore}
            </strong>
          ) : (
            <span>VS</span>
          )}

          <small>
            {match.status === "COMPLETED"
              ? "FULL TIME"
              : "DATE TBD"}
          </small>
        </div>

        <div className="match-team away">
          <strong>{match.away}</strong>
        </div>
      </div>

      <div className="match-foot">
        <span>Pongal 2027 · Date to be announced</span>
        <span>Kuntibhadra Cricket Ground</span>
      </div>
    </article>
  );

  // Fixtures announcement.
  const fixtureAnnouncement = () => (
    <section className="section dark-section fixtures-announcement">
      <div className="announcement-content">
        <div className="announcement-icon">🏏</div>

        <div className="eyebrow">
          KUNTIBHADRA PREMIER LEAGUE · SEASON 03
        </div>

        <h2>
          The fixtures
          <br />
          <em>are coming.</em>
        </h2>

        <p>
          Five teams. One village. One prestigious trophy.
          The official KPL 2027 match schedule will be
          announced three days before the tournament begins.
        </p>

        <div className="announcement-badge">
          <span className="live-dot" />
          FIXTURES TO BE ANNOUNCED
        </div>

        <div className="announcement-details">
          <div>
            <strong>05</strong>
            <span>TEAMS</span>
          </div>

          <div>
            <strong>03</strong>
            <span>DAYS BEFORE RELEASE</span>
          </div>

          <div>
            <strong>2027</strong>
            <span>PONGAL SEASON</span>
          </div>
        </div>

        <button
          className="btn btn-ghost"
          onClick={() => navigate("Teams")}
        >
          MEET THE FIVE TEAMS →
        </button>
      </div>
    </section>
  );

  // NEW AUCTION PAGE.
  const auction = () => (
    <section className="section dark-section">
      {sectionTitle(
        "KUNTIBHADRA PREMIER LEAGUE · SEASON 03",
        "The Player Auction.",
        "Your opportunity to become part of Kuntibhadra Premier League starts here."
      )}

      {/* Auction hero */}
      <div
        className="legacy-feature"
        style={{
          textAlign: "center",
          padding: "55px 25px",
          marginBottom: 25,
          borderColor: "rgba(239, 189, 73, 0.35)",
        }}
      >
        <div
          className="legacy-icon"
          style={{ fontSize: 45, marginBottom: 20 }}
        >
          🏏
        </div>

        <div className="eyebrow">
          OFFICIAL KPL SEASON 03 PLAYER AUCTION
        </div>

        <h2
          style={{
            fontSize: "clamp(35px, 6vw, 65px)",
            margin: "20px 0",
            color: "#efbd49",
          }}
        >
          15 NOVEMBER 2026
        </h2>

        <p>
          The battle begins. Five franchises. One auction.
          Your chance to become a KPL player.
        </p>

        <div
          className="announcement-badge"
          style={{
            margin: "25px auto 0",
            width: "fit-content",
          }}
        >
          <span className="live-dot" />
          AUCTION DAY · 15 NOVEMBER 2026
        </div>
      </div>

      {/* Auction information cards */}
      <div className="legacy-grid">

        {/* Registration Fee */}
        <article className="legacy-feature">
          <div className="legacy-icon">💰</div>

          <span>PLAYER REGISTRATION</span>

          <h3>₹500</h3>

          <p>
            Every player must pay ₹500 as the registration
            fee to participate in the KPL player auction.
          </p>

          <span className="coming">
            REGISTRATION FEE · ₹500
          </span>
        </article>

        {/* Unlimited Slots */}
        <article className="legacy-note">
          <div className="legacy-icon">♾️</div>

          <span>REGISTRATION OPPORTUNITY</span>

          <h3>Unlimited Slots</h3>

          <p>
            There is no limit on the number of player
            registrations. Every interested player
            gets an opportunity to register.
          </p>

          <span className="coming">
            UNLIMITED REGISTRATION SLOTS
          </span>
        </article>

        {/* Refund Policy */}
        <article className="legacy-feature">
          <div className="legacy-icon">🛡️</div>

          <span>PLAYER REFUND POLICY</span>

          <h3>100% Refund</h3>

          <p>
            Players who remain unsold in the auction
            will receive a full refund of their
            ₹500 registration fee.
          </p>

          <span className="coming">
            FULL REFUND FOR UNSOLD PLAYERS
          </span>
        </article>

      </div>

      {/* Refund information */}
      <div
        className="legacy-feature"
        style={{
          marginTop: 25,
          textAlign: "center",
          borderColor: "rgba(85, 199, 165, 0.4)",
        }}
      >
        <div className="legacy-icon">🏆</div>

        <span>OUR AUCTION PROMISE</span>

        <h3>
          Your Passion. Your Opportunity.
        </h3>

        <p>
          Register for the KPL Season 03 auction and
          get an opportunity to represent one of
          the five Kuntibhadra franchises.
        </p>

        <p>
          Unsold players will receive their full
          registration fee back.
        </p>
      </div>

      {/* Participating teams */}
      <section style={{ marginTop: 65 }}>
        {sectionTitle(
          "FIVE FRANCHISES",
          "Choose your dream team.",
          "Five franchises are ready to build their squads for KPL Season 03."
        )}

        <div className="team-grid">
          {sortedTeams.map(teamCard)}
        </div>
      </section>

      {/* Final announcement */}
      <div
        className="announcement-content"
        style={{
          textAlign: "center",
          margin: "70px auto 20px",
          maxWidth: 750,
        }}
      >
        <div className="announcement-icon">🏆</div>

        <div className="eyebrow">
          KUNTIBHADRA PREMIER LEAGUE
        </div>

        <h2>
          Your Game.
          <br />
          <em>Your Opportunity.</em>
        </h2>

        <p>
          Get ready for the biggest cricket auction
          in Kuntibhadra.
        </p>

        <div className="announcement-badge">
          <span className="live-dot" />
          AUCTION STARTS · 15 NOVEMBER 2026
        </div>
      </div>
    </section>
  );

  // KPL History.
  const history = () => (
    <section className="section dark-section">
      {sectionTitle(
        "THREE CHAMPIONSHIPS. ONE LEGACY.",
        "The KPL story.",
        "Celebrating the champions and unforgettable moments of Kuntibhadra Premier League."
      )}

      <div className="legacy-grid">
        <article className="legacy-feature">
          <div className="legacy-icon">♛</div>

          <span>SEASON 01 · PONGAL 2024</span>

          <h3>Lab Titans — The First Kings of KPL.</h3>

          <p>
            History was created when Lab Titans became
            the first-ever champions of Kuntibhadra
            Premier League.
          </p>

          <p>
            The inaugural tournament also featured
            Labbaru Banthi, who were dropped before
            the second edition.
          </p>

          <span className="coming">
            🏆 FIRST-EVER KPL CHAMPIONS
          </span>
        </article>

        <article className="legacy-note">
          <div className="legacy-icon">🏆</div>

          <span>SEASON 02 · PONGAL 2025</span>

          <h3>Colony Super Kings — A New Era.</h3>

          <p>
            Colony Super Kings joined KPL in its
            second edition and won the championship
            in their debut season.
          </p>

          <span className="coming">
            🏆 SEASON 02 CHAMPIONS
          </span>
        </article>

        <article className="legacy-feature">
          <div className="legacy-icon">♨</div>

          <span>SEASON 03 · PONGAL 2027</span>

          <h3>The Battle for the Third Crown.</h3>

          <p>
            Five teams. One village. One prestigious
            trophy. A new chapter awaits in the
            third edition of KPL.
          </p>

          <span className="coming">
            CHAMPION TO BE CROWNED
          </span>
        </article>
      </div>
    </section>
  );

  // Standings page - alphabetical order.
  const standings = () => {
    const table = teams
      .map((team) => {
        const played = matches.filter(
          (match) =>
            match.status === "COMPLETED" &&
            (match.home === team.name ||
              match.away === team.name)
        );

        const wins = played.filter((match) => {
          if (
            match.homeScore === null ||
            match.awayScore === null
          ) {
            return false;
          }

          return match.home === team.name
            ? match.homeScore > match.awayScore
            : match.awayScore > match.homeScore;
        }).length;

        const losses = played.filter((match) => {
          if (
            match.homeScore === null ||
            match.awayScore === null
          ) {
            return false;
          }

          return match.home === team.name
            ? match.homeScore < match.awayScore
            : match.awayScore < match.homeScore;
        }).length;

        return {
          ...team,
          played: played.length,
          wins,
          losses,
          points: wins * 2,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return (
      <section className="section dark-section">
        {sectionTitle(
          "THE TABLE",
          "Points that matter.",
          "Teams are displayed in alphabetical order. Match statistics update when the organizer enters results."
        )}

        <div className="table-wrap">
          <table className="standings">
            <thead>
              <tr>
                <th>POS</th>
                <th>TEAM</th>
                <th>P</th>
                <th>W</th>
                <th>L</th>
                <th>PTS</th>
              </tr>
            </thead>

            <tbody>
              {table.map((team, index) => (
                <tr key={team.id}>
                  <td>
                    {String(index + 1).padStart(2, "0")}
                  </td>

                  <td>
                    {team.name}

                    {team.titles > 0 && (
                      <span
                        style={{
                          color: "#efbd49",
                          marginLeft: 8,
                        }}
                      >
                        ★
                      </span>
                    )}
                  </td>

                  <td>{team.played}</td>
                  <td>{team.wins}</td>
                  <td>{team.losses}</td>
                  <td className="points">{team.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  // Home page.
  const home = () => (
    <>
      <section className="hero">
        <div className="hero-image" />
        <div className="hero-vignette" />

        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot" />
            KUNTIBHADRA PREMIER LEAGUE · SEASON 03
          </div>

          <h1>
            ONE VILLAGE.
            <br />
            <em>ONE TROPHY.</em>
            <br />
            ETERNAL PRIDE.
          </h1>

          <p className="hero-copy">
            Where friendships become rivalries, local
            heroes rise, and every run carries the
            pride of our village.
          </p>

          <div className="hero-actions">
            <button
              className="btn btn-gold"
              onClick={() => navigate("Fixtures")}
            >
              EXPLORE FIXTURES →
            </button>

            <button
              className="btn btn-ghost"
              onClick={() => navigate("Teams")}
            >
              MEET THE TEAMS
            </button>
          </div>

          <div className="hero-caption">
            <span className="caption-line" />
            THE SPIRIT OF KUNTIBHADRA
            <span className="caption-year">
              PONGAL · 2027
            </span>
          </div>
        </div>

        <div className="hero-side-label">
          EST. IN PRIDE · BUILT BY THE VILLAGE
        </div>
      </section>

      <div className="ticker">
        <div className="ticker-track">
          <span>
            VILLAGE PRIDE ✳ CRICKET PASSION ✳
            PONGAL TRADITION ✳ ONE CHAMPION ✳
          </span>

          <span>
            VILLAGE PRIDE ✳ CRICKET PASSION ✳
            PONGAL TRADITION ✳ ONE CHAMPION ✳
          </span>
        </div>
      </div>

      <section className="section intro">
        <div>
          <div className="eyebrow muted">
            A TRADITION THAT BRINGS US TOGETHER
          </div>

          <h2>
            IT'S NOT JUST
            <br />
            <em>A GAME.</em>
          </h2>
        </div>

        <div className="intro-copy">
          <p>
            Every Pongal, our ground becomes the heart
            of Kuntibhadra. The cheers, the last-over
            finishes, and unforgettable catches become
            memories our village carries for years.
          </p>

          <p>
            Welcome to the next chapter of our cricket story.
          </p>

          <button
            className="text-link"
            onClick={() => navigate("KPL History")}
          >
            DISCOVER OUR LEGACY ↘
          </button>
        </div>
      </section>

      {/* Alphabetical teams on Home page */}
      <section className="section dark-section">
        {sectionTitle(
          "THE KPL CONTENDERS",
          "The village is ready.",
          "Five teams. One dream. Meet the teams chasing Pongal glory."
        )}

        <div className="team-grid">
          {sortedTeams.map(teamCard)}
        </div>

        <button
          className="text-link"
          onClick={() => navigate("Teams")}
        >
          ALL TEAMS →
        </button>
      </section>

      <section className="section fixtures-preview">
        {sectionTitle(
          "THE ROAD TO THE FINAL",
          "Match centre",
          "The official fixtures will be released three days before KPL begins."
        )}

        {matches.length > 0 ? (
          <div className="match-list">
            {matches.slice(0, 2).map(matchCard)}
          </div>
        ) : (
          <div className="announcement-badge">
            <span className="live-dot" />
            FIXTURES TO BE ANNOUNCED
          </div>
        )}

        <button
          className="text-link"
          onClick={() => navigate("Fixtures")}
        >
          VIEW FIXTURE UPDATE →
        </button>
      </section>

      {history()}

      <section className="final-cta">
        <div className="cta-glow" />

        <div className="eyebrow">
          THIS PONGAL, HISTORY AWAITS
        </div>

        <h2>
          ONE VILLAGE.
          <br />
          <em>ONE CHAMPION.</em>
        </h2>

        <p>
          Five teams. One trophy. An unforgettable
          Kuntibhadra Pongal.
        </p>

        <button
          className="btn btn-gold"
          onClick={() => navigate("Fixtures")}
        >
          FOLLOW THE JOURNEY →
        </button>
      </section>
    </>
  );

  // Page navigation.
  const content = () => {
    switch (activePage) {
      case "Home":
        return home();

      case "Teams":
        return (
          <section className="section dark-section">
            {sectionTitle(
              "THE CONTENDERS",
              "Five teams. One village.",
              "Meet the teams competing for KPL glory."
            )}

            {/* Alphabetical team cards */}
            <div className="team-grid">
              {sortedTeams.map(teamCard)}
            </div>
          </section>
        );

      case "Auction":
        return auction();

      case "Fixtures":
        return matches.length > 0 ? (
          <section className="section dark-section">
            {sectionTitle(
              "THE ROAD TO THE FINAL",
              "Match centre",
              "Official KPL fixtures and results."
            )}

            <div className="match-list">
              {matches.map(matchCard)}
            </div>
          </section>
        ) : (
          fixtureAnnouncement()
        );

      case "Standings":
        return standings();

      case "KPL History":
        return history();

      default:
        return home();
    }
  };

  // Main website layout.
  return (
    <div className="app-shell">
      <header className="navbar">
        <button
          className="brand"
          onClick={() => navigate("Home")}
        >
          <span className="brand-mark">🏆</span>

          <span className="brand-copy">
            <b>KUNTIBHADRA</b>
            <small>PREMIER LEAGUE · KPL</small>
          </span>
        </button>

        <nav className="desktop-nav">
          {pages.map((page) => (
            <button
              key={page}
              className={`nav-item ${
                activePage === page ? "active" : ""
              }`}
              onClick={() => navigate(page)}
            >
              {page}
            </button>
          ))}
        </nav>

        <div className="nav-right">
          <span className="season-tag">
            <span /> KPL · SEASON 03
          </span>

          <button
            className="admin-btn"
            onClick={() => setAdminOpen(true)}
          >
            ORGANIZER →
          </button>

          <button
            className="mobile-menu"
            onClick={() =>
              setMenuOpen((open) => !open)
            }
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <nav className="mobile-nav">
            {pages.map((page) => (
              <button
                key={page}
                onClick={() => navigate(page)}
              >
                {page}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main>{content()}</main>

      <footer className="footer">
        <div className="brand footer-brand">
          <span className="brand-mark">🏆</span>

          <span className="brand-copy">
            <b>KUNTIBHADRA</b>
            <small>PREMIER LEAGUE · KPL</small>
          </span>
        </div>

        <p>
          BUILT WITH VILLAGE PRIDE · ONE VILLAGE. ONE TROPHY.
        </p>

        <span className="footer-year">
          PONGAL · 2027
        </span>
      </footer>

      <div className="api-indicator">
        <span className="status-dot" />
        PREVIEW MODE
      </div>

      {/* Organizer modal */}
      {adminOpen && (
        <div
          className="modal-backdrop"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setAdminOpen(false);
              setMessage("");
            }
          }}
        >
          <section className="admin-modal">
            <div className="modal-head">
              <div>
                <div className="eyebrow">
                  KPL MANAGEMENT
                </div>

                <h2>Organizer desk.</h2>
              </div>

              <button
                className="icon-btn"
                onClick={() => {
                  setAdminOpen(false);
                  setMessage("");
                }}
              >
                ✕
              </button>
            </div>

            {!loggedIn ? (
              <form
                className="login-form"
                onSubmit={(
                  event: FormEvent<HTMLFormElement>
                ) => {
                  event.preventDefault();

                  if (password === "kpl2027") {
                    setLoggedIn(true);
                    setMessage("");
                  } else {
                    setMessage("Incorrect demo password.");
                  }

                  setPassword("");
                }}
              >
                <p>
                  Enter the demo password to open
                  organizer controls.
                </p>

                <label htmlFor="password">
                  DEMO PASSWORD
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                />

                <button
                  className="btn btn-gold"
                  type="submit"
                >
                  OPEN ORGANIZER →
                </button>

                <p className="modal-foot">
                  Demo password: kpl2027
                </p>
              </form>
            ) : (
              <div className="admin-tools">
                <h3>Franchise owner</h3>

                <label htmlFor="team">
                  SELECT TEAM
                </label>

                <select
                  id="team"
                  value={selectedTeam}
                  onChange={(event) =>
                    setSelectedTeam(event.target.value)
                  }
                >
                  {teams.map((team) => (
                    <option
                      key={team.id}
                      value={team.name}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="owner">
                  OWNER NAME
                </label>

                <input
                  id="owner"
                  value={ownerName}
                  onChange={(event) =>
                    setOwnerName(event.target.value)
                  }
                  placeholder="Enter franchise owner"
                />

                <button
                  className="btn btn-gold"
                  onClick={updateOwner}
                >
                  SAVE OWNER
                </button>

                <h3>Publish a fixture</h3>

                <label htmlFor="new-home">
                  HOME TEAM
                </label>

                <select
                  id="new-home"
                  value={newHome}
                  onChange={(event) =>
                    setNewHome(event.target.value)
                  }
                >
                  {teams.map((team) => (
                    <option
                      key={team.id}
                      value={team.name}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="new-away">
                  AWAY TEAM
                </label>

                <select
                  id="new-away"
                  value={newAway}
                  onChange={(event) =>
                    setNewAway(event.target.value)
                  }
                >
                  {teams.map((team) => (
                    <option
                      key={team.id}
                      value={team.name}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>

                <button
                  className="btn btn-gold"
                  onClick={addFixture}
                >
                  PUBLISH FIXTURE
                </button>

                <h3>Update match result</h3>

                <label htmlFor="match">
                  SELECT MATCH
                </label>

                <select
                  id="match"
                  value={selectedMatch}
                  disabled={matches.length === 0}
                  onChange={(event) =>
                    setSelectedMatch(
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value)
                    )
                  }
                >
                  <option value="">
                    Select a fixture
                  </option>

                  {matches.map((match) => (
                    <option
                      key={match.id}
                      value={match.id}
                    >
                      {match.home} vs {match.away}
                    </option>
                  ))}
                </select>

                <div className="score-inputs">
                  <div>
                    <label htmlFor="home-score">
                      HOME SCORE
                    </label>

                    <input
                      id="home-score"
                      type="number"
                      min="0"
                      value={homeScore}
                      onChange={(event) =>
                        setHomeScore(event.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label htmlFor="away-score">
                      AWAY SCORE
                    </label>

                    <input
                      id="away-score"
                      type="number"
                      min="0"
                      value={awayScore}
                      onChange={(event) =>
                        setAwayScore(event.target.value)
                      }
                    />
                  </div>
                </div>

                <button
                  className="btn btn-gold"
                  onClick={updateResult}
                  disabled={matches.length === 0}
                >
                  SAVE RESULT
                </button>

                {message && (
                  <p className="notice">{message}</p>
                )}

                <p className="modal-foot">
                  Demo mode: changes are kept in page
                  memory and reset when you refresh.
                  This is not secure authentication
                  and is not connected to FastAPI
                  or a database.
                </p>

                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setLoggedIn(false);
                    setMessage("");
                  }}
                >
                  LOG OUT
                </button>
              </div>
            )}

            {message && !loggedIn && (
              <p className="notice">{message}</p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
