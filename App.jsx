import { useState } from "react";
import { newGame, moveAgent, getSuggestion } from "./api";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

:root{
  --bg:#07111f;
  --panel:rgba(15,23,42,0.88);
  --border:rgba(255,255,255,0.07);
  --text:#f8fafc;
  --muted:#94a3b8;
  --primary:#7c3aed;
  --primary2:#4f46e5;
  --green:#10b981;
  --red:#ef4444;
  --blue:#3b82f6;
  --yellow:#f59e0b;
}

body{
  min-height:100vh;
  background:
    radial-gradient(circle at top left, rgba(124,58,237,0.22), transparent 30%),
    linear-gradient(135deg,#020617,#07111f 60%,#0f172a);
  font-family:'Outfit',sans-serif;
  color:var(--text);
  overflow-x:hidden;
}

.wrap{
  max-width:1180px;
  margin:auto;
  padding:18px 16px 30px;
}

/* ---------- HERO ---------- */

.top{
  padding:24px 26px;
  border-radius:24px;
  margin-bottom:16px;
  background:linear-gradient(
    145deg,
    rgba(124,58,237,0.20),
    rgba(15,23,42,0.95)
  );
  border:1px solid var(--border);
  position:relative;
  overflow:hidden;
}

.top::before{
  content:"";
  position:absolute;
  width:180px;
  height:180px;
  border-radius:50%;
  background:rgba(124,58,237,0.22);
  right:-40px;
  top:-40px;
  filter:blur(35px);
}

.top-badge{
  display:inline-block;
  padding:7px 14px;
  border-radius:999px;
  background:rgba(255,255,255,0.06);
  color:#d8b4fe;
  font-size:11px;
  font-weight:600;
  letter-spacing:1px;
  text-transform:uppercase;
  margin-bottom:10px;
}

.top h1{
  font-size:clamp(1.8rem,4vw,2.8rem);
  line-height:1;
  margin-bottom:10px;
  font-weight:700;
}

.top p{
  color:#cbd5e1;
  max-width:650px;
  line-height:1.5;
  font-size:0.92rem;
}

/* ---------- CONTROLS ---------- */

.controls{
  display:flex;
  flex-wrap:wrap;
  align-items:end;
  gap:12px;
  padding:16px;
  border-radius:20px;
  background:var(--panel);
  border:1px solid var(--border);
  margin-bottom:14px;
}

.field{
  display:flex;
  flex-direction:column;
  gap:6px;
}

.field label{
  font-size:11px;
  color:var(--muted);
  letter-spacing:1px;
  text-transform:uppercase;
}

.field input{
  width:74px;
  padding:10px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,0.08);
  background:rgba(255,255,255,0.05);
  color:white;
  outline:none;
  font-family:'JetBrains Mono', monospace;
  font-size:14px;
}

.field input:focus{
  border-color:#8b5cf6;
}

.sep{
  width:1px;
  height:40px;
  background:rgba(255,255,255,0.08);
}

.btn{
  border:none;
  cursor:pointer;
  padding:11px 18px;
  border-radius:14px;
  font-size:14px;
  font-weight:600;
  transition:0.2s;
  font-family:inherit;
}

.btn:hover{
  transform:translateY(-2px);
}

.btn-dark{
  background:linear-gradient(135deg,var(--primary),var(--primary2));
  color:white;
}

.btn-ghost{
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.08);
  color:white;
}

/* ---------- ALERT ---------- */

.alert{
  padding:13px 16px;
  border-radius:14px;
  margin-bottom:14px;
  font-size:14px;
  font-weight:500;
}

.alert-blue{
  background:rgba(59,130,246,0.12);
  color:#93c5fd;
}

.alert-green{
  background:rgba(16,185,129,0.12);
  color:#6ee7b7;
}

.alert-red{
  background:rgba(239,68,68,0.12);
  color:#fca5a5;
}

.alert-amber{
  background:rgba(245,158,11,0.12);
  color:#fcd34d;
}

.gameover-bar{
  padding:14px;
  border-radius:14px;
  margin-bottom:14px;
  background:rgba(239,68,68,0.14);
  color:#fecaca;
  text-align:center;
  font-weight:600;
}

/* ---------- MAIN LAYOUT ---------- */

.layout{
  display:grid;
  grid-template-columns:minmax(0,1fr) 240px;
  gap:16px;
  align-items:start;
}

@media(max-width:900px){
  .layout{
    grid-template-columns:1fr;
  }
}

/* ---------- CARD ---------- */

.card{
  background:var(--panel);
  border-radius:20px;
  padding:16px;
  border:1px solid var(--border);
}

.card-title{
  font-size:12px;
  text-transform:uppercase;
  letter-spacing:1.5px;
  color:#c4b5fd;
  margin-bottom:14px;
  font-weight:700;
}

/* ---------- GRID ---------- */

.grid-box{
  display:grid;
  gap:8px;
  width:100%;
  max-width:700px;
  margin:auto;
}

.cell{
  aspect-ratio:1;
  min-height:68px;
  max-height:95px;
  border-radius:16px;
  background:rgba(255,255,255,0.04);
  border:1px solid rgba(255,255,255,0.06);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:0.18s ease;
  color:rgba(255,255,255,0.55);
  font-family:'JetBrains Mono', monospace;
  font-size:15px;
  font-weight:600;
}

.cell:hover{
  transform:scale(1.03);
  border-color:rgba(255,255,255,0.15);
}

.cell-agent{
  background:linear-gradient(135deg,#8b5cf6,#4f46e5);
  color:white;
  border:none;
  font-size:26px;
  font-weight:700;
  box-shadow:0 8px 18px rgba(124,58,237,0.35);
}

.cell-visited{
  background:rgba(59,130,246,0.14);
  color:#93c5fd;
  border-color:rgba(59,130,246,0.24);
}

.cell-safe{
  background:rgba(16,185,129,0.14);
  color:#6ee7b7;
  border-color:rgba(16,185,129,0.24);
}

/* ---------- LEGEND ---------- */

.legend{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  gap:10px;
  margin-top:14px;
}

.leg{
  display:flex;
  align-items:center;
  gap:6px;
  padding:7px 12px;
  border-radius:999px;
  background:rgba(255,255,255,0.05);
  color:#cbd5e1;
  font-size:12px;
}

.leg-dot{
  width:10px;
  height:10px;
  border-radius:4px;
}

/* ---------- SIDEBAR ---------- */

.sidebar{
  display:flex;
  flex-direction:column;
  gap:14px;
}

/* ---------- QUICK STATS ---------- */

.stats-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
}

.stat-box{
  background:rgba(255,255,255,0.05);
  border-radius:16px;
  padding:14px;
  border:1px solid rgba(255,255,255,0.05);
}

.stat-label{
  color:#94a3b8;
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:1px;
  margin-bottom:8px;
}

.stat-value{
  color:white;
  font-size:1.15rem;
  font-weight:700;
}

/* ---------- STATUS ---------- */

.status-item{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:10px 0;
  border-bottom:1px solid rgba(255,255,255,0.05);
}

.status-item:last-child{
  border-bottom:none;
}

.status-label{
  color:#94a3b8;
  font-size:14px;
}

.status-value{
  font-size:14px;
  font-weight:600;
}

.dot{
  width:9px;
  height:9px;
  border-radius:50%;
  display:inline-block;
  margin-right:6px;
}

.dot-on{
  background:#10b981;
  box-shadow:0 0 10px rgba(16,185,129,0.8);
}

.dot-off{
  background:#64748b;
}

.dot-err{
  background:#ef4444;
  box-shadow:0 0 10px rgba(239,68,68,0.8);
}

/* ---------- TAGS ---------- */

.tag{
  display:inline-flex;
  align-items:center;
  padding:8px 13px;
  border-radius:999px;
  margin:4px;
  font-size:12px;
  font-weight:600;
}

.tag-blue{
  background:rgba(59,130,246,0.15);
  color:#93c5fd;
}

.tag-purple{
  background:rgba(124,58,237,0.15);
  color:#d8b4fe;
}

.tag-gray{
  background:rgba(255,255,255,0.06);
  color:#94a3b8;
}

/* ---------- EMPTY ---------- */

.empty{
  padding:55px 10px;
  text-align:center;
}

.empty-icon{
  font-size:2.5rem;
  margin-bottom:10px;
}

.empty p{
  color:#94a3b8;
}

/* ---------- MOBILE ---------- */

@media(max-width:640px){

  .wrap{
    padding:12px;
  }

  .controls{
    gap:10px;
  }

  .field{
    flex:1;
  }

  .field input{
    width:100%;
  }

  .btn{
    width:100%;
  }

  .sep{
    display:none;
  }

  .stats-grid{
    grid-template-columns:1fr 1fr;
  }

  .cell{
    min-height:52px;
    font-size:12px;
  }

  .cell-agent{
    font-size:20px;
  }
}
`;

export default function App() {

  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  const [state, setState] = useState(null);

  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("blue");

  const startGame = async () => {

    const data = await newGame(rows, cols);

    setState(data);

    setMessage("Agent deployed at (0,0).");
    setMsgType("blue");
  };

  const handleCell = async (r, c) => {

    if (!state || state.game_over) return;

    if (
      state.agent[0] === r &&
      state.agent[1] === c
    ) return;

    const data = await moveAgent([r, c]);

    setState(prev => ({ ...prev, ...data }));

    if (data.game_over) {
      setMessage(data.message);
      setMsgType("red");

    } else if (data.kb_said_safe) {
      setMessage("Safe move confirmed by KB.");
      setMsgType("green");

    } else {
      setMessage(data.message);
      setMsgType("amber");
    }
  };

  const handleSuggest = async () => {

    const data = await getSuggestion();

    if (data.suggested) {

      setMessage(
        `Suggested move → (${data.suggested[0]}, ${data.suggested[1]})`
      );

      setMsgType("green");

    } else {

      setMessage("No provably safe move found.");
      setMsgType("red");
    }
  };

  const cellClass = (r, c) => {

    if (!state) return "cell";

    if (
      state.agent[0] === r &&
      state.agent[1] === c
    ) {
      return "cell cell-agent";
    }

    if (
      state.visited.some(
        ([vr, vc]) => vr === r && vc === c
      )
    ) {
      return "cell cell-visited";
    }

    if (
      state.safe_cells.some(
        ([sr, sc]) => sr === r && sc === c
      )
    ) {
      return "cell cell-safe";
    }

    return "cell";
  };

  const alive = state && !state.game_over;

  return (
    <>
      <style>{css}</style>

      <div className="wrap">

        {/* HERO */}
        <div className="top">

          <div className="top-badge">
            AI Logic Simulation
          </div>

          <h1>Wumpus Logic Agent</h1>
        </div>

        {/* CONTROLS */}
        <div className="controls">

          <div className="field">

            <label>Rows</label>

            <input
              type="number"
              value={rows}
              min={2}
              max={8}
              onChange={(e) =>
                setRows(+e.target.value)
              }
            />
          </div>

          <div className="field">

            <label>Cols</label>

            <input
              type="number"
              value={cols}
              min={2}
              max={8}
              onChange={(e) =>
                setCols(+e.target.value)
              }
            />
          </div>

          <div className="sep" />

          <button
            className="btn btn-dark"
            onClick={startGame}
          >
            New Game
          </button>

          {alive && (
            <button
              className="btn btn-ghost"
              onClick={handleSuggest}
            >
              Suggest Move
            </button>
          )}
        </div>

        {/* MESSAGE */}
        {message && (
          <div className={`alert alert-${msgType}`}>
            {message}
          </div>
        )}

        {/* GAME OVER */}
        {state?.game_over && (
          <div className="gameover-bar">
            Game Over — Start a new game
          </div>
        )}

        {/* MAIN */}
        <div className="layout">

          {/* GRID */}
          <div className="card">

            <div className="card-title">
              Navigation Grid
            </div>

            {!state ? (

              <div className="empty">

                <div className="empty-icon">
                  ◈
                </div>

                <p>
                  Configure the board and start the simulation
                </p>
              </div>

            ) : (
              <>
                <div
                  className="grid-box"
                  style={{
                    gridTemplateColumns:
                      `repeat(${state.cols}, 1fr)`
                  }}
                >

                  {Array.from(
                    { length: state.rows },
                    (_, r) =>
                      Array.from(
                        { length: state.cols },
                        (_, c) => (

                          <div
                            key={`${r}-${c}`}
                            className={cellClass(r, c)}
                            onClick={() =>
                              handleCell(r, c)
                            }
                          >
                            {
                              state.agent[0] === r &&
                              state.agent[1] === c
                                ? "◆"
                                : `${r},${c}`
                            }
                          </div>
                        )
                      )
                  )}
                </div>

                <div className="legend">

                  <div className="leg">
                    <div
                      className="leg-dot"
                      style={{
                        background:
                          "linear-gradient(135deg,#8b5cf6,#4f46e5)"
                      }}
                    />
                    Agent
                  </div>

                  <div className="leg">
                    <div
                      className="leg-dot"
                      style={{
                        background:"#3b82f6"
                      }}
                    />
                    Visited
                  </div>

                  <div className="leg">
                    <div
                      className="leg-dot"
                      style={{
                        background:"#10b981"
                      }}
                    />
                    Safe
                  </div>

                </div>
              </>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="sidebar">

            {/* QUICK STATS */}
            <div className="card">

              <div className="card-title">
                Quick Stats
              </div>

              <div className="stats-grid">

                <div className="stat-box">
                  <div className="stat-label">
                    Position
                  </div>

                  <div className="stat-value">
                    {state
                      ? `(${state.agent[0]},${state.agent[1]})`
                      : "--"}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-label">
                    Visited
                  </div>

                  <div className="stat-value">
                    {state
                      ? state.visited.length
                      : "--"}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-label">
                    Safe
                  </div>

                  <div className="stat-value">
                    {state
                      ? state.safe_cells.length
                      : "--"}
                  </div>
                </div>

                <div className="stat-box">
                  <div className="stat-label">
                    Inference
                  </div>

                  <div className="stat-value">
                    {state
                      ? state.inference_steps
                      : "--"}
                  </div>
                </div>

              </div>
            </div>

            {/* PERCEPTS */}
            <div className="card">

              <div className="card-title">
                Percepts
              </div>

              {!state ? (

                <span className="tag tag-gray">
                  No Data
                </span>

              ) : state.percepts?.length > 0 ? (

                state.percepts.map((p, i) => (

                  <span
                    key={i}
                    className={`tag ${
                      p === "Breeze"
                        ? "tag-blue"
                        : "tag-purple"
                    }`}
                  >
                    {
                      p === "Breeze"
                        ? "≋ Breeze"
                        : "◎ Stench"
                    }
                  </span>
                ))

              ) : (

                <span className="tag tag-gray">
                  Clear Area
                </span>
              )}
            </div>

            {/* STATUS */}
            <div className="card">

              <div className="card-title">
                System Status
              </div>

              <div className="status-item">

                <div className="status-label">
                  Agent
                </div>

                <div className="status-value">

                  <span
                    className={`dot ${
                      !state
                        ? "dot-off"
                        : alive
                        ? "dot-on"
                        : "dot-err"
                    }`}
                  />

                  {
                    !state
                      ? "Idle"
                      : alive
                      ? "Active"
                      : "Dead"
                  }
                </div>
              </div>

              <div className="status-item">

                <div className="status-label">
                  KB Engine
                </div>

                <div className="status-value">

                  <span
                    className={`dot ${
                      state
                        ? "dot-on"
                        : "dot-off"
                    }`}
                  />

                  {
                    state
                      ? "Running"
                      : "Standby"
                  }
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}