.PHONY: demo test-security zap-scan

demo:
	pnpm install
	pnpm db:up
	pnpm db:migrate
	@echo "Demo dependencies and database are ready."
	@echo "Run 'pnpm dev:api' and 'pnpm dev:web' in separate terminals."

test-security:
	pnpm lint
	pnpm test
	pnpm typecheck
	pnpm test:db

zap-scan:
	docker run --rm -t --add-host=host.docker.internal:host-gateway ghcr.io/zaproxy/zaproxy:stable zap-baseline.py -t http://host.docker.internal:3000 -a
