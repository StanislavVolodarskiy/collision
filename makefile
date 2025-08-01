TMUX_SESSION = col

.PHONY: help
help:
	grep -v '^\.PHONY: ' makefile

.PHONY: tmux-session
tmux-session:
	MAKELEVEL= tmux new-session -A -s $(TMUX_SESSION)

.PHONY: serve
serve:
	cd html && python -m http.server 3000

.PHONY: show
show:
	xdg-open http://localhost:3000/index.html
