package blog

import (
	"github.com/ahmetb/go-linq"
	"golang.org/x/net/html"
	"golang.org/x/net/html/atom"
	"log"
	"strings"
	"testing"
)

func process(n *html.Node) {
	if n.Type == html.ElementNode && n.DataAtom == atom.A {
		for i := range n.Attr {
			a := &n.Attr[i]
			if a.Key == "href" {
				a.Val = "#"
			}
		}
	}
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		process(c)
	}
}

func TestParseHTML(t *testing.T) {
	s := `<p>Links:</p><ul><li><a href="foo">Foo</a><li><a href="/bar/baz">BarBaz</a></ul>`
	doc, err := html.Parse(strings.NewReader(s))
	if err != nil {
		log.Fatal(err)
	}
	process(doc)
	htmlString, err := nodeToHTML(doc)
	if err != nil {
		t.Fail()
	}

	t.Log(htmlString)
	t.Log(htmlToMarkdown(doc))
}

func TestGrouping(t *testing.T) {
	type Company struct {
		Name    string
		Country string
		City    string
	}

	companies := []Company{
		Company{Name: "Microsoft", Country: "USA", City: "Redmond"},
		Company{Name: "Google", Country: "USA", City: "Palo Alto"},
		Company{Name: "Facebook", Country: "USA", City: "Palo Alto"},
		Company{Name: "Uber", Country: "USA", City: "San Francisco"},
		Company{Name: "Tweeter", Country: "USA", City: "San Francisco"},
		Company{Name: "SoundCloud", Country: "Germany", City: "Berlin"},
	}

	grouped := linq.From(companies).GroupBy(func(company interface{}) interface{} {
		return company.(Company).Country
	}, func(company interface{}) interface{} {
		return company
	})

	out := make(map[string][]interface{})

	for _, v := range grouped.Results() {
		group := v.(linq.Group)
		out[group.Key.(string)] = group.Group
	}

	t.Log(out)
}
