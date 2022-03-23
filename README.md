# 🟩 Game of Life

A custom version of [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life), with some modified rules, and zombies!

## 🤯 Why would you do this?!

It was a "challenge" proposed by [@miguedev](http://elmigue.dev) in the last [BeerJS Cba](https://beerjscba.com) meetup. He did [his version](https://elmigue.dev/gameoflife), and I had to do mine.

## 📋 Rules

First, we had the original rules...

1. Any live cell with fewer than two live neighbours dies, as if caused by under-population.
2. Any live cell with two or three live neighbours lives on to the next generation.
3. Any live cell with more than three live neighbours dies, as if by over-population.
4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.


And before going to _my rules_, you have to consider the following variables:

- `$MAX_GENERATIONS`: How many generations a cell can live.
- `$ZOMBIE_MAX_GENERATIONS`: How many generations a zombie can live without eating.

And now, the rules:

1. Any live cell with fewer than two live neighbours dies, as if caused by under-population, and has a 50% chance of becoming a zombie.
2. Any live cell with more than three live neighbours dies, as if by over-population, and has a 50% chance of becoming a zombie.
3. Any live cell that supprasses the `$MAX_GENERATIONS` limit dies, as if by old age, and has a 50% chance of becoming a zombie.
4. Any live cell with more zombie neighbours than alive becomes a zombie, as if by infection.
5. Any live cell with the same number of live and zombie neighbours has a 10% chance of dying and becoming as zombie, as if being overpowered by the zombies.
6. Any live cell with more live neighbours than zombie neighbours has a 30% chance of dying and becoming a zombie, as if being overpowered by the zombies;
7. Any live cell with exactly one zombie neighbour and no live neighbours has a 50% chance of dying and becoming a zombie, as if by infection.
8. Any live cell without zombie neighbours, that's been alive for less generations than `$MAX_GENERATIONS`, and with exactly three live neighboors, lives on to the next generation.
9. Any zombie cell with more zombie neighbours than live neighbours "lives" on to the next generation, and its hunger counter resets.
10. Any zombie cell with the same number of live and zombie neighbours has a 90% chance of "dying", as if being overpowered by the live cells.
11. Any zombie cell with more live neighbours than zombie neighbours has a 70% chance of "dying", as if being overpowered by the live cells.
12. Any zombie cell with exactly one live neighbour and no zombie neighbours has a 50% chance of dying, as if by being killed by the live cell.
13. Any zombie cell that supraes the `$ZOMBIE_MAX_GENERATIONS` without eating a live cell dies, as if by hunger.
14. Any zombie cell without live neighbours, that's been "alive" for less generations than `$ZOMBIE_MAX_GENERATIONS`, "lives" on to the next generation.
15. Any dead cell with exactly three live neighbours, and without zombie neighbours, becomes a live cell, as if by reproduction.
16. Any dead cell with exactly two live neighbours, and without zombie neighbours, has a 40% chance of becoming alive, as if by being the miracle baby in the middle of the zombie apocalypse.
