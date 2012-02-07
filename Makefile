all:
	rm -f web/js/*.js
	coffee --output web/js/ --compile src/*.coffee
	coffee --output test/ --compile src-test/*.coffee

doc:
	docco src/*.coffee
	mkdir -p docs/code
	mv docs/*.html docs/code
	mv docs/*.css docs/code

watch:
	coffee --output web/js/ --watch --compile src/*.coffee

clean:
	rm -f web/js/*.js
	rm -f test/*
	rm -f -R docs/code

.PHONY: clean
