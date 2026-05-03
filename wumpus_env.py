import random

class WumpusEnvironment:
    def __init__(self, rows, cols, num_pits=3):
        self.rows = rows
        self.cols = cols
        self.grid = {}
        self.agent_pos = (0, 0)
        self.visited = set()
        self.visited.add((0, 0))
        self._place_hazards(num_pits)

    def _place_hazards(self, num_pits):
        all_cells = [(r, c) for r in range(self.rows) for c in range(self.cols) if (r, c) != (0, 0)]
        positions = random.sample(all_cells, num_pits + 1)
        self.pits = set(positions[:num_pits])
        self.wumpus = positions[num_pits]

    def get_percepts(self, pos):
        r, c = pos
        neighbors = [(r-1,c),(r+1,c),(r,c-1),(r,c+1)]
        neighbors = [(nr,nc) for nr,nc in neighbors if 0<=nr<self.rows and 0<=nc<self.cols]
        percepts = []
        if any(n in self.pits for n in neighbors):
            percepts.append("Breeze")
        if any(n == self.wumpus for n in neighbors):
            percepts.append("Stench")
        if pos in self.pits:
            percepts.append("Fell_In_Pit")
        if pos == self.wumpus:
            percepts.append("Eaten")
        return percepts

    def get_neighbors(self, pos):
        r, c = pos
        neighbors = [(r-1,c),(r+1,c),(r,c-1),(r,c+1)]
        return [(nr,nc) for nr,nc in neighbors if 0<=nr<self.rows and 0<=nc<self.cols]

    def move_agent(self, new_pos):
        self.agent_pos = new_pos
        self.visited.add(new_pos)
        return self.get_percepts(new_pos)

    def get_state(self):
        return {
            "agent": self.agent_pos,
            "visited": list(self.visited),
            "pits": list(self.pits),       # hidden from frontend until confirmed
            "wumpus": list(self.wumpus),
            "rows": self.rows,
            "cols": self.cols
        }