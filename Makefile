build:
	npm run build

publish:
	rsync -vr --delete ./dist/ $(HOSTING_USERNAME)@$(HOSTING_HOSTNAME):~/nomnom/