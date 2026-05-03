from flask import Flask, jsonify, request
from flask_cors import CORS
from wumpus_env import WumpusEnvironment
from kb import KnowledgeBase

app = Flask(__name__)
CORS(app)

env = None
kb = None

@app.route("/new_game", methods=["POST"])
def new_game():
    global env, kb
    data = request.json
    rows = data.get("rows", 4)
    cols = data.get("cols", 4)
    env = WumpusEnvironment(rows, cols)
    kb = KnowledgeBase()
    pos = env.agent_pos
    percepts = env.get_percepts(pos)
    neighbors = env.get_neighbors(pos)
    kb.tell_percepts(pos, percepts, neighbors)
    return jsonify({
        "agent": pos,
        "percepts": percepts,
        "visited": [pos],
        "safe_cells": list(kb.safe_cells),
        "inference_steps": kb.inference_steps,
        "rows": rows,
        "cols": cols,
        "game_over": False,
        "message": "Game started!"
    })

@app.route("/move", methods=["POST"])
def move():
    global env, kb
    data = request.json
    new_pos = tuple(data["pos"])

    # Ask KB if safe
    is_safe = kb.ask_safe(new_pos)

    percepts = env.move_agent(new_pos)
    neighbors = env.get_neighbors(new_pos)
    kb.tell_percepts(new_pos, percepts, neighbors)

    game_over = "Fell_In_Pit" in percepts or "Eaten" in percepts
    message = "Safe move!" if is_safe else "Agent took a risk!"
    if "Fell_In_Pit" in percepts:
        message = "💀 Agent fell into a pit!"
    elif "Eaten" in percepts:
        message = "💀 Agent was eaten by the Wumpus!"

    return jsonify({
        "agent": new_pos,
        "percepts": percepts,
        "visited": list(env.visited),
        "safe_cells": list(kb.safe_cells),
        "inference_steps": kb.inference_steps,
        "game_over": game_over,
        "message": message,
        "kb_said_safe": is_safe
    })

@app.route("/suggest", methods=["GET"])
def suggest():
    """Suggest the next best safe move."""
    pos = env.agent_pos
    neighbors = env.get_neighbors(pos)
    unvisited = [n for n in neighbors if n not in env.visited]
    for cell in unvisited:
        if kb.ask_safe(cell):
            return jsonify({"suggested": cell, "reason": "KB proved safe"})
    return jsonify({"suggested": unvisited[0] if unvisited else None, "reason": "No proven safe cell found"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)