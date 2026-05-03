from itertools import combinations

class KnowledgeBase:
    def __init__(self):
        self.clauses = set()        # set of frozensets (CNF clauses)
        self.inference_steps = 0
        self.safe_cells = set()
        self.dangerous_cells = set()

    def tell_percepts(self, pos, percepts, neighbors):
        """Add rules to KB based on percepts at pos."""
        r, c = pos

        if "Breeze" not in percepts:
            # No breeze → no pit in any neighbor
            for nr, nc in neighbors:
                lit = f"P_{nr}_{nc}"
                self.clauses.add(frozenset([f"NOT_{lit}"]))
                self.safe_cells.add((nr, nc))
        else:
            # Breeze → at least one neighbor has a pit
            pit_clause = frozenset([f"P_{nr}_{nc}" for nr, nc in neighbors])
            self.clauses.add(pit_clause)

        if "Stench" not in percepts:
            for nr, nc in neighbors:
                lit = f"W_{nr}_{nc}"
                self.clauses.add(frozenset([f"NOT_{lit}"]))
                self.safe_cells.add((nr, nc))
        else:
            wumpus_clause = frozenset([f"W_{nr}_{nc}" for nr, nc in neighbors])
            self.clauses.add(wumpus_clause)

    def resolve(self, c1, c2):
        """Try to resolve two clauses; return resolvents."""
        resolvents = []
        for lit in c1:
            neg = lit[4:] if lit.startswith("NOT_") else f"NOT_{lit}"
            if neg in c2:
                new_clause = (c1 - {lit}) | (c2 - {neg})
                resolvents.append(frozenset(new_clause))
        return resolvents

    def ask_safe(self, pos):
        """
        Resolution Refutation: prove ¬P_r_c ∧ ¬W_r_c
        Returns True if cell is provably safe.
        """
        r, c = pos
        pit_lit = f"P_{r}_{c}"
        wumpus_lit = f"W_{r}_{c}"

        safe_from_pit = self._refute(pit_lit)
        safe_from_wumpus = self._refute(wumpus_lit)
        return safe_from_pit and safe_from_wumpus

    def _refute(self, literal):
        """
        Try to derive contradiction from KB + {literal} (negation of what we want to prove).
        Returns True if contradiction found (i.e., literal is provably false).
        """
        # Add negation of what we want to disprove
        neg_literal = literal[4:] if literal.startswith("NOT_") else f"NOT_{literal}"
        assumption = frozenset([neg_literal])

        working_clauses = set(self.clauses)
        working_clauses.add(frozenset([literal]))  # assume literal is TRUE, try contradiction

        new_clauses = set()
        clause_list = list(working_clauses)

        for _ in range(100):  # iteration cap
            pairs = list(combinations(clause_list, 2))
            for c1, c2 in pairs:
                resolvents = self.resolve(c1, c2)
                self.inference_steps += 1
                for r in resolvents:
                    if len(r) == 0:  # empty clause = contradiction
                        return True
                    new_clauses.add(r)
            if new_clauses.issubset(working_clauses):
                break
            working_clauses |= new_clauses
            clause_list = list(working_clauses)

        return False