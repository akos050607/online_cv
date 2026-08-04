# README correction for `akos050607/K3d-chaos-cluster`

`K3d-chaos-cluster` is not checked out anywhere on this machine, so this is the
patch to apply by hand. **Every measured number in that README stays exactly as
it is** — this changes one explanatory paragraph and nothing else.

## Why

The current note is wrong about the mechanism. It says the Master "intentionally
did not migrate the pods back", which describes a decision the scheduler made.
No decision was made: nothing asked the scheduler anything. It is also the
paragraph a Kubernetes-literate reader is most likely to stop on.

---

## Find this

> *Note: When the Edge node woke up and reconnected, the Master intentionally did
> not migrate the pods back to avoid unnecessary disruption. A manual `rollout
> restart` was performed to rebalance the cluster.*

## Replace with this

```markdown
**Note — why the pods did not come back.** When the edge node rejoined, the pods
stayed on the cloud node. This was not a decision the scheduler made; nothing
asked it. The Deployment's replica count was already satisfied, and Kubernetes
has no trigger that re-evaluates placement for pods that are already running
healthily. Rebalancing is not a scheduler feature — it requires something
external, either a descheduler or `topologySpreadConstraints` applied at
admission time. The `rollout restart` I ran worked because it forced fresh
scheduling decisions, not because it asked the scheduler to rebalance.

The distinction between *"the scheduler failed"* and *"the scheduler was never
asked again"* is the most useful thing this cluster has taught me.
```

---

## Apply it

```bash
git clone git@github.com:akos050607/K3d-chaos-cluster.git
cd K3d-chaos-cluster
# edit README.md — swap the paragraph above
git add README.md
git commit -m "Correct the note on why pods did not reschedule after rejoin"
git push
```

## While you are in that repo

The portfolio now cites these as measured, sourced from this repo. Confirm each
one is actually in the README before the application goes out:

| Claim on the site | Needs to match the repo |
|---|---|
| `4 → 10` replicas under load | HPA actual peak |
| HPA configured `min 4 / max 20` | autoscale command / manifest |
| `100` concurrent clients, `100,000` requests | ApacheBench invocation |
| `1718.34 req/s` sustained | ab output |
| `58.196 ms` mean | ab output |
| `0` failed requests out of 100,000 | ab output |

Also confirm one thing the site no longer claims: the modal used to say there
were **deliberate node drains and pod kills** alongside the sleep incident. That
clause has been cut back to the sleep incident alone, because the repo documents
only that. If drains and kills really did happen and are written up in the repo,
say so and it can go back in.
